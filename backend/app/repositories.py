from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .db_models import User, Asset, Liability, Expense, Goal

class BaseRepository(ABC):
    """Base repository interface for all entities."""
    
    def __init__(self, db_session: AsyncSession):
        self.db = db_session
    
    @abstractmethod
    async def get_all(self, user_id: int = 1) -> List[Any]:
        pass
    
    @abstractmethod
    async def get_by_id(self, entity_id: int, user_id: int = 1) -> Optional[Any]:
        pass
    
    @abstractmethod
    async def create(self, entity_data: Dict[str, Any], user_id: int = 1) -> Any:
        pass
    
    @abstractmethod
    async def update(self, entity_id: int, entity_data: Dict[str, Any], user_id: int = 1) -> Optional[Any]:
        pass
    
    @abstractmethod
    async def delete(self, entity_id: int, user_id: int = 1) -> bool:
        pass

class UserRepository:
    """Repository for user operations."""
    
    def __init__(self, db_session: AsyncSession):
        self.db = db_session
    
    async def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()
    
    async def create(self, user_data: Dict[str, Any]) -> User:
        """Create new user."""
        user = User(**user_data)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

class AssetRepository(BaseRepository):
    """Repository for asset operations."""
    
    async def get_all(self, user_id: int = 1) -> List[Asset]:
        """Get all assets for a user."""
        result = await self.db.execute(
            select(Asset).where(Asset.user_id == user_id)
        )
        return list(result.scalars().all())
    
    async def get_by_id(self, asset_id: int, user_id: int = 1) -> Optional[Asset]:
        """Get asset by ID for a specific user."""
        result = await self.db.execute(
            select(Asset).where(
                Asset.id == asset_id,
                Asset.user_id == user_id
            )
        )
        return result.scalar_one_or_none()
    
    async def create(self, asset_data: Dict[str, Any], user_id: int = 1) -> Asset:
        """Create new asset."""
        # Convert field names to match database schema
        db_data = {
            "user_id": user_id,
            "name": asset_data["name"],
            "value_inr": asset_data["valueINR"],
            "asset_class": asset_data["assetClass"],
            "asset_type": asset_data["assetType"],
            "fp_asset_class": asset_data["fpAssetClass"]
        }
        asset = Asset(**db_data)
        self.db.add(asset)
        await self.db.commit()
        await self.db.refresh(asset)
        return asset
    
    async def update(self, asset_id: int, asset_data: Dict[str, Any], user_id: int = 1) -> Optional[Asset]:
        """Update existing asset."""
        asset = await self.get_by_id(asset_id, user_id)
        if not asset:
            return None
        
        # Convert field names to match database schema
        if "name" in asset_data:
            asset.name = asset_data["name"]
        if "valueINR" in asset_data:
            asset.value_inr = asset_data["valueINR"]
        if "assetClass" in asset_data:
            asset.asset_class = asset_data["assetClass"]
        if "assetType" in asset_data:
            asset.asset_type = asset_data["assetType"]
        if "fpAssetClass" in asset_data:
            asset.fp_asset_class = asset_data["fpAssetClass"]
        
        await self.db.commit()
        await self.db.refresh(asset)
        return asset
    
    async def delete(self, asset_id: int, user_id: int = 1) -> bool:
        """Delete asset by ID."""
        asset = await self.get_by_id(asset_id, user_id)
        if not asset:
            return False
        
        await self.db.delete(asset)
        await self.db.commit()
        return True

class LiabilityRepository(BaseRepository):
    """Repository for liability operations."""
    
    async def get_all(self, user_id: int = 1) -> List[Liability]:
        """Get all liabilities for a user."""
        result = await self.db.execute(
            select(Liability).where(Liability.user_id == user_id)
        )
        return list(result.scalars().all())
    
    async def get_by_id(self, liability_id: int, user_id: int = 1) -> Optional[Liability]:
        """Get liability by ID for a specific user."""
        result = await self.db.execute(
            select(Liability).where(
                Liability.id == liability_id,
                Liability.user_id == user_id
            )
        )
        return result.scalar_one_or_none()
    
    async def create(self, liability_data: Dict[str, Any], user_id: int = 1) -> Liability:
        """Create new liability."""
        # Convert field names to match database schema
        db_data = {
            "user_id": user_id,
            "name": liability_data["name"],
            "type": liability_data["type"],
            "outstanding_amount_inr": liability_data["outstandingAmountINR"],
            "interest_rate": liability_data.get("interestRate"),
            "due_date": liability_data.get("dueDate")
        }
        liability = Liability(**db_data)
        self.db.add(liability)
        await self.db.commit()
        await self.db.refresh(liability)
        return liability
    
    async def update(self, liability_id: int, liability_data: Dict[str, Any], user_id: int = 1) -> Optional[Liability]:
        """Update existing liability."""
        liability = await self.get_by_id(liability_id, user_id)
        if not liability:
            return None
        
        # Convert field names to match database schema
        if "name" in liability_data:
            liability.name = liability_data["name"]
        if "type" in liability_data:
            liability.type = liability_data["type"]
        if "outstandingAmountINR" in liability_data:
            liability.outstanding_amount_inr = liability_data["outstandingAmountINR"]
        if "interestRate" in liability_data:
            liability.interest_rate = liability_data["interestRate"]
        if "dueDate" in liability_data:
            liability.due_date = liability_data["dueDate"]
        
        await self.db.commit()
        await self.db.refresh(liability)
        return liability
    
    async def delete(self, liability_id: int, user_id: int = 1) -> bool:
        """Delete liability by ID."""
        liability = await self.get_by_id(liability_id, user_id)
        if not liability:
            return False
        
        await self.db.delete(liability)
        await self.db.commit()
        return True

class ExpenseRepository(BaseRepository):
    """Repository for expense operations."""
    
    async def get_all(self, user_id: int = 1) -> List[Expense]:
        """Get all expenses for a user."""
        result = await self.db.execute(
            select(Expense).where(Expense.user_id == user_id)
        )
        return list(result.scalars().all())
    
    async def get_by_id(self, expense_id: int, user_id: int = 1) -> Optional[Expense]:
        """Get expense by ID for a specific user."""
        result = await self.db.execute(
            select(Expense).where(
                Expense.id == expense_id,
                Expense.user_id == user_id
            )
        )
        return result.scalar_one_or_none()
    
    async def create(self, expense_data: Dict[str, Any], user_id: int = 1) -> Expense:
        """Create new expense."""
        # Convert field names to match database schema
        db_data = {
            "user_id": user_id,
            "category": expense_data["category"],
            "details": expense_data.get("details"),
            "amount": expense_data["amount"],
            "frequency": expense_data["frequency"],
            "need_want": expense_data["needWant"],
            "date": expense_data["date"]
        }
        expense = Expense(**db_data)
        self.db.add(expense)
        await self.db.commit()
        await self.db.refresh(expense)
        return expense
    
    async def update(self, expense_id: int, expense_data: Dict[str, Any], user_id: int = 1) -> Optional[Expense]:
        """Update existing expense."""
        expense = await self.get_by_id(expense_id, user_id)
        if not expense:
            return None
        
        # Convert field names to match database schema
        if "category" in expense_data:
            expense.category = expense_data["category"]
        if "details" in expense_data:
            expense.details = expense_data["details"]
        if "amount" in expense_data:
            expense.amount = expense_data["amount"]
        if "frequency" in expense_data:
            expense.frequency = expense_data["frequency"]
        if "needWant" in expense_data:
            expense.need_want = expense_data["needWant"]
        if "date" in expense_data:
            expense.date = expense_data["date"]
        
        await self.db.commit()
        await self.db.refresh(expense)
        return expense
    
    async def delete(self, expense_id: int, user_id: int = 1) -> bool:
        """Delete expense by ID."""
        expense = await self.get_by_id(expense_id, user_id)
        if not expense:
            return False
        
        await self.db.delete(expense)
        await self.db.commit()
        return True

class GoalRepository(BaseRepository):
    """Repository for goal operations."""
    
    async def get_all(self, user_id: int = 1) -> List[Goal]:
        """Get all goals for a user."""
        result = await self.db.execute(
            select(Goal).where(Goal.user_id == user_id)
        )
        return list(result.scalars().all())
    
    async def get_by_id(self, goal_id: int, user_id: int = 1) -> Optional[Goal]:
        """Get goal by ID for a specific user."""
        result = await self.db.execute(
            select(Goal).where(
                Goal.id == goal_id,
                Goal.user_id == user_id
            )
        )
        return result.scalar_one_or_none()
    
    async def create(self, goal_data: Dict[str, Any], user_id: int = 1) -> Goal:
        """Create new goal."""
        # Convert field names to match database schema
        db_data = {
            "user_id": user_id,
            "name": goal_data["name"],
            "target_amount": goal_data["targetAmount"],
            "current_amount": goal_data["currentAmount"],
            "target_date": goal_data["targetDate"],
            "priority": goal_data["priority"],
            "category": goal_data["category"],
            "notes": goal_data.get("notes")
        }
        goal = Goal(**db_data)
        self.db.add(goal)
        await self.db.commit()
        await self.db.refresh(goal)
        return goal
    
    async def update(self, goal_id: int, goal_data: Dict[str, Any], user_id: int = 1) -> Optional[Goal]:
        """Update existing goal."""
        goal = await self.get_by_id(goal_id, user_id)
        if not goal:
            return None
        
        # Convert field names to match database schema
        if "name" in goal_data:
            goal.name = goal_data["name"]
        if "targetAmount" in goal_data:
            goal.target_amount = goal_data["targetAmount"]
        if "currentAmount" in goal_data:
            goal.current_amount = goal_data["currentAmount"]
        if "targetDate" in goal_data:
            goal.target_date = goal_data["targetDate"]
        if "priority" in goal_data:
            goal.priority = goal_data["priority"]
        if "category" in goal_data:
            goal.category = goal_data["category"]
        if "notes" in goal_data:
            goal.notes = goal_data["notes"]
        
        await self.db.commit()
        await self.db.refresh(goal)
        return goal
    
    async def delete(self, goal_id: int, user_id: int = 1) -> bool:
        """Delete goal by ID."""
        goal = await self.get_by_id(goal_id, user_id)
        if not goal:
            return False
        
        await self.db.delete(goal)
        await self.db.commit()
        return True
