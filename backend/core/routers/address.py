from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database.database import get_db
from core.schemas.schemas import UserAddressCreate, UserAddressResponse, UserAddressUpdate
from typing import List
from core.models.models import UserAddress, User

from core.services.auth import get_current_user

router = APIRouter(tags=["Account Address"], prefix="/account/addresses")


@router.get("", response_model=List[UserAddressResponse])
def get_all(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    addresses = db.query(UserAddress).filter(UserAddress.user_id == current_user.id).all()
    return addresses

@router.get("/{id}", response_model=UserAddressResponse)
def get_address(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    address = db.query(UserAddress).get(id)
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    return address

@router.post("", response_model=UserAddressResponse)
def create(address: UserAddressCreate, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_address = UserAddress(**address.model_dump())
    new_address.user_id = _.id
    existing_address = db.query(UserAddress).filter(
        UserAddress.user_id == new_address.user_id,
        UserAddress.address_line1 == new_address.address_line1,
        UserAddress.city == new_address.city,
        UserAddress.zip_code == new_address.zip_code
    ).first()
    if existing_address:
        raise HTTPException(status_code=400, detail="Address already exists")
    
    db.add(new_address)
    db.commit()
    db.refresh(new_address)
    return new_address

@router.put("/{id}", response_model=UserAddressUpdate)
def update_address(id: int, updated: UserAddressUpdate, db: Session = Depends(get_db)):
    address = db.query(UserAddress).get(id)
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    for key, value in updated.model_dump(exclude_unset=True).items():
        setattr(address, key, value)
    db.commit()
    db.refresh(address)
    return address

@router.delete("/{id}", status_code=204)
def delete(address_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    address = db.query(UserAddress).get(address_id)
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    db.delete(address)
    db.commit()
    return