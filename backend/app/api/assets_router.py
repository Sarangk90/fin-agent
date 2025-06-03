from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from ..services.asset_service import AssetService
from ..models.asset_models import AssetIn, AssetOut
from ..dependencies import get_asset_service

router = APIRouter(
    prefix="/api/assets",
    tags=["assets"], # For grouping in OpenAPI docs
    responses={404: {"description": "Not found"}}, # Default response for this router
)

@router.get("", response_model=List[AssetOut])
async def get_all_assets(
    asset_service: AssetService = Depends(get_asset_service)
):
    """Retrieve all assets."""
    return await asset_service.get_all_assets()

@router.get("/{asset_id}", response_model=AssetOut)
async def get_asset_by_id(
    asset_id: str,
    asset_service: AssetService = Depends(get_asset_service)
):
    """Retrieve an asset by its ID."""
    asset = await asset_service.get_asset_by_id(asset_id)
    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Asset with ID {asset_id} not found")
    return asset

@router.post("", response_model=AssetOut, status_code=status.HTTP_201_CREATED)
async def create_new_asset(
    asset: AssetIn,
    asset_service: AssetService = Depends(get_asset_service)
):
    """Create a new asset. Data is validated by AssetIn model."""
    try:
        return await asset_service.create_asset(asset)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        # Log the exception e here for debugging
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred while creating the asset.")

@router.put("/{asset_id}", response_model=AssetOut)
async def update_existing_asset(
    asset_id: str, 
    asset_data: AssetIn,
    asset_service: AssetService = Depends(get_asset_service)
):
    """Update an existing asset by its ID."""
    updated_asset = await asset_service.update_asset(asset_id, asset_data)
    if updated_asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Asset with ID {asset_id} not found")
    return updated_asset

@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_asset(
    asset_id: str,
    asset_service: AssetService = Depends(get_asset_service)
):
    """Delete an asset by its ID."""
    deleted_successfully = await asset_service.delete_asset(asset_id)
    if not deleted_successfully:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Asset with ID {asset_id} not found or already deleted")
    return # FastAPI will return 204 No Content by default if no body is returned
