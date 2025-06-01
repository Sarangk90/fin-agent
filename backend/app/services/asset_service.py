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

async def update_asset_service(asset_id: str, asset_update_data: AssetIn) -> AssetOut | None:
    """Updates an existing asset in the dummy database."""
    for i, asset in enumerate(dummy_assets_db):
        if asset.get("id") == asset_id:
            updated_asset_data = asset_update_data.model_dump()
            # Preserve the original ID, do not overwrite it with data from asset_update_data
            dummy_assets_db[i] = {**asset, **updated_asset_data, "id": asset_id}
            return AssetOut(**dummy_assets_db[i])
    return None # Asset not found

async def delete_asset_service(asset_id: str) -> bool:
    """Deletes an asset from the dummy database by ID."""
    global dummy_assets_db
    original_length = len(dummy_assets_db)
    dummy_assets_db = [asset for asset in dummy_assets_db if asset.get("id") != asset_id]
    return len(dummy_assets_db) < original_length

# Placeholder for get_asset_by_id_service
# which will be needed when we implement those operations. 