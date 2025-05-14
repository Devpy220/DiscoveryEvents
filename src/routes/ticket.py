from flask import Blueprint, jsonify, request, current_app # Import current_app to access app.extensions
from src.models.ticket import Ticket, db
from src.models.event import Event
from flask_mail import Message
# from src import mail # mail is now accessible via app.extensions['mail']

ticket_bp = Blueprint("ticket", __name__)

@ticket_bp.route("/tickets/purchase", methods=["POST"])
def purchase_ticket():
    data = request.json
    if not data or not data.get("event_id") or not data.get("buyer_name") or not data.get("buyer_email"):
        return jsonify({"message": "Missing event_id, buyer_name, or buyer_email"}), 400

    event = Event.query.get(data["event_id"])
    if not event:
        return jsonify({"message": "Event not found"}), 404

    try:
        new_ticket = Ticket(
            event_id=event.id,
            buyer_name=data["buyer_name"],
            buyer_email=data["buyer_email"],
            # price_paid=event.price
        )
        db.session.add(new_ticket)
        db.session.commit()

        # Send email confirmation
        mail = current_app.extensions.get('mail')
        if mail:
            try:
                msg = Message(
                    subject=f"Your Ticket for {event.name} - DiscoveryEvent's",
                    recipients=[new_ticket.buyer_email],
                    body=f"Hello {new_ticket.buyer_name},\n\nThank you for your purchase!\nYour ticket code is: {new_ticket.ticket_code}\nEvent: {event.name}\nDate: {event.date.strftime('%Y-%m-%d')} at {event.time.strftime('%H:%M')}\nLocation: {event.location}\n\nWe look forward to seeing you!\n\nBest regards,\nThe DiscoveryEvent's Team",
                    # html_body=render_template("email/ticket_confirmation.html", ticket=new_ticket, event=event) # Optional HTML email
                )
                mail.send(msg)
            except Exception as e:
                # Log email sending failure, but don't fail the purchase if email fails
                current_app.logger.error(f"Failed to send ticket confirmation email to {new_ticket.buyer_email}: {str(e)}")
        else:
            current_app.logger.error("Mail extension not found. Email not sent.")
            
        return jsonify(new_ticket.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error purchasing ticket: {str(e)}")
        return jsonify({"message": "Error purchasing ticket", "error": str(e)}), 500

@ticket_bp.route("/tickets/<string:ticket_code>", methods=["GET"])
def get_ticket_by_code(ticket_code):
    ticket = Ticket.query.filter_by(ticket_code=ticket_code).first_or_404()
    return jsonify(ticket.to_dict()), 200

@ticket_bp.route("/events/<int:event_id>/tickets", methods=["GET"])
# @jwt_required() # Protect this route
def get_tickets_for_event(event_id):
    event = Event.query.get_or_404(event_id)
    tickets = Ticket.query.filter_by(event_id=event.id).all()
    return jsonify([ticket.to_dict() for ticket in tickets]), 200

