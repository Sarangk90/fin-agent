from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from ..services.liability_service import LiabilityService
from ..models.liability_models import LiabilityIn, LiabilityOut
from ..dependencies import get_liability_service

router = APIRouter(
    prefix="/api/liabilities",
    tags=["liabilities"],
    responses={404: {"description": "Not found"}},
)

@router.get("", response_model=List[LiabilityOut])
async def get_all_liabilities(
    liability_service: LiabilityService = Depends(get_liability_service)
):
    """Retrieve all liabilities."""
    return await liability_service.get_all_liabilities()

@router.get("/{liability_id}", response_model=LiabilityOut)
async def get_liability_by_id(
    liability_id: str,
    liability_service: LiabilityService = Depends(get_liability_service)
):
    """Retrieve a liability by its ID."""
    liability = await liability_service.get_liability_by_id(liability_id)
    if liability is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Liability with ID {liability_id} not found")
    return liability

@router.post("", response_model=LiabilityOut, status_code=status.HTTP_201_CREATED)
async def create_new_liability(
    liability: LiabilityIn,
    liability_service: LiabilityService = Depends(get_liability_service)
):
    """Create a new liability."""
    try:
        return await liability_service.create_liability(liability)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        # Log the exception e here for debugging
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred while creating the liability.")

@router.put("/{liability_id}", response_model=LiabilityOut)
async def update_existing_liability(
    liability_id: str, 
    liability_data: LiabilityIn,
    liability_service: LiabilityService = Depends(get_liability_service)
):
    """Update an existing liability by its ID."""
    try:
        updated_liability = await liability_service.update_liability(liability_id, liability_data)
        if updated_liability is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Liability with ID {liability_id} not found")
        return updated_liability
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        # Log the exception e here for debugging
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred while updating liability {liability_id}.")

@router.delete("/{liability_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_liability(
    liability_id: str,
    liability_service: LiabilityService = Depends(get_liability_service)
):
    """Delete a liability by its ID."""
    deleted_successfully = await liability_service.delete_liability(liability_id)
    if not deleted_successfully:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Liability with ID {liability_id} not found or already deleted")
    return
