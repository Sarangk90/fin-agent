from fastapi import APIRouter, HTTPException, status
from typing import List
from ..services import liability_service
from ..models.liability_models import LiabilityIn, LiabilityOut

router = APIRouter(
    prefix="/api/liabilities",
    tags=["liabilities"],
    responses={404: {"description": "Not found"}},
)

@router.get("", response_model=List[LiabilityOut])
async def get_all_liabilities():
    """Retrieve all liabilities."""
    return await liability_service.get_liabilities_service()

@router.post("", response_model=LiabilityOut, status_code=status.HTTP_201_CREATED)
async def create_new_liability(liability: LiabilityIn):
    """Create a new liability."""
    try:
        return await liability_service.create_liability_service(liability)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        # Log the exception e here for debugging
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred while creating the liability.")

@router.put("/{liability_id}", response_model=LiabilityOut)
async def update_existing_liability(liability_id: str, liability_data: LiabilityIn):
    """Update an existing liability by its ID."""
    try:
        updated_liability = await liability_service.update_liability_service(liability_id, liability_data)
        if updated_liability is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Liability with ID {liability_id} not found")
        return updated_liability
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        # Log the exception e here for debugging
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred while updating liability {liability_id}.")

@router.delete("/{liability_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_liability(liability_id: str):
    """Delete a liability by its ID."""
    deleted_successfully = await liability_service.delete_liability_service(liability_id)
    if not deleted_successfully:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Liability with ID {liability_id} not found or already deleted")
    return 