
import { useEnhancedScope2Data } from '@/hooks/useEnhancedScope2Data';

// Mock data generator for Scope 2 emissions
export const generateScope2Data = () => {
  const regions = [
    {
      region: 'North America',
      gridIntensity: 400,
      renewablePercent: 25,
      emissions: 12500,
      efficiency: 'Good',
      opportunities: ['Solar PPA expansion', 'Energy storage'],
      gridStatus: 'stable',
      consumptionPercent: 35,
      renewableProgress: 78,
      achievements: ['ISO 50001 certified', 'Energy audit completed']
    },
    {
      region: 'Europe',
      gridIntensity: 280,
      renewablePercent: 45,
      emissions: 8200,
      efficiency: 'Excellent',
      opportunities: ['Wind energy contracts', 'Grid flexibility'],
      gridStatus: 'improving',
      consumptionPercent: 28,
      renewableProgress: 85,
      achievements: ['Green certificates obtained', 'Smart meter deployment']
    },
    {
      region: 'Asia Pacific',
      gridIntensity: 650,
      renewablePercent: 15,
      emissions: 18700,
      efficiency: 'Moderate',
      opportunities: ['Coal phase-out', 'Renewable certificates'],
      gridStatus: 'transitioning',
      consumptionPercent: 37,
      renewableProgress: 42,
      achievements: ['Energy management system', 'Efficiency targets met']
    }
  ];

  return {
    regions,
    totalEmissions: regions.reduce((sum, region) => sum + region.emissions, 0),
    averageIntensity: regions.reduce((sum, region) => sum + region.gridIntensity, 0) / regions.length,
    renewableShare: regions.reduce((sum, region) => sum + (region.renewablePercent * region.emissions), 0) / regions.reduce((sum, region) => sum + region.emissions, 0)
  };
};

export const getScope2Trends = () => {
  return [
    { month: 'Jan', emissions: 15400, renewable: 22 },
    { month: 'Feb', emissions: 14800, renewable: 24 },
    { month: 'Mar', emissions: 16200, renewable: 26 },
    { month: 'Apr', emissions: 15600, renewable: 28 },
    { month: 'May', emissions: 14200, renewable: 30 },
    { month: 'Jun', emissions: 13800, renewable: 32 }
  ];
};
