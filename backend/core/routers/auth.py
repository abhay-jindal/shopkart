from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database.database import get_db
from core.schemas.schemas import UserOut, UserCreate, Token, UserLogin
from core.utils.utils import hash_password, verify_password

from core.models.models import User

from core.services.auth import create_access_token, get_current_user, get_current_admin

router = APIRouter(tags=["Auth"], prefix="/auth")


# Register user
@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = hash_password(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=hashed_pwd,
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Login user
@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": db_user.email, "name": db_user.name, "id": db_user.id})
    return {"access_token": access_token, "token_type": "bearer"}

# Get current user profile
@router.get("/me", response_model=UserOut)
def get(current_user: User = Depends(get_current_user)):
    return current_user

# Admin-only route: Get all users
@router.get("/", response_model=list[UserOut])
def get_all(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return db.query(User).all()
