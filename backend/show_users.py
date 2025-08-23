from app import app, db, User

with app.app_context():
    users = User.query.all()
    for u in users:
        print(f"ID: {u.id}, Email: {u.email}, Balance: {u.balance}, Holdings: {u.holdings}")
