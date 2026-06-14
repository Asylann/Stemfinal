import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models import Product

router = APIRouter()


def _parse_colors(colors_json):
    if not colors_json:
        return []
    try:
        data = json.loads(colors_json)
        return data if isinstance(data, list) else []
    except (json.JSONDecodeError, TypeError):
        return []


def _product_out(p: Product) -> dict:
    cat = p.category
    colors = _parse_colors(p.colors_json)
    return {
        "id": p.id,
        "title": p.title,
        "img": p.img,
        "imgs": [c["img"] for c in colors if c.get("img")] or ([p.img] if p.img else []),
        "description": p.description_ru,
        "description_ru": p.description_ru,
        "description_kz": p.description_kz,
        "material": p.material_ru,
        "material_ru": p.material_ru,
        "material_kz": p.material_kz,
        "size": p.size,
        "article": p.article,
        "in_stock": p.in_stock,
        "price": None,
        "old_price": None,
        "colors": colors,
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
    query = db.query(Product).options(joinedload(Product.category))
    if category:
        query = query.filter(Product.category_slug == category)
    if q:
        query = query.filter(Product.title.ilike(f"%{q}%"))
    if in_stock is not None:
        query = query.filter(Product.in_stock == in_stock)
    return [_product_out(p) for p in query.all()]


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    p = (
        db.query(Product)
        .options(joinedload(Product.category))
        .filter(Product.id == product_id)
        .first()
    )
    if not p:
        raise HTTPException(status_code=404, detail=f"Товар с ID {product_id} не найден")
    return _product_out(p)
