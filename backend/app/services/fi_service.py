from typing import List, Dict, Any

from ..models.fi_models import UserFIParameters, FinancialIndependenceResult, FIDetails
from ..models.asset_models import AssetOut
from ..models.liability_models import LiabilityOut
from ..services import asset_service, liability_service

async def calculate_fi_details(user_fi_parameters: UserFIParameters) -> FinancialIndependenceResult:
    """Calculates Financial Independence status and related metrics.
    Fetches asset and liability data from their respective services.
    Goals are currently handled as a static placeholder value.
    """

    # Step 1: Initialize Parameters from user_fi_parameters
    fi_annual_expenses = user_fi_parameters.desired_annual_fi_expenses
    swr_percentage = user_fi_parameters.swr_percentage
    swr = swr_percentage / 100.0
    emergency_fund_to_exclude = user_fi_parameters.emergency_fund_to_exclude
    primary_residence_equity_to_exclude = user_fi_parameters.primary_residence_equity_to_exclude
    fp_asset_classes_for_investable = user_fi_parameters.fp_asset_classes_for_investable

    # Step 2: Calculate required_fi_corpus
    if swr <= 0:
        required_fi_corpus = float('inf')
    else:
        required_fi_corpus = fi_annual_expenses / swr

    # Fetch data from services
    assets_data_models: List[AssetOut] = await asset_service.get_assets_service()
    liabilities_data_models: List[LiabilityOut] = await liability_service.get_liabilities_service()
    
    # goals_data: For now, this is a placeholder. The logic below for
    # total_current_cost_of_goals_to_set_aside uses a static value if goals_data is effectively empty.
    # Once goal_service is implemented, it would be fetched here:
    # goals_data_models: List[GoalOut] = await goal_service.get_goals_service()

    # Step 3: Calculate net_investable_assets
    total_investable_asset_value = 0.0
    for asset in assets_data_models:
        # if asset.fpAssetClass in fp_asset_classes_for_investable:
        total_investable_asset_value += asset.valueINR

    net_investable_assets_before_liabilities = (
        total_investable_asset_value - 
        emergency_fund_to_exclude - 
        primary_residence_equity_to_exclude
    )
    
    total_liabilities_value = 0.0
    for liability in liabilities_data_models:
        total_liabilities_value += liability.outstandingAmountINR # Adjusted to use outstandingAmountINR
        
    net_investable_assets = net_investable_assets_before_liabilities - total_liabilities_value

    # Step 4: Calculate total_current_cost_of_goals_to_set_aside
    # Using a static present value of 50 lac (5,000,000) as goals_data is not fetched from a service yet.
    # This logic assumes that if actual goals_data were to be processed (e.g., from a future goal_service),
    # an empty list from such a service would trigger the static value, or it would be processed if populated.
    
    # current_goals_data_for_processing = [] # This would be populated if goals_data_models was fetched
    total_current_cost_of_goals_to_set_aside = 0.0
    
    # Simulating the logic from the original function where it checks if goals_data is empty.
    # Since we are not fetching goals yet, this condition will effectively be true for the static value.
    # If current_goals_data_for_processing were populated, the else block would run.
    if not []: # Effectively, if no goals are actively processed from a service yet
        total_current_cost_of_goals_to_set_aside = 102863884.0
    # else:
    #     for goal in current_goals_data_for_processing: # This part is for future goal integration
    #         if goal.get('isEssentialForFI', True) is False: # Assuming GoalOut model would have these fields
    #             continue
    #         goal_pv_provided = goal.get('currentCost', 0.0) 
    #         total_current_cost_of_goals_to_set_aside += goal_pv_provided

    # Step 5: Calculate net_fi_corpus_available
    net_fi_corpus_available = net_investable_assets - total_current_cost_of_goals_to_set_aside

    # Step 6: Determine FI Status and fi_ratio_percentage
    is_financially_independent = False
    fi_ratio_percentage = 0.0

    if required_fi_corpus > 0:
        is_financially_independent = (net_fi_corpus_available >= required_fi_corpus)
        fi_ratio_percentage = (net_fi_corpus_available / required_fi_corpus) * 100
        if fi_ratio_percentage < 0:
            fi_ratio_percentage = 0.0
    elif required_fi_corpus == 0: 
        if net_fi_corpus_available >= 0:
            fi_ratio_percentage = 100.0
            is_financially_independent = True
        else:
            fi_ratio_percentage = 0.0
            is_financially_independent = False
    else: # required_fi_corpus is float('inf')
        fi_ratio_percentage = 0.0
        is_financially_independent = False

    result_details = FIDetails(
        net_investable_assets=round(net_investable_assets, 2),
        total_current_cost_of_goals_to_set_aside=round(total_current_cost_of_goals_to_set_aside, 2)
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