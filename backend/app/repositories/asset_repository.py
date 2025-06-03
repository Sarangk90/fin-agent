from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .base_repository import BaseRepository
from ..db_models import Asset

class AssetRepository(BaseRepository):
    """Repository for asset operations."""
    
    async def get_all(self, user_id: int = 1) -> List[Asset]:
        """Get all assets for a user."""
        result = await self.db.execute(
            select(Asset).where(Asset.user_id == user_id)
        )
        return list(result.scalars().all())
    
    async def get_by_id(self, asset_id: int, user_id: int = 1) -> Optional[Asset]:
        """Get asset by ID for a specific user."""
        result = await self.db.execute(
            select(Asset).where(
                Asset.id == asset_id,
                Asset.user_id == user_id
            )
        )
        return result.scalar_one_or_none()
    
    async def create(self, asset_data: Dict[str, Any], user_id: int = 1) -> Asset:
        """Create new asset."""
        # Convert field names to match database schema
        db_data = {
            "user_id": user_id,
            "name": asset_data["name"],
            "value_inr": asset_data["valueINR"],
            "asset_class": asset_data["assetClass"],
            "asset_type": asset_data["assetType"],
            "fp_asset_class": asset_data["fpAssetClass"]
        }
        asset = Asset(**db_data)
        self.db.add(asset)
        await self.db.commit()
        await self.db.refresh(asset)
        return asset
    
    async def update(self, asset_id: int, asset_data: Dict[str, Any], user_id: int = 1) -> Optional[Asset]:
        """Update existing asset."""
        asset = await self.get_by_id(asset_id, user_id)
        if not asset:
            return None
        
        # Convert field names to match database schema
        if "name" in asset_data:
            asset.name = asset_data["name"]
        if "valueINR" in asset_data:
            asset.value_inr = asset_data["valueINR"]
        if "assetClass" in asset_data:
            asset.asset_class = asset_data["assetClass"]
        if "assetType" in asset_data:
            asset.asset_type = asset_data["assetType"]
        if "fpAssetClass" in asset_data:
            asset.fp_asset_class = asset_data["fpAssetClass"]
        
        await self.db.commit()
        await self.db.refresh(asset)
        return asset
    
    async def delete(self, asset_id: int, user_id: int = 1) -> bool:
        """Delete asset by ID."""
        asset = await self.get_by_id(asset_id, user_id)
        if not asset:
            return False
        
        await self.db.delete(asset)
        await self.db.commit()
        return True
