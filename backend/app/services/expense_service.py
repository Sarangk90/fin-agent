from typing import List, Optional, Union
from ..models.expense_models import ExpenseIn, ExpenseOut
from ..fixtures.sample_data import StaticDataManager
from ..repositories import ExpenseRepository
from ..utils.converters import expense_db_to_pydantic

class ExpenseService:
    """Service for managing expenses."""
    
    def __init__(self, data_source: Union[StaticDataManager, ExpenseRepository]):
        self.data_source = data_source
        self.is_repository = isinstance(data_source, ExpenseRepository)
    
    async def get_all_expenses(self, user_id: int = 1) -> List[ExpenseOut]:
        """Retrieves all expenses."""
        if self.is_repository:
            # Database repository
            expenses = await self.data_source.get_all(user_id)
            return [expense_db_to_pydantic(expense) for expense in expenses]
        else:
            # Static data manager (legacy)
            expense_data = self.data_source.get_all_expenses()
            return [ExpenseOut(**expense) for expense in expense_data]
    
    async def get_expense_by_id(self, expense_id: str, user_id: int = 1) -> Optional[ExpenseOut]:
        """Retrieves an expense by ID."""
        if self.is_repository:
            # Database repository
            expense = await self.data_source.get_by_id(int(expense_id), user_id)
            return expense_db_to_pydantic(expense) if expense else None
        else:
            # Static data manager (legacy)
            expense_data = self.data_source.get_expense_by_id(expense_id)
            return ExpenseOut(**expense_data) if expense_data else None
    
    async def create_expense(self, expense_data: ExpenseIn, user_id: int = 1) -> ExpenseOut:
        """Creates a new expense."""
        if self.is_repository:
            # Database repository
            expense = await self.data_source.create(expense_data.model_dump(), user_id)
            return expense_db_to_pydantic(expense)
        else:
            # Static data manager (legacy)
            new_expense_dict = self.data_source.create_expense(expense_data.model_dump())
            return ExpenseOut(**new_expense_dict)
    
    async def update_expense(self, expense_id: str, expense_update_data: ExpenseIn, user_id: int = 1) -> Optional[ExpenseOut]:
        """Updates an existing expense."""
        if self.is_repository:
            # Database repository
            expense = await self.data_source.update(int(expense_id), expense_update_data.model_dump(), user_id)
            return expense_db_to_pydantic(expense) if expense else None
        else:
            # Static data manager (legacy)
            updated_expense_dict = self.data_source.update_expense(expense_id, expense_update_data.model_dump())
            return ExpenseOut(**updated_expense_dict) if updated_expense_dict else None
    
    async def delete_expense(self, expense_id: str, user_id: int = 1) -> bool:
        """Deletes an expense by ID."""
        if self.is_repository:
            # Database repository
            return await self.data_source.delete(int(expense_id), user_id)
        else:
            # Static data manager (legacy)
            return self.data_source.delete_expense(expense_id)
