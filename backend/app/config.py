from typing import List
from functools import lru_cache

class Settings:
    """Application settings and constants."""
    
    # Asset validation constants
    ALLOWED_ASSET_CLASSES: List[str] = [
        "Cash / Cash Equivalent", "Equity", "Debt", "Real Estate", 
        "Commodities", "Alternatives", "Other"
    ]
    
    ALLOWED_ASSET_TYPES: List[str] = [
        "Savings Account", "Fixed Deposit (FD)", "Recurring Deposit (RD)",
        "Stocks (Direct Equity)", "Equity Mutual Fund", "Debt Mutual Fund",
        "PPF / EPF / NPS", "Bonds", "Residential Property", "Commercial Property",
        "Land", "Physical Gold / Silver", "SGB (Sovereign Gold Bond)",
        "Cryptocurrency", "Other Sub Class"
    ]
    
    ALLOWED_FP_ASSET_CLASSES: List[str] = [
        "Emergency Fund", "Retirement", "Goal-Specific",
        "General Investment / Wealth Creation", "Tax Saving", "Other"
    ]
    
    # Expense validation constants
    ALLOWED_EXPENSE_FREQUENCIES: List[str] = [
        "One-Time", "Monthly", "Quarterly", "Semi-Annually", "Annually"
    ]
    
    ALLOWED_NEED_WANT_CATEGORIES: List[str] = [
        "Need", "Want"
    ]
    
    # Goal validation constants
    ALLOWED_GOAL_PRIORITIES: List[str] = [
        "high", "medium", "low"
    ]
    
    ALLOWED_GOAL_CATEGORIES: List[str] = [
        "House", "Car", "Education", "Wedding", "Vacation", 
        "Retirement", "Emergency Fund", "Investment", "Other"
    ]
    
    # FI calculation constants
    DEFAULT_GOALS_PLACEHOLDER: float = 102863884.0
    DEFAULT_SWR_PERCENTAGE: float = 4.0
    DEFAULT_FP_ASSET_CLASSES_FOR_INVESTABLE: List[str] = [
        "Retirement", "General Investment / Wealth Creation"
    ]
    
    # API settings
    API_TITLE: str = "Financial Agent API"
    API_DESCRIPTION: str = "API for managing personal finance data."
    API_VERSION: str = "0.1.0"
    
    # CORS settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:5173",
    ]
    
    # Database settings
    DATABASE_URL: str = "sqlite+aiosqlite:///./financial_agent.db"
    DATABASE_ECHO: bool = False  # Set to True for SQL query logging

@lru_cache()
def get_settings() -> Settings:
    """Get application settings (cached)."""
    return Settings()
