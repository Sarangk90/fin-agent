from fastapi import APIRouter, HTTPException, status
from typing import List
from ..services import asset_service
from ..models.asset_models import AssetIn, AssetOut

router = APIRouter(
    prefix="/api/assets",
    tags=["assets"], # For grouping in OpenAPI docs
    responses={404: {"description": "Not found"}}, # Default response for this router
)

@router.get("", response_model=List[AssetOut])
async def get_all_assets():
    """Retrieve all assets."""
    return await asset_service.get_assets_service()

@router.post("", response_model=AssetOut, status_code=status.HTTP_201_CREATED)
async def create_new_asset(asset: AssetIn):
    """Create a new asset. Data is validated by AssetIn model."""
    # Pydantic will automatically handle validation errors and return a 422 response
    # if the incoming data doesn't match AssetIn model and its validators.
    try:
        return await asset_service.create_asset_service(asset)
    except ValueError as e: # Catch specific errors from service if needed, though Pydantic handles most
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e: # Generic error handler
        # Log the exception e here for debugging
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred while creating the asset.")

# Placeholders for GET by ID, PUT, DELETE endpoints
# @router.get("/{asset_id}", response_model=AssetOut)
# async def get_asset_by_id(asset_id: str):
#     pass

# @router.put("/{asset_id}", response_model=AssetOut)
# async def update_existing_asset(asset_id: str, asset: AssetIn):
#     pass

# @router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_existing_asset(asset_id: str):
#     pass 