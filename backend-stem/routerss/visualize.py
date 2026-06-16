"""
AI Visualization endpoint — uses Replicate FLUX Kontext Pro for image editing.

Approach: Creates a COMPOSITE image — room photo on top + product thumbnails at bottom.
FLUX Kontext sees the reference products and places them into the room scene.

Fallback: Replicate FLUX 1.1 Pro (text-to-image) if no room photo provided.
Fallback: HuggingFace FLUX.1-schnell if no REPLICATE_API_TOKEN.
"""

import asyncio
import base64
import json
import os
import time
from io import BytesIO
from pathlib import Path
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request
import httpx

load_dotenv()
router = APIRouter()

REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
HF_TOKEN = os.getenv("HF_TOKEN")  # fallback

UPLOAD_DIR = Path("/app/uploads")


# Furniture type mapping (Russian → English) for better AI understanding
FURNITURE_TYPES = {
    'ДИВАН': 'sofa', 'диван': 'sofa',
    'КРЕСЛО': 'armchair', 'кресло': 'armchair',
    'СТУЛ': 'chair', 'стул': 'chair',
    'СТОЛ': 'table', 'стол': 'table',
    'СТЕЛЛАЖ': 'bookshelf', 'стеллаж': 'bookshelf',
    'ШКАФ': 'cabinet', 'шкаф': 'cabinet',
    'ПОЛКА': 'shelf', 'полка': 'shelf',
    'ПУФ': 'pouf/ottoman', 'пуф': 'pouf/ottoman',
    'ЛАМПА': 'lamp', 'лампа': 'lamp',
    'СВЕТИЛЬНИК': 'light fixture', 'светильник': 'light fixture',
    'ДОСКА': 'whiteboard', 'доска': 'whiteboard',
    'ПАРТА': 'school desk', 'парта': 'school desk',
}


def _enrich_product_name(name: str) -> str:
    """Add English furniture type to product name for better AI understanding.
    E.g. 'ДИВАН 1 (L.Me-DI.UN.2500-01)' → 'a large sofa (ДИВАН 1)'
    """
    for ru_key, en_type in FURNITURE_TYPES.items():
        if ru_key in name.upper() or ru_key.lower() in name.lower():
            # Clean up: remove article numbers in parentheses
            clean_name = name.split('(')[0].strip()
            return f"a {en_type} ({clean_name})"
    # If no known type found, just clean the name
    clean_name = name.split('(')[0].strip()
    return f"furniture item ({clean_name})"


def build_prompt(products_list: list[str]) -> str:
    """Build a descriptive prompt for FLUX Kontext.
    
    Uses enriched product names with furniture types for better AI understanding.
    """
    enriched = [_enrich_product_name(p) for p in products_list]
    items_text = "; ".join(enriched)
    return (
        f"Add the following furniture into this room, making each piece large, clearly visible, "
        f"and prominent: {items_text}. "
        "Place each item naturally on the floor with correct proportions and realistic shadows. "
        "Keep the existing walls, floor, ceiling, windows, and doors exactly as they are. "
        "Only add new furniture — do not remove or change anything already in the room. "
        "Photorealistic, detailed, professional interior photography."
    )


def _optimize_image(b64_data: str) -> str:
    """Resize image to optimal size for FLUX Kontext (max 1024px)."""
    try:
        from PIL import Image as PILImage
        img_bytes = base64.b64decode(b64_data)
        img = PILImage.open(BytesIO(img_bytes))
        if img.mode != 'RGB':
            img = img.convert('RGB')
        max_dim = 1024
        if max(img.size) > max_dim:
            img.thumbnail((max_dim, max_dim), PILImage.LANCZOS)
        buf = BytesIO()
        img.save(buf, format='JPEG', quality=90)
        return base64.b64encode(buf.getvalue()).decode()
    except Exception as e:
        print(f"⚠️ Image optimization failed, using original: {e}")
        return b64_data


async def _download_image(url: str) -> bytes | None:
    """Download an image from URL, return bytes or None on failure.
    
    Always converts to internal Docker URL (frontend:80) for fast, reliable access.
    """
    from urllib.parse import urlparse

    # Extract just the path from any URL format
    if url.startswith("http"):
        parsed = urlparse(url)
        path = parsed.path
    else:
        path = url

    # Always use internal Docker nginx (fast, no external dependencies)
    internal_url = f"http://frontend:80{path}"

    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            resp = await client.get(internal_url)
            if resp.status_code == 200 and len(resp.content) > 100:
                return resp.content
            print(f"  ⚠️ Image download {resp.status_code} from {internal_url}")
    except Exception as e:
        print(f"  ⚠️ Failed internal download: {internal_url} — {e}")
        # Fallback: try the original URL directly
        if url.startswith("http") and url != internal_url:
            try:
                async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
                    resp = await client.get(url)
                    if resp.status_code == 200 and len(resp.content) > 100:
                        print(f"  ✅ Fallback download OK: {url[:80]}")
                        return resp.content
            except Exception as e2:
                print(f"  ⚠️ Fallback also failed: {e2}")
    return None


def _create_composite(room_b64: str, product_images: list[bytes]) -> str:
    """Create a composite image: room photo on top + product thumbnails at bottom.

    This gives FLUX Kontext visual reference of what products to add.
    Returns base64-encoded JPEG.
    """
    from PIL import Image as PILImage

    # Decode room image
    room_bytes = base64.b64decode(room_b64)
    room_img = PILImage.open(BytesIO(room_bytes))
    if room_img.mode != 'RGB':
        room_img = room_img.convert('RGB')

    room_w, room_h = room_img.size

    # Calculate strip height (20% of room height, min 100px, max 200px)
    strip_h = max(100, min(200, room_h // 5))

    # Create composite: room + strip at bottom
    composite_h = room_h + strip_h
    composite = PILImage.new('RGB', (room_w, composite_h), color=(255, 255, 255))
    composite.paste(room_img, (0, 0))

    # Add "PRODUCTS TO ADD:" label area
    from PIL import ImageDraw
    draw = ImageDraw.Draw(composite)
    draw.rectangle([0, room_h, room_w, room_h + 4], fill=(50, 50, 50))  # separator line

    if product_images:
        # Arrange product thumbnails evenly across the strip
        n = len(product_images)
        thumb_w = max(80, min(200, (room_w - 20) // n - 10))
        thumb_h = strip_h - 10

        total_thumbs_w = n * (thumb_w + 10) - 10
        start_x = (room_w - total_thumbs_w) // 2

        for i, img_bytes in enumerate(product_images):
            try:
                thumb = PILImage.open(BytesIO(img_bytes))
                if thumb.mode != 'RGB':
                    thumb = thumb.convert('RGB')
                thumb.thumbnail((thumb_w, thumb_h), PILImage.LANCZOS)

                # Center the thumbnail in its slot
                x = start_x + i * (thumb_w + 10) + (thumb_w - thumb.width) // 2
                y = room_h + 5 + (thumb_h - thumb.height) // 2
                composite.paste(thumb, (x, y))

                # Draw border around thumbnail
                draw.rectangle(
                    [x - 2, y - 2, x + thumb.width + 1, y + thumb.height + 1],
                    outline=(50, 50, 50), width=2
                )
            except Exception as e:
                print(f"⚠️ Failed to process product image {i}: {e}")

    # Save as JPEG
    buf = BytesIO()
    composite.save(buf, format='JPEG', quality=90)
    return base64.b64encode(buf.getvalue()).decode()


async def _upload_temp_image(b64_data: str, filename: str = "room.jpg") -> str:
    """Save base64 image to a temp file and return a public URL path."""
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    import uuid
    fname = f"viz_temp_{uuid.uuid4().hex[:8]}.jpg"
    path = UPLOAD_DIR / fname
    img_bytes = base64.b64decode(b64_data)
    path.write_bytes(img_bytes)
    return f"/uploads/{fname}"


async def _replicate_img2img(image_url: str, prompt: str) -> str:
    """Call Replicate FLUX Kontext Pro for image editing. Returns output URL."""
    headers = {
        "Authorization": f"Bearer {REPLICATE_API_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "wait",
    }

    payload = {
        "version": "black-forest-labs/flux-kontext-pro",
        "input": {
            "prompt": prompt,
            "input_image": image_url,
            "aspect_ratio": "match_input_image",
            "output_format": "png",
            "safety_tolerance": 2,
            "prompt_upsampling": True,
        }
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        resp = await client.post(
            "https://api.replicate.com/v1/predictions",
            headers=headers,
            json=payload,
        )

        if resp.status_code not in (200, 201):
            err_text = resp.text[:500]
            print(f"❌ Replicate create error {resp.status_code}: {err_text}")
            raise Exception(f"Replicate API error: {resp.status_code}")

        data = resp.json()

        if data.get("status") == "succeeded":
            output = data.get("output")
            if isinstance(output, list):
                return output[0]
            elif isinstance(output, str):
                return output
            raise Exception("Unexpected output format from Replicate")

        prediction_id = data.get("id")
        poll_url = data.get("urls", {}).get("get", f"https://api.replicate.com/v1/predictions/{prediction_id}")

        for attempt in range(60):
            await asyncio.sleep(2)
            poll_resp = await client.get(poll_url, headers=headers)
            poll_data = poll_resp.json()
            status = poll_data.get("status")

            if status == "succeeded":
                output = poll_data.get("output")
                if isinstance(output, list):
                    return output[0]
                elif isinstance(output, str):
                    return output
                raise Exception("Unexpected output format")
            elif status in ("failed", "canceled"):
                err = poll_data.get("error", "Unknown error")
                raise Exception(f"Replicate generation failed: {err}")

        raise Exception("Replicate generation timed out (>2 min)")


async def _replicate_txt2img(prompt: str) -> str:
    """Text-to-image fallback with Replicate FLUX 1.1 Pro."""
    headers = {
        "Authorization": f"Bearer {REPLICATE_API_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "wait",
    }
    payload = {
        "version": "black-forest-labs/flux-1.1-pro",
        "input": {
            "prompt": prompt,
            "aspect_ratio": "16:9",
            "output_format": "png",
            "safety_tolerance": 2,
        }
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        resp = await client.post(
            "https://api.replicate.com/v1/predictions",
            headers=headers,
            json=payload,
        )
        if resp.status_code not in (200, 201):
            raise Exception(f"Replicate API error: {resp.status_code}")

        data = resp.json()
        if data.get("status") == "succeeded":
            output = data.get("output")
            return output[0] if isinstance(output, list) else output

        prediction_id = data.get("id")
        poll_url = data.get("urls", {}).get("get", f"https://api.replicate.com/v1/predictions/{prediction_id}")

        for _ in range(60):
            await asyncio.sleep(2)
            poll_data = (await client.get(poll_url, headers=headers)).json()
            if poll_data.get("status") == "succeeded":
                output = poll_data.get("output")
                return output[0] if isinstance(output, list) else output
            elif poll_data.get("status") in ("failed", "canceled"):
                raise Exception(f"Generation failed: {poll_data.get('error')}")

        raise Exception("Generation timed out")


async def _hf_fallback(prompt: str) -> bytes:
    """Fallback: HuggingFace FLUX.1-schnell text-to-image."""
    from huggingface_hub import InferenceClient
    client = InferenceClient(api_key=HF_TOKEN, timeout=90)
    image = await asyncio.to_thread(
        lambda: client.text_to_image(prompt=prompt, model="black-forest-labs/FLUX.1-schnell")
    )
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


@router.post("/visualize")
@router.post("/visualize/")
async def visualize_interior(request: Request):
    if not REPLICATE_API_TOKEN and not HF_TOKEN:
        raise HTTPException(status_code=500, detail="REPLICATE_API_TOKEN или HF_TOKEN не настроен")

    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Невалидный JSON")

    products_list = body.get("products", [])
    product_image_urls = body.get("product_images", [])  # NEW: list of image URLs
    room_image_b64 = body.get("image")

    if not products_list:
        raise HTTPException(status_code=422, detail="Выберите хотя бы один товар")

    print(f"🛋 Products: {products_list}")
    print(f"🖼 Product images: {len(product_image_urls)} URLs")
    print(f"📸 Room image: {'yes' if room_image_b64 else 'no'}")

    try:
        # Prepare room image
        room_b64 = None
        if room_image_b64:
            room_b64 = _optimize_image(room_image_b64)
            print("📸 Room image optimized")

        # Build enriched prompt
        prompt = build_prompt(products_list)
        print(f"💬 Prompt: {prompt[:300]}...")

        # ── Try Replicate (preferred) ──
        replicate_result_b64 = None
        if REPLICATE_API_TOKEN and room_b64:
            try:
                temp_path = await _upload_temp_image(room_b64)
                host = os.getenv("PUBLIC_URL", "http://localhost")
                image_url = f"{host}{temp_path}"
                print(f"🔗 Room URL for Replicate: {image_url}")
                result_url = await _replicate_img2img(image_url, prompt)

                async with httpx.AsyncClient(timeout=30.0) as dl_client:
                    img_resp = await dl_client.get(result_url)
                    img_resp.raise_for_status()
                replicate_result_b64 = base64.b64encode(img_resp.content).decode("utf-8")
                print("✅ Replicate success")
            except Exception as rep_err:
                err_msg = str(rep_err)
                if "402" in err_msg or "Insufficient" in err_msg or "credit" in err_msg.lower():
                    print(f"⚠️ Replicate has no credits (402), falling back to HuggingFace")
                else:
                    print(f"⚠️ Replicate failed: {rep_err}")

        # ── Return Replicate result or fall back to HF ──
        if replicate_result_b64:
            return {
                "success": True,
                "image": f"data:image/png;base64,{replicate_result_b64}",
                "prompt": prompt,
                "provider": "replicate-flux-kontext-pro",
            }

        # ── HuggingFace fallback (free, no credits needed) ──
        if HF_TOKEN:
            print("🤗 Using HuggingFace FLUX.1-schnell (free fallback)")
            img_bytes = await _hf_fallback(prompt)
            result_b64 = base64.b64encode(img_bytes).decode("utf-8")
            return {
                "success": True,
                "image": f"data:image/png;base64,{result_b64}",
                "prompt": prompt,
                "provider": "hf-flux-schnell",
            }

        return {"success": False, "error": "Replicate без кредитов и HF_TOKEN не настроен. Добавьте кредит на https://replicate.com/account/billing"}

    except Exception as e:
        print(f"❌ Visualize error: {e}")
        return {"success": False, "error": f"Ошибка генерации: {e}"}
