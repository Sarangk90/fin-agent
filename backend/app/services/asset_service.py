from typing import List, Dict, Any
from ..models.asset_models import AssetIn, AssetOut, dummy_assets_db, next_id_counter
from fastapi import HTTPException

async def get_assets_service() -> List[AssetOut]:
    """Retrieves all assets from the dummy database."""
    return [AssetOut(**asset_data) for asset_data in dummy_assets_db]

async def create_asset_service(asset_data: AssetIn) -> AssetOut:
    """Creates a new asset in the dummy database."""
    global next_id_counter
    new_asset_dict = asset_data.model_dump() # Pydantic model to dict
    new_asset_dict["id"] = str(next_id_counter)
    dummy_assets_db.append(new_asset_dict)
    next_id_counter += 1
    return AssetOut(**new_asset_dict)

# Placeholder for get_asset_by_id_service, update_asset_service, delete_asset_service
# which will be needed when we implement those operations. 