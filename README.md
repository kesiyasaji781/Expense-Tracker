# Smart Expense Tracker System

A complete, modern, responsive full-stack web application to record, manage, and track your daily expenses, incomes, and budgets. Built with React.js, Tailwind CSS, FastAPI, and SQLAlchemy.

## Features
- **User Authentication**: Secure JWT-based login/register system.
- **Main Dashboard**: View total balance, income, expenses, and visual charts.
- **Expense & Income Management**: Full CRUD operations for adding daily finances.
- **Budget Tracking**: Set monthly budgets by category and monitor usage.
- **Smart Insights Engine**: Dynamic logic for auto-generating insights based on actual spending.
- **Analytics Visualization**: Clean, responsive charts powered by Recharts.
- **Responsive UI**: Polished Tailwind design that looks great on mobile and desktop.

## Tech Stack
### Frontend
- React.js (Vite)
- Tailwind CSS
- React Router Dom
- Recharts (for analytics visualization)
- Lucide React (for icons)
- Axios

### Backend
- Python 3.12
- FastAPI
- SQLAlchemy (SQLite used by default for easy local dev; easily configurable for PostgreSQL)
- Pydantic
- Passlib/Bcrypt & python-jose (Authentication)

## Installation Instructions

### Backend Setup
1. Open terminal and navigate to `backend/`.
2. Create virtual environment: `python -m venv venv`
3. Activate virtual environment: 
   - Windows: `.\venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt` (or install manually as listed in implementation plan)
5. Run the seed script to generate sample data (optional): `python seed.py`
6. Start the FastAPI server: `uvicorn app.main:app --reload`
   The backend API will run on `http://localhost:8000`.

### Frontend Setup
1. Open terminal and navigate to `frontend/`.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
   The frontend UI will run on `http://localhost:5173`.

## Demo Credentials
If you ran the seed script (`python seed.py`), use the following to login:
- **Email:** demo@example.com
- **Password:** password123

## Future Enhancements (AI/ML Architecture Ready)
The backend currently uses a rule-based smart insights engine (`app/routers/insights.py`). Because of the modular FastAPI structure, this router can be easily extended to communicate with an external AI/ML service (e.g., spending prediction, personalized categorization) in the future without disrupting the rest of the app.
