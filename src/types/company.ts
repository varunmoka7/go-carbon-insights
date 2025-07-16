export interface Company {
  id: string;
  name: string;
  sector: string; // Unified sector property (coalesces sector || industry)
  industry?: string; // Optional industry for backward compatibility
  description?: string;
  headquarters?: string;
  employees?: number;
  revenue?: number; // in billions USD
  marketCap?: number; // in billions USD
  totalEmissions: number; // Unified emissions property (coalesces total_emissions || carbon_footprint || 0)
  emissionsIntensity?: number; // tCO2e per million USD revenue
  carbonFootprint?: number; // Legacy property for backward compatibility
  energyConsumption?: number; // MWh
  wasteGenerated?: number; // tons
  renewableEnergyPercentage?: number;
  waterUsage?: number; // million gallons
  sustainabilityRating?: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
  sbtiCommitted?: boolean;
  netZeroTarget?: number | null; // target year
  lastUpdated?: string;
  
  // Additional properties for enhanced functionality
  topCarbonFootprints?: string[];
  sbtiProgress?: number;
  frameworks?: Array<{
    name: string;
    status: 'Implemented' | 'In Progress' | 'Planned' | 'Not Started';
    score?: string;
  }>;
  
  // Emissions data
  emissionsData?: Array<{
    year: number;
    scope1: number;
    scope2: number;
    scope3: number;
  }>;
  
  // SBTI targets
  sbtiTargets?: {
    nearTermTarget: string;
    longTermTarget: string;
    baselineYear: number;
    targetYear: number;
    validationStatus: string;
    scope1Reduction: number;
    scope3Reduction: number;
  };
}

// Type guard to check if an object is a Company
export function isCompany(obj: any): obj is Company {
  return obj && 
         typeof obj.id === 'string' && 
         typeof obj.name === 'string' && 
         typeof obj.sector === 'string' && 
         typeof obj.totalEmissions === 'number';
}

// Utility function to normalize company data from various sources
export function normalizeCompanyData(rawData: any): Company {
  return {
    id: rawData.id || '',
    name: rawData.name || '',
    sector: rawData.sector || rawData.industry || 'Unknown',
    industry: rawData.industry,
    description: rawData.description,
    headquarters: rawData.headquarters,
    employees: rawData.employees,
    revenue: rawData.revenue,
    marketCap: rawData.market_cap || rawData.marketCap,
    totalEmissions: rawData.total_emissions || rawData.totalEmissions || rawData.carbon_footprint || rawData.carbonFootprint || 0,
    emissionsIntensity: rawData.emissions_intensity || rawData.emissionsIntensity,
    carbonFootprint: rawData.carbon_footprint || rawData.carbonFootprint,
    energyConsumption: rawData.energy_consumption || rawData.energyConsumption,
    wasteGenerated: rawData.waste_generated || rawData.wasteGenerated,
    renewableEnergyPercentage: rawData.renewable_energy_percentage || rawData.renewableEnergyPercentage,
    waterUsage: rawData.water_usage || rawData.waterUsage,
    sustainabilityRating: rawData.sustainability_rating || rawData.sustainabilityRating,
    sbtiCommitted: rawData.sbti_committed || rawData.sbtiCommitted,
    netZeroTarget: rawData.net_zero_target || rawData.netZeroTarget,
    lastUpdated: rawData.last_updated || rawData.lastUpdated || rawData.updated_at,
    topCarbonFootprints: rawData.top_carbon_footprints || rawData.topCarbonFootprints,
    sbtiProgress: rawData.sbti_progress || rawData.sbtiProgress,
    frameworks: rawData.frameworks,
    emissionsData: rawData.emissionsData,
    sbtiTargets: rawData.sbtiTargets,
  };
} 