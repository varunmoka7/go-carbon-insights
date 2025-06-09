
import { EnhancedScope2Data } from '@/types/scope2Types';
import { getIndustryMultiplier } from './scope2IndustryConfig';

interface Company {
  id: string;
  name: string;
  industry: string;
  emissionsData: Array<{
    year: number;
    scope2: number;
  }>;
}

export const generateScope2MockData = (company: Company): EnhancedScope2Data => {
  const latestScope2 = company.emissionsData[company.emissionsData.length - 1]?.scope2 || 20000;
  
  // Simple company-specific variations using company ID hash
  const companyHash = company.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const seed = companyHash % 100;
  
  // Base values with company-specific variations
  const baseGridIntensity = 450 + (seed * 2);
  const baseRenewablePercent = 60 + (seed % 30);
  const baseEnergyIntensity = 15 + (seed % 20);
  const baseRank = Math.max(1, (seed % 50) + 1);
  const baseReduction = 5 + (seed % 8);
  const baseCostExposure = 2000000 + (seed * 50000);
  
  // Apply industry multipliers
  const multiplier = getIndustryMultiplier(company.industry);
  
  const gridIntensity = Math.round(baseGridIntensity * multiplier.grid);
  const renewablePercent = Math.min(95, Math.round(baseRenewablePercent * multiplier.renewable));
  const energyIntensity = Math.round((baseEnergyIntensity * multiplier.intensity) * 100) / 100;
  const costExposure = Math.round(baseCostExposure * multiplier.cost);
  
  // Generate trend data
  const trendData = company.emissionsData.map(item => ({
    year: item.year,
    emissions: item.scope2,
    marketBased: item.scope2,
    locationBased: Math.round(item.scope2 * 1.15)
  }));

  // Source data distribution
  const sourceData = [
    { source: 'Purchased Electricity', emissions: Math.round(latestScope2 * 0.7) },
    { source: 'Steam & Heating', emissions: Math.round(latestScope2 * 0.2) },
    { source: 'Cooling', emissions: Math.round(latestScope2 * 0.1) }
  ];

  // Location data
  const locationData = [
    { 
      location: 'North America', 
      emissions: Math.round(latestScope2 * 0.45), 
      percentage: '45%', 
      renewablePercent: `${Math.max(30, renewablePercent - 5)}%` 
    },
    { 
      location: 'Europe', 
      emissions: Math.round(latestScope2 * 0.30), 
      percentage: '30%', 
      renewablePercent: `${Math.min(95, renewablePercent + 15)}%` 
    },
    { 
      location: 'Asia Pacific', 
      emissions: Math.round(latestScope2 * 0.25), 
      percentage: '25%', 
      renewablePercent: `${Math.max(25, renewablePercent - 20)}%` 
    }
  ];

  const totalCompanies = 45;
  const sectorName = company.industry.toLowerCase() + ' companies';

  return {
    trendData,
    sourceData,
    locationData,
    sourceDataByYear: {},
    locationDataByYear: {},
    energyKPIs: {
      gridCarbonIntensity: {
        value: gridIntensity,
        unit: 'kg CO2/MWh',
        status: gridIntensity < 450 ? 'good' : gridIntensity < 550 ? 'average' : 'poor',
        industryAvg: 500
      },
      renewableEnergyPercent: {
        value: renewablePercent,
        target: Math.min(100, renewablePercent + 20),
        status: renewablePercent > 70 ? 'good' : renewablePercent > 50 ? 'average' : 'poor'
      },
      energyIntensity: {
        value: energyIntensity,
        unit: 'MWh per $M revenue',
        rank: baseRank,
        total: totalCompanies
      },
      industryRank: {
        position: baseRank,
        total: totalCompanies,
        sector: sectorName
      },
      annualReduction: {
        value: baseReduction,
        target: 10,
        status: baseReduction > 8 ? 'good' : baseReduction > 5 ? 'average' : 'poor'
      },
      carbonCostExposure: {
        value: costExposure,
        trend: ['increasing', 'decreasing', 'stable'][seed % 3] as 'increasing' | 'decreasing' | 'stable'
      }
    },
    benchmarking: {
      efficiencyRank: Math.floor((seed * 1.2) % totalCompanies) + 1,
      intensityPercentile: Math.floor((seed * 0.8) % 100) + 1,
      renewableRank: Math.floor((seed * 1.5) % totalCompanies) + 1,
      regionalRank: Math.floor((seed * 0.6) % 20) + 1
    },
    regionalData: [
      {
        region: 'North America',
        gridIntensity: Math.round(gridIntensity * 1.05),
        gridStatus: gridIntensity * 1.05 < 450 ? 'good' : gridIntensity * 1.05 < 550 ? 'average' : 'poor',
        consumptionPercent: 45,
        renewableProgress: Math.max(30, renewablePercent - 5),
        opportunities: ['Expand solar procurement', 'Join regional renewable cooperatives'],
        achievements: ['Achieved renewable energy targets', 'Reduced grid dependency by 15%']
      },
      {
        region: 'Europe',
        gridIntensity: Math.round(gridIntensity * 0.65),
        gridStatus: 'good' as const,
        consumptionPercent: 30,
        renewableProgress: Math.min(95, renewablePercent + 15),
        opportunities: ['Leverage EU green policies', 'Expand wind energy partnerships'],
        achievements: ['Leading regional renewable adoption', '25% above EU standards']
      },
      {
        region: 'Asia Pacific',
        gridIntensity: Math.round(gridIntensity * 1.25),
        gridStatus: gridIntensity * 1.25 < 500 ? 'average' : 'poor',
        consumptionPercent: 25,
        renewableProgress: Math.max(25, renewablePercent - 20),
        opportunities: ['Invest in regional solar projects', 'Partner with clean energy providers'],
        achievements: ['Established renewable energy office', 'Reduced emissions intensity by 12%']
      }
    ],
    insights: {
      highlights: [
        `${renewablePercent}% renewable energy achievement`,
        'Leading edge energy efficiency',
        'Carbon-neutral operations in key regions',
        'Sustainable energy procurement strategy',
        'Energy management optimization'
      ],
      opportunities: [
        { title: 'Expand renewable procurement', impact: '15% reduction potential', description: 'Increase clean energy purchases across all facilities' },
        { title: 'Energy efficiency optimization', impact: '12% improvement', description: 'Implement advanced energy management systems' },
        { title: 'Regional grid optimization', impact: '8% efficiency gain', description: 'Optimize energy usage based on regional grid characteristics' },
        { title: 'Supply chain engagement', impact: '10% value chain impact', description: 'Collaborate with suppliers on renewable energy adoption' }
      ],
      marketLocationExplanation: {
        marketBased: `Reflects your renewable energy purchases - ${Math.round(((trendData[trendData.length - 1].locationBased - trendData[trendData.length - 1].marketBased) / trendData[trendData.length - 1].locationBased * 100))}% lower due to clean energy choices`,
        locationBased: `Based on regional grid averages - shows baseline without renewable procurement`,
        impact: `Clean energy impact: ${Math.round((trendData[trendData.length - 1].locationBased - trendData[trendData.length - 1].marketBased))} tCO2e avoided annually`
      }
    }
  };
};
