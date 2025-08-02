import { useState } from 'react';
import { callGeminiApi } from '@/services/geminiAPI';
import type { ESGExtractionResult } from '@/types/esg-extraction';
import type { GeminiApiRequest } from '@/types/gemini-api';

export const useESGExtraction = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ESGExtractionResult | null>(null);

  /**
   * Function to initiate the ESG extraction process.
   * It takes a prompt and calls the underlying Gemini API service.
   */
  const performExtraction = async (request: GeminiApiRequest) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      // In a later story, this request will be built from the uploaded file content and user options.
      const result = await callGeminiApi(request);
      
      // For now, we just log the result. Data mapping will happen in a future story.
      console.log('Extraction API call successful:', result);
      
      // This is a placeholder. We will map the GeminiApiResponse to our ESGExtractionResult type later.
      const formattedResult: ESGExtractionResult = {
        extractionId: new Date().toISOString(), // Placeholder
        status: 'completed', // Placeholder
        confidence: 0.95, // Placeholder
        extractedMetrics: result, // Placeholder
      };

      setData(formattedResult);

    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred during extraction.'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    data,
    performExtraction,
  };
};