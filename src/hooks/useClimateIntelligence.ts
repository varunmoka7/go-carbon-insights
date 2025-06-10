
import { useQuery } from '@tanstack/react-query';
import { getCompanyById } from '@/data/companyMockData';

interface ClimateMetrics {
  carbonIntensity: number;
  annualReduction: number;
  netZeroProgress: number;
  sbtiStatus: string;
  renewableEnergy: number;
  carbonCredits: number;
}

interface CarbonProject {
  id: string;
  name: string;
  type: string;
  status: string;
  impact: number;
  timeline: string;
  investment: number;
}

interface PriorityAction {
  category: string;
  action: string;
  impact: string;
  timeline: string;
  investment: string;
  roi: string;
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
            investment: 25000000
          },
          {
            id: '2',
            name: 'Supply Chain Decarbonization',
            type: 'Supply Chain',
            status: 'Planning',
            impact: Math.round(totalCurrent * 0.25),
            timeline: '2025-2030',
            investment: 45000000
          },
          {
            id: '3',
            name: 'Carbon Removal Technologies',
            type: 'Removal',
            status: 'Research',
            impact: Math.round(totalCurrent * 0.08),
            timeline: '2026-2035',
            investment: 15000000
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
            investment: 30000000
          });
        } else if (company.sector === 'Automotive') {
          baseProjects.push({
            id: '4',
            name: 'Electric Vehicle Platform',
            type: 'Product',
            status: 'In Progress',
            impact: Math.round(totalCurrent * 0.20),
            timeline: '2024-2028',
            investment: 75000000
          });
        } else if (company.sector === 'Energy') {
          baseProjects.push({
            id: '4',
            name: 'Carbon Capture & Storage',
            type: 'Technology',
            status: 'Planning',
            impact: Math.round(totalCurrent * 0.30),
            timeline: '2025-2035',
            investment: 120000000
          });
        }

        return baseProjects;
      };

      // Generate priority actions based on company characteristics
      const generatePriorityActions = (): PriorityAction[] => {
        return [
          {
            category: 'Energy',
            action: 'Accelerate renewable energy procurement',
            impact: 'High',
            timeline: '1-2 years',
            investment: '$10-25M',
            roi: '4-6 years'
          },
          {
            category: 'Operations',
            action: 'Implement energy efficiency measures',
            impact: 'Medium',
            timeline: '6-18 months',
            investment: '$5-15M',
            roi: '2-4 years'
          },
          {
            category: 'Supply Chain',
            action: 'Engage top suppliers on emission targets',
            impact: 'Very High',
            timeline: '2-3 years',
            investment: '$20-50M',
            roi: '5-8 years'
          },
          {
            category: 'Technology',
            action: 'Invest in low-carbon alternatives',
            impact: 'High',
            timeline: '3-5 years',
            investment: '$30-100M',
            roi: '6-10 years'
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
          carbonCredits: Math.round(totalCurrent * 0.05) // 5% of emissions as credits
        },
        carbonProjects: generateCarbonProjects(),
        priorityActions: generatePriorityActions()
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
