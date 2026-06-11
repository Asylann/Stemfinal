from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Product

router = APIRouter()


@router.get("")
@router.get("/")
def get_products(
    category: str = Query(None),
    q: str = Query(None),
    in_stock: bool = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Product)
    if category:
        query = query.filter(Product.category_slug == category)
    if q:
        query = query.filter(Product.title.ilike(f"%{q}%"))
    if in_stock is not None:
        query = query.filter(Product.in_stock == in_stock)
    products = query.all()
    return [
        {
            "id": p.id,
            "title": p.title,
            "img": p.img,
            "description_ru": p.description_ru,
            "description_kz": p.description_kz,
            "material_ru": p.material_ru,
            "material_kz": p.material_kz,
            "size": p.size,
            "article": p.article,
            "in_stock": p.in_stock,
            "category_slug": p.category_slug,
        }
        for p in products
    ]


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Товар с ID {product_id} не найден")
    return {
        "id": product.id,
        "title": product.title,
        "img": product.img,
        "description_ru": product.description_ru,
        "description_kz": product.description_kz,
        "material_ru": product.material_ru,
        "material_kz": product.material_kz,
        "size": product.size,
        "article": product.article,
        "in_stock": product.in_stock,
        "category_slug": product.category_slug,
    }
