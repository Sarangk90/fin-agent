from pydantic import BaseModel, field_validator, Field
from typing import List, Dict, Any, Optional

# Define allowed values for categorical fields (MVP)
ALLOWED_ASSET_CLASSES = [
    "Cash / Cash Equivalent", "Equity", "Debt", "Real Estate", 
    "Commodities", "Alternatives", "Other"
]
ALLOWED_ASSET_TYPES = [
    "Savings Account", "Fixed Deposit (FD)", "Recurring Deposit (RD)",
    "Stocks (Direct Equity)", "Equity Mutual Fund", "Debt Mutual Fund",
    "PPF / EPF / NPS", "Bonds", "Residential Property", "Commercial Property",
    "Land", "Physical Gold / Silver", "SGB (Sovereign Gold Bond)",
    "Cryptocurrency", "Other Sub Class"
]
ALLOWED_FP_ASSET_CLASSES = [
    "Emergency Fund", "Retirement", "Goal-Specific",
    "General Investment / Wealth Creation", "Tax Saving", "Other"
]

class AssetBase(BaseModel):
    name: str = Field(..., min_length=1, description="Name of the asset, cannot be empty.")
    valueINR: float = Field(..., gt=0, description="Value of the asset in INR, must be positive.")
    assetClass: str = Field(..., description="Primary class of the asset.")
    assetType: str = Field(..., description="Specific type or sub-class of the asset.")
    fpAssetClass: str = Field(..., description="Financial planning purpose of the asset.")

    @field_validator('name', 'assetClass', 'assetType', 'fpAssetClass')
    @classmethod
    def not_empty_string(cls, value: str):
        if not value.strip():
            raise ValueError("Field cannot be empty or just whitespace.")
        return value.strip()

    @field_validator('assetClass')
    @classmethod
    def validate_asset_class(cls, value: str):
        stripped_value = value.strip()
        if stripped_value not in ALLOWED_ASSET_CLASSES:
            raise ValueError(f"Invalid asset class. Allowed values are: {', '.join(ALLOWED_ASSET_CLASSES)}")
        return stripped_value

    @field_validator('assetType')
    @classmethod
    def validate_asset_type(cls, value: str):
        stripped_value = value.strip()
        if stripped_value not in ALLOWED_ASSET_TYPES:
            raise ValueError(f"Invalid asset type. Allowed values are: {', '.join(ALLOWED_ASSET_TYPES)}")
        return stripped_value

    @field_validator('fpAssetClass')
    @classmethod
    def validate_fp_asset_class(cls, value: str):
        stripped_value = value.strip()
        if stripped_value not in ALLOWED_FP_ASSET_CLASSES:
            raise ValueError(f"Invalid FP asset class. Allowed values are: {', '.join(ALLOWED_FP_ASSET_CLASSES)}")
        return stripped_value

class AssetIn(AssetBase):
    pass # Inherits all fields and validators from AssetBase

class AssetOut(AssetBase):
    id: str

# This list will eventually be replaced by a database connection and ORM
# For now, the service layer will manage this dummy list.
dummy_assets_db: List[Dict[str, Any]] = [
    {"id": "1", "name": "Fixed Deposit", "valueINR": 50000.0, "assetClass": "Debt", "assetType": "Fixed Deposit (FD)", "fpAssetClass": "General Investment / Wealth Creation"},
    {"id": "2", "name": "Reliance Shares", "valueINR": 120000.0, "assetClass": "Equity", "assetType": "Stocks (Direct Equity)", "fpAssetClass": "General Investment / Wealth Creation"}
]
next_id_counter = 3 