
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
  insights: {
    keyFindings: string[];
    opportunities: string[];
    challenges: string[];
  };
}
