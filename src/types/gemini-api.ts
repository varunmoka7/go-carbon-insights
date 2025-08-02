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

export interface ESGExtractionRequest {
  documentText: string;
  fileContent?: string; // Add the missing property from the test  
  fileType?: string; // Add the missing property from the test
  extractorType?: string; // Add the missing property from the test - alias for extractionType
  extractionType: 'emissions' | 'goals' | 'strategies' | 'compliance';
  companyId?: string;
}

export interface ESGExtractionResponse {
  success: boolean;
  data: {
    emissions?: {
      scope1?: number;
      scope2?: number;
      scope3?: number;
      year?: number;
    };
    goals?: Array<{
      target: string;
      year: number;
      status: string;
    }>;
    strategies?: Array<{
      name: string;
      description: string;
      timeline: string;
    }>;
    compliance?: Array<{
      framework: string;
      status: string;
      lastReported: string;
    }>;
  };
  error?: string;
}