from typing import List, Optional, Union
from ..models.asset_models import AssetIn, AssetOut
from ..fixtures.sample_data import StaticDataManager
from ..repositories import AssetRepository
from ..utils.converters import asset_db_to_pydantic

class AssetService:
    """Service for managing assets."""
    
    def __init__(self, data_source: Union[StaticDataManager, AssetRepository]):
        self.data_source = data_source
        self.is_repository = isinstance(data_source, AssetRepository)
    
    async def get_all_assets(self, user_id: int = 1) -> List[AssetOut]:
        """Retrieves all assets."""
        if self.is_repository:
            # Database repository
            assets = await self.data_source.get_all(user_id)
            return [asset_db_to_pydantic(asset) for asset in assets]
        else:
            # Static data manager (legacy)
            asset_data = self.data_source.get_all_assets()
            return [AssetOut(**asset) for asset in asset_data]
    
    async def get_asset_by_id(self, asset_id: str, user_id: int = 1) -> Optional[AssetOut]:
        """Retrieves an asset by ID."""
        if self.is_repository:
            # Database repository
            asset = await self.data_source.get_by_id(int(asset_id), user_id)
            return asset_db_to_pydantic(asset) if asset else None
        else:
            # Static data manager (legacy)
            asset_data = self.data_source.get_asset_by_id(asset_id)
            return AssetOut(**asset_data) if asset_data else None
    
    async def create_asset(self, asset_data: AssetIn, user_id: int = 1) -> AssetOut:
        """Creates a new asset."""
        if self.is_repository:
            # Database repository
            asset = await self.data_source.create(asset_data.model_dump(), user_id)
            return asset_db_to_pydantic(asset)
        else:
            # Static data manager (legacy)
            new_asset_dict = self.data_source.create_asset(asset_data.model_dump())
            return AssetOut(**new_asset_dict)
    
    async def update_asset(self, asset_id: str, asset_update_data: AssetIn, user_id: int = 1) -> Optional[AssetOut]:
        """Updates an existing asset."""
        if self.is_repository:
            # Database repository
            asset = await self.data_source.update(int(asset_id), asset_update_data.model_dump(), user_id)
            return asset_db_to_pydantic(asset) if asset else None
        else:
            # Static data manager (legacy)
            updated_asset_dict = self.data_source.update_asset(asset_id, asset_update_data.model_dump())
            return AssetOut(**updated_asset_dict) if updated_asset_dict else None
    
    async def delete_asset(self, asset_id: str, user_id: int = 1) -> bool:
        """Deletes an asset by ID."""
        if self.is_repository:
            # Database repository
            return await self.data_source.delete(int(asset_id), user_id)
        else:
            # Static data manager (legacy)
            return self.data_source.delete_asset(asset_id)
