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
  
  // If Supabase data is loading or there's an error, fallback to enhanced mock data
  if (supabaseQuery.isLoading || supabaseQuery.error || !supabaseQuery.data?.trendData?.length) {
    const company = getCompanyById(companyId);
    
    if (!company) {
      return {
        data: null,
        isLoading: supabaseQuery.isLoading,
        error: supabaseQuery.error || new Error('Company not found')
      };
    }

    // Generate comprehensive mock data based on industry
    const generateEnhancedMockData = (): EnhancedScope2Data => {
      const industry = company.industry;
      const latestScope2 = company.emissionsData[company.emissionsData.length - 1]?.scope2 || 20000;
      
      // Industry-specific configurations
      const industryConfig = {
        'Technology': {
          gridIntensity: { min: 420, max: 550 },
          renewable: { min: 65, max: 85 },
          totalCompanies: 45,
          regionalMix: { NA: 45, Europe: 30, APAC: 25 },
          sector: 'tech companies'
        },
        'Manufacturing': {
          gridIntensity: { min: 480, max: 620 },
          renewable: { min: 35, max: 65 },
          totalCompanies: 78,
          regionalMix: { NA: 35, Europe: 40, APAC: 25 },
          sector: 'manufacturing companies'
        },
        'Retail': {
          gridIntensity: { min: 450, max: 580 },
          renewable: { min: 45, max: 75 },
          totalCompanies: 52,
          regionalMix: { NA: 55, Europe: 25, APAC: 20 },
          sector: 'retail companies'
        },
        'Financial Services': {
          gridIntensity: { min: 430, max: 520 },
          renewable: { min: 55, max: 80 },
          totalCompanies: 38,
          regionalMix: { NA: 50, Europe: 35, APAC: 15 },
          sector: 'financial services companies'
        },
        'Healthcare': {
          gridIntensity: { min: 460, max: 590 },
          renewable: { min: 40, max: 70 },
          totalCompanies: 31,
          regionalMix: { NA: 60, Europe: 25, APAC: 15 },
          sector: 'healthcare companies'
        }
      };

      const config = industryConfig[industry as keyof typeof industryConfig] || industryConfig['Technology'];
      
      // Generate values based on company performance
      const renewablePercent = Math.floor(Math.random() * (config.renewable.max - config.renewable.min + 1)) + config.renewable.min;
      const gridIntensity = Math.floor(Math.random() * (config.gridIntensity.max - config.gridIntensity.min + 1)) + config.gridIntensity.min;
      const industryRank = Math.floor(Math.random() * config.totalCompanies) + 1;
      
      // Generate trend data
      const trendData = company.emissionsData.map(item => ({
        year: item.year,
        emissions: item.scope2,
        marketBased: item.scope2,
        locationBased: Math.round(item.scope2 * 1.15)
      }));

      // Generate source data
      const sourceDistribution = {
        'Technology': { electricity: 0.75, heating: 0.15, cooling: 0.10 },
        'Manufacturing': { electricity: 0.60, heating: 0.30, cooling: 0.10 },
        'Retail': { electricity: 0.65, heating: 0.20, cooling: 0.15 },
        'Financial Services': { electricity: 0.70, heating: 0.18, cooling: 0.12 },
        'Healthcare': { electricity: 0.68, heating: 0.22, cooling: 0.10 }
      };

      const distribution = sourceDistribution[industry as keyof typeof sourceDistribution] || sourceDistribution['Technology'];
      
      const sourceData = [
        { source: 'Purchased Electricity', emissions: Math.round(latestScope2 * distribution.electricity) },
        { source: 'Steam & Heating', emissions: Math.round(latestScope2 * distribution.heating) },
        { source: 'Cooling', emissions: Math.round(latestScope2 * distribution.cooling) }
      ];

      // Generate location data
      const locationData = [
        { 
          location: 'North America', 
          emissions: Math.round(latestScope2 * (config.regionalMix.NA / 100)), 
          percentage: `${config.regionalMix.NA}%`, 
          renewablePercent: `${renewablePercent}%` 
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
            value: Math.round((latestScope2 / 1000) * 100) / 100,
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
            value: Math.round((Math.random() * 15 + 2) * 100) / 100,
            target: 10,
            status: Math.random() > 0.5 ? 'good' : 'average'
          },
          carbonCostExposure: {
            value: Math.round(latestScope2 * 0.05 * Math.random() + latestScope2 * 0.02),
            trend: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as 'increasing' | 'decreasing' | 'stable'
          }
        },
        benchmarking: {
          efficiencyRank: Math.floor(Math.random() * config.totalCompanies) + 1,
          intensityPercentile: Math.floor(Math.random() * 100) + 1,
          renewableRank: Math.floor(Math.random() * config.totalCompanies) + 1,
          regionalRank: Math.floor(Math.random() * 20) + 1
        },
        regionalData: [
          {
            region: 'North America',
            gridIntensity: 475,
            gridStatus: 'average' as const,
            consumptionPercent: config.regionalMix.NA,
            renewableProgress: renewablePercent,
            opportunities: ['Expand solar procurement', 'Join regional renewable cooperatives'],
            achievements: ['Achieved 50% renewable energy', 'Reduced grid dependency by 15%']
          },
          {
            region: 'Europe',
            gridIntensity: 320,
            gridStatus: 'good' as const,
            consumptionPercent: config.regionalMix.Europe,
            renewableProgress: Math.min(95, renewablePercent + 15),
            opportunities: ['Leverage EU green policies', 'Expand wind energy partnerships'],
            achievements: ['Leading regional renewable adoption', '25% above EU standards']
          },
          {
            region: 'Asia Pacific',
            gridIntensity: 650,
            gridStatus: 'poor' as const,
            consumptionPercent: config.regionalMix.APAC,
            renewableProgress: Math.max(25, renewablePercent - 20),
            opportunities: ['Invest in regional solar projects', 'Partner with clean energy providers'],
            achievements: ['Established renewable energy office', 'Reduced emissions intensity by 12%']
          }
        ],
        insights: {
          highlights: [
            `${renewablePercent}% renewable energy achievement`,
            `${Math.round(((trendData[0].emissions - trendData[trendData.length - 1].emissions) / trendData[0].emissions * 100))}% reduction in energy emissions`,
            'Market-based approach reduces emissions by 28%',
            'Industry-leading energy efficiency programs',
            'Strategic renewable energy partnerships established'
          ],
          opportunities: [
            {
              title: 'Increase renewable procurement',
              impact: '15% reduction potential',
              description: 'Expand renewable energy purchases to reach 85% clean energy target'
            },
            {
              title: 'Implement energy efficiency measures',
              impact: '8% reduction potential',
              description: 'Deploy advanced building management systems across all facilities'
            },
            {
              title: 'Regional grid improvements',
              impact: '12% reduction potential',
              description: 'Participate in regional clean energy initiatives and grid modernization'
            },
            {
              title: 'Power purchase agreements',
              impact: '20% cost reduction',
              description: 'Secure long-term renewable energy contracts for price stability'
            }
          ],
          marketLocationExplanation: {
            marketBased: `Reflects your renewable energy purchases - 28% lower due to clean energy choices`,
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
  }

  return supabaseQuery;
};
