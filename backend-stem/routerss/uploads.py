"""
Image upload router — POST /api/uploads/image
Admin-only. Accepts multipart/form-data, saves file to /app/uploads/,
returns the public URL path that can be stored in Product.img.
Files are served as static files by Nginx directly (no app proxying).
"""

import uuid
import mimetypes
from pathlib import Path

from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from sqlalchemy.orm import Session

from database import get_db
from routerss.auth import get_current_admin

router = APIRouter()

UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MAX_SIZE_BYTES = 5 * 1024 * 1024   # 5 MB
ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/jpg":  ".jpg",
    "image/png":  ".png",
    "image/webp": ".webp",
}


@router.post("/image", status_code=201)
async def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),   # Requires valid admin JWT
):
    """Upload a product image. Returns { url: '/uploads/<uuid>.ext' }"""

    # --- validate MIME type ---
    content_type = (file.content_type or "").lower()
    if content_type not in ALLOWED_TYPES:
        # Fall back to guessing from filename
        guessed, _ = mimetypes.guess_type(file.filename or "")
        if (guessed or "").lower() not in ALLOWED_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Недопустимый тип файла. Разрешены: JPG, PNG, WebP."
            )
        content_type = guessed.lower()

    # --- read & validate size ---
    data = await file.read()
    if len(data) > MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"Файл слишком большой. Максимум: {MAX_SIZE_BYTES // (1024 * 1024)} МБ."
        )
    if len(data) == 0:
        raise HTTPException(status_code=400, detail="Файл пустой.")

    # --- save with UUID name to avoid collisions ---
    ext = ALLOWED_TYPES[content_type]
    filename = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOAD_DIR / filename
    dest.write_bytes(data)

    return {"url": f"/uploads/{filename}"}
