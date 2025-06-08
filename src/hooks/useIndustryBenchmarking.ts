
import { useMemo } from 'react';
import { getCompanyById } from '@/data/enhancedMockData';

interface IndustryBenchmark {
  sector: string;
  totalCompanies: number;
  avgEmissionsIntensity: number;
  medianEmissionsIntensity: number;
  avgPerEmployee: number;
  avgFacilityEfficiency: number;
  avgReduction: number;
  carbonCostRange: { min: number; max: number };
}

interface CompanyBenchmarkData {
  emissionsIntensity: number;
  perEmployee: number;
  facilityEfficiency: number;
  industryRank: number;
  totalInSector: number;
  annualReduction: number;
  carbonCostExposure: number;
  performanceIndicators: {
    intensityVsAvg: 'above' | 'at' | 'below';
    employeeVsAvg: 'above' | 'at' | 'below';
    efficiencyVsAvg: 'above' | 'at' | 'below';
  };
}

const industryBenchmarks: Record<string, IndustryBenchmark> = {
  'Technology': {
    sector: 'Technology',
    totalCompanies: 45,
    avgEmissionsIntensity: 11.5,
    medianEmissionsIntensity: 10.2,
    avgPerEmployee: 5.2,
    avgFacilityEfficiency: 0.8,
    avgReduction: 8.5,
    carbonCostRange: { min: 150, max: 450 }
  },
  'Manufacturing': {
    sector: 'Manufacturing',
    totalCompanies: 78,
    avgEmissionsIntensity: 47.5,
    medianEmissionsIntensity: 45.2,
    avgPerEmployee: 20.1,
    avgFacilityEfficiency: 2.1,
    avgReduction: 6.2,
    carbonCostRange: { min: 800, max: 2500 }
  },
  'Energy': {
    sector: 'Energy',
    totalCompanies: 32,
    avgEmissionsIntensity: 1200.5,
    medianEmissionsIntensity: 1150.0,
    avgPerEmployee: 85.4,
    avgFacilityEfficiency: 12.5,
    avgReduction: 3.8,
    carbonCostRange: { min: 15000, max: 85000 }
  },
  'Retail': {
    sector: 'Retail',
    totalCompanies: 52,
    avgEmissionsIntensity: 24.3,
    medianEmissionsIntensity: 22.8,
    avgPerEmployee: 11.2,
    avgFacilityEfficiency: 1.4,
    avgReduction: 7.1,
    carbonCostRange: { min: 400, max: 1200 }
  },
  'Consumer Goods': {
    sector: 'Consumer Goods',
    totalCompanies: 38,
    avgEmissionsIntensity: 165.8,
    medianEmissionsIntensity: 158.2,
    avgPerEmployee: 15.6,
    avgFacilityEfficiency: 1.8,
    avgReduction: 5.9,
    carbonCostRange: { min: 600, max: 1800 }
  },
  'Aerospace': {
    sector: 'Aerospace',
    totalCompanies: 28,
    avgEmissionsIntensity: 385.2,
    medianEmissionsIntensity: 370.8,
    avgPerEmployee: 28.5,
    avgFacilityEfficiency: 3.2,
    avgReduction: 4.5,
    carbonCostRange: { min: 2500, max: 8500 }
  }
};

export const useIndustryBenchmarking = (companyId: string): CompanyBenchmarkData | null => {
  return useMemo(() => {
    const company = getCompanyById(companyId);
    if (!company) return null;

    const benchmark = industryBenchmarks[company.sector];
    if (!benchmark) return null;

    // Calculate company-specific metrics
    const emissionsIntensity = company.emissionsIntensity;
    const perEmployee = company.totalEmissions / (company.employees / 1000); // tCO2e per employee
    const facilityEfficiency = company.totalEmissions / (company.revenue * 100); // tCO2e per sq ft estimate
    
    // Calculate industry rank (based on emissions intensity performance)
    const rankPosition = Math.floor(
      (emissionsIntensity / benchmark.avgEmissionsIntensity) * benchmark.totalCompanies * 0.6 +
      Math.random() * benchmark.totalCompanies * 0.4
    );
    const industryRank = Math.max(1, Math.min(benchmark.totalCompanies, rankPosition));

    // Calculate annual reduction based on historical data
    const recentEmissions = company.emissionsData.slice(-2);
    const annualReduction = recentEmissions.length >= 2 
      ? ((recentEmissions[0].scope1 + recentEmissions[0].scope2 + recentEmissions[0].scope3 - 
          recentEmissions[1].scope1 - recentEmissions[1].scope2 - recentEmissions[1].scope3) /
         (recentEmissions[0].scope1 + recentEmissions[0].scope2 + recentEmissions[0].scope3)) * 100
      : 0;

    // Calculate carbon cost exposure
    const carbonCostExposure = Math.floor(
      company.totalEmissions * (benchmark.carbonCostRange.min + 
      Math.random() * (benchmark.carbonCostRange.max - benchmark.carbonCostRange.min)) / 1000
    );

    // Performance indicators
    const performanceIndicators = {
      intensityVsAvg: emissionsIntensity < benchmark.avgEmissionsIntensity * 0.9 ? 'above' as const :
                     emissionsIntensity > benchmark.avgEmissionsIntensity * 1.1 ? 'below' as const : 'at' as const,
      employeeVsAvg: perEmployee < benchmark.avgPerEmployee * 0.9 ? 'above' as const :
                    perEmployee > benchmark.avgPerEmployee * 1.1 ? 'below' as const : 'at' as const,
      efficiencyVsAvg: facilityEfficiency < benchmark.avgFacilityEfficiency * 0.9 ? 'above' as const :
                      facilityEfficiency > benchmark.avgFacilityEfficiency * 1.1 ? 'below' as const : 'at' as const,
    };

    return {
      emissionsIntensity: Math.round(emissionsIntensity * 10) / 10,
      perEmployee: Math.round(perEmployee * 10) / 10,
      facilityEfficiency: Math.round(facilityEfficiency * 100) / 100,
      industryRank,
      totalInSector: benchmark.totalCompanies,
      annualReduction: Math.round(Math.abs(annualReduction) * 10) / 10,
      carbonCostExposure,
      performanceIndicators
    };
  }, [companyId]);
};
