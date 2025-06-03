from typing import List, Optional
from ..models.liability_models import LiabilityIn, LiabilityOut
from ..data.static_data import StaticDataManager

class LiabilityService:
    """Service for managing liabilities."""
    
    def __init__(self, data_manager: StaticDataManager):
        self.data_manager = data_manager
    
    async def get_all_liabilities(self) -> List[LiabilityOut]:
        """Retrieves all liabilities."""
        liability_data = self.data_manager.get_all_liabilities()
        return [LiabilityOut(**liability) for liability in liability_data]
    
    async def get_liability_by_id(self, liability_id: str) -> Optional[LiabilityOut]:
        """Retrieves a liability by ID."""
        liability_data = self.data_manager.get_liability_by_id(liability_id)
        return LiabilityOut(**liability_data) if liability_data else None
    
    async def create_liability(self, liability_data: LiabilityIn) -> LiabilityOut:
        """Creates a new liability."""
        new_liability_dict = self.data_manager.create_liability(liability_data.model_dump(exclude_none=True))
        return LiabilityOut(**new_liability_dict)
    
    async def update_liability(self, liability_id: str, liability_update_data: LiabilityIn) -> Optional[LiabilityOut]:
        """Updates an existing liability."""
        updated_liability_dict = self.data_manager.update_liability(liability_id, liability_update_data.model_dump(exclude_none=True))
        return LiabilityOut(**updated_liability_dict) if updated_liability_dict else None
    
    async def delete_liability(self, liability_id: str) -> bool:
        """Deletes a liability by ID."""
        return self.data_manager.delete_liability(liability_id)
