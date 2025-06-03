from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .base_repository import BaseRepository
from ..db_models import Liability

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
