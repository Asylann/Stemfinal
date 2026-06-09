from fastapi import APIRouter, Query, HTTPException

router = APIRouter()


@router.get("/")
def get_products(
    category: str = Query(None),
    q: str = Query(None),
    in_stock: bool = Query(None),
):
    return []


@router.get("/{product_id}")
def get_product(product_id: int):
    raise HTTPException(status_code=404, detail=f"Товар с ID {product_id} не найден")
