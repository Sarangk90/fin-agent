from typing import List, Optional
from ..models.goal_models import GoalIn, GoalOut
from ..data.static_data import StaticDataManager

class GoalService:
    """Service for managing goals."""
    
    def __init__(self, data_manager: StaticDataManager):
        self.data_manager = data_manager
    
    async def get_all_goals(self) -> List[GoalOut]:
        """Retrieves all goals."""
        goal_data = self.data_manager.get_all_goals()
        return [GoalOut(**goal) for goal in goal_data]
    
    async def get_goal_by_id(self, goal_id: str) -> Optional[GoalOut]:
        """Retrieves a goal by ID."""
        goal_data = self.data_manager.get_goal_by_id(goal_id)
        return GoalOut(**goal_data) if goal_data else None
    
    async def create_goal(self, goal_data: GoalIn) -> GoalOut:
        """Creates a new goal."""
        new_goal_dict = self.data_manager.create_goal(goal_data.model_dump())
        return GoalOut(**new_goal_dict)
    
    async def update_goal(self, goal_id: str, goal_update_data: GoalIn) -> Optional[GoalOut]:
        """Updates an existing goal."""
        updated_goal_dict = self.data_manager.update_goal(goal_id, goal_update_data.model_dump())
        return GoalOut(**updated_goal_dict) if updated_goal_dict else None
    
    async def delete_goal(self, goal_id: str) -> bool:
        """Deletes a goal by ID."""
        return self.data_manager.delete_goal(goal_id)
