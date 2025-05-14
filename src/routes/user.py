from flask import Blueprint, jsonify, request
from src.models.user import User, db # User is now Organizer
from werkzeug.security import check_password_hash
# Assuming you will add JWT later for session management
# from flask_jwt_extended import create_access_token

user_bp = Blueprint("organizer_auth", __name__) # Renaming blueprint for clarity

@user_bp.route("/register", methods=["POST"])
def register_organizer():
    data = request.json
    if not data or not data.get("username") or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Missing username, email, or password"}), 400

    if User.query.filter_by(username=data["username"]).first() or User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Username or email already exists"}), 409

    organizer = User(username=data["username"], email=data["email"])
    organizer.set_password(data["password"])
    db.session.add(organizer)
    db.session.commit()
    return jsonify(organizer.to_dict()), 201

@user_bp.route("/login", methods=["POST"])
def login_organizer():
    data = request.json
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Missing email or password"}), 400

    organizer = User.query.filter_by(email=data["email"]).first()

    if not organizer or not organizer.check_password(data["password"]):
        return jsonify({"message": "Invalid email or password"}), 401

    # access_token = create_access_token(identity=organizer.id) # Generate JWT token
    # return jsonify(access_token=access_token, user=organizer.to_dict()), 200
    return jsonify({"message": "Login successful", "user": organizer.to_dict()}), 200 # Placeholder until JWT is fully set up

# Removing old generic user routes as we are focusing on organizers for now
# Or, these could be adapted for general users buying tickets later.

# @user_bp.route("/users", methods=["GET"])
# def get_users():
#     users = User.query.all()
#     return jsonify([user.to_dict() for user in users])

# @user_bp.route("/users/<int:user_id>", methods=["GET"])
# def get_user(user_id):
#     user = User.query.get_or_404(user_id)
#     return jsonify(user.to_dict())

# @user_bp.route("/users/<int:user_id>", methods=["PUT"])
# def update_user(user_id):
#     user = User.query.get_or_404(user_id)
#     data = request.json
#     user.username = data.get("username", user.username)
#     user.email = data.get("email", user.email)
#     # Add password update logic if needed, with rehashing
#     db.session.commit()
#     return jsonify(user.to_dict())

# @user_bp.route("/users/<int:user_id>", methods=["DELETE"])
# def delete_user(user_id):
#     user = User.query.get_or_404(user_id)
#     db.session.delete(user)
#     db.session.commit()
#     return "", 204

