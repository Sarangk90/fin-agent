from pydantic import BaseModel, field_validator, Field
from typing import Optional
from ..config import get_settings

settings = get_settings()

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
        if not stripped_value:
            raise ValueError("Frequency cannot be empty or just whitespace.")
        if stripped_value not in settings.ALLOWED_EXPENSE_FREQUENCIES:
            raise ValueError(f"Invalid frequency. Allowed values are: {', '.join(settings.ALLOWED_EXPENSE_FREQUENCIES)}")
        return stripped_value

    @field_validator('needWant')
    @classmethod
    def validate_need_want(cls, value: str):
        stripped_value = value.strip()
        if not stripped_value:
            raise ValueError("Need/Want cannot be empty or just whitespace.")
        if stripped_value not in settings.ALLOWED_NEED_WANT_CATEGORIES:
            raise ValueError(f"Invalid needWant value. Allowed values are: {', '.join(settings.ALLOWED_NEED_WANT_CATEGORIES)}")
        return stripped_value

    @field_validator('date')
    @classmethod
    def validate_date_format(cls, value: str):
        import re
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", value):
            raise ValueError("Date must be in YYYY-MM-DD format.")
        
        try:
            year, month, day = map(int, value.split('-'))
            if not (1 <= month <= 12 and 1 <= day <= 31):
                raise ValueError("Invalid month or day in date.")
        except ValueError as e:
            if "invalid literal" in str(e):
                raise ValueError("Date components must be valid numbers.")
            raise
        return value

class ExpenseIn(ExpenseBase):
    pass

class ExpenseOut(ExpenseBase):
    id: str
