from typing import List, Optional
from ..models.asset_models import AssetIn, AssetOut
from ..data.static_data import StaticDataManager

class AssetService:
    """Service for managing assets."""
    
    def __init__(self, data_manager: StaticDataManager):
        self.data_manager = data_manager
    
    async def get_all_assets(self) -> List[AssetOut]:
        """Retrieves all assets."""
        asset_data = self.data_manager.get_all_assets()
        return [AssetOut(**asset) for asset in asset_data]
    
    async def get_asset_by_id(self, asset_id: str) -> Optional[AssetOut]:
        """Retrieves an asset by ID."""
        asset_data = self.data_manager.get_asset_by_id(asset_id)
        return AssetOut(**asset_data) if asset_data else None
    
    async def create_asset(self, asset_data: AssetIn) -> AssetOut:
        """Creates a new asset."""
        new_asset_dict = self.data_manager.create_asset(asset_data.model_dump())
        return AssetOut(**new_asset_dict)
    
    async def update_asset(self, asset_id: str, asset_update_data: AssetIn) -> Optional[AssetOut]:
        """Updates an existing asset."""
        updated_asset_dict = self.data_manager.update_asset(asset_id, asset_update_data.model_dump())
        return AssetOut(**updated_asset_dict) if updated_asset_dict else None
    
    async def delete_asset(self, asset_id: str) -> bool:
        """Deletes an asset by ID."""
        return self.data_manager.delete_asset(asset_id)
