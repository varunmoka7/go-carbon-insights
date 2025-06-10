
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

// Company-specific data variations to ensure uniqueness
const companyVariations: Record<string, {
  gridIntensityBase: number;
  renewableBase: number;
  intensityBase: number;
  rankBase: number;
  reductionBase: number;
  costBase: number;
}> = {
  'techcorp': { gridIntensityBase: 420, renewableBase: 85, intensityBase: 12, rankBase: 3, reductionBase: 8.5, costBase: 2200000 },
  'apple': { gridIntensityBase: 380, renewableBase: 95, intensityBase: 8, rankBase: 1, reductionBase: 12, costBase: 1800000 },
  'microsoft': { gridIntensityBase: 410, renewableBase: 88, intensityBase: 10, rankBase: 2, reductionBase: 9.5, costBase: 2000000 },
  'alphabet': { gridIntensityBase: 390, renewableBase: 92, intensityBase: 9, rankBase: 2, reductionBase: 11, costBase: 1900000 },
  'tesla': { gridIntensityBase: 350, renewableBase: 78, intensityBase: 15, rankBase: 8, reductionBase: 7, costBase: 2500000 },
  'amazon': { gridIntensityBase: 450, renewableBase: 65, intensityBase: 18, rankBase: 12, reductionBase: 6, costBase: 3200000 },
  'meta': { gridIntensityBase: 425, renewableBase: 70, intensityBase: 11, rankBase: 7, reductionBase: 8, costBase: 2100000 },
  'samsung': { gridIntensityBase: 480, renewableBase: 55, intensityBase: 22, rankBase: 18, reductionBase: 5, costBase: 2800000 },
  'bmw': { gridIntensityBase: 520, renewableBase: 68, intensityBase: 28, rankBase: 8, reductionBase: 6.5, costBase: 3500000 },
  'volkswagen': { gridIntensityBase: 540, renewableBase: 62, intensityBase: 32, rankBase: 12, reductionBase: 5.5, costBase: 3800000 },
  'toyota': { gridIntensityBase: 510, renewableBase: 58, intensityBase: 30, rankBase: 10, reductionBase: 6, costBase: 3600000 },
  'bp': { gridIntensityBase: 480, renewableBase: 45, intensityBase: 25, rankBase: 15, reductionBase: 4, costBase: 4200000 },
  'shell': { gridIntensityBase: 500, renewableBase: 40, intensityBase: 28, rankBase: 18, reductionBase: 3.5, costBase: 4500000 },
  'energy-transition': { gridIntensityBase: 320, renewableBase: 85, intensityBase: 15, rankBase: 2, reductionBase: 15, costBase: 1500000 },
  'nike': { gridIntensityBase: 460, renewableBase: 72, intensityBase: 16, rankBase: 8, reductionBase: 7.5, costBase: 2400000 },
  'unilever': { gridIntensityBase: 440, renewableBase: 78, intensityBase: 14, rankBase: 5, reductionBase: 9, costBase: 2200000 },
  'nestle': { gridIntensityBase: 470, renewableBase: 65, intensityBase: 18, rankBase: 12, reductionBase: 6.5, costBase: 2600000 },
  'consumer-goods': { gridIntensityBase: 490, renewableBase: 58, intensityBase: 20, rankBase: 15, reductionBase: 5.5, costBase: 2800000 },
  'manufacturing': { gridIntensityBase: 550, renewableBase: 48, intensityBase: 35, rankBase: 20, reductionBase: 4.5, costBase: 4000000 },
  'healthcare': { gridIntensityBase: 420, renewableBase: 65, intensityBase: 22, rankBase: 10, reductionBase: 7, costBase: 2700000 },
};

// Fallback for companies not in the variations list
const getCompanyVariation = (companyId: string) => {
  const variation = companyVariations[companyId.toLowerCase()];
  if (variation) return variation;
  
  // Generate consistent fallback based on company ID
  const hash = companyId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return {
    gridIntensityBase: 400 + (hash % 200),
    renewableBase: 50 + (hash % 40),
    intensityBase: 10 + (hash % 25),
    rankBase: 1 + (hash % 25),
    reductionBase: 3 + (hash % 10),
    costBase: 2000000 + (hash % 3000000)
  };
};

export const generateScope2MockData = (company: Company): EnhancedScope2Data => {
  const latestScope2 = company.emissionsData[company.emissionsData.length - 1]?.scope2 || 20000;
  
  // Get company-specific base values
  const variation = getCompanyVariation(company.id);
  
  // Apply industry multipliers
  const multiplier = getIndustryMultiplier(company.industry);
  
  // Calculate final values
  const gridIntensity = Math.round(variation.gridIntensityBase * multiplier.grid);
  const renewablePercent = Math.min(95, Math.round(variation.renewableBase * multiplier.renewable));
  const energyIntensity = Math.round((variation.intensityBase * multiplier.intensity) * 100) / 100;
  const costExposure = Math.round(variation.costBase * multiplier.cost);
  
  // Generate comprehensive trend data
  const trendData = company.emissionsData.length > 0 
    ? company.emissionsData.map(item => ({
        year: item.year,
        emissions: item.scope2,
        marketBased: item.scope2,
        locationBased: Math.round(item.scope2 * 1.15)
      }))
    : [
        { year: 2020, emissions: Math.round(latestScope2 * 1.2), marketBased: Math.round(latestScope2 * 1.2), locationBased: Math.round(latestScope2 * 1.38) },
        { year: 2021, emissions: Math.round(latestScope2 * 1.1), marketBased: Math.round(latestScope2 * 1.1), locationBased: Math.round(latestScope2 * 1.27) },
        { year: 2022, emissions: Math.round(latestScope2 * 1.05), marketBased: Math.round(latestScope2 * 1.05), locationBased: Math.round(latestScope2 * 1.21) },
        { year: 2023, emissions: latestScope2, marketBased: latestScope2, locationBased: Math.round(latestScope2 * 1.15) },
        { year: 2024, emissions: Math.round(latestScope2 * 0.92), marketBased: Math.round(latestScope2 * 0.92), locationBased: Math.round(latestScope2 * 1.06) }
      ];

  // Source data distribution
  const sourceData = [
    { source: 'Purchased Electricity', emissions: Math.round(latestScope2 * 0.7) },
    { source: 'Steam & Heating', emissions: Math.round(latestScope2 * 0.2) },
    { source: 'Cooling', emissions: Math.round(latestScope2 * 0.1) }
  ];

  // Location data with regional variations
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

  // Generate year-over-year data for sources and locations
  const sourceDataByYear: Record<string, any[]> = {};
  const locationDataByYear: Record<string, any[]> = {};
  
  [2020, 2021, 2022, 2023, 2024].forEach(year => {
    const yearMultiplier = year === 2020 ? 1.2 : year === 2021 ? 1.1 : year === 2022 ? 1.05 : year === 2023 ? 1.0 : 0.92;
    
    sourceDataByYear[year.toString()] = sourceData.map(source => ({
      ...source,
      emissions: Math.round(source.emissions * yearMultiplier)
    }));
    
    locationDataByYear[year.toString()] = locationData.map(location => ({
      ...location,
      emissions: Math.round(location.emissions * yearMultiplier)
    }));
  });

  // Industry-specific totals and sectors
  const getTotalCompanies = (industry: string) => {
    if (industry.toLowerCase().includes('tech') || industry.toLowerCase().includes('software')) return 45;
    if (industry.toLowerCase().includes('automotive')) return 35;
    if (industry.toLowerCase().includes('energy') || industry.toLowerCase().includes('oil')) return 28;
    if (industry.toLowerCase().includes('consumer') || industry.toLowerCase().includes('retail')) return 52;
    if (industry.toLowerCase().includes('manufacturing')) return 38;
    if (industry.toLowerCase().includes('healthcare')) return 32;
    return 40;
  };

  const totalCompanies = getTotalCompanies(company.industry);
  const sectorName = company.industry.toLowerCase().includes('tech') ? 'technology companies' :
                    company.industry.toLowerCase().includes('automotive') ? 'automotive companies' :
                    company.industry.toLowerCase().includes('energy') ? 'energy companies' :
                    company.industry.toLowerCase().includes('consumer') ? 'consumer goods companies' :
                    company.industry.toLowerCase().includes('manufacturing') ? 'manufacturing companies' :
                    company.industry.toLowerCase().includes('healthcare') ? 'healthcare companies' :
                    'industry companies';

  return {
    trendData,
    sourceData,
    locationData,
    sourceDataByYear,
    locationDataByYear,
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
        rank: variation.rankBase,
        total: totalCompanies
      },
      industryRank: {
        position: variation.rankBase,
        total: totalCompanies,
        sector: sectorName
      },
      annualReduction: {
        value: variation.reductionBase,
        target: 10,
        status: variation.reductionBase > 8 ? 'good' : variation.reductionBase > 5 ? 'average' : 'poor'
      },
      carbonCostExposure: {
        value: costExposure,
        trend: variation.reductionBase > 7 ? 'decreasing' : variation.reductionBase > 4 ? 'stable' : 'increasing'
      }
    },
    benchmarking: {
      efficiencyRank: Math.max(1, variation.rankBase + 2),
      intensityPercentile: Math.min(99, Math.max(1, Math.round((variation.rankBase / totalCompanies) * 100))),
      renewableRank: Math.max(1, renewablePercent > 80 ? variation.rankBase - 2 : variation.rankBase + 3),
      regionalRank: Math.max(1, Math.min(20, variation.rankBase))
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
