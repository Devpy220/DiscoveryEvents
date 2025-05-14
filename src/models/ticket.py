from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid # For generating unique ticket codes
from src.models.user import db # Re-using the db instance

class Ticket(db.Model):
    __tablename__ = "tickets"
    id = db.Column(db.Integer, primary_key=True)
    ticket_code = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    event = db.relationship("Event", backref=db.backref("tickets", lazy=True))
    
    # Information about the buyer
    buyer_name = db.Column(db.String(100), nullable=False)
    buyer_email = db.Column(db.String(120), nullable=False)
    
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow)
    is_used = db.Column(db.Boolean, default=False, nullable=False)
    # price_paid = db.Column(db.Float, nullable=False) # Could store the price at time of purchase

    # If users can register, we might link tickets to a user account
    # user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    # user = db.relationship("User", backref=db.backref("purchased_tickets", lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "ticket_code": self.ticket_code,
            "event_id": self.event_id,
            "event_name": self.event.name if self.event else None,
            "buyer_name": self.buyer_name,
            "buyer_email": self.buyer_email,
            "purchase_date": self.purchase_date.isoformat(),
            "is_used": self.is_used,
            # "price_paid": self.price_paid
        }

    def __repr__(self):
        return f"<Ticket {self.ticket_code} for Event {self.event_id}>"

