from functools import lru_cache
from fastapi import Depends
from .data.static_data import StaticDataManager
from .config import Settings, get_settings
from .services.asset_service import AssetService
from .services.liability_service import LiabilityService
from .services.expense_service import ExpenseService
from .services.fi_service import FIService

@lru_cache()
def get_data_manager() -> StaticDataManager:
    """Get the static data manager (singleton)."""
    return StaticDataManager()

@lru_cache()
def get_settings_dependency() -> Settings:
    """Get application settings (cached)."""
    return get_settings()

def get_asset_service(
    data_manager: StaticDataManager = Depends(get_data_manager)
) -> AssetService:
    """Get the asset service with injected dependencies."""
    return AssetService(data_manager)

def get_liability_service(
    data_manager: StaticDataManager = Depends(get_data_manager)
) -> LiabilityService:
    """Get the liability service with injected dependencies."""
    return LiabilityService(data_manager)

def get_expense_service(
    data_manager: StaticDataManager = Depends(get_data_manager)
) -> ExpenseService:
    """Get the expense service with injected dependencies."""
    return ExpenseService(data_manager)

def get_fi_service(
    asset_service: AssetService = Depends(get_asset_service),
    liability_service: LiabilityService = Depends(get_liability_service)
) -> FIService:
    """Get the FI service with injected dependencies."""
    return FIService(asset_service, liability_service)
