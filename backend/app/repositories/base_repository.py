from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession

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
