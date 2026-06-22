import os
import re
import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Tuple

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, BackgroundTasks, HTTPException, Depends, Request
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, field_validator, model_validator
from sqlalchemy.orm import Session

from database import get_db, SessionLocal
from models import Application, User
from routerss.auth import get_current_user

load_dotenv()

# Astana, Kazakhstan timezone (UTC+5)
ASTANA_TZ = timezone(timedelta(hours=5))

router = APIRouter()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
GROUP_CHAT_ID = os.getenv("TELEGRAM_GROUP_CHAT_ID")
BITRIX_WEBHOOK_URL = os.getenv("BITRIX_WEBHOOK_URL")


class CartItem(BaseModel):
    name: str
    article: Optional[str] = None
    quantity: Optional[int] = 1
    url: Optional[str] = None
    color: Optional[str] = None


class ApplicationCreate(BaseModel):
    name: str
    phone: str
    username: Optional[str] = None
    comment: Optional[str] = None
    location_city: Optional[str] = None
    location_address: Optional[str] = None
    product_name: Optional[str] = None
    article: Optional[str] = None
    product_url: Optional[str] = None
    products: Optional[List[CartItem]] = None

    @field_validator("name")
    @classmethod
    def validate_name_field(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2 or len(cleaned) > 50:
            raise ValueError("Имя должно быть от 2 до 50 символов")
        if not re.fullmatch(r"[A-Za-zА-Яа-яӘәҒғҚқҢңӨөҰұҮүҺһІіЁё\s\-]+", cleaned):
            raise ValueError("Имя содержит недопустимые символы")
        return cleaned

    @field_validator("phone")
    @classmethod
    def validate_phone_field(cls, v: str) -> str:
        digits = "".join(ch for ch in v if ch.isdigit())
        if len(digits) < 10 or len(digits) > 15:
            raise ValueError("Некорректный номер телефона")
        return v

    @model_validator(mode="after")
    def check_products_or_product_name(self) -> "ApplicationCreate":
        if not self.product_name and not self.products:
            raise ValueError("Укажите либо product_name, либо products")
        return self


def normalize_phone(phone: str) -> str:
    digits = "".join(ch for ch in phone if ch.isdigit())
    if len(digits) == 11 and digits.startswith("8"):
        digits = "7" + digits[1:]
    if len(digits) == 10:
        digits = "7" + digits
    return f"+{digits}"


def format_products(products: Optional[List[Dict]]) -> Tuple[str, str]:
    if not products:
        return "Не указан", "—"
    names = [p.get("name", "Товар") for p in products if p.get("name")]
    if not names:
        return "Не указан", "—"
    short = names[0] if len(names) == 1 else f"{names[0]} и др."
    return short, ""


def format_location(data: Dict) -> str:
    city = (data.get("location_city") or "").strip()
    address = (data.get("location_address") or "").strip()
    if city and address:
        return f"{city}, {address}"
    return city or address or "—"


def build_admin_comment(comment: Optional[str], location_text: str) -> str:
    parts = []
    if comment and comment.strip():
        parts.append(comment.strip())
    parts.append(f"Город/самовывоз: {location_text}")
    return "\n\n".join(parts)


async def send_to_telegram(data: Dict, app_id: str) -> None:
    if not BOT_TOKEN or not GROUP_CHAT_ID:
        return

    # Format timestamp in Astana time
    now = datetime.now(ASTANA_TZ).strftime("%Y-%m-%d %H:%M")

    # Format products list
    products = data.get("products_list", [])
    products_count = len(products) if products else 0
    products_lines = []
    for p in products:
        parts = [f"• {p.get('name', 'Товар')}"]
        if p.get('color'):    parts.append(f"Цвет: {p.get('color')}")
        if p.get('article'):  parts.append(f"Арт: {p.get('article')}")
        products_lines.append(" | ".join(parts))
    products_text = "\n".join(products_lines) if products_lines else "—"

    text = (
        "📥 <b>Новая заявка с сайта</b>\n\n"
        f"🆔 <b>ID:</b> #{app_id}\n"
        f"🕒 <b>Время:</b> {now}\n\n"
        f"📦 <b>Товары ({products_count} шт.):</b>\n{products_text}\n\n"
        f"👤 <b>Имя:</b> {data.get('name')}\n"
        f"📞 <b>Телефон:</b> {data.get('phone')}\n"
        f"📍 <b>Город/самовывоз:</b> {format_location(data)}\n"
        f"💬 <b>Комментарий:</b> {data.get('comment') or '—'}"
    )

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(
            f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
            json={"chat_id": GROUP_CHAT_ID, "text": text, "parse_mode": "HTML"},
        )
        if response.status_code == 200:
            print(f"✅ Telegram: Заявка #{app_id} успешно отправлена")


# ─── Bitrix24 deal stage mapping ─────────────────────────────────────────────────
# When creating a deal via REST API, Bitrix24 accepts STAGE_ID to set initial stage.
# Our internal status  →  Bitrix24 STAGE_ID
# NOTE: 'UC_4PQZ76' is the actual 'Заявка с сайта' stage in their Bitrix24 pipeline.
LOCAL_TO_BITRIX_STAGE = {
    "new":        "UC_4PQZ76",   # Заявка с сайта
    "preparing":  "UC_3AWFVA",   # Название
    "invoicing":  "5",           # Новая заявка
    "processing": "EXECUTING",
    "paid":       "PREPAID",
    "completed":  "WON",
    "closed":     "LOSE",
}

# Bitrix24 STAGE_ID  →  our internal status  (reverse map)
BITRIX_TO_LOCAL_STATUS = {v: k for k, v in LOCAL_TO_BITRIX_STAGE.items()}


async def send_to_bitrix(data: Dict, db_id: int) -> None:
    """
    Create a deal in Bitrix24 CRM and persist the returned deal ID + stage
    back to the local Application row.
    """
    if not BITRIX_WEBHOOK_URL:
        return

    url = f"{BITRIX_WEBHOOK_URL.rstrip('/')}/crm.deal.add"

    products = data.get("products_list", [])
    product_lines = []
    for p in products:
        parts = [f"• {p.get('name', 'Товар')}"]
        if p.get('color'):   parts.append(f"Цвет: {p.get('color')}")
        if p.get('article'): parts.append(f"Арт: {p.get('article')}")
        product_lines.append(" | ".join(parts))

    product_details = "\n".join(product_lines)

    # Determine initial Bitrix stage from local status (default: UC_4PQZ76 = Заявка с сайта)
    local_status = data.get("status", "new")
    initial_stage = LOCAL_TO_BITRIX_STAGE.get(local_status, "UC_4PQZ76")

    payload = {
        "fields": {
            "TITLE":     f"Заявка с сайта: {data.get('name', 'Клиент')}",
            "NAME":      data.get("name"),
            "PHONE":     [{"VALUE": data.get("phone"), "VALUE_TYPE": "WORK"}],
            "COMMENTS":  f"📦 Товары:\n{product_details}\n\n📍 Город/самовывоз: {format_location(data)}\n\n💬 Комментарий: {data.get('comment') or '—'}",
            "SOURCE_ID": "WEB",
            "STAGE_ID":  initial_stage,
            "OPENED":    "Y",
        }
    }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            result = response.json()
            bitrix_id = result.get("result")

            if bitrix_id:
                print(f"✅ Битрикс24: Сделка #{bitrix_id} создана для заявки DB ID {db_id}")
                with SessionLocal() as db:
                    app = db.query(Application).filter(Application.id == db_id).first()
                    if app:
                        app.bitrix_id = bitrix_id
                        app.bitrix_stage_id = initial_stage
                        app.status = local_status
                        db.commit()
            else:
                print(f"❌ Битрикс24 ошибка: {result}")
    except Exception as e:
        print(f"❌ Ошибка Bitrix для DB ID {db_id}: {e}")


class ContactMessage(BaseModel):
    name: str
    phone: str
    message: Optional[str] = None
    location_city: Optional[str] = None
    location_address: Optional[str] = None


async def send_contact_to_telegram(data: Dict) -> None:
    """Send contact form message to Telegram."""
    if not BOT_TOKEN or not GROUP_CHAT_ID:
        return
    now = datetime.now(ASTANA_TZ).strftime("%Y-%m-%d %H:%M")
    text = (
        "✉️ <b>Сообщение с формы контактов</b>\n\n"
        f"🕒 <b>Время:</b> {now}\n"
        f"👤 <b>Имя:</b> {data.get('name')}\n"
        f"📞 <b>Телефон:</b> {data.get('phone')}\n"
        f"📍 <b>Город/самовывоз:</b> {format_location(data)}\n"
        f"💬 <b>Сообщение:</b> {data.get('message') or '—'}"
    )
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(
            f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
            json={"chat_id": GROUP_CHAT_ID, "text": text, "parse_mode": "HTML"},
        )
        if response.status_code == 200:
            print(f"✅ Telegram: Контактное сообщение отправлено")


@router.post("/contact")
async def contact_message(data: ContactMessage, background_tasks: BackgroundTasks):
    """Handle contact form submissions."""
    normalized_phone = normalize_phone(data.phone)
    app_data = {
        "name": data.name.strip(),
        "phone": normalized_phone,
        "message": data.message.strip() if data.message else None,
        "location_city": data.location_city,
        "location_address": data.location_address,
    }
    background_tasks.add_task(send_contact_to_telegram, app_data)
    return {"status": "ok"}


@router.post("")
@router.post("/")
async def create_application(
    request: Request,
    data: ApplicationCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    app_id = str(uuid.uuid4())[:8].upper()
    normalized_phone = normalize_phone(data.phone)

    products_list = [p.model_dump() for p in data.products] if data.products else [{"name": data.product_name, "article": data.article}]
    short_name = products_list[0].get("name", "Заявка")

    app_data = {
        "name": data.name.strip(),
        "phone": normalized_phone,
        "comment": data.comment,
        "location_city": data.location_city,
        "location_address": data.location_address,
        "products_list": products_list,
    }
    admin_comment = build_admin_comment(data.comment, format_location(app_data))

    # Try to extract user_id from JWT token (optional — anonymous orders still work)
    user_id = None
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        try:
            from jose import jwt, JWTError
            import os
            token = auth_header.split(" ")[1]
            payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
            user_id = int(payload.get("sub"))
        except:
            pass  # Invalid token — proceed as anonymous

    new_application = Application(
        name=app_data["name"],
        phone=app_data["phone"],
        comment=admin_comment,
        product_name=short_name,
        status="new",
        user_id=user_id
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    background_tasks.add_task(send_to_bitrix, app_data, new_application.id)
    background_tasks.add_task(send_to_telegram, app_data, app_id)

    return {"status": "ok", "id": app_id}


@router.get("/me")
def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Return the authenticated user's application/order history."""
    apps = (
        db.query(Application)
        .filter(Application.user_id == current_user.id)
        .order_by(Application.created_at.desc())
        .all()
    )
    return [
        {
            "id": a.id,
            "name": a.name,
            "phone": a.phone,
            "comment": a.comment,
            "product_name": a.product_name,
            "article": a.article,
            "status": a.status,
            "bitrix_stage_id": a.bitrix_stage_id,
            "bitrix_stage_name": a.bitrix_stage_name,
            "created_at": a.created_at,
            "updated_at": a.updated_at,
        }
        for a in apps
    ]
