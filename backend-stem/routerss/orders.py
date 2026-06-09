from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class OrderCreate(BaseModel):
    product_id: int
    product_title: str
    client_name: Optional[str] = None
    client_phone: Optional[str] = None
    message: Optional[str] = None

@router.post("/")
def create_order(order: OrderCreate):
    return {"status": "ok"}

@router.get("/")
def get_orders():
    return []
