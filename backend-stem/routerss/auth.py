import os
import re
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
from models import User
from pydantic import BaseModel
from typing import Optional
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is not set. It is required for secure authentication.")
ALGORITHM = "HS256"
EXPIRE_DAYS = 7

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2 = OAuth2PasswordBearer(tokenUrl="/auth/login")


def normalize_phone(phone: str) -> str:
    """Normalize phone numbers so 87055381140 == +77055381140.
    Kazakhstan: 8 is the national prefix, +7 is the international prefix.
    Both refer to the same subscriber."""
    if not phone:
        return phone
    digits = re.sub(r'\D', '', phone)
    if len(digits) == 11 and digits.startswith('8'):
        return '+7' + digits[1:]
    if len(digits) == 11 and digits.startswith('7'):
        return '+' + digits
    if len(digits) == 10:
        return '+7' + digits
    # Return cleaned but preserve original format if unusual
    return phone.strip()


class RegisterData(BaseModel):
    phone: str
    password: str
    name: Optional[str] = None
    email: Optional[str] = None


class LoginData(BaseModel):
    phone: str
    password: str


class UserOut(BaseModel):
    id: int
    name: Optional[str] = None
    email: Optional[str] = None
    phone: str
    is_admin: bool = False

    class Config:
        from_attributes = True


def make_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(days=EXPIRE_DAYS)
    return jwt.encode({"sub": str(user_id), "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def get_user_id(token: str = Depends(oauth2)) -> int:
    """Extract user ID from JWT — used by legacy routes."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload["sub"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Невалидный токен")


def get_current_user(token: str = Depends(oauth2), db: Session = Depends(get_db)) -> User:
    """Return the full User ORM object from the JWT. Raises 401 on invalid token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload["sub"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Невалидный токен")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Пользователь не найден")
    return user


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """Ensure the current user is an administrator. Raises 403 otherwise."""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Доступ запрещён: требуются права администратора")
    return current_user


@router.post("/register")
def register(data: RegisterData, db: Session = Depends(get_db)):
    phone = normalize_phone(data.phone)
    # Check if phone already registered
    if db.query(User).filter(User.phone == phone).first():
        raise HTTPException(status_code=400, detail="Этот номер телефона уже зарегистрирован")
    # Check if email already taken (if provided)
    if data.email and db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")
    user = User(
        name=data.name,
        email=data.email,
        password=pwd.hash(data.password),
        phone=phone
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {
        "access_token": make_token(user.id),
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "is_admin": user.is_admin,
        }
    }


@router.post("/login")
def login(data: LoginData, db: Session = Depends(get_db)):
    phone = normalize_phone(data.phone)
    user = db.query(User).filter(User.phone == phone).first()
    if not user or not pwd.verify(data.password, user.password):
        raise HTTPException(status_code=401, detail="Неверный номер телефона или пароль")
    return {
        "access_token": make_token(user.id),
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "is_admin": user.is_admin,
        }
    }


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user


class UpdateUserData(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None


@router.patch("/me", response_model=UserOut)
def update_me(data: UpdateUserData, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update the current user's profile (name, email)."""
    if data.name is not None:
        current_user.name = data.name.strip() or None
    if data.email is not None:
        email = data.email.strip() or None
        if email:
            existing = db.query(User).filter(User.email == email, User.id != current_user.id).first()
            if existing:
                raise HTTPException(status_code=400, detail="Email уже занят")
        current_user.email = email
    db.commit()
    db.refresh(current_user)
    return current_user