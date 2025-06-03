from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .base_repository import BaseRepository
from ..db_models import Expense

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
