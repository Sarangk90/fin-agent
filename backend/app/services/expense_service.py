from typing import List, Dict, Any
from ..models.expense_models import ExpenseIn, ExpenseOut, dummy_expenses_db, next_expense_id_counter
from fastapi import HTTPException

async def get_expenses_service() -> List[ExpenseOut]:
    """Retrieves all expenses from the dummy database."""
    return [ExpenseOut(**expense_data) for expense_data in dummy_expenses_db]

async def create_expense_service(expense_data: ExpenseIn) -> ExpenseOut:
    """Creates a new expense in the dummy database."""
    global next_expense_id_counter, dummy_expenses_db
    new_expense_dict = expense_data.model_dump()
    new_expense_dict["id"] = str(next_expense_id_counter)
    dummy_expenses_db.append(new_expense_dict)
    next_expense_id_counter += 1
    return ExpenseOut(**new_expense_dict)

async def update_expense_service(expense_id: str, expense_update_data: ExpenseIn) -> ExpenseOut | None:
    """Updates an existing expense in the dummy database."""
    global dummy_expenses_db
    for i, expense in enumerate(dummy_expenses_db):
        if expense.get("id") == expense_id:
            updated_data = expense_update_data.model_dump()
            dummy_expenses_db[i] = {**expense, **updated_data, "id": expense_id}
            return ExpenseOut(**dummy_expenses_db[i])
    return None # Expense not found

async def delete_expense_service(expense_id: str) -> bool:
    """Deletes an expense from the dummy database by ID."""
    global dummy_expenses_db
    original_length = len(dummy_expenses_db)
    dummy_expenses_db = [expense for expense in dummy_expenses_db if expense.get("id") != expense_id]
    return len(dummy_expenses_db) < original_length 