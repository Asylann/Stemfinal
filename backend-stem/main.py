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
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # fallback if no OpenAI key
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_GROUP_CHAT_ID = os.getenv("TELEGRAM_GROUP_CHAT_ID")
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
HF_TOKEN = os.getenv("HF_TOKEN")  # fallback if no Replicate key

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
Ты — виртуальный помощник компании STEM Academia (Казахстан). Ты эксперт в области оснащения учебных заведений, STEM-лабораторий и образовательных пространств.

═══ ИНФОРМАЦИЯ О КОМПАНИИ ═══

Название: STEM Academia (ТОО «STEM Academia»)
Сайт: stem-academia.kz
Город: Астана, Казахстан
Адрес самовывоза: г. Астана, ул. Домалак-ана 26
Телефон/WhatsApp: +7 700 039 58 77
Email: info@stem-academia.kz
Режим работы: Пн-Пт 9:00-18:00

Что продаём:
• Школьная и офисная мебель (парты, стулья, столы, шкафы, стеллажи, диваны)
• Интерактивные панели и цифровое оборудование
• Лабораторное оборудование (цифровые микроскопы, наборы для химии/физики)
• 3D-декор и оформление интерьеров (3D-панели, декоративные элементы)
• Оборудование для робототехники (Arduino, LEGO SPIKE Prime)
• Образовательные платформы (Roqed Science)

Доставка: По всему Казахстану (1-7 рабочих дней в зависимости от региона)
Оплата: Безналичный расчёт, банковский перевод
Склад: Астана + новый склад в Алматы

═══ ПРАВИЛА ОБЩЕНИЯ ═══

1. Отвечай кратко, вежливо и по делу (максимум 3-5 предложений).
2. Когда клиент спрашивает о товаре — ищи его в каталоге и давай конкретный ответ с названием и артикулом.
3. Если товара нет в каталоге — честно скажи об этом и предложи связаться с менеджером.
4. Не выдумывай цены — предлагай связаться с менеджером для уточнения стоимости.
5. Поддерживай русский и казахский языки (отвечай на том же языке, на котором спросили).
6. Называй товары точно как в каталоге — не изменяй названия.
7. Если спрашивают про доставку, оплату или контакты — отвечай на основе информации выше.
8. Рекомендуй подходящие товары из каталога когда просят помочь с выбором.

• на любую другую тему не отвечай, строго информация из нашей компании (stem-academia.kz)
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

    if not OPENAI_API_KEY and not GROQ_API_KEY:
        return {"reply": "⚠️ Ошибка: сервис ИИ не настроен (нужен OPENAI_API_KEY или GROQ_API_KEY)"}

    try:
        chat_messages = build_chat_messages(body)

        # Choose provider: OpenAI GPT-4o preferred, Groq as fallback
        if OPENAI_API_KEY:
            api_url = "https://api.openai.com/v1/chat/completions"
            api_key = OPENAI_API_KEY
            model = "gpt-4o-mini"
            max_tokens = 500
        else:
            api_url = "https://api.groq.com/openai/v1/chat/completions"
            api_key = GROQ_API_KEY
            model = "llama-3.3-70b-versatile"
            max_tokens = 500

        async with httpx.AsyncClient() as client:
            response = await client.post(
                api_url,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": chat_messages,
                    "temperature": 0.6,
                    "max_tokens": max_tokens,
                },
                timeout=30.0
            )
            if response.status_code == 200:
                result = response.json()
                reply = result["choices"][0]["message"]["content"].strip()
                return {"reply": reply}
            else:
                err = response.json() if response.headers.get("content-type","").startswith("application/json") else {}
                print(f"❌ AI API error {response.status_code}: {err.get('error', {}).get('message', response.text[:200])}")
                return {"reply": "⚠️ ИИ временно недоступен, попробуйте позже."}
    except httpx.TimeoutException:
        return {"reply": "⚠️ ИИ долго отвечает. Попробуйте ещё раз или напишите менеджеру в WhatsApp: +7 700 039 58 77"}
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
            "ai_chat":      f"configured ({'GPT-4o' if OPENAI_API_KEY else 'Groq fallback'})",
            "ai_visualize": f"configured ({('OpenAI gpt-image-1' if OPENAI_API_KEY else ('Replicate FLUX Kontext Pro' if REPLICATE_API_TOKEN else 'HF fallback'))})",
        }
    }
