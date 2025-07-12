from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from core.services.razorpay import client
import datetime
from typing import List, Optional

from core.database.database import get_db
from core.models.models import CourierPartners, Order, OrderItem, OrderStatus, Payment, PaymentStatus, Shipment, User, UserAddress
from core.schemas.schemas import OrderCreateRequest, OrderResponse, OrderWithTotalResponse
from core.services.auth import get_current_user
from core.services.pdf_service import InvoicePDFService
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

@router.get("/{order_id}/invoice")
def download_invoice(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Download invoice PDF for a specific order"""
    try:
        # Get the order with all related data
        order = db.query(Order).filter(
            Order.id == order_id,
            Order.user_id == current_user.id
        ).first()
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Get order items with product and variant information
        order_items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
        
        if not order_items:
            raise HTTPException(status_code=404, detail="No items found for this order")
        
        # Get user information
        user = db.query(User).filter(User.id == order.user_id).first()
        
        # Get shipping address
        shipping_address = db.query(UserAddress).filter(UserAddress.id == order.shipping_address_id).first()
        
        if not shipping_address:
            raise HTTPException(status_code=404, detail="Shipping address not found")
        
        # Get payment information
        payment = db.query(Payment).filter(Payment.order_id == order_id).first()
        
        if not payment:
            raise HTTPException(status_code=404, detail="Payment information not found")
        
        # Generate PDF
        pdf_service = InvoicePDFService()
        pdf_buffer = pdf_service.generate_invoice_pdf(
            order=order,
            order_items=order_items,
            user=user,
            shipping_address=shipping_address,
            payment=payment
        )
        
        # Return the PDF as a streaming response
        return StreamingResponse(
            iter([pdf_buffer.getvalue()]),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=invoice-{order_id:06d}.pdf"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate invoice: {str(e)}")

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
