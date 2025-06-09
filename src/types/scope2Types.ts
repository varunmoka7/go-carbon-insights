export interface EnhancedScope2Data {
  // Existing data structure
  trendData: Array<{
    year: number;
    emissions: number;
    marketBased: number;
    locationBased: number;
  }>;
  sourceData: Array<{
    source: string;
    emissions: number;
  }>;
  locationData: Array<{
    location: string;
    emissions: number;
    percentage: string;
    renewablePercent: string;
  }>;
  sourceDataByYear: Record<string, any[]>;
  locationDataByYear: Record<string, any[]>;
  
  // New enhanced KPIs
  energyKPIs: {
    gridCarbonIntensity: {
      value: number;
      unit: string;
      status: 'good' | 'average' | 'poor';
      industryAvg: number;
    };
    renewableEnergyPercent: {
      value: number;
      target: number;
      status: 'good' | 'average' | 'poor';
    };
    energyIntensity: {
      value: number;
      unit: string;
      rank: number;
      total: number;
    };
    industryRank: {
      position: number;
      total: number;
      sector: string;
    };
    annualReduction: {
      value: number;
      target: number;
      status: 'good' | 'average' | 'poor';
    };
    carbonCostExposure: {
      value: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
  };
  
  // Enhanced benchmarking
  benchmarking: {
    efficiencyRank: number;
    intensityPercentile: number;
    renewableRank: number;
    regionalRank: number;
  };
  
  // Regional intelligence
  regionalData: Array<{
    region: string;
    gridIntensity: number;
    gridStatus: 'good' | 'average' | 'poor';
    consumptionPercent: number;
    renewableProgress: number;
    opportunities: string[];
    achievements: string[];
  }>;
  
  // Enhanced insights
  insights: {
    highlights: string[];
    opportunities: Array<{
      title: string;
      impact: string;
      description: string;
    }>;
    marketLocationExplanation: {
      marketBased: string;
      locationBased: string;
      impact: string;
    };
  };
}
