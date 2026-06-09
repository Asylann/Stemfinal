import os
import json
import httpx
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from dotenv import load_dotenv

load_dotenv()

from routerss import categories, orders, products, applications, visualize, auth
from database import init_db

app = FastAPI(title="STEM Academia API", redirect_slashes=False)
app.router.redirect_slashes = False

@app.on_event("startup")
async def startup_event():
    init_db()

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
        return {"reply": "⚠️ Ошибка: GROQ_API_KEY не настроен"}

    SYSTEM_PROMPT = """
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
    - Если не знаешь точного ответа — предложи написать менеджеру в WhatsApp.
    - Не выдумывай цены и наличие, если их нет в вопросе.
    - Поддерживай русский и казахский языки (отвечай на том же, на котором спросили).
    """

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.1-8b-instant",
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_message}
                    ],
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
app.include_router(visualize.router,     prefix="/api/ai/visualize", tags=["AI Visualize"])
app.include_router(auth.router,          prefix="/auth",             tags=["auth"])


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
