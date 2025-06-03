from pydantic import BaseModel, field_validator, Field
from ..config import get_settings

settings = get_settings()

class AssetBase(BaseModel):
    name: str = Field(..., min_length=1, description="Name of the asset, cannot be empty.")
    valueINR: float = Field(..., gt=0, description="Value of the asset in INR, must be positive.")
    assetClass: str = Field(..., description="Primary class of the asset.")
    assetType: str = Field(..., description="Specific type or sub-class of the asset.")
    fpAssetClass: str = Field(..., description="Financial planning purpose of the asset.")

    @field_validator('name')
    @classmethod
    def validate_name(cls, value: str):
        if not value.strip():
            raise ValueError("Name cannot be empty or just whitespace.")
        return value.strip()

    @field_validator('assetClass')
    @classmethod
    def validate_asset_class(cls, value: str):
        stripped_value = value.strip()
        if not stripped_value:
            raise ValueError("Asset class cannot be empty or just whitespace.")
        if stripped_value not in settings.ALLOWED_ASSET_CLASSES:
            raise ValueError(f"Invalid asset class. Allowed values are: {', '.join(settings.ALLOWED_ASSET_CLASSES)}")
        return stripped_value

    @field_validator('assetType')
    @classmethod
    def validate_asset_type(cls, value: str):
        stripped_value = value.strip()
        if not stripped_value:
            raise ValueError("Asset type cannot be empty or just whitespace.")
        if stripped_value not in settings.ALLOWED_ASSET_TYPES:
            raise ValueError(f"Invalid asset type. Allowed values are: {', '.join(settings.ALLOWED_ASSET_TYPES)}")
        return stripped_value

    @field_validator('fpAssetClass')
    @classmethod
    def validate_fp_asset_class(cls, value: str):
        stripped_value = value.strip()
        if not stripped_value:
            raise ValueError("FP asset class cannot be empty or just whitespace.")
        if stripped_value not in settings.ALLOWED_FP_ASSET_CLASSES:
            raise ValueError(f"Invalid FP asset class. Allowed values are: {', '.join(settings.ALLOWED_FP_ASSET_CLASSES)}")
        return stripped_value

class AssetIn(AssetBase):
    pass # Inherits all fields and validators from AssetBase

class AssetOut(AssetBase):
    id: str
