from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
import calendar

from .. import models, database, auth

router = APIRouter(
    prefix="/api/insights",
    tags=["Insights"]
)

@router.get("/")
def get_insights(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    insights = []
    today = date.today()
    month = today.month
    year = today.year
    
    _, last_day = calendar.monthrange(year, month)
    start_date = date(year, month, 1)
    end_date = date(year, month, last_day)
    
    # 1. High spending category
    highest_cat = db.query(
        models.Expense.category, 
        func.sum(models.Expense.amount).label("total")
    ).filter(
        models.Expense.user_id == current_user.id,
        models.Expense.date >= start_date,
        models.Expense.date <= end_date
    ).group_by(models.Expense.category).order_by(func.sum(models.Expense.amount).desc()).first()
    
    if highest_cat:
        insights.append(f"{highest_cat.category} is your highest spending category this month (₹{highest_cat.total:,.2f}).")
        
    # 2. Daily spending average
    total_expense = db.query(func.sum(models.Expense.amount)).filter(
        models.Expense.user_id == current_user.id,
        models.Expense.date >= start_date,
        models.Expense.date <= end_date
    ).scalar() or 0.0
    
    current_day = today.day
    if current_day > 0 and total_expense > 0:
        avg = total_expense / current_day
        insights.append(f"Your average daily spending is ₹{avg:,.2f}.")
        
    # 3. Budget warnings
    budgets = db.query(models.Budget).filter(
        models.Budget.user_id == current_user.id,
        models.Budget.month == month,
        models.Budget.year == year
    ).all()
    
    for b in budgets:
        spent = db.query(func.sum(models.Expense.amount)).filter(
            models.Expense.user_id == current_user.id,
            models.Expense.category == b.category,
            models.Expense.date >= start_date,
            models.Expense.date <= end_date
        ).scalar() or 0.0
        
        if spent > b.amount:
            insights.append(f"You exceeded your {b.category} budget by ₹{(spent - b.amount):,.2f}.")
        elif b.amount > 0 and (spent / b.amount) >= 0.8:
            percentage = (spent / b.amount) * 100
            insights.append(f"You have used {percentage:.1f}% of your {b.category} budget.")
            
    # 4. Savings
    total_income = db.query(func.sum(models.Income.amount)).filter(
        models.Income.user_id == current_user.id,
        models.Income.date >= start_date,
        models.Income.date <= end_date
    ).scalar() or 0.0
    
    if total_income > 0:
        savings = total_income - total_expense
        if savings > 0:
            insights.append(f"You saved ₹{savings:,.2f} this month.")
        else:
            insights.append("Your expenses have exceeded your income this month.")
            
    if not insights:
        insights.append("Add more transactions to unlock smart spending insights.")
        
    return {"insights": insights}
