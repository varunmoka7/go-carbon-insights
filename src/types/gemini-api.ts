// Placeholder for Gemini-specific API request/response types.
// This will be populated as we build the API service.

export interface GeminiApiRequest {
  prompt: string;
  // other Gemini-specific parameters
}

export interface GeminiApiResponse {
  // structure of the response from our secure backend function
  extractedText: string;
  // other relevant data
}