from typing import List, Optional, Union
from ..models.liability_models import LiabilityIn, LiabilityOut
from ..fixtures.sample_data import StaticDataManager
from ..repositories import LiabilityRepository
from ..utils.converters import liability_db_to_pydantic

class LiabilityService:
    """Service for managing liabilities."""
    
    def __init__(self, data_source: Union[StaticDataManager, LiabilityRepository]):
        self.data_source = data_source
        self.is_repository = isinstance(data_source, LiabilityRepository)
    
    async def get_all_liabilities(self, user_id: int = 1) -> List[LiabilityOut]:
        """Retrieves all liabilities."""
        if self.is_repository:
            # Database repository
            liabilities = await self.data_source.get_all(user_id)
            return [liability_db_to_pydantic(liability) for liability in liabilities]
        else:
            # Static data manager (legacy)
            liability_data = self.data_source.get_all_liabilities()
            return [LiabilityOut(**liability) for liability in liability_data]
    
    async def get_liability_by_id(self, liability_id: str, user_id: int = 1) -> Optional[LiabilityOut]:
        """Retrieves a liability by ID."""
        if self.is_repository:
            # Database repository
            liability = await self.data_source.get_by_id(int(liability_id), user_id)
            return liability_db_to_pydantic(liability) if liability else None
        else:
            # Static data manager (legacy)
            liability_data = self.data_source.get_liability_by_id(liability_id)
            return LiabilityOut(**liability_data) if liability_data else None
    
    async def create_liability(self, liability_data: LiabilityIn, user_id: int = 1) -> LiabilityOut:
        """Creates a new liability."""
        if self.is_repository:
            # Database repository
            liability = await self.data_source.create(liability_data.model_dump(), user_id)
            return liability_db_to_pydantic(liability)
        else:
            # Static data manager (legacy)
            new_liability_dict = self.data_source.create_liability(liability_data.model_dump())
            return LiabilityOut(**new_liability_dict)
    
    async def update_liability(self, liability_id: str, liability_update_data: LiabilityIn, user_id: int = 1) -> Optional[LiabilityOut]:
        """Updates an existing liability."""
        if self.is_repository:
            # Database repository
            liability = await self.data_source.update(int(liability_id), liability_update_data.model_dump(), user_id)
            return liability_db_to_pydantic(liability) if liability else None
        else:
            # Static data manager (legacy)
            updated_liability_dict = self.data_source.update_liability(liability_id, liability_update_data.model_dump())
            return LiabilityOut(**updated_liability_dict) if updated_liability_dict else None
    
    async def delete_liability(self, liability_id: str, user_id: int = 1) -> bool:
        """Deletes a liability by ID."""
        if self.is_repository:
            # Database repository
            return await self.data_source.delete(int(liability_id), user_id)
        else:
            # Static data manager (legacy)
            return self.data_source.delete_liability(liability_id)
