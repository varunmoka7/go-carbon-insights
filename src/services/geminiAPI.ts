import type { GeminiApiRequest, GeminiApiResponse } from " @/types/gemini-api";

/**
 * Processes a request through our secure backend proxy to the Gemini API.
 *
 * @param request - The request payload for the Gemini API.
 * @returns A promise that resolves with the API response.
 * @throws An error if the API call fails.
 */
export const callGeminiApi = async (
  request: GeminiApiRequest
): Promise<GeminiApiResponse> => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      // Try to parse a structured error from the backend, otherwise throw a generic error
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `API call failed with status ${response.status}: ${errorData?.error?.message || response.statusText}`
      );
    }

    return (await response.json()) as GeminiApiResponse;
  } catch (error) {
    console.error('Error calling Gemini API service:', error);
    // Re-throw the error to be handled by the calling function (e.g., in a React hook)
    throw error;
  }
};