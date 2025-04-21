from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from core.services.razorpay import client
import datetime
from typing import List, Optional

from core.database.database import get_db
from core.models.models import CourierPartners, Order, OrderItem, OrderStatus, Payment, PaymentStatus, Shipment, User
from core.schemas.schemas import OrderCreateRequest, OrderResponse, OrderWithTotalResponse
from core.services.auth import get_current_user
import random

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("", response_model=OrderWithTotalResponse)
def get_orders(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Order).filter(Order.user_id == user.id)

    total = query.count()
    results = query.order_by(Order.created_at.desc()).offset(offset).limit(limit).all()

    # Optionally return metadata
    return { "total": total, "orders": results }

@router.post("", response_model=OrderResponse)
async def create_order(
    payload: OrderCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        total_amount = sum(line.quantity * line.price for line in payload.order_lines)
        payment_data = client.payment.fetch(payload.payment_id)

        order = Order(
            user_id=current_user.id,
            shipping_address_id=payload.address_id,
            total_amount=total_amount + 20,  # Adding a flat platform fee of 20
            order_status=OrderStatus.pending,
            payment_status=PaymentStatus.pending,
            created_at=datetime.datetime.utcnow()
        )
        db.add(order)
        db.flush()

        for line in payload.order_lines:
            db.add(OrderItem(
                order_id=order.id,
                variant_id=line.variant_id,
                quantity=line.quantity,
                unit_price=line.price
            ))

        payment = Payment(
            order_id=order.id,
            transaction_id=payment_data["id"],
            status=payment_data["status"],
            amount=payment_data["amount"] / 100,
            payment_method=payment_data["method"],
            description=payment_data.get("description", ""),
            currency=payment_data["currency"],
            paid_at=datetime.datetime.utcnow()
        )
        db.add(payment)

        order.payment_status = (
            PaymentStatus.paid if payment.status == "captured"
            else PaymentStatus.failed
        )

        courier_name = random.choice([c.value for c in CourierPartners])
        db.add(Shipment(
            order_id=order.id,
            courier_name=courier_name,
            tracking_number=str(random.randint(1000000000, 9999999999)),
            shipped_at=datetime.datetime.utcnow(),
            delivery_estimate=datetime.datetime.utcnow() + datetime.timedelta(days=random.randint(3, 7)),
            status="pending"
        ))

        db.commit()  # 🔥 commit everything
        db.refresh(order)  # optional, if you want updated values
        order.description = payment.description
        print(order)
        return order

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Order creation failed: {e}")
