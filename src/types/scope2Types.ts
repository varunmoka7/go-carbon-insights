
export interface EnhancedScope2Data {
  company: {
    id: string;
    name: string;
    sector: string;
    industry: string;
    renewableEnergyPercent: number;
    energyIntensity: number;
    totalEnergyConsumption: number;
  };
  trendData: Array<{
    year: number;
    emissions: number;
    marketBased: number;
    locationBased: number;
    renewablePercent: number;
  }>;
  sourceData: Array<{
    source: string;
    emissions: number;
    percentage: string;
    costPerMWh: number;
    renewablePercent: string;
  }>;
  locationData: Array<{
    location: string;
    emissions: number;
    percentage: string;
    renewablePercent: string;
    gridIntensity: number;
  }>;
  sourceDataByYear: Record<string, any[]>;
  locationDataByYear: Record<string, any[]>;
  renewableTargets: {
    2025: number;
    2030: number;
    2050: number;
  };
  efficiencyData: Array<{
    year: number;
    energyIntensity: number;
    improvementRate: number;
  }>;
  energyKPIs: {
    gridCarbonIntensity: {
      value: number;
      unit: string;
      industryAvg: number;
      status: string;
    };
    renewableEnergyPercent: {
      value: number;
      status: string;
      target: number;
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
      status: string;
    };
    carbonCostExposure: {
      value: number;
      trend: string;
    };
  };
  benchmarking: {
    efficiencyRank: number;
    intensityPercentile: number;
    renewableRank: number;
    regionalRank: number;
  };
  regionalData: Array<{
    region: string;
    gridIntensity: number;
    renewablePercent: number;
    emissions: number;
    efficiency: string;
    opportunities: string[];
  }>;
  insights: {
    keyFindings: string[];
    opportunities: Array<{
      title: string;
      impact: string;
      description: string;
    }>;
    challenges: string[];
    marketLocationExplanation: {
      marketBased: string;
      locationBased: string;
      impact: string;
    };
    highlights: string[];
  };
}
