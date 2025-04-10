from pydantic import BaseModel, EmailStr, HttpUrl, Field, condecimal
from typing import List
from typing import Optional


# ------ User shcemas ------
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

    
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

# ------ Category shcemas ------
class CategoryCreate(BaseModel):
    name: str

class CategoryBulkRequest(BaseModel):
    categories: List[CategoryCreate]

class CategoryResponse(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

# ----- Product Schemas --------
class ProductCreate(BaseModel):
    name: str
    brand: str
    description: Optional[str]
    price: float = Field(gt=0)
    category_id: int
    image_url: Optional[str]

class ProductBulkRequest(BaseModel):
    products: List[ProductCreate]

class ProductResponse(BaseModel):
    id: int
    name: str
    brand: str
    description: Optional[str]
    price: float
    category_id: int
    image_url: Optional[str]

    class Config:
        orm_mode = True


# ------- Product Varianst Schema ----- 
class ProductVariantCreate(BaseModel):
    product_id: int
    sku: str
    size: str
    color: str
    stock: int
    price: condecimal(max_digits=10, decimal_places=2)

class BulkProductVariantRequest(BaseModel):
    variants: List[ProductVariantCreate]