import { useState } from 'react';
import { processEsgReport } from '@/services/geminiAPI';
import type { ESGExtractionResponse } from '@/types/gemini-api';
import type { ESGExtractionRequest as ApiRequest } from '@/types/gemini-api';

export const useESGExtraction = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ESGExtractionResponse | null>(null);

  /**
   * Function to initiate the ESG extraction process.
   * It takes a structured request and calls the secure backend service.
   */
  const performExtraction = async (request: ApiRequest) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await processEsgReport(request);
      setData(result);
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