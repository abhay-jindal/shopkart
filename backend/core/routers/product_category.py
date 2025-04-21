from typing import List
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from core.database.database import get_db
from core.models.models import User, ProductCategory
from core.schemas.schemas import CategoryBulkRequest, CategoryCreate, CategoryResponse

from core.services.auth import get_current_admin
from core.services.cache import LocalCache

router = APIRouter(prefix="/product/categories", tags=["Product Categories"])
cache = LocalCache()


@router.post("", status_code=201)
def add(
    payload: CategoryBulkRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    existing_names = {c.name.lower() for c in db.query(ProductCategory).all()}
    added, skipped = [], []

    for cat in payload.categories:
        if cat.name.lower() in existing_names:
            skipped.append(cat.name)
            continue
        new_cat = ProductCategory(name=cat.name)
        db.add(new_cat)
        added.append(cat.name)

    db.commit()
    cache.invalidate("categories")  # Clear cache after mutation
    return {
        "created": added,
        "skipped": skipped,
        "message": f"{len(added)} created, {len(skipped)} skipped"
    }

@router.get("", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    cached_data = cache.get("categories")
    if cached_data:
        return cached_data

    categories = db.query(ProductCategory).all()
    cache.set("categories", categories, ttl=300)  # cache for 5 min
    return categories

@router.put("/{id}", status_code=200)
def update(
    id: int = Path(..., gt=0),
    payload: CategoryCreate = Depends(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    category = db.query(ProductCategory).filter(ProductCategory.id == id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")

    # Check for duplicate name
    duplicate = db.query(ProductCategory).filter(
        ProductCategory.name.ilike(payload.name),
        ProductCategory.id != id
    ).first()
    if duplicate:
        raise HTTPException(status_code=400, detail="Category name already exists.")

    category.name = payload.name
    db.commit()
    db.refresh(category)
    return {"message": "Category updated", "category": {"id": category.id, "name": category.name}}