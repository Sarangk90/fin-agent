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
    {"id": "1", "category": "Childcare", "details": "Kid 1 school fees broken into monthly", "amount": 16667, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "2", "category": "Childcare", "details": "Kid 2 school fees broken into monthly", "amount": 16667, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "3", "category": "Food", "details": "Veg groceries food expense", "amount": 7500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "4", "category": "Food", "details": "Restaurent food expense", "amount": 10000, "frequency": "Monthly", "needWant": "Want", "date": "2025-06-01"},
    {"id": "5", "category": "Helper", "details": "Helper Cook", "amount": 6500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "6", "category": "Helper", "details": "Helper Sweeping", "amount": 1000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "7", "category": "Helper", "details": "Helper Dish Washing", "amount": 1000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "8", "category": "Helper", "details": "Helper Bathroom", "amount": 1500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "9", "category": "Insurance", "details": "Medical Super Top Up", "amount": 833, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "10", "category": "Insurance", "details": "Medical", "amount": 417, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "11", "category": "Rent", "details": "House Rent", "amount": 70000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "12", "category": "EMI", "details": "House EMI", "amount": 50000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "13", "category": "Shopping", "details": "General shopping", "amount": 5000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "14", "category": "Tax", "details": "Dad Tax Filing", "amount": 1200, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "15", "category": "Tax", "details": "Mom Tax Filing", "amount": 1200, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "16", "category": "Trip", "details": "International Trip", "amount": 41667, "frequency": "Monthly", "needWant": "Want", "date": "2025-06-01"},
    {"id": "17", "category": "Trip", "details": "Long Trip", "amount": 16667, "frequency": "Monthly", "needWant": "Want", "date": "2025-06-01"},
    {"id": "18", "category": "Trip", "details": "Short Trip", "amount": 8333, "frequency": "Monthly", "needWant": "Want", "date": "2025-06-01"},
    {"id": "19", "category": "Utilities", "details": "Electricity Bill", "amount": 3500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "20", "category": "Utilities", "details": "Internet Bill", "amount": 1500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "22", "category": "Utilities", "details": "Gas Bill", "amount": 750, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "23", "category": "Utilities", "details": "Dry Cleaning Bill", "amount": 500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "24", "category": "Utilities", "details": "Mom Phone Bill", "amount": 450, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "25", "category": "Utilities", "details": "Water Bill", "amount": 400, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "26", "category": "Utilities", "details": "Dad Phone Bill", "amount": 500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "27", "category": "Utilities", "details": "Ironing Bill", "amount": 500, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    {"id": "28", "category": "Utilities", "details": "Car Petrol Bill", "amount": 3000, "frequency": "Monthly", "needWant": "Need", "date": "2025-06-01"},
    # Non-monthly (yearly and multi-year) expenses
    {"id": "29", "category": "Childcare", "details": "Kid 1 school fees broken into monthly", "amount": 200000, "frequency": "Annually", "needWant": "Need", "date": "2025-06-01"},
    {"id": "30", "category": "Childcare", "details": "Kid 2 school fees broken into monthly", "amount": 200000, "frequency": "Annually", "needWant": "Need", "date": "2025-06-01"},
    {"id": "31", "category": "Trip", "details": "Short Trip", "amount": 100000, "frequency": "Annually", "needWant": "Want", "date": "2025-06-01"},
    {"id": "32", "category": "Trip", "details": "Long Trip", "amount": 200000, "frequency": "Annually", "needWant": "Want", "date": "2025-06-01"},
    {"id": "33", "category": "Trip", "details": "International Trip", "amount": 1000000, "frequency": "Annually", "needWant": "Want", "date": "2025-06-01"},
    {"id": "34", "category": "Insurance", "details": "Family Medical Super Top Up Insurance", "amount": 30000, "frequency": "Annually", "needWant": "Need", "date": "2025-06-01"},
    {"id": "35", "category": "Insurance", "details": "Family Medical Insurance", "amount": 10000, "frequency": "Annually", "needWant": "Need", "date": "2025-06-01"}
]
next_expense_id_counter: int = 36 # Adjusted to be the next available ID
