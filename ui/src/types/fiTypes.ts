// Corresponds to Pydantic UserFIParameters
export interface UserFIParameters {
    desired_annual_fi_expenses: number;
    swr_percentage: number;
    emergency_fund_to_exclude?: number; // Optional, defaults to 0 on backend
    primary_residence_equity_to_exclude?: number; // Optional, defaults to 0 on backend
    fp_asset_classes_for_investable?: string[]; // Optional, defaults on backend
}

// Corresponds to Pydantic FIDetails
export interface FIDetails {
    net_investable_assets: number;
    total_current_cost_of_goals_to_set_aside: number;
}

// Corresponds to Pydantic FinancialIndependenceResult
export interface FinancialIndependenceResult {
    is_financially_independent: boolean;
    fi_ratio_percentage: number;
    net_fi_corpus_available: number;
    required_fi_corpus: number | string; // Can be number or "N/A"
    fi_annual_expenses_used: number;
    swr_percentage_used: number;
    details: FIDetails;
} 