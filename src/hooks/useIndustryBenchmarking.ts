
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
  const { data: companies } = useCompanies();
  const company = companies?.find(c => c.id === companyId);
  
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
  const latestEmissions = company.emissionsData[company.emissionsData.length - 1];
  const firstEmissions = company.emissionsData[0];

  // Calculate company metrics
  const companyIntensity = (latestEmissions.scope1 + latestEmissions.scope2 + latestEmissions.scope3) / company.revenue;
  const companyPerEmployee = (latestEmissions.scope1 + latestEmissions.scope2 + latestEmissions.scope3) / company.employees;
  const companyFacilityEfficiency = latestEmissions.scope1 / (company.revenue * 0.001); // Simplified facility efficiency

  // Calculate industry averages
  const industryIntensities = sectorCompanies.map(c => {
    const latest = c.emissionsData[c.emissionsData.length - 1];
    return (latest.scope1 + latest.scope2 + latest.scope3) / c.revenue;
  });
  
  const industryPerEmployee = sectorCompanies.map(c => {
    const latest = c.emissionsData[c.emissionsData.length - 1];
    return (latest.scope1 + latest.scope2 + latest.scope3) / c.employees;
  });

  const avgIntensity = industryIntensities.reduce((a, b) => a + b, 0) / industryIntensities.length;
  const avgPerEmployee = industryPerEmployee.reduce((a, b) => a + b, 0) / industryPerEmployee.length;

  // Calculate ranking
  const sortedByIntensity = sectorCompanies
    .map(c => {
      const latest = c.emissionsData[c.emissionsData.length - 1];
      return {
        id: c.id,
        intensity: (latest.scope1 + latest.scope2 + latest.scope3) / c.revenue
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
