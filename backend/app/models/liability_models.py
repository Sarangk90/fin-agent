from pydantic import BaseModel, field_validator, Field
from typing import Optional
import re

class LiabilityBase(BaseModel):
    name: str = Field(..., min_length=1, description="Name of the liability.")
    type: str = Field(..., min_length=1, description="Type of the liability (e.g., Credit Card, Home Loan).")
    outstandingAmountINR: float = Field(..., gt=0, description="Outstanding amount in INR, must be positive.")
    interestRate: Optional[float] = Field(None, ge=0, description="Interest rate in percentage, optional, cannot be negative.")
    dueDate: Optional[str] = Field(None, description="Due date of the liability (YYYY-MM-DD), optional.")

    @field_validator('name')
    @classmethod
    def validate_name(cls, value: str):
        if not value.strip():
            raise ValueError("Name cannot be empty or just whitespace.")
        return value.strip()

    @field_validator('type')
    @classmethod
    def validate_type(cls, value: str):
        if not value.strip():
            raise ValueError("Type cannot be empty or just whitespace.")
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
        except ValueError as e:
            if "invalid literal" in str(e):
                raise ValueError("Due date components must be valid numbers.")
            raise
        return value

class LiabilityIn(LiabilityBase):
    pass

class LiabilityOut(LiabilityBase):
    id: str
