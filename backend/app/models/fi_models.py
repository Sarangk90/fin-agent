from pydantic import BaseModel
from typing import List, Optional, Union

# Asset and Liability models are now imported from their respective service/model files
# and are not redefined here. The FI service will use those directly.

class Goal(BaseModel):
    # Define Goal structure as it becomes clearer
    # For now, let's assume it might have currentCost and isEssentialForFI
    currentCost: Optional[float] = 0.0
    isEssentialForFI: Optional[bool] = True
    # Add other goal fields as necessary

class UserFIParameters(BaseModel):
    desired_annual_fi_expenses: float
    swr_percentage: float
    emergency_fund_to_exclude: Optional[float] = 0.0
    primary_residence_equity_to_exclude: Optional[float] = 0.0
    fp_asset_classes_for_investable: Optional[List[str]] = ["Retirement", "General Investment"]
    # current_year: Optional[int] # Not used in current calculation logic directly

class FIDetails(BaseModel):
    net_investable_assets: float
    total_current_cost_of_goals_to_set_aside: float

class FinancialIndependenceResult(BaseModel):
    is_financially_independent: bool
    fi_ratio_percentage: float
    net_fi_corpus_available: float
    required_fi_corpus: Union[float, str] # Can be float or "N/A"
    fi_annual_expenses_used: float
    swr_percentage_used: float
    details: FIDetails

# Model for the request body - only UserFIParameters are needed from the client
class FIRequestData(BaseModel):
    user_fi_parameters: UserFIParameters 