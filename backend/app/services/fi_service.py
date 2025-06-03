from typing import List

from ..models.fi_models import UserFIParameters, FinancialIndependenceResult, FIDetails
from ..models.asset_models import AssetOut
from ..models.liability_models import LiabilityOut
from ..services.asset_service import AssetService
from ..services.liability_service import LiabilityService
from ..config import get_settings

settings = get_settings()

class FIService:
    """Service for Financial Independence calculations."""
    
    def __init__(self, asset_service: AssetService, liability_service: LiabilityService):
        self.asset_service = asset_service
        self.liability_service = liability_service
    
    def _calculate_required_fi_corpus(self, fi_annual_expenses: float, swr: float) -> float:
        """Calculate the required FI corpus based on annual expenses and SWR."""
        return float('inf') if swr <= 0 else fi_annual_expenses / swr
    
    def _calculate_total_asset_value(self, assets: List[AssetOut]) -> float:
        """Calculate total value of all assets."""
        return sum(asset.valueINR for asset in assets)
    
    def _calculate_total_liabilities_value(self, liabilities: List[LiabilityOut]) -> float:
        """Calculate total outstanding amount of all liabilities."""
        return sum(liability.outstandingAmountINR for liability in liabilities)
    
    def _calculate_fi_status(self, net_fi_corpus_available: float, required_fi_corpus: float) -> tuple[bool, float]:
        """Calculate FI status and ratio percentage."""
        if required_fi_corpus > 0:
            is_fi = net_fi_corpus_available >= required_fi_corpus
            ratio = max(0.0, (net_fi_corpus_available / required_fi_corpus) * 100)
        elif required_fi_corpus == 0:
            is_fi = net_fi_corpus_available >= 0
            ratio = 100.0 if is_fi else 0.0
        else:  # required_fi_corpus is float('inf')
            is_fi = False
            ratio = 0.0
        
        return is_fi, ratio

    async def calculate_fi_details(self, user_fi_parameters: UserFIParameters) -> FinancialIndependenceResult:
        """Calculates Financial Independence status and related metrics."""
        # Extract parameters
        fi_annual_expenses = user_fi_parameters.desired_annual_fi_expenses
        swr_percentage = user_fi_parameters.swr_percentage
        swr = swr_percentage / 100.0
        emergency_fund_to_exclude = user_fi_parameters.emergency_fund_to_exclude
        primary_residence_equity_to_exclude = user_fi_parameters.primary_residence_equity_to_exclude

        # Calculate required FI corpus
        required_fi_corpus = self._calculate_required_fi_corpus(fi_annual_expenses, swr)

        # Fetch data from services
        assets = await self.asset_service.get_all_assets()
        liabilities = await self.liability_service.get_all_liabilities()

        # Calculate net investable assets
        total_asset_value = self._calculate_total_asset_value(assets)
        total_liabilities_value = self._calculate_total_liabilities_value(liabilities)
        
        net_investable_assets = (
            total_asset_value - 
            emergency_fund_to_exclude - 
            primary_residence_equity_to_exclude - 
            total_liabilities_value
        )

        # Calculate net FI corpus available (using configured goals placeholder)
        net_fi_corpus_available = net_investable_assets - settings.DEFAULT_GOALS_PLACEHOLDER

        # Determine FI status
        is_financially_independent, fi_ratio_percentage = self._calculate_fi_status(
            net_fi_corpus_available, required_fi_corpus
        )

        # Build result
        result_details = FIDetails(
            net_investable_assets=round(net_investable_assets, 2),
            total_current_cost_of_goals_to_set_aside=round(settings.DEFAULT_GOALS_PLACEHOLDER, 2)
        )

        return FinancialIndependenceResult(
            is_financially_independent=is_financially_independent,
            fi_ratio_percentage=round(fi_ratio_percentage, 2),
            net_fi_corpus_available=round(net_fi_corpus_available, 2),
            required_fi_corpus=round(required_fi_corpus, 2) if required_fi_corpus != float('inf') else "N/A",
            fi_annual_expenses_used=round(fi_annual_expenses, 2),
            swr_percentage_used=swr_percentage,
            details=result_details
        )
