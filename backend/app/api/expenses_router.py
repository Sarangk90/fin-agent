from fastapi import APIRouter, HTTPException, status
from typing import List
from ..services import expense_service
from ..models.expense_models import ExpenseIn, ExpenseOut

router = APIRouter(
    prefix="/api/expenses",
    tags=["expenses"],
    responses={404: {"description": "Not found"}},
)

@router.get("", response_model=List[ExpenseOut])
async def get_all_expenses():
    """Retrieve all expenses."""
    try:
        return await expense_service.get_expenses_service()
    except Exception as e:
        # It's good practice to log the error for debugging purposes
        # For example: print(f"Error in get_all_expenses: {e}") or use a proper logger
        # You might want to add logging here
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while retrieving expenses."
        )

@router.post("", response_model=ExpenseOut, status_code=status.HTTP_201_CREATED)
async def create_new_expense(expense: ExpenseIn):
    """Create a new expense."""
    try:
        return await expense_service.create_expense_service(expense)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        # Log the exception e here for debugging
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred while creating the expense.")

@router.put("/{expense_id}", response_model=ExpenseOut)
async def update_existing_expense(expense_id: str, expense_data: ExpenseIn):
    """Update an existing expense by its ID."""
    try:
        updated_expense = await expense_service.update_expense_service(expense_id, expense_data)
        if updated_expense is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Expense with ID {expense_id} not found")
        return updated_expense
    except ValueError as e: # Catches validation errors from Pydantic models if they are re-raised or occur during service logic
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        # Log the exception e here for debugging
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred while updating expense {expense_id}.")


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_expense(expense_id: str):
    """Delete an expense by its ID."""
    try:
        deleted_successfully = await expense_service.delete_expense_service(expense_id)
        if not deleted_successfully:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Expense with ID {expense_id} not found or already deleted")
        return # FastAPI will return 204 No Content by default
    except Exception as e:
        # Add logging for the error e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while deleting expense {expense_id}."
        ) 