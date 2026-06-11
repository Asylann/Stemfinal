from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Category

router = APIRouter()


@router.get("")
@router.get("/")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return [
        {
            "id": c.id,
            "slug": c.slug,
            "title_ru": c.title_ru,
            "title_kz": c.title_kz,
            "img": c.img,
            "path": c.path,
            "parent_slug": c.parent_slug,
        }
        for c in categories
    ]


@router.get("/{slug}")
def get_category(slug: str, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.slug == slug).first()
    if not category:
        raise HTTPException(status_code=404, detail=f"Категория '{slug}' не найдена")
    return {
        "id": category.id,
        "slug": category.slug,
        "title_ru": category.title_ru,
        "title_kz": category.title_kz,
        "img": category.img,
        "path": category.path,
        "parent_slug": category.parent_slug,
    }
