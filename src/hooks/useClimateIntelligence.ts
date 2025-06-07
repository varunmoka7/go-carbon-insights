
import { useQuery } from '@tanstack/react-query';
import { useCompanies } from './useCompanies';

interface ClimateMetrics {
  temperatureAlignment: string;
  netZeroProgress: number;
  sbtiStatus: string;
  climateRiskScore: string;
  totalEmissions: number;
  carbonIntensity: number;
  renewableEnergy: number;
  avoidedEmissions: number;
  carbonCostExposure: number;
  climateInvestment: number;
  averageROI: number;
  greenRevenue: number;
}

interface CarbonProject {
  id: string;
  name: string;
  type: string;
  status: string;
  investment: number;
  annualReduction: number;
  paybackPeriod: number;
  roi: number;
  description: string;
}

export const useClimateIntelligence = (companyId: string) => {
  const { data: companies } = useCompanies();
  
  return useQuery({
    queryKey: ['climate-intelligence', companyId],
    queryFn: () => {
      const company = companies?.find(c => c.id === companyId);
      if (!company) return null;

      // Enhanced strategic climate data based on company
      const strategicData = {
        apple: {
          revenueMillions: 394300,
          renewableEnergyPercent: 100,
          energyEfficiencyImprovement: 35,
          fleetElectrification: 85,
          sbtiStatus: 'approved',
          netZeroTargetYear: 2030,
          climateRiskScore: 'low'
        },
        microsoft: {
          revenueMillions: 211900,
          renewableEnergyPercent: 85,
          energyEfficiencyImprovement: 40,
          fleetElectrification: 70,
          sbtiStatus: 'approved',
          netZeroTargetYear: 2030,
          climateRiskScore: 'low'
        },
        tesla: {
          revenueMillions: 96800,
          renewableEnergyPercent: 95,
          energyEfficiencyImprovement: 45,
          fleetElectrification: 100,
          sbtiStatus: 'approved',
          netZeroTargetYear: 2025,
          climateRiskScore: 'low'
        },
        default: {
          revenueMillions: 150000,
          renewableEnergyPercent: 65,
          energyEfficiencyImprovement: 30,
          fleetElectrification: 50,
          sbtiStatus: 'committed',
          netZeroTargetYear: 2035,
          climateRiskScore: 'medium'
        }
      };

      const data = strategicData[companyId as keyof typeof strategicData] || strategicData.default;
      const totalEmissions = company.total_emissions || 3500;
      
      const climateMetrics: ClimateMetrics = {
        temperatureAlignment: data.netZeroTargetYear <= 2030 ? '1.5°C Aligned' : '2°C Pathway',
        netZeroProgress: Math.min(95, ((2050 - data.netZeroTargetYear) / (2050 - 2020)) * 100),
        sbtiStatus: data.sbtiStatus,
        climateRiskScore: data.climateRiskScore,
        totalEmissions,
        carbonIntensity: Math.round((totalEmissions / data.revenueMillions) * 1000000),
        renewableEnergy: data.renewableEnergyPercent,
        avoidedEmissions: Math.round(totalEmissions * (data.energyEfficiencyImprovement / 100)),
        carbonCostExposure: Math.round(totalEmissions * 85), // $85/tCO2e
        climateInvestment: Math.round(data.revenueMillions * 0.02), // 2% of revenue
        averageROI: 12.5,
        greenRevenue: Math.round(data.revenueMillions * 0.15) // 15% green revenue
      };

      // Carbon projects based on company
      const carbonProjects: CarbonProject[] = [
        {
          id: '1',
          name: 'Renewable Energy Transition',
          type: 'renewable_energy',
          status: 'active',
          investment: Math.round(data.revenueMillions * 0.008),
          annualReduction: Math.round(totalEmissions * 0.25),
          paybackPeriod: 8.5,
          roi: 14.2,
          description: 'Solar and wind power installations across facilities'
        },
        {
          id: '2',
          name: 'Energy Efficiency Program',
          type: 'energy_efficiency',
          status: 'completed',
          investment: Math.round(data.revenueMillions * 0.003),
          annualReduction: Math.round(totalEmissions * 0.15),
          paybackPeriod: 5.2,
          roi: 18.7,
          description: 'LED lighting, smart HVAC, and building automation'
        },
        {
          id: '3',
          name: 'Fleet Electrification',
          type: 'electrification',
          status: 'planned',
          investment: Math.round(data.revenueMillions * 0.005),
          annualReduction: Math.round(totalEmissions * 0.10),
          paybackPeriod: 6.8,
          roi: 12.3,
          description: 'Electric vehicle adoption and charging infrastructure'
        }
      ];

      return {
        climateMetrics,
        carbonProjects,
        company: {
          ...company,
          ...data
        }
      };
    },
    enabled: !!companies && !!companyId,
  });
};
