from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
import calendar

from .. import models, database, auth

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"]
)

@router.get("/summary")
def get_summary(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
    month: int = None,
    year: int = None
):
    # Default to current month/year if not provided
    today = date.today()
    if not month:
        month = today.month
    if not year:
        year = today.year
        
    # Calculate start and end date of the given month
    _, last_day = calendar.monthrange(year, month)
    start_date = date(year, month, 1)
    end_date = date(year, month, last_day)
    
    # Total Income
    total_income = db.query(func.sum(models.Income.amount)).filter(
        models.Income.user_id == current_user.id,
        models.Income.date >= start_date,
        models.Income.date <= end_date
    ).scalar() or 0.0
    
    # Total Expenses
    total_expense = db.query(func.sum(models.Expense.amount)).filter(
        models.Expense.user_id == current_user.id,
        models.Expense.date >= start_date,
        models.Expense.date <= end_date
    ).scalar() or 0.0
    
    # Budgets for the month
    total_budget = db.query(func.sum(models.Budget.amount)).filter(
        models.Budget.user_id == current_user.id,
        models.Budget.month == month,
        models.Budget.year == year
    ).scalar() or 0.0

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "total_balance": total_income - total_expense,
        "total_budget": total_budget,
        "remaining_budget": total_budget - total_expense if total_budget > 0 else 0
    }

@router.get("/categories")
def get_category_distribution(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
    month: int = None,
    year: int = None
):
    today = date.today()
    if not month:
        month = today.month
    if not year:
        year = today.year
        
    _, last_day = calendar.monthrange(year, month)
    start_date = date(year, month, 1)
    end_date = date(year, month, last_day)

    results = db.query(
        models.Expense.category, 
        func.sum(models.Expense.amount).label("total")
    ).filter(
        models.Expense.user_id == current_user.id,
        models.Expense.date >= start_date,
        models.Expense.date <= end_date
    ).group_by(models.Expense.category).all()

    return [{"category": r.category, "amount": r.total} for r in results]

@router.get("/daily")
def get_daily_trend(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
    month: int = None,
    year: int = None
):
    today = date.today()
    if not month:
        month = today.month
    if not year:
        year = today.year
        
    _, last_day = calendar.monthrange(year, month)
    start_date = date(year, month, 1)
    end_date = date(year, month, last_day)

    expenses = db.query(
        models.Expense.date,
        func.sum(models.Expense.amount).label("total")
    ).filter(
        models.Expense.user_id == current_user.id,
        models.Expense.date >= start_date,
        models.Expense.date <= end_date
    ).group_by(models.Expense.date).all()
    
    incomes = db.query(
        models.Income.date,
        func.sum(models.Income.amount).label("total")
    ).filter(
        models.Income.user_id == current_user.id,
        models.Income.date >= start_date,
        models.Income.date <= end_date
    ).group_by(models.Income.date).all()
    
    # Format the data
    expense_dict = {str(e.date): e.total for e in expenses}
    income_dict = {str(i.date): i.total for i in incomes}
    
    trend = []
    for day in range(1, last_day + 1):
        d_str = str(date(year, month, day))
        trend.append({
            "date": d_str,
            "expense": expense_dict.get(d_str, 0),
            "income": income_dict.get(d_str, 0)
        })
        
    return trend
