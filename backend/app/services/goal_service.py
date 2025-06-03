from typing import List, Optional, Union
from ..models.goal_models import GoalIn, GoalOut
from ..fixtures.sample_data import StaticDataManager
from ..repositories import GoalRepository
from ..utils.converters import goal_db_to_pydantic

class GoalService:
    """Service for managing goals."""
    
    def __init__(self, data_source: Union[StaticDataManager, GoalRepository]):
        self.data_source = data_source
        self.is_repository = isinstance(data_source, GoalRepository)
    
    async def get_all_goals(self, user_id: int = 1) -> List[GoalOut]:
        """Retrieves all goals."""
        if self.is_repository:
            # Database repository
            goals = await self.data_source.get_all(user_id)
            return [goal_db_to_pydantic(goal) for goal in goals]
        else:
            # Static data manager (legacy)
            goal_data = self.data_source.get_all_goals()
            return [GoalOut(**goal) for goal in goal_data]
    
    async def get_goal_by_id(self, goal_id: str, user_id: int = 1) -> Optional[GoalOut]:
        """Retrieves a goal by ID."""
        if self.is_repository:
            # Database repository
            goal = await self.data_source.get_by_id(int(goal_id), user_id)
            return goal_db_to_pydantic(goal) if goal else None
        else:
            # Static data manager (legacy)
            goal_data = self.data_source.get_goal_by_id(goal_id)
            return GoalOut(**goal_data) if goal_data else None
    
    async def create_goal(self, goal_data: GoalIn, user_id: int = 1) -> GoalOut:
        """Creates a new goal."""
        if self.is_repository:
            # Database repository
            goal = await self.data_source.create(goal_data.model_dump(), user_id)
            return goal_db_to_pydantic(goal)
        else:
            # Static data manager (legacy)
            new_goal_dict = self.data_source.create_goal(goal_data.model_dump())
            return GoalOut(**new_goal_dict)
    
    async def update_goal(self, goal_id: str, goal_update_data: GoalIn, user_id: int = 1) -> Optional[GoalOut]:
        """Updates an existing goal."""
        if self.is_repository:
            # Database repository
            goal = await self.data_source.update(int(goal_id), goal_update_data.model_dump(), user_id)
            return goal_db_to_pydantic(goal) if goal else None
        else:
            # Static data manager (legacy)
            updated_goal_dict = self.data_source.update_goal(goal_id, goal_update_data.model_dump())
            return GoalOut(**updated_goal_dict) if updated_goal_dict else None
    
    async def delete_goal(self, goal_id: str, user_id: int = 1) -> bool:
        """Deletes a goal by ID."""
        if self.is_repository:
            # Database repository
            return await self.data_source.delete(int(goal_id), user_id)
        else:
            # Static data manager (legacy)
            return self.data_source.delete_goal(goal_id)
