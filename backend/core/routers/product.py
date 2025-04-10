from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy import and_
from sqlalchemy.orm import Session
from core.database.database import get_db
from core.models.models import User, ProductCategory, Product
from core.schemas.schemas import ProductBulkRequest, ProductResponse

from core.services.auth import get_current_admin

router = APIRouter(prefix="/product", tags=["Products"])

@router.get("/", response_model=List[ProductResponse])
def get(
    category_id: Optional[int] = Query(None, gt=0),
    search: Optional[str] = Query(None, description="Search in product names"),
    brand: Optional[str] = Query(None, description="Search in brand"),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    filters = []
    if category_id:
        filters.append([Product.category_id == category_id])
    if search:
        filters.append(Product.name.ilike(f"%{search}%"))
    if min_price is not None:
        filters.append(Product.price >= min_price)
    if max_price is not None:
        filters.append(Product.price <= max_price)
    if brand:
        filters.append(Product.brand.ilike(f"%{brand}%"))

    products = db.query(Product)\
        .filter(and_(*filters))\
        .limit(limit)\
        .offset(offset)\
        .all()

    return products

@router.post("/", status_code=201)
def add(
    payload: ProductBulkRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    created = []
    skipped = []
    valid_category_ids = {cat.id for cat in db.query(ProductCategory).all()}

    for p in payload.products:
        if p.category_id not in valid_category_ids:
            skipped.append({"name": p.name, "reason": "Invalid category_id"})
            continue

        new_product = Product(
            name=p.name,
            description=p.description,
            price=p.price,
            brand=p.brand,
            category_id=p.category_id,
            image_url=p.image_url
        )
        db.add(new_product)
        created.append(p.name)

    db.commit()
    return {
        "created": created,
        "skipped": skipped,
        "message": f"{len(created)} created, {len(skipped)} skipped"
    }