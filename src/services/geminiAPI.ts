import type { ESGExtractionResponse, ESGExtractionRequest as ApiRequest } from '@/types/gemini-api';

/**
 * Calls the secure backend proxy to process an ESG extraction request.
 *
 * @param request - The ESG extraction request payload.
 * @returns A promise that resolves with the structured ESG extraction response.
 * @throws An error if the API call fails or returns a non-ok status.
 */
export const processEsgReport = async (
  request: ApiRequest
): Promise<ESGExtractionResponse> => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      // Attempt to get more detailed error info from the response body
      const errorBody = await response.json().catch(() => ({
        message: 'An unknown API error occurred.',
      }));
      
      console.error('API Error:', errorBody);
      throw new Error(
        `API request failed with status ${response.status}: ${errorBody.message || response.statusText}`
      );
    }

    return (await response.json()) as ESGExtractionResponse;

  } catch (error) {
    console.error('Failed to process ESG report:', error);
    // Re-throw for the UI layer to handle
    throw error;
  }
};