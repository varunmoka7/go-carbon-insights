import { useQuery } from '@tanstack/react-query';
import { getCompanyById } from '@/data/companyMockData';
import { getRealisticClimateData } from '@/data/realisticClimateData';

interface ClimateMetrics {
  carbonIntensity: number;
  annualReduction: number;
  netZeroProgress: number;
  sbtiStatus: string;
  renewableEnergy: number;
  carbonCredits: number;
  temperatureAlignment: string;
  climateRiskScore: string;
  totalEmissions: number;
  avoidedEmissions: number;
  carbonOffset: number;
  energyEfficiency: number;
  supplyChainEmissions: number;
  carbonCostExposure: number;
  climateInvestment: number;
  averageROI: number;
  greenRevenue: number;
  scope3Coverage: number;
  supplierEngagement: number;
  industryBenchmark: {
    carbonIntensity: { value: number; status: 'above' | 'at' | 'below' };
    renewableEnergy: { value: number; status: 'above' | 'at' | 'below' };
    scope3Coverage: { value: number; status: 'above' | 'at' | 'below' };
    energyEfficiency: { value: number; status: 'above' | 'at' | 'below' };
    supplierEngagement: { value: number; status: 'above' | 'at' | 'below' };
  };
  alerts: {
    carbonIntensity: 'critical' | 'warning' | 'trending' | 'good';
    scope3Coverage: 'critical' | 'warning' | 'trending' | 'good';
    renewableEnergy: 'critical' | 'warning' | 'trending' | 'good';
    energyEfficiency: 'critical' | 'warning' | 'trending' | 'good';
    supplierEngagement: 'critical' | 'warning' | 'trending' | 'good';
  };
}

interface CarbonProject {
  id: string;
  name: string;
  type: string;
  status: string;
  impact: number;
  timeline: string;
  investment: number;
  annualReduction: number;
  paybackPeriod: number;
  roi: number;
  description: string;
}

interface PriorityAction {
  id: string;
  category: string;
  action: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  timeline: string;
  investment: string;
  roi: string;
  effort: "high" | "medium" | "low";
}

interface ClimateIntelligenceData {
  company: {
    id: string;
    name: string;
    sector: string;
    industry: string;
    netZeroTargetYear: number;
    sbtiStatus: string;
    renewableEnergyPercent: number;
    fleetElectrification: number;
    climateRiskScore: string;
  };
  climateMetrics: ClimateMetrics;
  carbonProjects: CarbonProject[];
  priorityActions: PriorityAction[];
}

export const useClimateIntelligence = (companyId: string) => {
  return useQuery({
    queryKey: ['climate-intelligence', companyId],
    queryFn: async (): Promise<ClimateIntelligenceData> => {
      const company = getCompanyById(companyId);
      
      if (!company) {
        throw new Error(`Company with id ${companyId} not found`);
      }

      // Get realistic climate data for this company
      const realisticData = getRealisticClimateData(companyId);

      return {
        company: {
          id: company.id,
          name: company.name,
          sector: company.sector,
          industry: company.industry,
          netZeroTargetYear: company.id === 'apple' ? 2030 : 
                            company.id === 'microsoft' ? 2030 :
                            company.id === 'tesla' ? 2040 :
                            company.id === 'exxonmobil' ? 2050 : 2040,
          sbtiStatus: realisticData.climateMetrics.sbtiStatus,
          renewableEnergyPercent: realisticData.climateMetrics.renewableEnergy,
          fleetElectrification: company.id === 'tesla' ? 68 : 40,
          climateRiskScore: realisticData.climateMetrics.climateRiskScore
        },
        climateMetrics: {
          carbonIntensity: realisticData.climateMetrics.carbonIntensity,
          annualReduction: 12.5, // Keep this as a calculated reduction rate
          netZeroProgress: realisticData.climateMetrics.netZeroProgress,
          sbtiStatus: realisticData.climateMetrics.sbtiStatus,
          renewableEnergy: realisticData.climateMetrics.renewableEnergy,
          carbonCredits: Math.round(realisticData.climateMetrics.totalEmissions * 0.02), // 2% as credits
          temperatureAlignment: realisticData.climateMetrics.temperatureAlignment,
          climateRiskScore: realisticData.climateMetrics.climateRiskScore,
          totalEmissions: realisticData.climateMetrics.totalEmissions,
          avoidedEmissions: realisticData.climateMetrics.avoidedEmissions,
          carbonOffset: Math.round(realisticData.climateMetrics.totalEmissions * 0.015), // 1.5% offset
          energyEfficiency: realisticData.climateMetrics.energyEfficiency,
          supplyChainEmissions: Math.round(realisticData.climateMetrics.totalEmissions * 0.7), // ~70% scope 3
          carbonCostExposure: realisticData.climateMetrics.carbonCostExposure,
          climateInvestment: realisticData.climateMetrics.climateInvestment,
          averageROI: realisticData.climateMetrics.averageROI,
          greenRevenue: realisticData.climateMetrics.greenRevenue,
          scope3Coverage: realisticData.climateMetrics.scope3Coverage,
          supplierEngagement: realisticData.climateMetrics.supplierEngagement,
          industryBenchmark: realisticData.climateMetrics.industryBenchmark,
          alerts: realisticData.climateMetrics.alerts
        },
        carbonProjects: realisticData.carbonProjects,
        priorityActions: realisticData.priorityActions
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
