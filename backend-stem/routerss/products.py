import json
import os
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models import Product
from cache_utils import cache_get, cache_set

router = APIRouter()


def _parse_colors(colors_json):
    if not colors_json:
        return []
    try:
        data = json.loads(colors_json)
        return data if isinstance(data, list) else []
    except (json.JSONDecodeError, TypeError):
        return []


def _parse_specs(specs_json):
    if not specs_json:
        return []
    try:
        data = json.loads(specs_json)
        if isinstance(data, list):
            return [s for s in data if isinstance(s, dict) and s.get('label') and s.get('value')]
        return []
    except (json.JSONDecodeError, TypeError):
        return []


# Resolve project root for verifying static image paths
_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Docker: /frontend-public  |  Local dev: ../frontend-stem/public
for _fp in ('/frontend-public', os.path.normpath(os.path.join(_PROJECT_ROOT, '..', 'frontend-stem', 'public'))):
    if os.path.isdir(_fp):
        _FRONTEND_PUBLIC = _fp
        break
else:
    _FRONTEND_PUBLIC = None


def _verify_img(img_path):
    """Return img_path only if the file actually exists; otherwise None."""
    if not img_path:
        return None
    # Check /uploads/ paths (backend-served static files)
    if img_path.startswith('/uploads/'):
        if not os.path.exists(img_path.lstrip('/')):
            return None
        return img_path
    # Check /img/ paths (frontend public assets)
    if img_path.startswith('/img/'):
        if _FRONTEND_PUBLIC is None:
            return img_path  # can't verify, trust it
        full = os.path.join(_FRONTEND_PUBLIC, img_path.lstrip('/'))
        if not os.path.exists(full):
            return None
        return img_path
    return img_path


def _product_out(p: Product) -> dict:
    cat = p.category
    colors = _parse_colors(p.colors_json)
    specs = _parse_specs(p.specs_json)
    img = _verify_img(p.img)
    # Filter out broken image URLs from imgs list
    valid_imgs = [c["img"] for c in colors if c.get("img") and _verify_img(c["img"])]
    if not valid_imgs and img:
        valid_imgs = [img]
    # Also filter color images
    valid_colors = []
    for c in colors:
        cc = dict(c)
        if cc.get('img') and not _verify_img(cc['img']):
            cc['img'] = None
        valid_colors.append(cc)
    return {
        "id": p.id,
        "title": p.title,
        "img": img,
        "imgs": valid_imgs,
        "description": p.description_ru,
        "description_ru": p.description_ru,
        "description_kz": p.description_kz,
        "material": p.material_ru,
        "material_ru": p.material_ru,
        "material_kz": p.material_kz,
        "size": p.size,
        "article": p.article,
        "in_stock": p.in_stock,
        "colors": valid_colors,
        "specs": specs,
        "category_slug": p.category_slug,
        "category": {
            "slug": cat.slug,
            "title_ru": cat.title_ru,
            "title_kz": cat.title_kz,
            "path": cat.path,
        } if cat else None,
    }

@router.get("")
@router.get("/")
def get_products(
    category: str = Query(None),
    q: str = Query(None),
    in_stock: bool = Query(None),
    db: Session = Depends(get_db),
):
    # Build cache key based on query parameters
    cache_key = f"products:{category}:{q}:{in_stock}"
    
    # Try to get from cache
    cached = cache_get(cache_key)
    if cached:
        return cached
    
    # Query database
    query = db.query(Product).options(joinedload(Product.category))
    if category:
        query = query.filter(Product.category_slug == category)
    if q:
        query = query.filter(Product.title.ilike(f"%{q}%"))
    if in_stock is not None:
        query = query.filter(Product.in_stock == in_stock)
    
    result = [_product_out(p) for p in query.all()]
    
    # Cache for 30 minutes
    cache_set(cache_key, result, ttl=1800)
    
    return result


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    # Try to get from cache
    cache_key = f"product:{product_id}"
    cached = cache_get(cache_key)
    if cached:
        return cached
    
    # Query database
    p = (
        db.query(Product)
        .options(joinedload(Product.category))
        .filter(Product.id == product_id)
        .first()
    )
    if not p:
        raise HTTPException(status_code=404, detail=f"Товар с ID {product_id} не найден")
    
    result = _product_out(p)
    
    # Cache for 1 hour
    cache_set(cache_key, result, ttl=3600)
    
    return result
