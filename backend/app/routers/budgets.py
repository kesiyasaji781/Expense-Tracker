from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from .. import models, schemas, database, auth

router = APIRouter(
    prefix="/api/budgets",
    tags=["Budgets"]
)

@router.get("/", response_model=List[schemas.BudgetOut])
def get_budgets(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
    month: Optional[int] = None,
    year: Optional[int] = None
):
    query = db.query(models.Budget).filter(models.Budget.user_id == current_user.id)
    
    if month:
        query = query.filter(models.Budget.month == month)
    if year:
        query = query.filter(models.Budget.year == year)
        
    budgets = query.all()
    return budgets

@router.post("/", response_model=schemas.BudgetOut)
def create_budget(
    budget: schemas.BudgetCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Check if budget already exists for this category, month, and year
    existing_budget = db.query(models.Budget).filter(
        models.Budget.user_id == current_user.id,
        models.Budget.category == budget.category,
        models.Budget.month == budget.month,
        models.Budget.year == budget.year
    ).first()
    
    if existing_budget:
        # Update existing
        existing_budget.amount = budget.amount
        db.commit()
        db.refresh(existing_budget)
        return existing_budget
        
    new_budget = models.Budget(**budget.dict(), user_id=current_user.id)
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return new_budget

@router.put("/{budget_id}", response_model=schemas.BudgetOut)
def update_budget(
    budget_id: int, 
    budget_update: schemas.BudgetCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    budget = db.query(models.Budget).filter(models.Budget.id == budget_id, models.Budget.user_id == current_user.id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    for key, value in budget_update.dict().items():
        setattr(budget, key, value)
        
    db.commit()
    db.refresh(budget)
    return budget

@router.delete("/{budget_id}")
def delete_budget(
    budget_id: int, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    budget = db.query(models.Budget).filter(models.Budget.id == budget_id, models.Budget.user_id == current_user.id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    db.delete(budget)
    db.commit()
    return {"detail": "Budget deleted successfully"}
