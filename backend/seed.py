import os
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal, Base
from app.models import User, Expense, Income, Budget, Category, TransactionType
from app.auth import get_password_hash
from datetime import date, timedelta
import random

def seed_data():
    db = SessionLocal()
    
    # Check if we already seeded
    if db.query(User).count() > 0:
        print("Database already seeded")
        db.close()
        return

    print("Seeding database...")
    
    # 1. Create a demo user
    demo_user = User(
        name="Demo User",
        email="demo@example.com",
        password_hash=get_password_hash("password123")
    )
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)
    
    # 2. Add some categories
    categories = [
        Category(user_id=demo_user.id, name="Food", type=TransactionType.expense),
        Category(user_id=demo_user.id, name="Transport", type=TransactionType.expense),
        Category(user_id=demo_user.id, name="Shopping", type=TransactionType.expense),
        Category(user_id=demo_user.id, name="Salary", type=TransactionType.income)
    ]
    db.add_all(categories)
    db.commit()
    
    # 3. Add Budgets
    today = date.today()
    budgets = [
        Budget(user_id=demo_user.id, category="Food", amount=8000, month=today.month, year=today.year),
        Budget(user_id=demo_user.id, category="Transport", amount=4000, month=today.month, year=today.year),
        Budget(user_id=demo_user.id, category="Shopping", amount=5000, month=today.month, year=today.year)
    ]
    db.add_all(budgets)
    db.commit()
    
    # 4. Add Income
    income = Income(
        user_id=demo_user.id,
        amount=50000,
        source="Salary",
        description="Monthly Salary",
        date=date(today.year, today.month, 1)
    )
    db.add(income)
    
    # 5. Add Expenses (spread over the month)
    expense_data = [
        {"amount": 350, "category": "Food", "desc": "Lunch", "pm": "UPI"},
        {"amount": 120, "category": "Transport", "desc": "Uber", "pm": "UPI"},
        {"amount": 1250, "category": "Shopping", "desc": "T-shirt", "pm": "Credit Card"},
        {"amount": 800, "category": "Education", "desc": "Course", "pm": "Debit Card"},
        {"amount": 2500, "category": "Food", "desc": "Dinner out", "pm": "Credit Card"},
        {"amount": 60, "category": "Transport", "desc": "Metro", "pm": "Cash"},
        {"amount": 1500, "category": "Bills & Utilities", "desc": "Electricity", "pm": "Bank Transfer"},
    ]
    
    expenses = []
    for i, ed in enumerate(expense_data):
        day_offset = random.randint(0, min(20, today.day - 1)) if today.day > 1 else 0
        exp_date = today - timedelta(days=day_offset)
        
        expenses.append(Expense(
            user_id=demo_user.id,
            amount=ed["amount"],
            category=ed["category"],
            description=ed["desc"],
            date=exp_date,
            payment_method=ed["pm"]
        ))
        
    db.add_all(expenses)
    db.commit()
    
    print("Database seeding completed.")
    print("Demo Email: demo@example.com")
    print("Demo Password: password123")
    db.close()

if __name__ == "__main__":
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    seed_data()
