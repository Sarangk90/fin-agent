# Financial Planner Assistant

A comprehensive personal finance management application built with React, TypeScript, and FastAPI.

## Features

- **Dashboard**: Overview of net worth, assets, liabilities, and expenses
- **Assets Management**: Track investments, savings, and other assets
- **Liabilities Management**: Monitor loans, debts, and outstanding amounts
- **Expenses Tracking**: Categorize and track spending patterns
- **Goals Planning**: Set and monitor financial goals with target dates
- **Profile Settings**: Manage user preferences and settings

## Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation

**Backend:**
- FastAPI with Python
- SQLAlchemy ORM
- SQLite database
- Pydantic for data validation

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)

### Installation

1. **Backend Setup:**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --port 5001
   ```

2. **Frontend Setup:**
   ```bash
   cd ui
   npm install
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## Project Structure

```
fin-agent/
├── backend/          # FastAPI backend
│   ├── app/         # Application modules
│   └── main.py      # Entry point
└── ui/              # React frontend
    ├── src/         # Source code
    └── public/      # Static assets
```

## License

Private project for personal use.
