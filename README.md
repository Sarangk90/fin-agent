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
- SQLAlchemy ORM with async support
- SQLite database
- Pydantic for data validation

## Quick Start for New Developers

### Prerequisites
- **Python 3.8+** (recommended: Python 3.9 or higher)
- **Node.js 18+** and npm
- **Git**

### 🚀 One-Command Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd fin-agent
   ```

2. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

3. **Run the automated setup:**
   ```bash
   python setup_dev.py
   ```

This script will:
- Create the SQLite database
- Set up database tables
- Migrate sample data (assets, liabilities, expenses, goals)
- Create a default user
- Provide next steps

### 🏃‍♂️ Running the Application

After running the setup script:

1. **Start the backend server:**
   ```bash
   cd backend
   uvicorn main:app --reload --port 5001
   ```

2. **In a new terminal, start the frontend:**
   ```bash
   cd ui
   npm install
   npm run dev
   ```

3. **Access the application:**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5001
   - **API Documentation**: http://localhost:5001/docs

## Manual Setup (Alternative)

If you prefer to set up manually or the automated script doesn't work:

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up database and sample data:**
   ```bash
   python -m app.migrate_data
   ```

5. **Start the server:**
   ```bash
   uvicorn main:app --reload --port 5001
   ```

### Frontend Setup

1. **Navigate to UI directory:**
   ```bash
   cd ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Database Information

### Database File Location
- **File**: `backend/financial_agent.db`
- **Type**: SQLite database
- **Note**: This file is automatically created and is **not tracked in git**

### Sample Data
The application comes with comprehensive sample data including:
- **3 Assets**: Savings account, shares, and other investments
- **4 Liabilities**: Home loan, car loan, credit card, personal loan
- **35+ Expenses**: Monthly and annual expenses across various categories
- **6 Goals**: House down payment, education fund, car, emergency fund, vacation, retirement

### Data Migration
- Sample data is located in `backend/app/fixtures/sample_data.py`
- Migration script is at `backend/app/migrate_data.py`
- Run migration manually: `cd backend && python -m app.migrate_data`

## Development Workflow

### Adding New Data
1. Use the web interface to add/edit data through the frontend
2. Or use the API directly at http://localhost:5001/docs
3. All data is persisted in the SQLite database

### Resetting Database
If you need to reset the database with fresh sample data:
```bash
# Delete the database file
rm backend/financial_agent.db

# Run migration again
cd backend
python -m app.migrate_data
```

### API Testing
- **Swagger UI**: http://localhost:5001/docs
- **ReDoc**: http://localhost:5001/redoc
- All endpoints are documented with request/response schemas

## Project Structure

```
fin-agent/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API route handlers
│   │   ├── fixtures/       # Sample data
│   │   ├── models/         # Pydantic models
│   │   ├── repositories/   # Database repositories
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── config.py       # Application configuration
│   │   ├── database.py     # Database setup
│   │   ├── migrate_data.py # Data migration script
│   │   └── db_models.py    # SQLAlchemy models
│   ├── main.py             # FastAPI application entry point
│   └── requirements.txt    # Python dependencies
├── ui/                     # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   └── main.tsx        # React application entry point
│   ├── package.json        # Node.js dependencies
│   └── vite.config.ts      # Vite configuration
├── setup_dev.py            # Automated development setup script
└── README.md               # This file
```

## Troubleshooting

### Common Issues

1. **Database file missing**: Run `python setup_dev.py` or `python -m app.migrate_data`
2. **Import errors**: Make sure you're in the correct directory and dependencies are installed
3. **Port conflicts**: Backend uses port 5001, frontend uses 5173
4. **CORS issues**: Backend is configured to allow requests from localhost:5173

### Getting Help

1. Check the API documentation at http://localhost:5001/docs
2. Look at the browser console for frontend errors
3. Check the terminal output for backend errors
4. Verify that both servers are running on the correct ports

## Development Notes

- The application uses async/await patterns throughout the backend
- Database operations are handled through repository pattern
- Frontend uses modern React with hooks and TypeScript
- All financial amounts are stored in INR (Indian Rupees)
- Date handling uses ISO format (YYYY-MM-DD)

## License

Private project for personal use.
