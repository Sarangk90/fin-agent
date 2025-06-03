from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from ..services.goal_service import GoalService
from ..models.goal_models import GoalIn, GoalOut
from ..dependencies import get_goal_service

router = APIRouter(
    prefix="/api/goals",
    tags=["goals"], # For grouping in OpenAPI docs
    responses={404: {"description": "Not found"}}, # Default response for this router
)

@router.get("", response_model=List[GoalOut])
async def get_all_goals(
    goal_service: GoalService = Depends(get_goal_service)
):
    """Retrieve all goals."""
    return await goal_service.get_all_goals()

@router.get("/{goal_id}", response_model=GoalOut)
async def get_goal_by_id(
    goal_id: str,
    goal_service: GoalService = Depends(get_goal_service)
):
    """Retrieve a goal by its ID."""
    goal = await goal_service.get_goal_by_id(goal_id)
    if goal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Goal with ID {goal_id} not found")
    return goal

@router.post("", response_model=GoalOut, status_code=status.HTTP_201_CREATED)
async def create_new_goal(
    goal: GoalIn,
    goal_service: GoalService = Depends(get_goal_service)
):
    """Create a new goal. Data is validated by GoalIn model."""
    try:
        return await goal_service.create_goal(goal)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        # Log the exception e here for debugging
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred while creating the goal.")

@router.put("/{goal_id}", response_model=GoalOut)
async def update_existing_goal(
    goal_id: str, 
    goal_data: GoalIn,
    goal_service: GoalService = Depends(get_goal_service)
):
    """Update an existing goal by its ID."""
    updated_goal = await goal_service.update_goal(goal_id, goal_data)
    if updated_goal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Goal with ID {goal_id} not found")
    return updated_goal

@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_goal(
    goal_id: str,
    goal_service: GoalService = Depends(get_goal_service)
):
    """Delete a goal by its ID."""
    deleted_successfully = await goal_service.delete_goal(goal_id)
    if not deleted_successfully:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Goal with ID {goal_id} not found or already deleted")
    return # FastAPI will return 204 No Content by default if no body is returned
