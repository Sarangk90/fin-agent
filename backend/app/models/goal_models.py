from pydantic import BaseModel, field_validator, Field
from typing import Optional
import re
from ..config import get_settings

settings = get_settings()

class GoalBase(BaseModel):
    name: str = Field(..., min_length=1, description="Name of the goal, cannot be empty.")
    targetAmount: float = Field(..., gt=0, description="Target amount in INR, must be positive.")
    currentAmount: float = Field(..., ge=0, description="Current saved amount in INR, cannot be negative.")
    targetDate: str = Field(..., description="Target completion date (YYYY-MM-DD).")
    priority: str = Field(..., description="Priority level of the goal.")
    category: str = Field(..., description="Category of the goal.")
    notes: Optional[str] = Field(None, description="Optional notes about the goal.")

    @field_validator('name')
    @classmethod
    def validate_name(cls, value: str):
        if not value.strip():
            raise ValueError("Name cannot be empty or just whitespace.")
        return value.strip()

    @field_validator('currentAmount')
    @classmethod
    def validate_current_amount(cls, value: float):
        if value < 0:
            raise ValueError("Current amount cannot be negative.")
        return value

    @field_validator('targetDate')
    @classmethod
    def validate_target_date_format(cls, value: str):
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", value):
            raise ValueError("Target date must be in YYYY-MM-DD format.")
        
        try:
            year, month, day = map(int, value.split('-'))
            if not (1 <= month <= 12 and 1 <= day <= 31):
                raise ValueError("Invalid month or day in target date.")
        except ValueError as e:
            if "invalid literal" in str(e):
                raise ValueError("Target date components must be valid numbers.")
            raise
        return value

    @field_validator('priority')
    @classmethod
    def validate_priority(cls, value: str):
        stripped_value = value.strip()
        if not stripped_value:
            raise ValueError("Priority cannot be empty or just whitespace.")
        if stripped_value not in settings.ALLOWED_GOAL_PRIORITIES:
            raise ValueError(f"Invalid priority. Allowed values are: {', '.join(settings.ALLOWED_GOAL_PRIORITIES)}")
        return stripped_value

    @field_validator('category')
    @classmethod
    def validate_category(cls, value: str):
        stripped_value = value.strip()
        if not stripped_value:
            raise ValueError("Category cannot be empty or just whitespace.")
        if stripped_value not in settings.ALLOWED_GOAL_CATEGORIES:
            raise ValueError(f"Invalid category. Allowed values are: {', '.join(settings.ALLOWED_GOAL_CATEGORIES)}")
        return stripped_value

class GoalIn(GoalBase):
    pass # Inherits all fields and validators from GoalBase

class GoalOut(GoalBase):
    id: str
