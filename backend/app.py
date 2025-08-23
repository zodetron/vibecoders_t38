from flask import Flask, request, jsonify, session, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_cors import CORS
from cryptography.fernet import Fernet
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
CORS(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Generate a key for encryption
def generate_key():
    return Fernet.generate_key()

# Load the key from an environment variable or generate a new one
if os.environ.get('FERNET_KEY') is None:
    key = generate_key()
    os.environ['FERNET_KEY'] = key.decode()  # Store the key in an environment variable
else:
    key = os.environ['FERNET_KEY'].encode()

fernet = Fernet(key)

# User Model
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    balance = db.Column(db.Float, default=0.0)

class Investment(db.Model):
    __tablename__ = 'investments'   # 👈 force plural name
    id = db.Column(db.Integer, primary_key=True)
    asset = db.Column(db.String(50), nullable=False)
    investment_type = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.String(50), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User  registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        login_user(user)
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/add_investment', methods=['POST'])
@login_required
def add_investment():
    data = request.get_json()
    encrypted_asset = fernet.encrypt(data['asset'].encode()).decode()  # Encrypt the asset
    new_investment = Investment(
        asset=encrypted_asset,
        amount=data['amount'],
        investment_type=data['type'],
        date=data['date']
    )
    current_user.balance += data['amount'] if data['type'] == 'Buy' else -data['amount']
    db.session.add(new_investment)
    db.session.commit()
    return jsonify({'message': 'Investment added successfully'}), 201

@app.route('/holdings', methods=['GET'])
@login_required
def get_holdings():
    investments = Investment.query.filter_by(user_id=current_user.id).all()
    holdings = [{'asset': fernet.decrypt(inv.asset.encode()).decode(), 'amount': inv.amount, 'type': inv.investment_type, 'date': inv.date} for inv in investments]
    return jsonify({'holdings': holdings, 'balance': current_user.balance}), 200

@app.route("/")
def index():
    return render_template("2.html")



if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables
    app.run(debug=True)
