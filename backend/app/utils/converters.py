from typing import Dict, Any
from ..db_models import Asset, Liability, Expense, Goal
from ..models.asset_models import AssetOut
from ..models.liability_models import LiabilityOut
from ..models.expense_models import ExpenseOut
from ..models.goal_models import GoalOut

def asset_db_to_pydantic(asset: Asset) -> AssetOut:
    """Convert database Asset model to Pydantic AssetOut model."""
    return AssetOut(
        id=str(asset.id),
        name=asset.name,
        valueINR=asset.value_inr,
        assetClass=asset.asset_class,
        assetType=asset.asset_type,
        fpAssetClass=asset.fp_asset_class
    )

def liability_db_to_pydantic(liability: Liability) -> LiabilityOut:
    """Convert database Liability model to Pydantic LiabilityOut model."""
    return LiabilityOut(
        id=str(liability.id),
        name=liability.name,
        type=liability.type,
        outstandingAmountINR=liability.outstanding_amount_inr,
        interestRate=liability.interest_rate,
        dueDate=str(liability.due_date) if liability.due_date else None
    )

def expense_db_to_pydantic(expense: Expense) -> ExpenseOut:
    """Convert database Expense model to Pydantic ExpenseOut model."""
    return ExpenseOut(
        id=str(expense.id),
        category=expense.category,
        details=expense.details,
        amount=expense.amount,
        frequency=expense.frequency,
        needWant=expense.need_want,
        date=str(expense.date)
    )

def goal_db_to_pydantic(goal: Goal) -> GoalOut:
    """Convert database Goal model to Pydantic GoalOut model."""
    return GoalOut(
        id=str(goal.id),
        name=goal.name,
        targetAmount=goal.target_amount,
        currentAmount=goal.current_amount,
        targetDate=str(goal.target_date),
        priority=goal.priority,
        category=goal.category,
        notes=goal.notes
    )
