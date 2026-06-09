from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_categories():
    return []

@router.get("/{slug}")
def get_category(slug: str):
    return None
