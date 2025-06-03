from functools import lru_cache
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .fixtures.sample_data import StaticDataManager
from .config import Settings, get_settings
from .database import get_db_session
from .repositories import AssetRepository, LiabilityRepository, ExpenseRepository, GoalRepository, UserRepository
from .services.asset_service import AssetService
from .services.liability_service import LiabilityService
from .services.expense_service import ExpenseService
from .services.goal_service import GoalService
from .services.fi_service import FIService

# Legacy static data manager (will be phased out)
@lru_cache()
def get_data_manager() -> StaticDataManager:
    """Get the static data manager (singleton) - LEGACY."""
    return StaticDataManager()

@lru_cache()
def get_settings_dependency() -> Settings:
    """Get application settings (cached)."""
    return get_settings()

# Database repositories
def get_user_repository(
    db_session: AsyncSession = Depends(get_db_session)
) -> UserRepository:
    """Get the user repository with database session."""
    return UserRepository(db_session)

def get_asset_repository(
    db_session: AsyncSession = Depends(get_db_session)
) -> AssetRepository:
    """Get the asset repository with database session."""
    return AssetRepository(db_session)

def get_liability_repository(
    db_session: AsyncSession = Depends(get_db_session)
) -> LiabilityRepository:
    """Get the liability repository with database session."""
    return LiabilityRepository(db_session)

def get_expense_repository(
    db_session: AsyncSession = Depends(get_db_session)
) -> ExpenseRepository:
    """Get the expense repository with database session."""
    return ExpenseRepository(db_session)

def get_goal_repository(
    db_session: AsyncSession = Depends(get_db_session)
) -> GoalRepository:
    """Get the goal repository with database session."""
    return GoalRepository(db_session)

# Services with database repositories
def get_asset_service(
    asset_repository: AssetRepository = Depends(get_asset_repository)
) -> AssetService:
    """Get the asset service with database repository."""
    return AssetService(asset_repository)

def get_liability_service(
    liability_repository: LiabilityRepository = Depends(get_liability_repository)
) -> LiabilityService:
    """Get the liability service with database repository."""
    return LiabilityService(liability_repository)

def get_expense_service(
    expense_repository: ExpenseRepository = Depends(get_expense_repository)
) -> ExpenseService:
    """Get the expense service with database repository."""
    return ExpenseService(expense_repository)

def get_goal_service(
    goal_repository: GoalRepository = Depends(get_goal_repository)
) -> GoalService:
    """Get the goal service with database repository."""
    return GoalService(goal_repository)

def get_fi_service(
    asset_service: AssetService = Depends(get_asset_service),
    liability_service: LiabilityService = Depends(get_liability_service)
) -> FIService:
    """Get the FI service with injected dependencies."""
    return FIService(asset_service, liability_service)

# Legacy services with static data manager (for backward compatibility during migration)
def get_legacy_asset_service(
    data_manager: StaticDataManager = Depends(get_data_manager)
) -> AssetService:
    """Get the asset service with static data manager - LEGACY."""
    return AssetService(data_manager)

def get_legacy_liability_service(
    data_manager: StaticDataManager = Depends(get_data_manager)
) -> LiabilityService:
    """Get the liability service with static data manager - LEGACY."""
    return LiabilityService(data_manager)

def get_legacy_expense_service(
    data_manager: StaticDataManager = Depends(get_data_manager)
) -> ExpenseService:
    """Get the expense service with static data manager - LEGACY."""
    return ExpenseService(data_manager)

def get_legacy_goal_service(
    data_manager: StaticDataManager = Depends(get_data_manager)
) -> GoalService:
    """Get the goal service with static data manager - LEGACY."""
    return GoalService(data_manager)
