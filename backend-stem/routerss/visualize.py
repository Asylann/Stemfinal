import asyncio
import base64
import os
from io import BytesIO
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request
from huggingface_hub import InferenceClient

load_dotenv()
router = APIRouter()

HF_TOKEN = os.getenv("HF_TOKEN")

def build_prompt(products_list):
    items_text = ", ".join(products_list)
    return (
       f"Professional STEM classroom interior, photorealistic 4K architectural render. "
        f"The room contains ONLY these items: {items_text}. "
        f"Large modern classroom with fresh renovation, premium educational interior design. "
        f"Interactive STEM learning environment with visible equipment and organized workspace. "
        f"Bright LED ceiling panel lighting, additional accent lighting, realistic illumination. "
        f"Modern suspended ceiling, decorative wall panels, acoustic elements, clean white and light wood finishes. "
        f"High-quality wooden flooring, large windows with natural daylight. "
        f"Every object is large, detailed, fully visible and occupies significant space in the scene. "
        f"No empty areas, no unused floor space, richly furnished classroom. "
        f"Professional school interior, architectural visualization, interior design magazine quality, ultra realistic."
    )

@router.post("/visualize")
@router.post("/visualize/")
async def visualize_interior(request: Request):
    if not HF_TOKEN:
        raise HTTPException(status_code=500, detail="HF_TOKEN не настроен")

    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Невалидный JSON")

    products_list = body.get("products", [])
    if not products_list:
        raise HTTPException(status_code=422, detail="Выберите хотя бы один товар")

    prompt = build_prompt(products_list)
    print(f"🎨 Промпт: {prompt}")

    try:
        client = InferenceClient(api_key=HF_TOKEN, timeout=90)

        image = await asyncio.to_thread(
            lambda: client.text_to_image(
                prompt=prompt,
                model="black-forest-labs/FLUX.1-schnell",
            )
        )

        buffer = BytesIO()
        image.save(buffer, format="PNG")
        result_b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

        return {
            "success": True,
            "image": f"data:image/png;base64,{result_b64}",
            "prompt": prompt,
        }

    except Exception as e:
        print(f"❌ Visualize error: {e}")
        return {"success": False, "error": f"Ошибка генерации: {e}"}