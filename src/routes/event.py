from flask import Blueprint, jsonify, request
from src.models.event import Event, db
from src.models.user import User # To check if user is an organizer
# from flask_jwt_extended import jwt_required, get_jwt_identity # Assuming JWT for auth

event_bp = Blueprint("event", __name__)

# Placeholder for JWT or other auth check - for now, we'll assume organizer_id is passed or known
# A real implementation would use @jwt_required and get_jwt_identity()

@event_bp.route("/events", methods=["POST"])
# @jwt_required()
def create_event():
    data = request.json
    # current_user_id = get_jwt_identity()
    # For now, let's assume organizer_id is sent in the request for simplicity until JWT is fully set up.
    # In a real app, this would come from the JWT token.
    organizer_id = data.get("organizer_id") 
    if not organizer_id:
        return jsonify({"message": "Organizer ID is required"}), 400
    
    # Optional: Check if the user is indeed an organizer if roles are implemented
    # organizer = User.query.get(organizer_id)
    # if not organizer or organizer.role != 'organizer':
    #     return jsonify({"message": "User is not authorized to create events"}), 403

    if not all(k in data for k in ["name", "date", "time", "location", "price"]):
        return jsonify({"message": "Missing required event fields"}), 400

    try:
        new_event = Event(
            name=data["name"],
            description=data.get("description"),
            date=data["date"], # Expecting YYYY-MM-DD string
            time=data["time"], # Expecting HH:MM:SS string
            location=data["location"],
            price=float(data["price"]),
            organizer_id=organizer_id
            # image_url=data.get("image_url")
        )
        db.session.add(new_event)
        db.session.commit()
        return jsonify(new_event.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating event", "error": str(e)}), 500

@event_bp.route("/events", methods=["GET"])
def get_events():
    events = Event.query.order_by(Event.date.asc(), Event.time.asc()).all()
    return jsonify([event.to_dict() for event in events]), 200

@event_bp.route("/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    event = Event.query.get_or_404(event_id)
    return jsonify(event.to_dict()), 200

@event_bp.route("/events/<int:event_id>", methods=["PUT"])
# @jwt_required()
def update_event(event_id):
    event = Event.query.get_or_404(event_id)
    # current_user_id = get_jwt_identity()
    # if event.organizer_id != current_user_id:
    #     return jsonify({"message": "Not authorized to update this event"}), 403

    data = request.json
    try:
        event.name = data.get("name", event.name)
        event.description = data.get("description", event.description)
        event.date = data.get("date", event.date)
        event.time = data.get("time", event.time)
        event.location = data.get("location", event.location)
        event.price = float(data.get("price", event.price))
        # event.image_url = data.get("image_url", event.image_url)
        
        db.session.commit()
        return jsonify(event.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating event", "error": str(e)}), 500

@event_bp.route("/events/<int:event_id>", methods=["DELETE"])
# @jwt_required()
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    # current_user_id = get_jwt_identity()
    # if event.organizer_id != current_user_id:
    #     return jsonify({"message": "Not authorized to delete this event"}), 403
    
    try:
        db.session.delete(event)
        db.session.commit()
        return "", 204
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting event", "error": str(e)}), 500

@event_bp.route("/organizers/<int:organizer_id>/events", methods=["GET"])
# @jwt_required()
def get_organizer_events(organizer_id):
    # current_user_id = get_jwt_identity()
    # if organizer_id != current_user_id: # Ensure organizer can only see their own events
        # return jsonify({"message": "Not authorized to view these events"}), 403

    organizer = User.query.get_or_404(organizer_id)
    events = Event.query.filter_by(organizer_id=organizer.id).order_by(Event.date.asc(), Event.time.asc()).all()
    return jsonify([event.to_dict() for event in events]), 200

