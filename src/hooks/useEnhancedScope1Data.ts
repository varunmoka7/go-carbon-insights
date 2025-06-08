
import { useScope1Data } from './useScope1Data';
import { useIndustryBenchmarking } from './useIndustryBenchmarking';
import { getCompanyById } from '@/data/enhancedMockData';

interface EnhancedSourceData {
  source: string;
  emissions: number;
  percentage: number;
  industryTypicalRange: { min: number; max: number };
  efficiencyMetric: number;
  costPerTonne: number;
  icon: React.ReactNode;
}

interface BenchmarkTrendData {
  year: number;
  emissions: number;
  industryAverage: number;
  percentileRank: number;
}

interface EnhancedScope1Data {
  trendData: BenchmarkTrendData[];
  sourceData: EnhancedSourceData[];
  sourceDataByYear: Record<string, EnhancedSourceData[]>;
  benchmarkData: ReturnType<typeof useIndustryBenchmarking>;
  insights: {
    performanceVsPeers: string[];
    improvementOpportunities: string[];
    costBenefitHighlights: string[];
  };
}

export const useEnhancedScope1Data = (companyId: string) => {
  const { data: scope1Data, isLoading, error } = useScope1Data(companyId);
  const benchmarkData = useIndustryBenchmarking(companyId);
  const company = getCompanyById(companyId);

  if (isLoading || error || !scope1Data || !benchmarkData || !company) {
    return { data: null, isLoading, error };
  }

  // Generate industry-specific typical ranges and metrics
  const getSourceMetrics = (source: string, emissions: number, total: number) => {
    const percentage = (emissions / total) * 100;
    
    const sourceRanges: Record<string, any> = {
      'Natural Gas': {
        typical: { min: 35, max: 55 },
        efficiency: emissions / (company.revenue * 0.8), // efficiency per revenue
        costPerTonne: 45 + Math.random() * 15
      },
      'Diesel Fuel': {
        typical: { min: 20, max: 40 },
        efficiency: emissions / (company.employees * 0.1),
        costPerTonne: 55 + Math.random() * 20
      },
      'Company Vehicles': {
        typical: { min: 15, max: 30 },
        efficiency: emissions / (company.employees * 0.05),
        costPerTonne: 65 + Math.random() * 25
      },
      'Refrigerants': {
        typical: { min: 5, max: 15 },
        efficiency: emissions / (company.revenue * 0.2),
        costPerTonne: 85 + Math.random() * 35
      }
    };

    const metrics = sourceRanges[source] || { typical: { min: 10, max: 25 }, efficiency: 1, costPerTonne: 50 };
    
    return {
      percentage: Math.round(percentage * 10) / 10,
      industryTypicalRange: metrics.typical,
      efficiencyMetric: Math.round(metrics.efficiency * 100) / 100,
      costPerTonne: Math.round(metrics.costPerTonne)
    };
  };

  // Enhanced trend data with industry benchmarks
  const enhancedTrendData: BenchmarkTrendData[] = scope1Data.trendData.map(item => {
    const industryAverage = benchmarkData.emissionsIntensity * company.revenue;
    const percentileRank = Math.max(10, Math.min(90, 
      50 + (benchmarkData.industryRank / benchmarkData.totalInSector - 0.5) * 80
    ));

    return {
      year: item.year,
      emissions: item.emissions,
      industryAverage: Math.round(industryAverage),
      percentileRank: Math.round(percentileRank)
    };
  });

  // Enhanced source data with metrics
  const enhancedSourceData: EnhancedSourceData[] = scope1Data.sourceData.map(item => {
    const total = scope1Data.sourceData.reduce((sum, s) => sum + s.emissions, 0);
    const metrics = getSourceMetrics(item.source, item.emissions, total);
    
    return {
      ...item,
      ...metrics
    };
  });

  // Enhanced source data by year
  const enhancedSourceDataByYear: Record<string, EnhancedSourceData[]> = {};
  Object.entries(scope1Data.sourceDataByYear || {}).forEach(([year, sources]) => {
    const total = sources.reduce((sum, s) => sum + s.emissions, 0);
    enhancedSourceDataByYear[year] = sources.map(item => {
      const metrics = getSourceMetrics(item.source, item.emissions, total);
      return { ...item, ...metrics };
    });
  });

  // Generate insights based on performance data
  const insights = {
    performanceVsPeers: [
      `Ranked ${benchmarkData.industryRank} of ${benchmarkData.totalInSector} companies in ${company.sector}`,
      benchmarkData.performanceIndicators.intensityVsAvg === 'above' 
        ? `Emissions intensity 15% better than industry average`
        : benchmarkData.performanceIndicators.intensityVsAvg === 'below'
        ? `Emissions intensity 18% above industry average - improvement opportunity`
        : `Emissions intensity aligned with industry average`,
      `Annual reduction rate of ${benchmarkData.annualReduction}% ${benchmarkData.annualReduction > 7 ? 'exceeds' : 'trails'} sector median of 6.5%`
    ],
    improvementOpportunities: [
      enhancedSourceData[0] ? `${enhancedSourceData[0].source} optimization could reduce emissions by 12-18%` : 'Focus on largest emission sources',
      'Fleet electrification potential: 25% reduction in transport emissions',
      'Energy efficiency upgrades: $2.3M investment, 3.2 year payback',
      'Renewable energy transition: 35% scope 2 reduction achievable'
    ],
    costBenefitHighlights: [
      `Carbon cost exposure: $${benchmarkData.carbonCostExposure.toLocaleString()} annually at current prices`,
      'High-impact projects average 2.8 year ROI with 15% emission reduction',
      'Efficiency improvements: $450/tonne reduction cost vs $800/tonne carbon credits',
      'Early action advantage: 40% lower compliance costs vs delayed implementation'
    ]
  };

  const enhancedData: EnhancedScope1Data = {
    trendData: enhancedTrendData,
    sourceData: enhancedSourceData,
    sourceDataByYear: enhancedSourceDataByYear,
    benchmarkData,
    insights
  };

  return { data: enhancedData, isLoading, error };
};
