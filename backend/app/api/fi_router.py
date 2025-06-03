from fastapi import APIRouter, HTTPException, Depends

from ..services.fi_service import FIService
from ..models.fi_models import FIRequestData, FinancialIndependenceResult, UserFIParameters
from ..dependencies import get_fi_service

router = APIRouter(
    prefix="/fi", # All routes in this router will start with /fi
    tags=["Financial Independence"], # Tag for API documentation
)

@router.post("/calculate-status", response_model=FinancialIndependenceResult)
async def calculate_financial_independence_status(
    request_data: FIRequestData,
    fi_service: FIService = Depends(get_fi_service)
) -> FinancialIndependenceResult:
    """
    Calculates the Financial Independence (FI) status and related financial metrics.

    This endpoint takes user-defined FI parameters and uses existing backend data
    for assets and liabilities to perform the calculations.
    """
    try:
        if not isinstance(request_data.user_fi_parameters, UserFIParameters):
            # This check might be redundant if Pydantic validation is effective,
            # but can be a safeguard.
            raise HTTPException(status_code=422, detail="Invalid user_fi_parameters structure.")

        result = await fi_service.calculate_fi_details(user_fi_parameters=request_data.user_fi_parameters)
        return result
    except HTTPException as http_exc: # Re-raise HTTPExceptions from service or here
        raise http_exc
    except Exception as e:
        # Log the exception e here for debugging purposes
        # print(f"Error during FI calculation: {e}") 
        raise HTTPException(status_code=500, detail=f"An internal server error occurred during FI calculation: {str(e)}")

@router.get("/summary")
async def get_fi_summary(
    fi_service: FIService = Depends(get_fi_service)
):
    """
    Get a summary of current financial status including net worth and basic FI metrics.
    """
    try:
        # Get basic financial summary without requiring user FI parameters
        summary = await fi_service.get_financial_summary()
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting financial summary: {str(e)}")

# Example of how to add more FI related endpoints in the future:
# @router.get("/parameters-schema", response_model=UserFIParameters)
# async def get_fi_parameters_schema():
#     """Returns the schema for User FI Parameters."""
#     return UserFIParameters.model_json_schema()
