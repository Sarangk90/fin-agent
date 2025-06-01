from pydantic import BaseModel, field_validator, Field
from typing import List, Dict, Any, Optional

# Define allowed values for categorical fields
ALLOWED_EXPENSE_FREQUENCIES = [
    "One-Time", "Monthly", "Quarterly", "Semi-Annually", "Annually"
]
ALLOWED_NEED_WANT = ["Need", "Want"]

class ExpenseBase(BaseModel):
    category: str = Field(..., min_length=1, description="Category of the expense.")
    details: Optional[str] = Field(None, description="Optional details about the expense.")
    amount: float = Field(..., gt=0, description="Amount of the expense, must be positive.")
    frequency: str = Field(..., description="Frequency of the expense.")
    needWant: str = Field(..., description="Whether the expense is a Need or a Want.")
    date: str = Field(..., description="Date of the expense (YYYY-MM-DD).") # We'll expect ISO format string

    @field_validator('category')
    @classmethod
    def category_not_empty(cls, value: str):
        if not value.strip():
            raise ValueError("Category cannot be empty or just whitespace.")
        return value.strip()

    @field_validator('frequency')
    @classmethod
    def validate_frequency(cls, value: str):
        stripped_value = value.strip()
        if stripped_value not in ALLOWED_EXPENSE_FREQUENCIES:
            raise ValueError(f"Invalid frequency. Allowed values are: {', '.join(ALLOWED_EXPENSE_FREQUENCIES)}")
        return stripped_value

    @field_validator('needWant')
    @classmethod
    def validate_need_want(cls, value: str):
        stripped_value = value.strip()
        if stripped_value not in ALLOWED_NEED_WANT:
            raise ValueError(f"Invalid needWant value. Allowed values are: {', '.join(ALLOWED_NEED_WANT)}")
        return stripped_value

    @field_validator('date')
    @classmethod
    def validate_date_format(cls, value: str):
        # Basic check for YYYY-MM-DD format. For robust validation, a date parsing library could be used.
        # For now, this regex checks the pattern. It doesn't validate if the date itself is real (e.g., 2023-02-30)
        import re
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", value):
            raise ValueError("Date must be in YYYY-MM-DD format.")
        # Further validation could check if year, month, day are sensible, e.g. month 01-12, day 01-31
        try:
            year, month, day = map(int, value.split('-'))
            if not (1 <= month <= 12 and 1 <= day <= 31): # Basic sanity check
                 raise ValueError("Invalid month or day.")
            # More complex date validation (e.g. days in month) can be added if needed
        except ValueError:
             raise ValueError("Date components are not valid integers or structure is wrong.")
        return value

class ExpenseIn(ExpenseBase):
    pass

class ExpenseOut(ExpenseBase):
    id: str

# Dummy database for expenses
dummy_expenses_db: List[Dict[str, Any]] = [
    {"id": "1", "category": "Housing", "details": "Monthly Rent", "amount": 25000, "frequency": "Monthly", "needWant": "Need", "date": "2023-10-01"},
    {"id": "2", "category": "Food", "details": "Groceries for the week", "amount": 3000, "frequency": "Monthly", "needWant": "Need", "date": "2023-10-05"},
    {"id": "3", "category": "Utilities", "details": "Electricity Bill", "amount": 1200, "frequency": "Monthly", "needWant": "Need", "date": "2023-10-10"},
    {"id": "4", "category": "Transport", "details": "Metro Card Recharge", "amount": 500, "frequency": "Monthly", "needWant": "Need", "date": "2023-10-02"},
    {"id": "5", "category": "Entertainment", "details": "Movie tickets", "amount": 600, "frequency": "One-Time", "needWant": "Want", "date": "2023-10-07"},
    {"id": "6", "category": "Health", "details": "Gym Membership", "amount": 1500, "frequency": "Monthly", "needWant": "Want", "date": "2023-10-01"}
]
next_expense_id_counter: int = 7 # Adjusted to be the next available ID 