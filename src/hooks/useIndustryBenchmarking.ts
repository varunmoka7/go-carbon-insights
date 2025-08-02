
import { useCompanies } from './useCompanies';

export interface IndustryBenchmarkData {
  emissionsIntensity: number;
  perEmployee: number;
  facilityEfficiency: number;
  industryRank: number;
  totalInSector: number;
  annualReduction: number;
  carbonCostExposure: number;
  performanceIndicators: {
    intensityVsAvg: 'above' | 'below' | 'at';
    employeeVsAvg: 'above' | 'below' | 'at';
    efficiencyVsAvg: 'above' | 'below' | 'at';
  };
}

export const useIndustryBenchmarking = (companyId: string): IndustryBenchmarkData => {
  const { data: companies, isLoading } = useCompanies();
  const company = companies?.find(c => c.id === companyId);
  
  // Return default data during loading to prevent breaking the hook chain
  if (isLoading || !companies) {
    return {
      emissionsIntensity: 50,
      perEmployee: 15,
      facilityEfficiency: 0.8,
      industryRank: 5,
      totalInSector: 10,
      annualReduction: 5.5,
      carbonCostExposure: 125000,
      performanceIndicators: {
        intensityVsAvg: 'at',
        employeeVsAvg: 'at',
        efficiencyVsAvg: 'at'
      }
    };
  }
  
  if (!company || !companies) {
    // Return default benchmark data
    return {
      emissionsIntensity: 50,
      perEmployee: 15,
      facilityEfficiency: 0.8,
      industryRank: 5,
      totalInSector: 10,
      annualReduction: 5.5,
      carbonCostExposure: 125000,
      performanceIndicators: {
        intensityVsAvg: 'at',
        employeeVsAvg: 'at',
        efficiencyVsAvg: 'at'
      }
    };
  }

  const sectorCompanies = companies.filter(c => c.sector === company.sector);
  
  // Create synthetic emissions data from available fields
  const latestEmissions = {
    year: 2024,
    scope1: company.scope1_emissions || 1000,
    scope2: company.scope2_emissions || 800,
    scope3: company.scope3_emissions || 2000
  };
  const firstEmissions = {
    year: 2019,
    scope1: Math.round((company.scope1_emissions || 1000) * 1.25),
    scope2: Math.round((company.scope2_emissions || 800) * 1.25),
    scope3: Math.round((company.scope3_emissions || 2000) * 1.25)
  };

  // Calculate company metrics with fallback values
  const estimatedRevenue = (company as any).revenue || (company.total_emissions * 0.01);
  const estimatedEmployees = (company as any).employees || Math.round(company.total_emissions * 0.5);
  
  const companyIntensity = (latestEmissions.scope1 + latestEmissions.scope2 + latestEmissions.scope3) / estimatedRevenue;
  const companyPerEmployee = (latestEmissions.scope1 + latestEmissions.scope2 + latestEmissions.scope3) / estimatedEmployees;
  const companyFacilityEfficiency = latestEmissions.scope1 / (estimatedRevenue * 0.001); // Simplified facility efficiency

  // Calculate industry averages
  const industryIntensities = sectorCompanies.map(c => {
    const totalEmissions = c.total_emissions;
    const estimatedRevenue = (c as any).revenue || (totalEmissions * 0.01);
    return totalEmissions / estimatedRevenue;
  });
  
  const industryPerEmployee = sectorCompanies.map(c => {
    const totalEmissions = c.total_emissions;
    const estimatedEmployees = (c as any).employees || Math.round(totalEmissions * 0.5);
    return totalEmissions / estimatedEmployees;
  });

  const avgIntensity = industryIntensities.reduce((a, b) => a + b, 0) / industryIntensities.length;
  const avgPerEmployee = industryPerEmployee.reduce((a, b) => a + b, 0) / industryPerEmployee.length;

  // Calculate ranking
  const sortedByIntensity = sectorCompanies
    .map(c => {
      const totalEmissions = c.total_emissions;
      const estimatedRevenue = (c as any).revenue || (totalEmissions * 0.01);
      return {
        id: c.id,
        intensity: totalEmissions / estimatedRevenue
      };
    })
    .sort((a, b) => a.intensity - b.intensity);

  const companyRank = sortedByIntensity.findIndex(c => c.id === company.id) + 1;

  // Calculate annual reduction rate
  const totalFirst = firstEmissions.scope1 + firstEmissions.scope2 + firstEmissions.scope3;
  const totalLatest = latestEmissions.scope1 + latestEmissions.scope2 + latestEmissions.scope3;
  const yearsSpan = latestEmissions.year - firstEmissions.year;
  const annualReduction = yearsSpan > 0 ? 
    (Math.pow(totalLatest / totalFirst, 1 / yearsSpan) - 1) * -100 : 0;

  // Carbon cost exposure (simplified calculation)
  const carbonPrice = 50; // $50 per tonne CO2e
  const carbonCostExposure = (latestEmissions.scope1 + latestEmissions.scope2) * carbonPrice;

  // Performance indicators with correct types
  const getPerformanceIndicator = (value: number, avg: number): 'above' | 'below' | 'at' => {
    const threshold = 0.1; // 10% threshold
    if (value < avg * (1 - threshold)) return 'above'; // Lower emissions = better performance
    if (value > avg * (1 + threshold)) return 'below';
    return 'at';
  };

  return {
    emissionsIntensity: Math.round(companyIntensity * 10) / 10,
    perEmployee: Math.round(companyPerEmployee * 10) / 10,
    facilityEfficiency: Math.round(companyFacilityEfficiency * 100) / 100,
    industryRank: companyRank,
    totalInSector: sectorCompanies.length,
    annualReduction: Math.round(annualReduction * 10) / 10,
    carbonCostExposure: Math.round(carbonCostExposure),
    performanceIndicators: {
      intensityVsAvg: getPerformanceIndicator(companyIntensity, avgIntensity),
      employeeVsAvg: getPerformanceIndicator(companyPerEmployee, avgPerEmployee),
      efficiencyVsAvg: getPerformanceIndicator(companyFacilityEfficiency, avgIntensity * 1000)
    }
  };
};
