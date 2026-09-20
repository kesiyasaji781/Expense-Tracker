from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas, database, auth

router = APIRouter(
    prefix="/api/categories",
    tags=["Categories"]
)

@router.get("/", response_model=List[schemas.CategoryOut])
def get_categories(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
    type: str = None
):
    query = db.query(models.Category).filter(models.Category.user_id == current_user.id)
    if type:
        query = query.filter(models.Category.type == type)
    return query.all()

@router.post("/", response_model=schemas.CategoryOut)
def create_category(
    category: schemas.CategoryCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Check if category already exists for user
    existing_cat = db.query(models.Category).filter(
        models.Category.user_id == current_user.id,
        models.Category.name == category.name,
        models.Category.type == category.type
    ).first()
    
    if existing_cat:
        raise HTTPException(status_code=400, detail="Category already exists")
        
    new_cat = models.Category(**category.dict(), user_id=current_user.id)
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat
