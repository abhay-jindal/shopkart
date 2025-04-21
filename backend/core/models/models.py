from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum, DECIMAL, ARRAY
import enum
import datetime
from sqlalchemy.orm import relationship

from core.database.database import Base, engine

# ENUMS
class UserRole(str, enum.Enum):
    admin = "admin"
    user = "user"

class OrderStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"

class PaymentMethod(str, enum.Enum):
    card = "card"
    cod = "cod"
    upi = "upi"

class PaymentStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"

class CourierPartners(str, enum.Enum):
    DTDC = "DTDC"
    BlueDart = "BlueDart"
    DHL = "DHL"
    FedEx = "FedEx"
    IndiaPost = "IndiaPost"

# MODELS
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True)
    password = Column(String,  nullable=False)
    phone = Column(String)
    role = Column(Enum(UserRole), nullable=False, server_default="user")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class UserAddress(Base):
    __tablename__ = "user_addresses"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    address_line1 = Column(String)
    city = Column(String)
    state = Column(String)
    zip_code = Column(Integer)
    alias = Column(String)
    user = relationship("User", backref="addresses")

class ProductCategory(Base):
    __tablename__ = "product_categories"
    id = Column(Integer, primary_key=True)
    name = Column(String,  unique=True)
    parent_id = Column(Integer, ForeignKey("product_categories.id"))
    parent = relationship("ProductCategory", remote_side=[id])

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(Text)
    brand = Column(String)
    price = Column(DECIMAL)
    category_id = Column(Integer, ForeignKey("product_categories.id"))
    image_url = Column(Text)
    category = relationship("ProductCategory")

class ProductVariant(Base):
    __tablename__ = "product_variants"
    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    sku = Column(String)
    size = Column(String)
    color = Column(String)
    stock = Column(Integer)
    price = Column(DECIMAL)
    product = relationship("Product")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    shipping_address_id = Column(Integer, ForeignKey("user_addresses.id"))
    total_amount = Column(DECIMAL)
    order_status = Column(Enum(OrderStatus))
    payment_status = Column(Enum(PaymentStatus))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    variant_id = Column(Integer, ForeignKey("product_variants.id"))
    quantity = Column(Integer)
    unit_price = Column(DECIMAL)

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    payment_method = Column(String)
    status = Column(String)
    paid_at = Column(DateTime)
    description = Column(Text)
    amount = Column(DECIMAL)
    currency = Column(String)
    transaction_id = Column(Integer)

class Shipment(Base):
    __tablename__ = "shipments"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    courier_name = Column(String)
    tracking_number = Column(String)
    shipped_at = Column(DateTime)
    delivery_estimate = Column(DateTime)
    status = Column(String)

class Cart(Base):
    __tablename__ = "carts"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_id = Column(String)

class CartItem(Base):
    __tablename__ = "cart_items"
    id = Column(Integer, primary_key=True)
    cart_id = Column(Integer, ForeignKey("carts.id"))
    variant_id = Column(Integer, ForeignKey("product_variants.id"))
    quantity = Column(Integer)

class ProductView(Base):
    __tablename__ = "product_views"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    viewed_at = Column(DateTime, default=datetime.datetime.utcnow)

class ProductReview(Base):
    __tablename__ = "product_reviews"
    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer)
    title = Column(String)
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    is_verified = Column(Boolean)


Base.metadata.create_all(bind=engine)
