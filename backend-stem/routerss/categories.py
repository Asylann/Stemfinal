from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Category

router = APIRouter()

def _cat_out(c: Category) -> dict:
    return {
        "id": c.id,
        "slug": c.slug,
        "title_ru": c.title_ru,
        "title_kz": c.title_kz,
        "img": c.img,
        "path": c.path,
        "parent_slug": c.parent_slug,
    }

@router.get("")
@router.get("/")
def get_categories(db: Session = Depends(get_db)):
    return [_cat_out(c) for c in db.query(Category).all()]


@router.get("/{slug}")
def get_category(slug: str, db: Session = Depends(get_db)):
    c = db.query(Category).filter(Category.slug == slug).first()
    if not c:
        raise HTTPException(status_code=404, detail=f"Категория '{slug}' не найдена")
    return _cat_out(c)
