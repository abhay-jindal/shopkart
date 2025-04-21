import datetime
from decimal import Decimal
from pydantic import BaseModel, EmailStr, Field
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
    id: int
    product_id: int
    sku: str
    size: str
    color: str
    stock: int
    price: Decimal = Field(..., gt=0, max_digits=10, decimal_places=2)

class BulkProductVariantRequest(BaseModel):
    variants: List[ProductVariantCreate]

class VariantIDListRequest(BaseModel):
    ids: List[int]

class ProductByIdResponse(ProductResponse):
    variants: List[
        ProductVariantCreate
    ]

    class Config:
        orm_mode = True


# ------ User Address Schemas ------
class UserAddressBase(BaseModel):
    address_line1: str
    city: str
    state: str
    zip_code: int
    alias: Optional[str] = None

class UserAddressResponse(UserAddressBase):
    id: int

    class Config:
        orm_mode = True

class UserAddressUpdate(UserAddressBase):
    pass

class UserAddressCreate(UserAddressBase):
    pass


# ----- Payment Schemas -----
class CreatePaymentOrderRequest(BaseModel):
    amount: float = Field(..., gt=0)
    currency: str = Field(default="INR")

class CreatePaymentOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    receipt: str
    status: str

# ----- Order Schemas -----
class OrderLineCreate(BaseModel):
    variant_id: int
    quantity: int
    price: float

class OrderCreateRequest(BaseModel):
    address_id: int
    payment_order_id: str
    payment_id: str
    payment_signature: str
    order_lines: List[OrderLineCreate]

class OrderResponse(BaseModel):
    id: int
    user_id: int
    shipping_address_id: int
    total_amount: Decimal
    order_status: str
    payment_status: str
    created_at: datetime.datetime

    class Config:
        orm_mode = True

class OrderWithTotalResponse(BaseModel):
    total: int
    orders: List[
        OrderResponse
    ]

    class Config:
        orm_mode = True