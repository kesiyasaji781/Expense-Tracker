from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Optional, List

# ---- Auth & User ----
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# ---- Categories ----
class CategoryBase(BaseModel):
    name: str
    type: str

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# ---- Expenses ----
class ExpenseBase(BaseModel):
    amount: float = Field(..., gt=0)
    category: str
    description: str
    date: date
    payment_method: str
    notes: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseOut(ExpenseBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# ---- Income ----
class IncomeBase(BaseModel):
    amount: float = Field(..., gt=0)
    source: str
    description: str
    date: date

class IncomeCreate(IncomeBase):
    pass

class IncomeOut(IncomeBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# ---- Budget ----
class BudgetBase(BaseModel):
    category: str
    amount: float = Field(..., gt=0)
    month: int = Field(..., ge=1, le=12)
    year: int

class BudgetCreate(BudgetBase):
    pass

class BudgetOut(BudgetBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# ---- Recurring Expenses ----
class RecurringBase(BaseModel):
    name: str
    amount: float = Field(..., gt=0)
    category: str
    frequency: str
    start_date: date
    next_due_date: date

class RecurringCreate(RecurringBase):
    pass

class RecurringOut(RecurringBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
