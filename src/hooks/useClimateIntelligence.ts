
import { useQuery } from '@tanstack/react-query';
import { getCompanyById } from '@/data/companyMockData';

interface ClimateMetrics {
  carbonIntensity: number;
  annualReduction: number;
  netZeroProgress: number;
  sbtiStatus: string;
  renewableEnergy: number;
  carbonCredits: number;
  temperatureAlignment: number;
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
  industryBenchmark: string;
  alerts: string[];
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

      const latestEmissions = company.emissionsData[company.emissionsData.length - 1];
      const firstEmissions = company.emissionsData[0];
      const totalCurrent = latestEmissions.scope1 + latestEmissions.scope2 + latestEmissions.scope3;
      const totalFirst = firstEmissions.scope1 + firstEmissions.scope2 + firstEmissions.scope3;

      // Calculate metrics based on company data
      const annualReduction = ((totalFirst - totalCurrent) / totalFirst) * 100;
      const carbonIntensity = totalCurrent / company.revenue;

      // Generate sector-specific net zero targets and SBTi status
      const getSectorSpecificData = () => {
        switch (company.sector) {
          case 'Technology':
            return {
              netZeroTarget: 2030,
              sbtiStatus: 'approved',
              renewablePercent: company.renewable_energy_percentage,
              fleetElectrification: 65,
              climateRisk: 'Medium'
            };
          case 'Automotive':
            return {
              netZeroTarget: 2040,
              sbtiStatus: 'committed',
              renewablePercent: company.renewable_energy_percentage,
              fleetElectrification: 45,
              climateRisk: 'High'
            };
          case 'Energy':
            return {
              netZeroTarget: 2050,
              sbtiStatus: 'under review',
              renewablePercent: company.renewable_energy_percentage,
              fleetElectrification: 25,
              climateRisk: 'Very High'
            };
          case 'Consumer':
            return {
              netZeroTarget: 2040,
              sbtiStatus: 'approved',
              renewablePercent: company.renewable_energy_percentage,
              fleetElectrification: 35,
              climateRisk: 'Medium'
            };
          case 'Healthcare':
            return {
              netZeroTarget: 2045,
              sbtiStatus: 'committed',
              renewablePercent: company.renewable_energy_percentage,
              fleetElectrification: 40,
              climateRisk: 'Medium'
            };
          default:
            return {
              netZeroTarget: 2050,
              sbtiStatus: 'committed',
              renewablePercent: company.renewable_energy_percentage,
              fleetElectrification: 30,
              climateRisk: 'Medium'
            };
        }
      };

      const sectorData = getSectorSpecificData();

      // Calculate net zero progress
      const currentYear = 2024;
      const targetYear = sectorData.netZeroTarget;
      const baselineYear = 2019;
      const yearsSinceBaseline = currentYear - baselineYear;
      const totalYearsToTarget = targetYear - baselineYear;
      const emissionProgress = Math.max(0, annualReduction);
      const timeProgress = (yearsSinceBaseline / totalYearsToTarget) * 100;
      const netZeroProgress = Math.min(100, (emissionProgress + timeProgress) / 2);

      // Generate carbon projects based on company sector
      const generateCarbonProjects = (): CarbonProject[] => {
        const baseProjects = [
          {
            id: '1',
            name: 'Renewable Energy Transition',
            type: 'Energy',
            status: 'In Progress',
            impact: Math.round(totalCurrent * 0.15),
            timeline: '2024-2027',
            investment: 25000000,
            annualReduction: 12,
            paybackPeriod: 5.2,
            roi: 18.5,
            description: 'Comprehensive transition to renewable energy sources across all facilities'
          },
          {
            id: '2',
            name: 'Supply Chain Decarbonization',
            type: 'Supply Chain',
            status: 'Planning',
            impact: Math.round(totalCurrent * 0.25),
            timeline: '2025-2030',
            investment: 45000000,
            annualReduction: 20,
            paybackPeriod: 7.8,
            roi: 15.2,
            description: 'Comprehensive supplier engagement and decarbonization program'
          },
          {
            id: '3',
            name: 'Carbon Removal Technologies',
            type: 'Removal',
            status: 'Research',
            impact: Math.round(totalCurrent * 0.08),
            timeline: '2026-2035',
            investment: 15000000,
            annualReduction: 8,
            paybackPeriod: 12.5,
            roi: 8.7,
            description: 'Investment in direct air capture and nature-based solutions'
          }
        ];

        // Add sector-specific projects
        if (company.sector === 'Technology') {
          baseProjects.push({
            id: '4',
            name: 'Green Data Centers',
            type: 'Efficiency',
            status: 'In Progress',
            impact: Math.round(totalCurrent * 0.12),
            timeline: '2024-2026',
            investment: 30000000,
            annualReduction: 15,
            paybackPeriod: 4.2,
            roi: 22.1,
            description: 'Energy-efficient cooling and renewable-powered data center infrastructure'
          });
        } else if (company.sector === 'Automotive') {
          baseProjects.push({
            id: '4',
            name: 'Electric Vehicle Platform',
            type: 'Product',
            status: 'In Progress',
            impact: Math.round(totalCurrent * 0.20),
            timeline: '2024-2028',
            investment: 75000000,
            annualReduction: 25,
            paybackPeriod: 6.5,
            roi: 16.8,
            description: 'Development of next-generation electric vehicle manufacturing capabilities'
          });
        } else if (company.sector === 'Energy') {
          baseProjects.push({
            id: '4',
            name: 'Carbon Capture & Storage',
            type: 'Technology',
            status: 'Planning',
            impact: Math.round(totalCurrent * 0.30),
            timeline: '2025-2035',
            investment: 120000000,
            annualReduction: 35,
            paybackPeriod: 15.2,
            roi: 12.4,
            description: 'Large-scale carbon capture, utilization, and storage infrastructure'
          });
        }

        return baseProjects;
      };

      // Generate priority actions based on company characteristics
      const generatePriorityActions = (): PriorityAction[] => {
        return [
          {
            id: '1',
            category: 'Energy',
            action: 'Accelerate renewable energy procurement',
            title: 'Renewable Energy Acceleration',
            description: 'Fast-track renewable energy procurement through PPAs and on-site generation',
            impact: 'high',
            timeline: '1-2 years',
            investment: '$10-25M',
            roi: '4-6 years',
            effort: 'medium'
          },
          {
            id: '2',
            category: 'Operations',
            action: 'Implement energy efficiency measures',
            title: 'Energy Efficiency Program',
            description: 'Comprehensive energy efficiency improvements across facilities and operations',
            impact: 'medium',
            timeline: '6-18 months',
            investment: '$5-15M',
            roi: '2-4 years',
            effort: 'low'
          },
          {
            id: '3',
            category: 'Supply Chain',
            action: 'Engage top suppliers on emission targets',
            title: 'Supplier Engagement Initiative',
            description: 'Strategic supplier engagement program to reduce scope 3 emissions',
            impact: 'high',
            timeline: '2-3 years',
            investment: '$20-50M',
            roi: '5-8 years',
            effort: 'high'
          },
          {
            id: '4',
            category: 'Technology',
            action: 'Invest in low-carbon alternatives',
            title: 'Low-Carbon Technology Investment',
            description: 'R&D investment in breakthrough low-carbon technologies and processes',
            impact: 'high',
            timeline: '3-5 years',
            investment: '$30-100M',
            roi: '6-10 years',
            effort: 'high'
          }
        ];
      };

      return {
        company: {
          id: company.id,
          name: company.name,
          sector: company.sector,
          industry: company.industry,
          netZeroTargetYear: sectorData.netZeroTarget,
          sbtiStatus: sectorData.sbtiStatus,
          renewableEnergyPercent: sectorData.renewablePercent,
          fleetElectrification: sectorData.fleetElectrification,
          climateRiskScore: sectorData.climateRisk
        },
        climateMetrics: {
          carbonIntensity: Math.round(carbonIntensity * 10) / 10,
          annualReduction: Math.round(annualReduction * 10) / 10,
          netZeroProgress: Math.round(netZeroProgress),
          sbtiStatus: sectorData.sbtiStatus,
          renewableEnergy: sectorData.renewablePercent,
          carbonCredits: Math.round(totalCurrent * 0.05), // 5% of emissions as credits
          temperatureAlignment: 1.8,
          climateRiskScore: sectorData.climateRisk,
          totalEmissions: totalCurrent,
          avoidedEmissions: Math.round(totalFirst - totalCurrent),
          carbonOffset: Math.round(totalCurrent * 0.03),
          energyEfficiency: 85,
          supplyChainEmissions: latestEmissions.scope3,
          carbonCostExposure: Math.round(totalCurrent * 50), // $50 per tonne
          climateInvestment: Math.round(company.revenue * 0.02), // 2% of revenue
          averageROI: 15.2,
          greenRevenue: Math.round(company.revenue * 0.35), // 35% green revenue
          scope3Coverage: 85,
          supplierEngagement: 74,
          industryBenchmark: 'good',
          alerts: ['Renewable energy target achieved', 'Supply chain assessment pending']
        },
        carbonProjects: generateCarbonProjects(),
        priorityActions: generatePriorityActions()
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
