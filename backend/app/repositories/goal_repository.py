from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .base_repository import BaseRepository
from ..db_models import Goal

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
