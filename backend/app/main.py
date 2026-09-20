from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import auth, expenses, income, budgets, categories, recurring, analytics, insights

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Expense Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(expenses.router)
app.include_router(income.router)
app.include_router(budgets.router)
app.include_router(categories.router)
app.include_router(recurring.router)
app.include_router(analytics.router)
app.include_router(insights.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Expense Tracker API"}
