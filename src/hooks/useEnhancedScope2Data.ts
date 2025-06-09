import { useSupabaseScope2Data } from './useSupabaseScope2';
import { getCompanyById } from '@/data/companyMockData';

export interface EnhancedScope2Data {
  // Existing data structure
  trendData: Array<{
    year: number;
    emissions: number;
    marketBased: number;
    locationBased: number;
  }>;
  sourceData: Array<{
    source: string;
    emissions: number;
  }>;
  locationData: Array<{
    location: string;
    emissions: number;
    percentage: string;
    renewablePercent: string;
  }>;
  sourceDataByYear: Record<string, any[]>;
  locationDataByYear: Record<string, any[]>;
  
  // New enhanced KPIs
  energyKPIs: {
    gridCarbonIntensity: {
      value: number;
      unit: string;
      status: 'good' | 'average' | 'poor';
      industryAvg: number;
    };
    renewableEnergyPercent: {
      value: number;
      target: number;
      status: 'good' | 'average' | 'poor';
    };
    energyIntensity: {
      value: number;
      unit: string;
      rank: number;
      total: number;
    };
    industryRank: {
      position: number;
      total: number;
      sector: string;
    };
    annualReduction: {
      value: number;
      target: number;
      status: 'good' | 'average' | 'poor';
    };
    carbonCostExposure: {
      value: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
  };
  
  // Enhanced benchmarking
  benchmarking: {
    efficiencyRank: number;
    intensityPercentile: number;
    renewableRank: number;
    regionalRank: number;
  };
  
  // Regional intelligence
  regionalData: Array<{
    region: string;
    gridIntensity: number;
    gridStatus: 'good' | 'average' | 'poor';
    consumptionPercent: number;
    renewableProgress: number;
    opportunities: string[];
    achievements: string[];
  }>;
  
  // Enhanced insights
  insights: {
    highlights: string[];
    opportunities: Array<{
      title: string;
      impact: string;
      description: string;
    }>;
    marketLocationExplanation: {
      marketBased: string;
      locationBased: string;
      impact: string;
    };
  };
}

export const useEnhancedScope2Data = (companyId: string) => {
  const supabaseQuery = useSupabaseScope2Data(companyId);
  
  // Always return enhanced mock data with consistent structure
  const company = getCompanyById(companyId);
  
  if (!company) {
    return {
      data: null,
      isLoading: supabaseQuery.isLoading,
      error: supabaseQuery.error || new Error('Company not found')
    };
  }

  // Generate comprehensive mock data based on industry with complete structure for ALL companies
  const generateEnhancedMockData = (): EnhancedScope2Data => {
    const industry = company.industry;
    const latestScope2 = company.emissionsData[company.emissionsData.length - 1]?.scope2 || 20000;
    
    // Enhanced industry-specific configurations for ALL companies
    const industryConfigs = {
      'Technology': {
        gridIntensity: { min: 420, max: 550 },
        renewable: { min: 65, max: 85 },
        energyIntensity: { min: 8, max: 15 },
        totalCompanies: 45,
        regionalMix: { NA: 45, Europe: 30, APAC: 25 },
        sector: 'tech companies',
        costExposure: { min: 1500000, max: 4000000 },
        reduction: { min: 5, max: 12 }
      },
      'Software Development': {
        gridIntensity: { min: 420, max: 550 },
        renewable: { min: 65, max: 85 },
        energyIntensity: { min: 8, max: 15 },
        totalCompanies: 45,
        regionalMix: { NA: 45, Europe: 30, APAC: 25 },
        sector: 'tech companies',
        costExposure: { min: 1500000, max: 4000000 },
        reduction: { min: 5, max: 12 }
      },
      'Manufacturing': {
        gridIntensity: { min: 480, max: 620 },
        renewable: { min: 35, max: 65 },
        energyIntensity: { min: 25, max: 45 },
        totalCompanies: 78,
        regionalMix: { NA: 35, Europe: 40, APAC: 25 },
        sector: 'manufacturing companies',
        costExposure: { min: 8000000, max: 15000000 },
        reduction: { min: 2, max: 6 }
      },
      'Automotive': {
        gridIntensity: { min: 480, max: 620 },
        renewable: { min: 35, max: 65 },
        energyIntensity: { min: 25, max: 45 },
        totalCompanies: 78,
        regionalMix: { NA: 35, Europe: 40, APAC: 25 },
        sector: 'manufacturing companies',
        costExposure: { min: 8000000, max: 15000000 },
        reduction: { min: 2, max: 6 }
      },
      'Electric Vehicles': {
        gridIntensity: { min: 400, max: 520 },
        renewable: { min: 70, max: 90 },
        energyIntensity: { min: 20, max: 35 },
        totalCompanies: 32,
        regionalMix: { NA: 40, Europe: 35, APAC: 25 },
        sector: 'EV companies',
        costExposure: { min: 3000000, max: 8000000 },
        reduction: { min: 6, max: 15 }
      },
      'Aerospace': {
        gridIntensity: { min: 460, max: 580 },
        renewable: { min: 30, max: 60 },
        energyIntensity: { min: 30, max: 50 },
        totalCompanies: 28,
        regionalMix: { NA: 50, Europe: 30, APAC: 20 },
        sector: 'aerospace companies',
        costExposure: { min: 5000000, max: 12000000 },
        reduction: { min: 3, max: 8 }
      },
      'Retail': {
        gridIntensity: { min: 450, max: 580 },
        renewable: { min: 45, max: 75 },
        energyIntensity: { min: 12, max: 22 },
        totalCompanies: 52,
        regionalMix: { NA: 55, Europe: 25, APAC: 20 },
        sector: 'retail companies',
        costExposure: { min: 3000000, max: 8000000 },
        reduction: { min: 3, max: 8 }
      },
      'Financial Services': {
        gridIntensity: { min: 430, max: 520 },
        renewable: { min: 55, max: 80 },
        energyIntensity: { min: 10, max: 18 },
        totalCompanies: 38,
        regionalMix: { NA: 50, Europe: 35, APAC: 15 },
        sector: 'financial services companies',
        costExposure: { min: 2000000, max: 6000000 },
        reduction: { min: 4, max: 10 }
      },
      'Healthcare': {
        gridIntensity: { min: 460, max: 590 },
        renewable: { min: 40, max: 70 },
        energyIntensity: { min: 18, max: 35 },
        totalCompanies: 31,
        regionalMix: { NA: 60, Europe: 25, APAC: 15 },
        sector: 'healthcare companies',
        costExposure: { min: 4000000, max: 10000000 },
        reduction: { min: 4, max: 9 }
      },
      'Food & Beverage': {
        gridIntensity: { min: 470, max: 600 },
        renewable: { min: 40, max: 70 },
        energyIntensity: { min: 20, max: 40 },
        totalCompanies: 44,
        regionalMix: { NA: 40, Europe: 35, APAC: 25 },
        sector: 'food & beverage companies',
        costExposure: { min: 5000000, max: 12000000 },
        reduction: { min: 3, max: 7 }
      },
      'Oil & Gas': {
        gridIntensity: { min: 520, max: 680 },
        renewable: { min: 15, max: 40 },
        energyIntensity: { min: 40, max: 80 },
        totalCompanies: 42,
        regionalMix: { NA: 35, Europe: 25, APAC: 40 },
        sector: 'energy companies',
        costExposure: { min: 15000000, max: 35000000 },
        reduction: { min: 1, max: 5 }
      },
      'E-commerce & Cloud': {
        gridIntensity: { min: 380, max: 480 },
        renewable: { min: 70, max: 90 },
        energyIntensity: { min: 6, max: 12 },
        totalCompanies: 28,
        regionalMix: { NA: 50, Europe: 30, APAC: 20 },
        sector: 'cloud companies',
        costExposure: { min: 2000000, max: 5000000 },
        reduction: { min: 8, max: 15 }
      },
      'Software & Cloud': {
        gridIntensity: { min: 380, max: 480 },
        renewable: { min: 70, max: 90 },
        energyIntensity: { min: 6, max: 12 },
        totalCompanies: 28,
        regionalMix: { NA: 50, Europe: 30, APAC: 20 },
        sector: 'cloud companies',
        costExposure: { min: 2000000, max: 5000000 },
        reduction: { min: 8, max: 15 }
      }
    };

    const config = industryConfigs[industry as keyof typeof industryConfigs] || industryConfigs['Technology'];
    
    // Generate unique values for each company based on company ID hash
    const companyHash = companyId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const seed = companyHash % 100;
    
    // Use seed to generate consistent but varied values for each company
    const renewablePercent = Math.floor((seed % (config.renewable.max - config.renewable.min + 1)) + config.renewable.min);
    const gridIntensity = Math.floor((seed * 1.3 % (config.gridIntensity.max - config.gridIntensity.min + 1)) + config.gridIntensity.min);
    const energyIntensity = Math.round(((seed * 0.7 % (config.energyIntensity.max - config.energyIntensity.min + 1)) + config.energyIntensity.min) * 100) / 100;
    const industryRank = Math.floor((seed * 1.7) % config.totalCompanies) + 1;
    const annualReduction = Math.round(((seed * 0.9 % (config.reduction.max - config.reduction.min + 1)) + config.reduction.min) * 100) / 100;
    const costExposure = Math.floor((seed * 2.1 % (config.costExposure.max - config.costExposure.min + 1)) + config.costExposure.min);
    
    // Generate trend data
    const trendData = company.emissionsData.map(item => ({
      year: item.year,
      emissions: item.scope2,
      marketBased: item.scope2,
      locationBased: Math.round(item.scope2 * 1.15)
    }));

    // Generate source data with industry-appropriate distribution
    const sourceDistribution = {
      'Technology': { electricity: 0.75, heating: 0.15, cooling: 0.10 },
      'Software Development': { electricity: 0.75, heating: 0.15, cooling: 0.10 },
      'Manufacturing': { electricity: 0.60, heating: 0.30, cooling: 0.10 },
      'Automotive': { electricity: 0.60, heating: 0.30, cooling: 0.10 },
      'Electric Vehicles': { electricity: 0.70, heating: 0.20, cooling: 0.10 },
      'Aerospace': { electricity: 0.65, heating: 0.25, cooling: 0.10 },
      'Retail': { electricity: 0.65, heating: 0.20, cooling: 0.15 },
      'Financial Services': { electricity: 0.70, heating: 0.18, cooling: 0.12 },
      'Healthcare': { electricity: 0.68, heating: 0.22, cooling: 0.10 },
      'Food & Beverage': { electricity: 0.62, heating: 0.28, cooling: 0.10 },
      'Oil & Gas': { electricity: 0.55, heating: 0.35, cooling: 0.10 },
      'E-commerce & Cloud': { electricity: 0.80, heating: 0.12, cooling: 0.08 },
      'Software & Cloud': { electricity: 0.80, heating: 0.12, cooling: 0.08 }
    };

    const distribution = sourceDistribution[industry as keyof typeof sourceDistribution] || sourceDistribution['Technology'];
    
    const sourceData = [
      { source: 'Purchased Electricity', emissions: Math.round(latestScope2 * distribution.electricity) },
      { source: 'Steam & Heating', emissions: Math.round(latestScope2 * distribution.heating) },
      { source: 'Cooling', emissions: Math.round(latestScope2 * distribution.cooling) }
    ];

    // Generate location data with company-specific regional mix
    const locationData = [
      { 
        location: 'North America', 
        emissions: Math.round(latestScope2 * (config.regionalMix.NA / 100)), 
        percentage: `${config.regionalMix.NA}%`, 
        renewablePercent: `${Math.max(30, renewablePercent - 5)}%` 
      },
      { 
        location: 'Europe', 
        emissions: Math.round(latestScope2 * (config.regionalMix.Europe / 100)), 
        percentage: `${config.regionalMix.Europe}%`, 
        renewablePercent: `${Math.min(95, renewablePercent + 15)}%` 
      },
      { 
        location: 'Asia Pacific', 
        emissions: Math.round(latestScope2 * (config.regionalMix.APAC / 100)), 
        percentage: `${config.regionalMix.APAC}%`, 
        renewablePercent: `${Math.max(25, renewablePercent - 20)}%` 
      }
    ];

    // Generate sector-specific insights
    const sectorInsights = {
      'Technology': {
        highlights: [
          `${renewablePercent}% renewable energy achievement`,
          'Leading edge data center efficiency',
          'Cloud infrastructure optimization',
          'Green software development practices',
          'Carbon-neutral operations in 3 regions'
        ],
        opportunities: [
          { title: 'Expand renewable procurement', impact: '15% reduction potential', description: 'Increase clean energy purchases across all data centers' },
          { title: 'Edge computing optimization', impact: '8% efficiency gain', description: 'Deploy edge infrastructure to reduce transmission losses' },
          { title: 'AI-powered efficiency', impact: '12% improvement', description: 'Implement AI-driven cooling and power management' },
          { title: 'Employee engagement', impact: '5% behavioral change', description: 'Remote work policies and green commuting incentives' }
        ]
      },
      'Manufacturing': {
        highlights: [
          `${renewablePercent}% renewable energy adoption`,
          'Energy-efficient production lines',
          'Waste heat recovery systems',
          'Smart grid integration',
          'ISO 50001 energy management'
        ],
        opportunities: [
          { title: 'Industrial heat pumps', impact: '20% heating reduction', description: 'Replace gas boilers with electric heat pump systems' },
          { title: 'On-site solar installation', impact: '25% grid independence', description: 'Install rooftop and ground-mounted solar arrays' },
          { title: 'Process electrification', impact: '18% emissions reduction', description: 'Convert fossil fuel processes to electric alternatives' },
          { title: 'Energy storage systems', impact: '10% cost savings', description: 'Battery storage for load shifting and grid services' }
        ]
      },
      'Financial Services': {
        highlights: [
          `${renewablePercent}% clean electricity procurement`,
          'LEED-certified office buildings',
          'Paperless operations initiatives',
          'Green building certifications',
          'Carbon-neutral data centers'
        ],
        opportunities: [
          { title: 'Portfolio decarbonization', impact: '30% financed emissions', description: 'Shift investment portfolio toward clean energy' },
          { title: 'Green building upgrades', impact: '15% office efficiency', description: 'Smart building systems and LED retrofits' },
          { title: 'Renewable energy PPAs', impact: '20% cost reduction', description: 'Long-term renewable energy purchase agreements' },
          { title: 'Digital transformation', impact: '12% operational efficiency', description: 'Cloud migration and paperless processes' }
        ]
      },
      'Healthcare': {
        highlights: [
          `${renewablePercent}% renewable energy in operations`,
          '24/7 critical care efficiency',
          'Medical equipment optimization',
          'Green hospital certifications',
          'Energy recovery ventilation'
        ],
        opportunities: [
          { title: 'Hospital energy systems', impact: '18% HVAC efficiency', description: 'Upgrade to high-efficiency medical-grade HVAC' },
          { title: 'Cogeneration systems', impact: '22% energy independence', description: 'Combined heat and power for critical operations' },
          { title: 'LED surgical lighting', impact: '8% lighting efficiency', description: 'Medical-grade LED systems in all facilities' },
          { title: 'Smart grid integration', impact: '12% grid services', description: 'Demand response for non-critical systems' }
        ]
      }
    };

    const insights = sectorInsights[industry as keyof typeof sectorInsights] || sectorInsights['Technology'];

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
          industryAvg: Math.round((config.gridIntensity.min + config.gridIntensity.max) / 2)
        },
        renewableEnergyPercent: {
          value: renewablePercent,
          target: Math.min(100, renewablePercent + 20),
          status: renewablePercent > 70 ? 'good' : renewablePercent > 50 ? 'average' : 'poor'
        },
        energyIntensity: {
          value: energyIntensity,
          unit: 'MWh per $M revenue',
          rank: industryRank,
          total: config.totalCompanies
        },
        industryRank: {
          position: industryRank,
          total: config.totalCompanies,
          sector: config.sector
        },
        annualReduction: {
          value: annualReduction,
          target: 10,
          status: annualReduction > 8 ? 'good' : annualReduction > 5 ? 'average' : 'poor'
        },
        carbonCostExposure: {
          value: costExposure,
          trend: ['increasing', 'decreasing', 'stable'][seed % 3] as 'increasing' | 'decreasing' | 'stable'
        }
      },
      benchmarking: {
        efficiencyRank: Math.floor((seed * 1.2) % config.totalCompanies) + 1,
        intensityPercentile: Math.floor((seed * 0.8) % 100) + 1,
        renewableRank: Math.floor((seed * 1.5) % config.totalCompanies) + 1,
        regionalRank: Math.floor((seed * 0.6) % 20) + 1
      },
      regionalData: [
        {
          region: 'North America',
          gridIntensity: Math.round(gridIntensity * 1.05),
          gridStatus: gridIntensity * 1.05 < 450 ? 'good' : gridIntensity * 1.05 < 550 ? 'average' : 'poor',
          consumptionPercent: config.regionalMix.NA,
          renewableProgress: Math.max(30, renewablePercent - 5),
          opportunities: ['Expand solar procurement', 'Join regional renewable cooperatives'],
          achievements: ['Achieved renewable energy targets', 'Reduced grid dependency by 15%']
        },
        {
          region: 'Europe',
          gridIntensity: Math.round(gridIntensity * 0.65),
          gridStatus: 'good' as const,
          consumptionPercent: config.regionalMix.Europe,
          renewableProgress: Math.min(95, renewablePercent + 15),
          opportunities: ['Leverage EU green policies', 'Expand wind energy partnerships'],
          achievements: ['Leading regional renewable adoption', '25% above EU standards']
        },
        {
          region: 'Asia Pacific',
          gridIntensity: Math.round(gridIntensity * 1.25),
          gridStatus: gridIntensity * 1.25 < 500 ? 'average' : 'poor',
          consumptionPercent: config.regionalMix.APAC,
          renewableProgress: Math.max(25, renewablePercent - 20),
          opportunities: ['Invest in regional solar projects', 'Partner with clean energy providers'],
          achievements: ['Established renewable energy office', 'Reduced emissions intensity by 12%']
        }
      ],
      insights: {
        highlights: insights.highlights,
        opportunities: insights.opportunities,
        marketLocationExplanation: {
          marketBased: `Reflects your renewable energy purchases - ${Math.round(((trendData[trendData.length - 1].locationBased - trendData[trendData.length - 1].marketBased) / trendData[trendData.length - 1].locationBased * 100))}% lower due to clean energy choices`,
          locationBased: `Based on regional grid averages - shows baseline without renewable procurement`,
          impact: `Clean energy impact: ${Math.round((trendData[trendData.length - 1].locationBased - trendData[trendData.length - 1].marketBased))} tCO2e avoided annually`
        }
      }
    };
  };

  return {
    data: generateEnhancedMockData(),
    isLoading: supabaseQuery.isLoading,
    error: supabaseQuery.error
  };
};
