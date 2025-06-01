from pydantic import BaseModel, field_validator, Field
from typing import List, Dict, Any, Optional
import re

class LiabilityBase(BaseModel):
    name: str = Field(..., min_length=1, description="Name of the liability.")
    type: str = Field(..., min_length=1, description="Type of the liability (e.g., Credit Card, Home Loan).")
    outstandingAmountINR: float = Field(..., gt=0, description="Outstanding amount in INR, must be positive.")
    interestRate: Optional[float] = Field(None, ge=0, description="Interest rate in percentage, optional, cannot be negative.")
    dueDate: Optional[str] = Field(None, description="Due date of the liability (YYYY-MM-DD), optional.")

    @field_validator('name', 'type')
    @classmethod
    def not_empty_string(cls, value: str):
        if not value.strip():
            raise ValueError("Field cannot be empty or just whitespace.")
        return value.strip()

    @field_validator('dueDate')
    @classmethod
    def validate_due_date_format(cls, value: Optional[str]):
        if value is None:
            return value
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", value):
            raise ValueError("Due date must be in YYYY-MM-DD format.")
        try:
            year, month, day = map(int, value.split('-'))
            if not (1 <= month <= 12 and 1 <= day <= 31):
                 raise ValueError("Invalid month or day in due date.")
        except ValueError:
             raise ValueError("Due date components are not valid integers or structure is wrong.")
        return value

class LiabilityIn(LiabilityBase):
    pass

class LiabilityOut(LiabilityBase):
    id: str

# Dummy database for liabilities
dummy_liabilities_db: List[Dict[str, Any]] = [
    {"id": "1", "name": "Home Loan", "type": "Secured Loan", "outstandingAmountINR": 3500000, "interestRate": 8.5, "dueDate": "2043-05-15"},
    {"id": "2", "name": "Car Loan", "type": "Secured Loan", "outstandingAmountINR": 450000, "interestRate": 9.2, "dueDate": "2028-11-01"},
    {"id": "3", "name": "Credit Card Due - ICICI", "type": "Unsecured Loan", "outstandingAmountINR": 35000, "interestRate": 36.0, "dueDate": "2023-11-20"},
    {"id": "4", "name": "Personal Loan", "type": "Unsecured Loan", "outstandingAmountINR": 150000, "interestRate": 14.0, "dueDate": "2026-07-01"}
]
next_liability_id_counter: int = 5 # Adjusted to be the next available ID 