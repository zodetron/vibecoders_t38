import os
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# -----------------------
# Models
# -----------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    balance = db.Column(db.Float, default=0.0)        # 💰 user balance
    holdings = db.Column(db.String(500), default="")  # 📦 holdings (could be JSON string)

with app.app_context():
    db.create_all()

# -----------------------
# Routes
# -----------------------
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409
    user = User(email=email, password=password, balance=100.0, holdings="{}")  # default values
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered"}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email, password=password).first()
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "balance": user.balance,
            "holdings": user.holdings
        }
    })

@app.route("/api/users")
def get_users():
    users = User.query.all()
    return jsonify([
        {"id": u.id, "email": u.email, "balance": u.balance, "holdings": u.holdings}
        for u in users
    ])

# update balance
@app.route("/api/update_balance", methods=["POST"])
def update_balance():
    data = request.json
    user_id = data.get("id")
    new_balance = data.get("balance")
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.balance = new_balance
    db.session.commit()
    return jsonify({"message": "Balance updated", "balance": user.balance})

# update holdings
@app.route("/api/update_holdings", methods=["POST"])
def update_holdings():
    data = request.json
    user_id = data.get("id")
    new_holdings = data.get("holdings")
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.holdings = new_holdings
    db.session.commit()
    return jsonify({"message": "Holdings updated", "holdings": user.holdings})

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
