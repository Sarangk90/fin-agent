import { UserFIParameters, FinancialIndependenceResult } from '../types/fiTypes';

// Consistent with other API calls in App.tsx, using the full direct URL.
// The backend FI router has a prefix /fi and the endpoint is /calculate-status.
const API_ENDPOINT = 'http://localhost:5001/fi/calculate-status';

export async function calculateFIStatus(
    params: UserFIParameters
): Promise<FinancialIndependenceResult> {
    const requestBody = {
        user_fi_parameters: params,
    };

    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        // Attempt to parse error response, provide a fallback message
        let errorDetail = 'Failed to calculate FI status.';
        try {
            const errorData = await response.json();
            errorDetail = errorData.detail || errorData.message || errorDetail;
        } catch (e) {
            // Ignore if error response is not JSON or empty
            errorDetail = response.statusText || errorDetail;
        }
        console.error('API Error:', response.status, errorDetail);
        throw new Error(errorDetail);
    }

    return response.json();
} 