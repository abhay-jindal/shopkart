from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_
from sqlalchemy.orm import Session
from core.database.database import get_db
from core.models.models import ProductVariant, Product
from core.schemas.schemas import BulkProductVariantRequest, ProductVariantCreate, VariantIDListRequest

from typing import List

from core.services.auth import get_current_admin, get_current_user

router = APIRouter(prefix="/product/variants", tags=["Product Variants"])

@router.post("/bulk")
def add(
    payload: BulkProductVariantRequest,
    db: Session = Depends(get_db),
    _ =Depends(get_current_admin)
):
    incoming_skus = [v.sku for v in payload.variants]

    # Step 1: Query only SKUs that might conflict
    existing_skus = db.query(ProductVariant.sku).filter(ProductVariant.sku.in_(incoming_skus)).all()
    existing_sku_set = {sku for (sku,) in existing_skus}

    created_variants = []
    skipped = []

    for item in payload.variants:
        if item.sku in existing_sku_set:
            skipped.append({
                "data": item.dict(),
                "reason": f"SKU '{item.sku}' already exists"
            })
            continue

        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            skipped.append({
                "data": item.dict(),
                "reason": f"Product with ID {item.product_id} not found"
            })
            continue

        variant = ProductVariant(
            product_id=item.product_id,
            sku=item.sku,
            size=item.size,
            color=item.color,
            stock=item.stock,
            price=item.price
        )
        db.add(variant)
        created_variants.append(item.dict())

    db.commit()

    return {
        "success": True,
        "created_count": len(created_variants),
        "skipped_count": len(skipped),
        "created_variants": created_variants,
        "skipped": skipped
    }

@router.post("", response_model=List[ProductVariantCreate])
def get_variants_by_ids(ids: VariantIDListRequest, db: Session = Depends(get_db)):
    """
    Get all product variants based on a list of variant IDs.
    """
    if not ids:
        raise HTTPException(status_code=400, detail="Variant ID list is empty")

    variants = db.query(ProductVariant).filter(ProductVariant.id.in_(ids.ids)).all()
    
    if not variants:
        raise HTTPException(status_code=404, detail="No variants found for the given IDs")

    return variants