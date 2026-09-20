from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from .. import models, schemas, database, auth

router = APIRouter(
    prefix="/api/income",
    tags=["Income"]
)

@router.get("/", response_model=List[schemas.IncomeOut])
def get_incomes(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
    skip: int = 0,
    limit: int = 100,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
):
    query = db.query(models.Income).filter(models.Income.user_id == current_user.id)
    
    if start_date:
        query = query.filter(models.Income.date >= start_date)
    if end_date:
        query = query.filter(models.Income.date <= end_date)
        
    incomes = query.order_by(models.Income.date.desc()).offset(skip).limit(limit).all()
    return incomes

@router.post("/", response_model=schemas.IncomeOut)
def create_income(
    income: schemas.IncomeCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    new_income = models.Income(**income.dict(), user_id=current_user.id)
    db.add(new_income)
    db.commit()
    db.refresh(new_income)
    return new_income

@router.get("/{income_id}", response_model=schemas.IncomeOut)
def get_income(
    income_id: int, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    income = db.query(models.Income).filter(models.Income.id == income_id, models.Income.user_id == current_user.id).first()
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")
    return income

@router.put("/{income_id}", response_model=schemas.IncomeOut)
def update_income(
    income_id: int, 
    income_update: schemas.IncomeCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    income = db.query(models.Income).filter(models.Income.id == income_id, models.Income.user_id == current_user.id).first()
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")
    
    for key, value in income_update.dict().items():
        setattr(income, key, value)
        
    db.commit()
    db.refresh(income)
    return income

@router.delete("/{income_id}")
def delete_income(
    income_id: int, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    income = db.query(models.Income).filter(models.Income.id == income_id, models.Income.user_id == current_user.id).first()
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")
    
    db.delete(income)
    db.commit()
    return {"detail": "Income deleted successfully"}
