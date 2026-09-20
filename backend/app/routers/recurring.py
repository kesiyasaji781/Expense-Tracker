from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas, database, auth

router = APIRouter(
    prefix="/api/recurring",
    tags=["Recurring Expenses"]
)

@router.get("/", response_model=List[schemas.RecurringOut])
def get_recurring(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.RecurringExpense).filter(models.RecurringExpense.user_id == current_user.id).all()

@router.post("/", response_model=schemas.RecurringOut)
def create_recurring(
    recurring: schemas.RecurringCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    new_recurring = models.RecurringExpense(**recurring.dict(), user_id=current_user.id)
    db.add(new_recurring)
    db.commit()
    db.refresh(new_recurring)
    return new_recurring

@router.delete("/{recurring_id}")
def delete_recurring(
    recurring_id: int, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    recurring = db.query(models.RecurringExpense).filter(models.RecurringExpense.id == recurring_id, models.RecurringExpense.user_id == current_user.id).first()
    if not recurring:
        raise HTTPException(status_code=404, detail="Recurring expense not found")
    
    db.delete(recurring)
    db.commit()
    return {"detail": "Recurring expense deleted successfully"}
