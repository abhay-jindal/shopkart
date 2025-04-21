from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from core.database.database import get_db
from core.schemas.schemas import CreatePaymentOrderRequest, CreatePaymentOrderResponse
from core.models.models import User

from core.services.razorpay import client
from core.services.auth import get_current_user

router = APIRouter(tags=["Payment"], prefix="/payment")


@router.post("/order", response_model=CreatePaymentOrderResponse)
def create_razorpay_order(order: CreatePaymentOrderRequest, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    try:
        # Convert rupees to paise (razorpay expects paise)
        order_payload = {
            "amount": int(order.amount * 100),
            "currency": order.currency,
            "receipt": f"receipt_{uuid.uuid4().hex[:10]}",
            "payment_capture": 1,
        }

        razorpay_order = client.order.create(data=order_payload)

        return {
            "order_id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "receipt": razorpay_order["receipt"],
            "status": razorpay_order["status"],
        }

    except Exception as e:
        raise HTTPException(status_code=424, detail=f"Razorpay cannot process your request right now! Please try again later")
