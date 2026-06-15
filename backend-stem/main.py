import os
import json
import httpx
from pathlib import Path
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, validator
from dotenv import load_dotenv

load_dotenv()

from routerss import categories, orders, products, applications, visualize, auth, admin, uploads, blog
from database import init_db, SessionLocal
from models import Product, Category

UPLOADS_DIR = Path("/app/uploads")
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="STEM Academia API", redirect_slashes=False)
app.router.redirect_slashes = False

# ── Product catalog cache for the AI chatbot ──────────────────────────────────
PRODUCT_CATALOG_TEXT = ""  # populated on startup


def _build_product_catalog() -> str:
    """Load all products from DB and build a compact text catalog for the AI prompt."""
    db = SessionLocal()
    try:
        all_products = db.query(Product).all()
        all_categories = db.query(Category).all()

        cat_map = {c.slug: c.title_ru for c in all_categories}

        # Group products by category
        grouped: dict[str, list[str]] = {}
        for p in all_products:
            cat_name = cat_map.get(p.category_slug, p.category_slug or "Без категории")
            entry = p.title
            if p.article:
                entry += f" (арт. {p.article})"
            if p.size:
                entry += f", {p.size}"
            grouped.setdefault(cat_name, []).append(entry)

        lines = ["КАТАЛОГ ТОВАРОВ (актуальный список из базы данных):"]
        for cat_name, items in grouped.items():
            lines.append(f"\n📁 {cat_name} ({len(items)} товаров):")
            for item in items:
                lines.append(f"  • {item}")

        lines.append(f"\nВсего товаров в каталоге: {len(all_products)}")
        return "\n".join(lines)
    except Exception as e:
        print(f"⚠️ Не удалось загрузить каталог для AI: {e}")
        return "Каталог товаров временно недоступен."
    finally:
        db.close()


@app.on_event("startup")
async def startup_event():
    init_db()
    global PRODUCT_CATALOG_TEXT
    PRODUCT_CATALOG_TEXT = _build_product_catalog()
    print(f"🤖 AI product catalog loaded: {len(PRODUCT_CATALOG_TEXT)} chars")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "http://localhost:8000",
        "https://stem-catalog.netlify.app",
        "https://stem-catalog.vercel.app",
        "https://stem-catalog.pages.dev",
        "https://frontend-stem.pages.dev",
        "https://catalog-stem.pages.dev",
        "https://frontend-stem.yvayvayayv7.workers.dev",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
)

BITRIX_WEBHOOK_URL = os.getenv("BITRIX_WEBHOOK_URL")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_GROUP_CHAT_ID = os.getenv("TELEGRAM_GROUP_CHAT_ID")
HF_TOKEN = os.getenv("HF_TOKEN")

if not all([TELEGRAM_BOT_TOKEN, TELEGRAM_GROUP_CHAT_ID]):
    print("⚠️ Telegram не настроен — уведомления о заявках не будут отправляться")


class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)

    @validator('message', pre=True, always=True)
    def ensure_message(cls, v, values):
        if not v and values.get('text'):
            return values['text']
        return v


SYSTEM_PROMPT_BASE = """
Ты — виртуальный помощник компании STEM Academia (Казахстан).
Твоя задача: помогать клиентам подбирать мебель и оборудование, отвечать на вопросы о доставке и оплате.

ИНФОРМАЦИЯ О КОМПАНИИ:
- Мы продаем: мебель для школ/офисов, парты, стулья, шкафы, интерактивные панели, 3D декор, лабораторное оборудование.
- Доставка: По всему Казахстану.
- Самовывоз: г. Астана, ул. Домалак-ана 26.
- Телефон/WhatsApp: +7 700 039 58 77.
- Сайт: stem-academia.kz

ПРАВИЛА ОБЩЕНИЯ:
- Отвечай кратко, вежливо и по делу (максимум 3-4 предложения).
- Если клиент спрашивает о конкретном товаре — ищи его в каталоге ниже и отвечай на основе каталога.
- Если товара нет в каталоге — скажи что такого товара пока нет и предложи связаться с менеджером.
- Не выдумывай цены — они не указаны в каталоге. Предлагай связаться с менеджером для уточнения цены.
- Поддерживай русский и казахский языки (отвечай на том же, на котором спросили).
- Когда recommending товары, mention их названия точно как в каталоге.
"""


def get_system_prompt() -> str:
    """Build the full system prompt with the current product catalog."""
    return SYSTEM_PROMPT_BASE + "\n\n" + PRODUCT_CATALOG_TEXT


def build_chat_messages(body: dict) -> list[dict[str, str]]:
    messages: list[dict[str, str]] = [{"role": "system", "content": get_system_prompt()}]

    history = body.get("messages")
    if isinstance(history, list):
        for item in history[-12:]:
            if not isinstance(item, dict):
                continue

            role = item.get("role")
            content = item.get("content")

            if role not in {"user", "assistant"}:
                continue
            if not isinstance(content, str) or not content.strip():
                continue

            messages.append({"role": role, "content": content.strip()[:4000]})

    user_message = body.get("message") or body.get("text")
    if isinstance(user_message, str) and user_message.strip():
        if not messages or messages[-1].get("role") != "user" or messages[-1].get("content") != user_message.strip():
            messages.append({"role": "user", "content": user_message.strip()[:4000]})

    return messages


@app.post("/api/ai/chat")
async def ai_chat(request: Request):
    try:
        body = await request.json()
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format")

    user_message = body.get("message") or body.get("text")

    if not user_message or not isinstance(user_message, str):
        raise HTTPException(status_code=422, detail="Поле 'message' обязательно")

    if not GROQ_API_KEY:
        return {"reply": "⚠️ Ошибка: сервис ИИ не настроен"}

    try:
        chat_messages = build_chat_messages(body)

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.1-8b-instant",
                    "messages": chat_messages,
                    "temperature": 0.5,
                    "max_tokens": 300
                },
                timeout=15.0
            )
            if response.status_code == 200:
                result = response.json()
                reply = result["choices"][0]["message"]["content"].strip()
                return {"reply": reply}
            else:
                return {"reply": "⚠️ ИИ временно недоступен, попробуйте позже."}
    except Exception as e:
        print(f"❌ Ошибка AI: {e}")
        return {"reply": "❌ Произошла ошибка соединения. Попробуйте ещё раз."}


app.include_router(products.router,      prefix="/api/products",     tags=["products"])
app.include_router(categories.router,    prefix="/api/categories",   tags=["categories"])
app.include_router(orders.router,        prefix="/api/orders",       tags=["orders"])
app.include_router(applications.router,  prefix="/api/applications", tags=["applications"])
app.include_router(visualize.router,     prefix="/api/ai", tags=["AI Visualize"])
app.include_router(uploads.router,       prefix="/api/uploads",      tags=["uploads"])
app.include_router(blog.router,          prefix="/api/blog",         tags=["blog"])
app.include_router(auth.router,          prefix="/auth",             tags=["auth"])
app.include_router(admin.router,         prefix="/admin",            tags=["admin"])

# Serve uploaded product images as static files
# /uploads/<filename> → /app/uploads/<filename>
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


@app.get("/")
def root():
    return {
        "message": "STEM Academia API работает 🚀",
        "status": "ok",
        "services": {
            "telegram":     "configured" if TELEGRAM_BOT_TOKEN else "not set",
            "bitrix24":     "configured" if BITRIX_WEBHOOK_URL else "not set",
            "ai_chat":      "configured" if GROQ_API_KEY else "not set",
            "ai_visualize": "configured" if HF_TOKEN else "not set",
        }
    }
