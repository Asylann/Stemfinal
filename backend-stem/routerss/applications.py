import os
import re
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Tuple

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel, field_validator, model_validator

load_dotenv()

router = APIRouter()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
GROUP_CHAT_ID = os.getenv("TELEGRAM_GROUP_CHAT_ID")
BITRIX_WEBHOOK_URL = os.getenv("BITRIX_WEBHOOK_URL")


class CartItem(BaseModel):
    name: str
    article: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = 1
    url: Optional[str] = None


class ApplicationCreate(BaseModel):
    name: str
    phone: str
    username: Optional[str] = None
    comment: Optional[str] = None
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
        if len(digits) == 11 and digits.startswith("8"):
            digits = "7" + digits[1:]
        if len(digits) == 10:
            digits = "7" + digits
        if len(digits) < 11 or len(digits) > 15:
            raise ValueError("Некорректный номер телефона")
        return v

    @field_validator("username")
    @classmethod
    def clean_username(cls, v: Optional[str]) -> Optional[str]:
        if v:
            return v.replace("@", "").strip() or None
        return None

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
    if len(digits) < 11 or len(digits) > 15:
        raise HTTPException(status_code=400, detail="Некорректный номер телефона")
    if len(digits) == 11 and digits.startswith("7"):
        return f"+7 ({digits[1:4]}) {digits[4:7]}-{digits[7:9]}-{digits[9:11]}"
    return f"+{digits}"


def format_products(products: Optional[List[Dict]]) -> Tuple[str, str]:
    if not products:
        return "Не указан", "—"
    names = [p.get("name", "Товар") for p in products if p.get("name")]
    if not names:
        return "Не указан", "—"
    short = names[0] if len(names) == 1 else (", ".join(names) if len(names) <= 3 else f"{names[0]}, {names[1]} и ещё {len(names)-2}")
    detailed = "\n".join(f"• {n}" for n in names)
    return short, detailed


async def send_to_telegram(data: Dict, app_id: str) -> None:
    if not BOT_TOKEN or not GROUP_CHAT_ID:
        print("⚠️ Telegram не настроен")
        return

    username_line = f"🔗 <b>Username:</b> @{data.get('username')}\n" if data.get("username") else ""
    _, product_detailed = format_products(data.get("products_list"))

    text = (
        "📥 <b>Новая заявка с сайта</b>\n\n"
        f"🆔 <b>ID:</b> #{app_id}\n"
        f"🕒 <b>Время:</b> {datetime.now().strftime('%Y-%m-%d %H:%M')}\n\n"
        f"📦 <b>Товары ({data.get('items_count', 1)} шт.):</b>\n{product_detailed}\n\n"
        f"👤 <b>Имя:</b> {data.get('name')}\n"
        f"📞 <b>Телефон:</b> {data.get('phone')}\n"
        f"{username_line}"
        f"💬 <b>Комментарий:</b> {data.get('comment') or '—'}"
    )

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
                json={
                    "chat_id": GROUP_CHAT_ID,
                    "text": text,
                    "parse_mode": "HTML",
                    "disable_web_page_preview": True,
                },
            )
            if response.status_code == 200:
                print(f"📩 Telegram: Заявка #{app_id} отправлена")
            else:
                print(f"❌ Telegram ошибка: {response.text}")
    except Exception as e:
        print(f"❌ Ошибка Telegram: {e}")


async def send_to_bitrix(data: Dict) -> None:
    if not BITRIX_WEBHOOK_URL:
        print("⚠️ Bitrix не настроен")
        return

    url = f"{BITRIX_WEBHOOK_URL.rstrip('/')}/crm.lead.add"
    short_name, product_detailed = format_products(data.get("products_list"))

    comments = (
        f"📦 Товары ({data.get('items_count', 1)} шт.):\n{product_detailed}\n\n"
        f"💬 Комментарий: {data.get('comment') or '—'}\n"
        f"🌐 Ссылка: {data.get('product_url') or '—'}"
    ).strip()

    payload = {
        "fields": {
            "TITLE": f"Заявка с сайта: {short_name}",
            "NAME": data.get("name") or "Не указано",
            "PHONE": [{"VALUE": data.get("phone") or "", "VALUE_TYPE": "WORK"}],
            "COMMENTS": comments,
            "SOURCE_ID": "WEB",
            "SOURCE_DESCRIPTION": "Сайт STEM Academia",
            "OPENED": "Y",
        }
    }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(url, json=payload)
            if response.status_code == 200:
                result = response.json()
                if result.get("result"):
                    print(f"✅ Битрикс24: Лид #{result['result']} создан")
                else:
                    print(f"❌ Битрикс24 ошибка: {result}")
            else:
                print(f"❌ Битрикс24 HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ Ошибка Bitrix: {e}")


@router.post("")
@router.post("/")
async def create_application(data: ApplicationCreate, background_tasks: BackgroundTasks):
    app_id = str(uuid.uuid4())[:8].upper()
    normalized_phone = normalize_phone(data.phone)

    is_cart = bool(data.products)

    if is_cart:
        short_name, _ = format_products([p.model_dump() for p in data.products])
        products_list = [p.model_dump() for p in data.products]
        items_count = len(data.products)
        first_url = next((p.url for p in data.products if p.url), None)
    else:
        short_name = data.product_name or "Общий запрос"
        products_list = [{"name": data.product_name, "article": data.article}]
        items_count = 1
        first_url = data.product_url

    app_data: Dict = {
        "id": app_id,
        "name": data.name.strip(),
        "phone": normalized_phone,
        "username": data.username,
        "comment": data.comment.strip() if data.comment else None,
        "product_name": short_name,
        "article": data.article,
        "product_url": first_url,
        "products_list": products_list,
        "items_count": items_count,
    }

    background_tasks.add_task(send_to_bitrix, app_data)
    background_tasks.add_task(send_to_telegram, app_data, app_id)

    return {
        "status": "ok",
        "id": app_id,
        "normalized_phone": normalized_phone,
        "items_count": items_count,
    }
