from typing import List, Optional
from ..models.expense_models import ExpenseIn, ExpenseOut
from ..data.static_data import StaticDataManager

class ExpenseService:
    """Service for managing expenses."""
    
    def __init__(self, data_manager: StaticDataManager):
        self.data_manager = data_manager
    
    async def get_all_expenses(self) -> List[ExpenseOut]:
        """Retrieves all expenses."""
        expense_data = self.data_manager.get_all_expenses()
        return [ExpenseOut(**expense) for expense in expense_data]
    
    async def get_expense_by_id(self, expense_id: str) -> Optional[ExpenseOut]:
        """Retrieves an expense by ID."""
        expense_data = self.data_manager.get_expense_by_id(expense_id)
        return ExpenseOut(**expense_data) if expense_data else None
    
    async def create_expense(self, expense_data: ExpenseIn) -> ExpenseOut:
        """Creates a new expense."""
        new_expense_dict = self.data_manager.create_expense(expense_data.model_dump())
        return ExpenseOut(**new_expense_dict)
    
    async def update_expense(self, expense_id: str, expense_update_data: ExpenseIn) -> Optional[ExpenseOut]:
        """Updates an existing expense."""
        updated_expense_dict = self.data_manager.update_expense(expense_id, expense_update_data.model_dump())
        return ExpenseOut(**updated_expense_dict) if updated_expense_dict else None
    
    async def delete_expense(self, expense_id: str) -> bool:
        """Deletes an expense by ID."""
        return self.data_manager.delete_expense(expense_id)
