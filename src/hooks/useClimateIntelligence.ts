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
  scope3Coverage: number;
  energyEfficiency: number;
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
  investment: number;
  annualReduction: number;
  paybackPeriod: number;
  roi: number;
  description: string;
}

interface CompanyClimateData {
  revenueMillions: number;
  renewableEnergyPercent: number;
  energyEfficiencyImprovement: number;
  fleetElectrification: number;
  sbtiStatus: string;
  netZeroTargetYear: number;
  climateRiskScore: string;
  scope3CoveragePercent: number;
  supplierEngagementPercent: number;
}

interface PriorityAction {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  category: string;
}

export const useClimateIntelligence = (companyId: string) => {
  const { data: companies } = useCompanies();
  
  return useQuery({
    queryKey: ['climate-intelligence', companyId],
    queryFn: () => {
      console.log('Generating climate intelligence for company:', companyId);
      
      // Comprehensive strategic climate data for existing + 5 new companies
      const strategicClimateData: Record<string, CompanyClimateData> = {
        // ... keep existing code (existing companies data)
        apple: {
          revenueMillions: 394300,
          renewableEnergyPercent: 100,
          energyEfficiencyImprovement: 35,
          fleetElectrification: 85,
          sbtiStatus: 'approved',
          netZeroTargetYear: 2030,
          climateRiskScore: 'low',
          scope3CoveragePercent: 95,
          supplierEngagementPercent: 88
        },
        microsoft: {
          revenueMillions: 211900,
          renewableEnergyPercent: 85,
          energyEfficiencyImprovement: 40,
          fleetElectrification: 70,
          sbtiStatus: 'approved',
          netZeroTargetYear: 2030,
          climateRiskScore: 'low',
          scope3CoveragePercent: 90,
          supplierEngagementPercent: 82
        },
        google: {
          revenueMillions: 307400,
          renewableEnergyPercent: 75,
          energyEfficiencyImprovement: 30,
          fleetElectrification: 60,
          sbtiStatus: 'committed',
          netZeroTargetYear: 2030,
          climateRiskScore: 'medium',
          scope3CoveragePercent: 85,
          supplierEngagementPercent: 76
        },
        tesla: {
          revenueMillions: 96800,
          renewableEnergyPercent: 95,
          energyEfficiencyImprovement: 45,
          fleetElectrification: 100,
          sbtiStatus: 'approved',
          netZeroTargetYear: 2025,
          climateRiskScore: 'low',
          scope3CoveragePercent: 88,
          supplierEngagementPercent: 92
        },
        amazon: {
          revenueMillions: 513900,
          renewableEnergyPercent: 65,
          energyEfficiencyImprovement: 28,
          fleetElectrification: 80,
          sbtiStatus: 'committed',
          netZeroTargetYear: 2040,
          climateRiskScore: 'medium',
          scope3CoveragePercent: 75,
          supplierEngagementPercent: 68
        },
        meta: {
          revenueMillions: 118000,
          renewableEnergyPercent: 50,
          energyEfficiencyImprovement: 25,
          fleetElectrification: 40,
          sbtiStatus: 'not_set',
          netZeroTargetYear: 2035,
          climateRiskScore: 'high',
          scope3CoveragePercent: 45,
          supplierEngagementPercent: 42
        },
        bmw: {
          revenueMillions: 142600,
          renewableEnergyPercent: 60,
          energyEfficiencyImprovement: 32,
          fleetElectrification: 55,
          sbtiStatus: 'committed',
          netZeroTargetYear: 2030,
          climateRiskScore: 'medium',
          scope3CoveragePercent: 70,
          supplierEngagementPercent: 65
        },
        volkswagen: {
          revenueMillions: 295800,
          renewableEnergyPercent: 45,
          energyEfficiencyImprovement: 28,
          fleetElectrification: 45,
          sbtiStatus: 'committed',
          netZeroTargetYear: 2035,
          climateRiskScore: 'medium',
          scope3CoveragePercent: 68,
          supplierEngagementPercent: 58
        },
        toyota: {
          revenueMillions: 274500,
          renewableEnergyPercent: 70,
          energyEfficiencyImprovement: 38,
          fleetElectrification: 65,
          sbtiStatus: 'approved',
          netZeroTargetYear: 2035,
          climateRiskScore: 'low',
          scope3CoveragePercent: 80,
          supplierEngagementPercent: 72
        },
        samsung: {
          revenueMillions: 244200,
          renewableEnergyPercent: 55,
          energyEfficiencyImprovement: 30,
          fleetElectrification: 35,
          sbtiStatus: 'committed',
          netZeroTargetYear: 2030,
          climateRiskScore: 'medium',
          scope3CoveragePercent: 65,
          supplierEngagementPercent: 60
        },
        bp: {
          revenueMillions: 164200,
          renewableEnergyPercent: 40,
          energyEfficiencyImprovement: 35,
          fleetElectrification: 25,
          sbtiStatus: 'approved',
          netZeroTargetYear: 2030,
          climateRiskScore: 'high',
          scope3CoveragePercent: 55,
          supplierEngagementPercent: 48
        },
        shell: {
          revenueMillions: 261500,
          renewableEnergyPercent: 35,
          energyEfficiencyImprovement: 30,
          fleetElectrification: 20,
          sbtiStatus: 'committed',
          netZeroTargetYear: 2050,
          climateRiskScore: 'high',
          scope3CoveragePercent: 50,
          supplierEngagementPercent: 45
        },
        nike: {
          revenueMillions: 51200,
          renewableEnergyPercent: 80,
          energyEfficiencyImprovement: 42,
          fleetElectrification: 90,
          sbtiStatus: 'approved',
          netZeroTargetYear: 2030,
          climateRiskScore: 'low',
          scope3CoveragePercent: 92,
          supplierEngagementPercent: 85
        },
        unilever: {
          revenueMillions: 64300,
          renewableEnergyPercent: 75,
          energyEfficiencyImprovement: 38,
          fleetElectrification: 65,
          sbtiStatus: 'committed',
          netZeroTargetYear: 2030,
          climateRiskScore: 'medium',
          scope3CoveragePercent: 88,
          supplierEngagementPercent: 78
        },
        nestle: {
          revenueMillions: 94400,
          renewableEnergyPercent: 65,
          energyEfficiencyImprovement: 35,
          fleetElectrification: 55,
          sbtiStatus: 'committed',
          netZeroTargetYear: 2050,
          climateRiskScore: 'medium',
          scope3CoveragePercent: 82,
          supplierEngagementPercent: 70
        },
        // New companies
        techcorp: {
          revenueMillions: 45000,
          renewableEnergyPercent: 95,
          energyEfficiencyImprovement: 48,
          fleetElectrification: 85,
          sbtiStatus: 'approved',
          netZeroTargetYear: 2028,
          climateRiskScore: 'low',
          scope3CoveragePercent: 90,
          supplierEngagementPercent: 88
        },
        manufacturingplus: {
          revenueMillions: 180000,
          renewableEnergyPercent: 55,
          energyEfficiencyImprovement: 25,
          fleetElectrification: 40,
          sbtiStatus: 'committed',
          netZeroTargetYear: 2035,
          climateRiskScore: 'medium',
          scope3CoveragePercent: 60,
          supplierEngagementPercent: 55
        },
        energytransition: {
          revenueMillions: 320000,
          renewableEnergyPercent: 60,
          energyEfficiencyImprovement: 30,
          fleetElectrification: 35,
          sbtiStatus: 'committed',
          netZeroTargetYear: 2040,
          climateRiskScore: 'high',
          scope3CoveragePercent: 65,
          supplierEngagementPercent: 52
        },
        consumergoods: {
          revenueMillions: 95000,
          renewableEnergyPercent: 78,
          energyEfficiencyImprovement: 35,
          fleetElectrification: 70,
          sbtiStatus: 'approved',
          netZeroTargetYear: 2032,
          climateRiskScore: 'low',
          scope3CoveragePercent: 90,
          supplierEngagementPercent: 82
        },
        healthcare: {
          revenueMillions: 72000,
          renewableEnergyPercent: 70,
          energyEfficiencyImprovement: 32,
          fleetElectrification: 60,
          sbtiStatus: 'committed',
          netZeroTargetYear: 2030,
          climateRiskScore: 'medium',
          scope3CoveragePercent: 75,
          supplierEngagementPercent: 68
        }
      };

      // Get climate data for the company or use default
      const data = strategicClimateData[companyId] || strategicClimateData.apple;
      
      // Get company info from existing data
      const company = companies?.find(c => c.id === companyId);
      const totalEmissions = company?.total_emissions || (() => {
        // Define emissions for new companies
        const newCompanyEmissions: Record<string, number> = {
          techcorp: 25000,
          manufacturingplus: 250000,
          energytransition: 500000,
          consumergoods: 120000,
          healthcare: 85000
        };
        return newCompanyEmissions[companyId] || 3500;
      })();
      
      console.log('Company data found:', company);
      console.log('Total emissions:', totalEmissions);

      // Calculate industry benchmarks by sector
      const getIndustryBenchmarks = (sector: string) => {
        const sectorAverages: Record<string, any> = {
          technology: { carbonIntensity: 12, renewableEnergy: 78, scope3Coverage: 85, energyEfficiency: 38, supplierEngagement: 75 },
          automotive: { carbonIntensity: 45, renewableEnergy: 58, scope3Coverage: 72, energyEfficiency: 32, supplierEngagement: 65 },
          energy: { carbonIntensity: 180, renewableEnergy: 48, scope3Coverage: 58, energyEfficiency: 28, supplierEngagement: 50 },
          manufacturing: { carbonIntensity: 85, renewableEnergy: 52, scope3Coverage: 65, energyEfficiency: 30, supplierEngagement: 58 },
          consumer: { carbonIntensity: 35, renewableEnergy: 65, scope3Coverage: 80, energyEfficiency: 35, supplierEngagement: 72 },
          healthcare: { carbonIntensity: 25, renewableEnergy: 62, scope3Coverage: 70, energyEfficiency: 30, supplierEngagement: 65 }
        };
        
        return sectorAverages[sector.toLowerCase()] || sectorAverages.technology;
      };

      const sectorName = company?.sector?.toLowerCase() || 'technology';
      const industryAvg = getIndustryBenchmarks(sectorName);
      const carbonIntensity = Math.round((totalEmissions / data.revenueMillions) * 1000000);

      // Calculate climate metrics with enhanced data
      const climateMetrics: ClimateMetrics = {
        temperatureAlignment: data.netZeroTargetYear <= 2030 ? '1.5°C Aligned' : '2°C Pathway',
        netZeroProgress: Math.min(95, ((2050 - data.netZeroTargetYear) / (2050 - 2020)) * 100),
        sbtiStatus: data.sbtiStatus,
        climateRiskScore: data.climateRiskScore,
        totalEmissions,
        carbonIntensity,
        renewableEnergy: data.renewableEnergyPercent,
        avoidedEmissions: Math.round(totalEmissions * (data.energyEfficiencyImprovement / 100)),
        carbonCostExposure: Math.round(totalEmissions * 85), // $85/tCO2e
        climateInvestment: Math.round(data.revenueMillions * 0.02), // 2% of revenue
        averageROI: 12.5,
        greenRevenue: Math.round(data.revenueMillions * 0.15), // 15% green revenue
        scope3Coverage: data.scope3CoveragePercent,
        energyEfficiency: data.energyEfficiencyImprovement,
        supplierEngagement: data.supplierEngagementPercent,
        industryBenchmark: {
          carbonIntensity: {
            value: industryAvg.carbonIntensity,
            status: carbonIntensity < industryAvg.carbonIntensity ? 'below' : carbonIntensity > industryAvg.carbonIntensity * 1.1 ? 'above' : 'at'
          },
          renewableEnergy: {
            value: industryAvg.renewableEnergy,
            status: data.renewableEnergyPercent > industryAvg.renewableEnergy ? 'above' : data.renewableEnergyPercent < industryAvg.renewableEnergy * 0.9 ? 'below' : 'at'
          },
          scope3Coverage: {
            value: industryAvg.scope3Coverage,
            status: data.scope3CoveragePercent > industryAvg.scope3Coverage ? 'above' : data.scope3CoveragePercent < industryAvg.scope3Coverage * 0.9 ? 'below' : 'at'
          },
          energyEfficiency: {
            value: industryAvg.energyEfficiency,
            status: data.energyEfficiencyImprovement > industryAvg.energyEfficiency ? 'above' : data.energyEfficiencyImprovement < industryAvg.energyEfficiency * 0.8 ? 'below' : 'at'
          },
          supplierEngagement: {
            value: industryAvg.supplierEngagement,
            status: data.supplierEngagementPercent > industryAvg.supplierEngagement ? 'above' : data.supplierEngagementPercent < industryAvg.supplierEngagement * 0.9 ? 'below' : 'at'
          }
        },
        alerts: {
          carbonIntensity: carbonIntensity > industryAvg.carbonIntensity * 1.2 ? 'critical' : carbonIntensity > industryAvg.carbonIntensity * 1.1 ? 'warning' : 'good',
          scope3Coverage: data.scope3CoveragePercent < 60 ? 'critical' : data.scope3CoveragePercent < 75 ? 'warning' : 'good',
          renewableEnergy: data.renewableEnergyPercent < 40 ? 'critical' : data.renewableEnergyPercent < 60 ? 'warning' : 'good',
          energyEfficiency: data.energyEfficiencyImprovement < 20 ? 'critical' : data.energyEfficiencyImprovement < 30 ? 'warning' : 'good',
          supplierEngagement: data.supplierEngagementPercent < 50 ? 'critical' : data.supplierEngagementPercent < 70 ? 'warning' : 'good'
        }
      };

      // Generate priority actions based on performance gaps
      const generatePriorityActions = (metrics: ClimateMetrics, data: CompanyClimateData): PriorityAction[] => {
        const actions: PriorityAction[] = [];

        if (metrics.alerts.carbonIntensity !== 'good') {
          actions.push({
            id: '1',
            title: 'Reduce Carbon Intensity',
            description: `Current intensity is ${metrics.carbonIntensity} tCO2e/$M vs industry avg of ${metrics.industryBenchmark.carbonIntensity.value}. Focus on energy efficiency and renewable transition.`,
            impact: 'high',
            effort: 'medium',
            category: 'Emissions'
          });
        }

        if (metrics.alerts.scope3Coverage !== 'good') {
          actions.push({
            id: '2',
            title: 'Expand Scope 3 Measurement',
            description: `Only ${metrics.scope3Coverage}% of supply chain emissions tracked. Target 85%+ coverage for comprehensive climate strategy.`,
            impact: 'high',
            effort: 'high',
            category: 'Supply Chain'
          });
        }

        if (metrics.alerts.supplierEngagement !== 'good') {
          actions.push({
            id: '3',
            title: 'Accelerate Supplier Engagement',
            description: `${metrics.supplierEngagement}% suppliers engaged vs 75%+ target. Implement supplier climate requirements and incentives.`,
            impact: 'medium',
            effort: 'medium',
            category: 'Partnerships'
          });
        }

        return actions.slice(0, 3); // Return top 3 actions
      };

      // Generate sector-appropriate carbon projects
      const generateCarbonProjects = (companyId: string, data: CompanyClimateData): CarbonProject[] => {
        const baseProjects = [
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

        // Add sector-specific projects
        if (['bp', 'shell', 'energytransition'].includes(companyId)) {
          baseProjects.push({
            id: '4',
            name: 'Carbon Capture & Storage',
            type: 'carbon_capture',
            status: 'planned',
            investment: Math.round(data.revenueMillions * 0.015),
            annualReduction: Math.round(totalEmissions * 0.20),
            paybackPeriod: 15.0,
            roi: 8.5,
            description: 'Industrial-scale carbon capture from operations'
          });
        }

        if (['tesla', 'bmw', 'volkswagen', 'toyota'].includes(companyId)) {
          baseProjects.push({
            id: '4',
            name: 'Battery Technology Innovation',
            type: 'innovation',
            status: 'active',
            investment: Math.round(data.revenueMillions * 0.012),
            annualReduction: Math.round(totalEmissions * 0.18),
            paybackPeriod: 7.5,
            roi: 16.2,
            description: 'Advanced battery technology for electric vehicles'
          });
        }

        if (['techcorp', 'apple', 'microsoft', 'google'].includes(companyId)) {
          baseProjects.push({
            id: '4',
            name: 'Data Center Optimization',
            type: 'efficiency',
            status: 'active',
            investment: Math.round(data.revenueMillions * 0.010),
            annualReduction: Math.round(totalEmissions * 0.22),
            paybackPeriod: 6.2,
            roi: 15.8,
            description: 'AI-powered cooling and server efficiency improvements'
          });
        }

        return baseProjects;
      };

      const carbonProjects = generateCarbonProjects(companyId, data);
      const priorityActions = generatePriorityActions(climateMetrics, data);

      const result = {
        climateMetrics,
        carbonProjects,
        priorityActions,
        company: {
          ...company,
          ...data
        }
      };

      console.log('Generated climate intelligence:', result);
      return result;
    },
    enabled: true, // Always enabled to ensure data is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (updated from cacheTime)
  });
};
