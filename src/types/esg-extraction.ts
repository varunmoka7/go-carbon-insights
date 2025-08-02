// Core ESG Extraction Types from Epic 13 Technical Architecture
export interface ESGExtractionRequest {
  fileId: string;
  fileName: string;
  fileType: 'pdf' | 'txt' | 'csv' | 'md';
  organizationId: string;
  extractorType: 'standard' | 'banking' | 'apparel' | 'waste' | 'carbon_levers';
  processingOptions: {
    includeScope3: boolean;
    extractTargets: boolean;
    extractPolicies: boolean;
    benchmarkMode: boolean;
  };
}

export interface ESGExtractionResult {
  extractionId: string;
  status: 'processing' | 'completed' | 'failed';
  confidence: number;
  extractedMetrics: {
    emissions: any; // Using 'any' as placeholder from epic, will be refined
    targets: any[];
    policies: any[];
    financialMetrics: any;
  };
  benchmarkData?: any; // Using 'any' as placeholder from epic
  errors?: any[]; // Using 'any' as placeholder from epic
}