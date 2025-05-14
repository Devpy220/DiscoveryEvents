from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db # Re-using the db instance from user.py

class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False, default=0.0)
    # image_url = db.Column(db.String(255), nullable=True) # For event posters/images
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    organizer_id = db.Column(db.Integer, db.ForeignKey('organizers.id'), nullable=False)
    organizer = db.relationship('User', backref=db.backref('events', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'date': self.date.isoformat() if self.date else None,
            'time': self.time.isoformat() if self.time else None,
            'location': self.location,
            'price': self.price,
            # 'image_url': self.image_url,
            'organizer_id': self.organizer_id,
            'organizer_username': self.organizer.username if self.organizer else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

    def __repr__(self):
        return f'<Event {self.name}>'

