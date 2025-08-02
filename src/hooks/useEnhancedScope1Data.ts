
import { useScope1Data } from './useScope1Data';
import { useIndustryBenchmarking } from './useIndustryBenchmarking';
import { useCompanies } from './useCompanies';

interface EnhancedSourceData {
  source: string;
  emissions: number;
  percentage: number;
  industryTypicalRange: { min: number; max: number };
  efficiencyMetric: number;
  costPerTonne: number;
  iconType: 'fuel' | 'truck' | 'zap' | 'factory';
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
  const { data: companies } = useCompanies();
  const company = companies?.find(c => c.id === companyId);

  if (isLoading || error || !scope1Data || !benchmarkData || !company) {
    return { data: null, isLoading, error };
  }

  // Generate industry-specific typical ranges and metrics
  const getSourceMetrics = (source: string, emissions: number, total: number) => {
    const percentage = (emissions / total) * 100;
    
    const sourceRanges: Record<string, any> = {
      // Technology sources
      'Data Center Cooling': {
        typical: { min: 30, max: 50 },
        efficiency: emissions / (company.revenue * 0.8),
        costPerTonne: 45 + Math.random() * 15,
        iconType: 'zap'
      },
      'Emergency Generators': {
        typical: { min: 15, max: 30 },
        efficiency: emissions / (company.employees * 0.1),
        costPerTonne: 55 + Math.random() * 20,
        iconType: 'fuel'
      },
      'Company Vehicles': {
        typical: { min: 10, max: 25 },
        efficiency: emissions / (company.employees * 0.05),
        costPerTonne: 65 + Math.random() * 25,
        iconType: 'truck'
      },
      'Refrigerants': {
        typical: { min: 5, max: 15 },
        efficiency: emissions / (company.revenue * 0.2),
        costPerTonne: 85 + Math.random() * 35,
        iconType: 'zap'
      },
      'Process Heating': {
        typical: { min: 8, max: 18 },
        efficiency: emissions / (company.revenue * 0.3),
        costPerTonne: 50 + Math.random() * 20,
        iconType: 'fuel'
      },
      
      // E-commerce sources
      'Warehouse Heating': {
        typical: { min: 25, max: 40 },
        efficiency: emissions / (company.revenue * 0.6),
        costPerTonne: 40 + Math.random() * 15,
        iconType: 'fuel'
      },
      'Fleet Vehicles': {
        typical: { min: 30, max: 50 },
        efficiency: emissions / (company.employees * 0.2),
        costPerTonne: 60 + Math.random() * 25,
        iconType: 'truck'
      },
      'Backup Generators': {
        typical: { min: 8, max: 20 },
        efficiency: emissions / (company.revenue * 0.1),
        costPerTonne: 55 + Math.random() * 20,
        iconType: 'fuel'
      },
      'Refrigeration': {
        typical: { min: 12, max: 25 },
        efficiency: emissions / (company.revenue * 0.4),
        costPerTonne: 75 + Math.random() * 30,
        iconType: 'zap'
      },
      'Material Handling': {
        typical: { min: 5, max: 12 },
        efficiency: emissions / (company.employees * 0.03),
        costPerTonne: 45 + Math.random() * 15,
        iconType: 'factory'
      },
      
      // Automotive sources
      'Manufacturing Furnaces': {
        typical: { min: 35, max: 55 },
        efficiency: emissions / (company.revenue * 1.2),
        costPerTonne: 40 + Math.random() * 15,
        iconType: 'factory'
      },
      'Paint Booth Operations': {
        typical: { min: 15, max: 25 },
        efficiency: emissions / (company.employees * 0.08),
        costPerTonne: 50 + Math.random() * 20,
        iconType: 'factory'
      },
      'Test Vehicle Fleet': {
        typical: { min: 10, max: 20 },
        efficiency: emissions / (company.employees * 0.06),
        costPerTonne: 65 + Math.random() * 25,
        iconType: 'truck'
      },
      'Facility Heating': {
        typical: { min: 8, max: 15 },
        efficiency: emissions / (company.revenue * 0.2),
        costPerTonne: 42 + Math.random() * 18,
        iconType: 'fuel'
      },
      'Welding & Cutting': {
        typical: { min: 6, max: 12 },
        efficiency: emissions / (company.employees * 0.04),
        costPerTonne: 38 + Math.random() * 15,
        iconType: 'factory'
      },
      
      // Energy sources
      'Processing Equipment': {
        typical: { min: 40, max: 60 },
        efficiency: emissions / (company.revenue * 2.0),
        costPerTonne: 35 + Math.random() * 12,
        iconType: 'factory'
      },
      'Flaring Operations': {
        typical: { min: 20, max: 35 },
        efficiency: emissions / (company.employees * 0.5),
        costPerTonne: 30 + Math.random() * 10,
        iconType: 'fuel'
      },
      'Pipeline Compression': {
        typical: { min: 10, max: 20 },
        efficiency: emissions / (company.revenue * 0.8),
        costPerTonne: 45 + Math.random() * 15,
        iconType: 'fuel'
      },
      'Facility Operations': {
        typical: { min: 8, max: 15 },
        efficiency: emissions / (company.employees * 0.1),
        costPerTonne: 40 + Math.random() * 15,
        iconType: 'factory'
      },
      'Emergency Systems': {
        typical: { min: 3, max: 8 },
        efficiency: emissions / (company.revenue * 0.05),
        costPerTonne: 50 + Math.random() * 20,
        iconType: 'fuel'
      },
      
      // Consumer Goods sources
      'Manufacturing Heat': {
        typical: { min: 25, max: 45 },
        efficiency: emissions / (company.revenue * 1.0),
        costPerTonne: 42 + Math.random() * 18,
        iconType: 'fuel'
      },
      'Packaging Processes': {
        typical: { min: 15, max: 30 },
        efficiency: emissions / (company.employees * 0.12),
        costPerTonne: 48 + Math.random() * 20,
        iconType: 'factory'
      },
      'Distribution Fleet': {
        typical: { min: 18, max: 35 },
        efficiency: emissions / (company.employees * 0.15),
        costPerTonne: 62 + Math.random() * 25,
        iconType: 'truck'
      },
      'Facility HVAC': {
        typical: { min: 10, max: 20 },
        efficiency: emissions / (company.revenue * 0.3),
        costPerTonne: 45 + Math.random() * 15,
        iconType: 'fuel'
      },
      'Quality Testing': {
        typical: { min: 3, max: 10 },
        efficiency: emissions / (company.employees * 0.02),
        costPerTonne: 40 + Math.random() * 15,
        iconType: 'factory'
      },
      
      // Food & Beverage sources
      'Production Boilers': {
        typical: { min: 30, max: 50 },
        efficiency: emissions / (company.revenue * 1.5),
        costPerTonne: 38 + Math.random() * 15,
        iconType: 'fuel'
      },
      'Refrigeration Systems': {
        typical: { min: 20, max: 35 },
        efficiency: emissions / (company.revenue * 0.8),
        costPerTonne: 70 + Math.random() * 30,
        iconType: 'zap'
      },
      'Delivery Vehicles': {
        typical: { min: 12, max: 25 },
        efficiency: emissions / (company.employees * 0.1),
        costPerTonne: 60 + Math.random() * 25,
        iconType: 'truck'
      },
      'Food Processing Equipment': {
        typical: { min: 8, max: 18 },
        efficiency: emissions / (company.revenue * 0.4),
        costPerTonne: 45 + Math.random() * 20,
        iconType: 'factory'
      },
      'Steam Generation': {
        typical: { min: 6, max: 15 },
        efficiency: emissions / (company.revenue * 0.3),
        costPerTonne: 42 + Math.random() * 18,
        iconType: 'fuel'
      },
      
      // Healthcare sources
      'Medical Equipment': {
        typical: { min: 20, max: 40 },
        efficiency: emissions / (company.revenue * 0.9),
        costPerTonne: 55 + Math.random() * 25,
        iconType: 'zap'
      },
      'HVAC & Sterilization': {
        typical: { min: 18, max: 35 },
        efficiency: emissions / (company.employees * 0.15),
        costPerTonne: 50 + Math.random() * 20,
        iconType: 'fuel'
      },
      'Healthcare Emergency Generators': {
        typical: { min: 12, max: 25 },
        efficiency: emissions / (company.revenue * 0.2),
        costPerTonne: 55 + Math.random() * 20,
        iconType: 'fuel'
      },
      'Laboratory Operations': {
        typical: { min: 8, max: 20 },
        efficiency: emissions / (company.employees * 0.08),
        costPerTonne: 48 + Math.random() * 22,
        iconType: 'factory'
      },
      'Transport Vehicles': {
        typical: { min: 6, max: 15 },
        efficiency: emissions / (company.employees * 0.05),
        costPerTonne: 62 + Math.random() * 25,
        iconType: 'truck'
      },
      
      // Retail sources
      'Store HVAC Systems': {
        typical: { min: 25, max: 45 },
        efficiency: emissions / (company.revenue * 0.7),
        costPerTonne: 45 + Math.random() * 18,
        iconType: 'fuel'
      },
      'Refrigeration Units': {
        typical: { min: 20, max: 35 },
        efficiency: emissions / (company.employees * 0.2),
        costPerTonne: 75 + Math.random() * 30,
        iconType: 'zap'
      },
      'Delivery Fleet': {
        typical: { min: 15, max: 30 },
        efficiency: emissions / (company.employees * 0.12),
        costPerTonne: 60 + Math.random() * 25,
        iconType: 'truck'
      },
      'Store Backup Generators': {
        typical: { min: 8, max: 18 },
        efficiency: emissions / (company.revenue * 0.1),
        costPerTonne: 52 + Math.random() * 20,
        iconType: 'fuel'
      },
      'Warehouse Operations': {
        typical: { min: 5, max: 12 },
        efficiency: emissions / (company.employees * 0.03),
        costPerTonne: 40 + Math.random() * 15,
        iconType: 'factory'
      }
    };

    const metrics = sourceRanges[source] || { 
      typical: { min: 10, max: 25 }, 
      efficiency: 1, 
      costPerTonne: 50,
      iconType: 'factory'
    };
    
    return {
      percentage: Math.round(percentage * 10) / 10,
      industryTypicalRange: metrics.typical,
      efficiencyMetric: Math.round(metrics.efficiency * 100) / 100,
      costPerTonne: Math.round(metrics.costPerTonne),
      iconType: metrics.iconType
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

  // Calculate total emissions for percentage calculations
  let totalEmissions = 0;
  scope1Data.sourceData.forEach(source => {
    totalEmissions += source.emissions;
  });
  
  // Enhanced source data with metrics
  const enhancedSourceData: EnhancedSourceData[] = scope1Data.sourceData.map(item => {
    const metrics = getSourceMetrics(item.source, item.emissions, totalEmissions);
    
    return {
      ...item,
      ...metrics
    };
  });

  // Enhanced source data by year
  const enhancedSourceDataByYear: Record<string, EnhancedSourceData[]> = {};
  Object.entries(scope1Data.sourceDataByYear || {}).forEach(([year, sources]) => {
    if (Array.isArray(sources)) {
      let total = 0;
      sources.forEach(s => total += s.emissions);
      enhancedSourceDataByYear[year] = sources.map(item => {
        const metrics = getSourceMetrics(item.source, item.emissions, total);
        return { ...item, ...metrics };
      });
    }
  });

  // Generate industry-specific insights based on performance data
  const getIndustrySpecificInsights = () => {
    const topSource = enhancedSourceData[0];
    const secondSource = enhancedSourceData[1];
    
    const basePerformance = [
      `Ranked ${benchmarkData.industryRank} of ${benchmarkData.totalInSector} companies in ${company.sector}`,
      benchmarkData.performanceIndicators.intensityVsAvg === 'above' 
        ? `Emissions intensity 15% better than industry average - strong performance`
        : benchmarkData.performanceIndicators.intensityVsAvg === 'below'
        ? `Emissions intensity 18% above industry average - significant improvement opportunity`
        : `Emissions intensity aligned with industry average - room for optimization`,
      `Annual reduction rate of ${Math.abs(benchmarkData.annualReduction)}% ${benchmarkData.annualReduction > 6.5 ? 'exceeds' : 'trails'} sector median of 6.5%`
    ];

    switch (company.industry) {
      case 'Technology':
        return {
          performanceVsPeers: [
            ...basePerformance,
            company.renewable_energy_percentage > 70 ? 
              'Leading in renewable energy adoption for data center operations' :
              'Data center energy efficiency lags behind industry leaders by 20-30%'
          ],
          improvementOpportunities: [
            topSource ? `${topSource.source} optimization through advanced cooling systems could reduce emissions by 15-25%` : 'Focus on data center efficiency improvements',
            'AI-powered HVAC optimization: 12-18% reduction in cooling-related emissions',
            'Server virtualization and consolidation: $1.8M investment, 2.1 year payback',
            'Transition to edge computing: 20% reduction in centralized processing emissions',
            'Employee remote work programs: 15-30% reduction in facility-based emissions'
          ],
          costBenefitHighlights: [
            `Carbon cost exposure: $${benchmarkData.carbonCostExposure.toLocaleString()} annually with data center operations`,
            'Energy-efficient infrastructure upgrades: $320/tonne reduction cost vs $500/tonne offsets',
            'Renewable energy PPAs: 35% cost savings vs traditional energy procurement',
            'Early action advantage: 45% lower compliance costs for upcoming tech sector regulations'
          ]
        };

      case 'E-commerce':
        return {
          performanceVsPeers: [
            ...basePerformance,
            'Logistics fleet efficiency ranks in top quartile compared to retail peers',
            'Warehouse automation contributing to 8-12% emissions reduction annually'
          ],
          improvementOpportunities: [
            topSource ? `${topSource.source} optimization through route optimization could reduce emissions by 20-35%` : 'Focus on logistics optimization',
            'Electric delivery vehicle transition: 40-60% reduction in last-mile emissions',
            'Warehouse automation and robotics: $4.2M investment, 3.8 year payback',
            'AI-powered demand forecasting: 15% reduction in unnecessary inventory movements',
            'Consolidated packaging systems: 8-12% reduction in distribution emissions'
          ],
          costBenefitHighlights: [
            `Carbon cost exposure: $${benchmarkData.carbonCostExposure.toLocaleString()} annually from logistics operations`,
            'Fleet electrification programs: $580/tonne reduction cost with government incentives',
            'Route optimization software: 25% fuel cost savings with 18-month ROI',
            'Early adopter advantage: 50% lower transition costs vs competitors waiting until 2030'
          ]
        };

      case 'Automotive':
        return {
          performanceVsPeers: [
            ...basePerformance,
            'Manufacturing process efficiency above industry median by 12%',
            'Transition to electric vehicle production accelerating emissions reduction trajectory'
          ],
          improvementOpportunities: [
            topSource ? `${topSource.source} efficiency through heat recovery systems could reduce emissions by 18-28%` : 'Focus on manufacturing process optimization',
            'Industrial electrification: 30-45% reduction in natural gas dependency',
            'Closed-loop manufacturing: $8.5M investment, 4.2 year payback',
            'Supplier decarbonization programs: 25% reduction in scope 3 manufacturing emissions',
            'Lightweight materials adoption: 15% reduction in production energy intensity'
          ],
          costBenefitHighlights: [
            `Carbon cost exposure: $${benchmarkData.carbonCostExposure.toLocaleString()} annually from manufacturing operations`,
            'Heat recovery systems: $420/tonne reduction cost with 2.8 year payback',
            'Manufacturing efficiency upgrades: 22% energy cost savings over 5 years',
            'Regulatory compliance advantage: 35% lower costs vs reactive implementation'
          ]
        };

      case 'Energy':
        return {
          performanceVsPeers: [
            ...basePerformance,
            'Methane leak detection and reduction programs showing measurable results',
            'Renewable energy integration advancing faster than traditional energy peers'
          ],
          improvementOpportunities: [
            topSource ? `${topSource.source} optimization through advanced process control could reduce emissions by 10-20%` : 'Focus on operational efficiency improvements',
            'Carbon capture and storage deployment: 60-80% reduction in process emissions',
            'Advanced leak detection and repair: $12M investment, 3.5 year payback',
            'Process electrification initiatives: 25% reduction in direct combustion emissions',
            'Digital twin optimization: 15% improvement in operational efficiency'
          ],
          costBenefitHighlights: [
            `Carbon cost exposure: $${benchmarkData.carbonCostExposure.toLocaleString()} annually from direct operations`,
            'CCUS technology deployment: $65/tonne reduction cost at scale',
            'Operational efficiency programs: 18% cost savings with immediate implementation',
            'Early mover advantage: 60% cost advantage vs late adopters in carbon management'
          ]
        };

      case 'Consumer Goods':
        return {
          performanceVsPeers: [
            ...basePerformance,
            'Manufacturing energy intensity improving faster than consumer goods average',
            'Supply chain optimization initiatives driving measurable emissions reductions'
          ],
          improvementOpportunities: [
            topSource ? `${topSource.source} optimization through cogeneration systems could reduce emissions by 15-25%` : 'Focus on manufacturing efficiency',
            'Renewable energy transition: 40% reduction in manufacturing emissions',
            'Packaging optimization: $3.2M investment, 2.1 year payback',
            'Local sourcing initiatives: 20% reduction in distribution-related emissions',
            'Circular economy programs: 12-18% reduction in production emissions'
          ],
          costBenefitHighlights: [
            `Carbon cost exposure: $${benchmarkData.carbonCostExposure.toLocaleString()} annually from manufacturing`,
            'Energy efficiency upgrades: $380/tonne reduction cost with 3-year payback',
            'Sustainable packaging transition: 15% cost savings through material optimization',
            'Supply chain optimization: 25% logistics cost reduction with environmental benefits'
          ]
        };

      case 'Food & Beverage':
        return {
          performanceVsPeers: [
            ...basePerformance,
            'Refrigeration efficiency improvements outpacing food industry standards',
            'Sustainable agriculture initiatives contributing to scope 1 reduction goals'
          ],
          improvementOpportunities: [
            topSource ? `${topSource.source} optimization through heat recovery could reduce emissions by 20-30%` : 'Focus on thermal process efficiency',
            'Natural refrigerant transition: 65% reduction in refrigeration emissions',
            'Biogas and biomass utilization: $5.8M investment, 4.5 year payback',
            'Cold chain optimization: 18% reduction in refrigeration energy consumption',
            'Waste-to-energy programs: 25% reduction in disposal-related emissions'
          ],
          costBenefitHighlights: [
            `Carbon cost exposure: $${benchmarkData.carbonCostExposure.toLocaleString()} annually from processing operations`,
            'Natural refrigerants: $520/tonne reduction cost with regulatory compliance benefits',
            'Process heat recovery: 28% energy cost savings with immediate implementation',
            'Sustainable sourcing programs: 20% supply chain cost optimization opportunity'
          ]
        };

      case 'Healthcare':
        return {
          performanceVsPeers: [
            ...basePerformance,
            'Medical equipment efficiency leading healthcare sector benchmarks',
            'Energy management systems delivering consistent performance improvements'
          ],
          improvementOpportunities: [
            topSource ? `${topSource.source} optimization through smart building systems could reduce emissions by 12-22%` : 'Focus on facility efficiency',
            'Medical equipment upgrades: 30% reduction in equipment-related emissions',
            'Building automation systems: $2.8M investment, 3.2 year payback',
            'Renewable energy procurement: 45% reduction in purchased electricity emissions',
            'Telemedicine expansion: 15% reduction in facility-based healthcare delivery'
          ],
          costBenefitHighlights: [
            `Carbon cost exposure: $${benchmarkData.carbonCostExposure.toLocaleString()} annually from facility operations`,
            'Energy-efficient medical equipment: $450/tonne reduction cost with operational benefits',
            'Building efficiency upgrades: 20% utility cost savings over 5 years',
            'Regulatory compliance positioning: 30% advantage in healthcare sustainability requirements'
          ]
        };

      case 'Retail':
        return {
          performanceVsPeers: [
            ...basePerformance,
            'Store energy management systems performing above retail industry average',
            'Distribution efficiency initiatives showing strong year-over-year improvements'
          ],
          improvementOpportunities: [
            topSource ? `${topSource.source} optimization through smart HVAC systems could reduce emissions by 18-28%` : 'Focus on store efficiency optimization',
            'LED lighting and smart controls: 35% reduction in store lighting emissions',
            'Natural refrigerant transition: $6.5M investment, 3.8 year payback',
            'Electric delivery fleet: 50% reduction in last-mile distribution emissions',
            'Local supplier programs: 20% reduction in transportation-related emissions'
          ],
          costBenefitHighlights: [
            `Carbon cost exposure: $${benchmarkData.carbonCostExposure.toLocaleString()} annually from store operations`,
            'Store efficiency upgrades: $340/tonne reduction cost with customer experience benefits',
            'Refrigeration system upgrades: 25% energy cost savings with 4-year payback',
            'Early sustainability leadership: 40% brand value advantage in consumer preference studies'
          ]
        };

      default:
        return {
          performanceVsPeers: basePerformance,
          improvementOpportunities: [
            topSource ? `${topSource.source} optimization could reduce emissions by 12-18%` : 'Focus on largest emission sources',
            'Energy efficiency upgrades: 20-30% reduction potential in facility operations',
            'Fleet electrification programs: $4.2M investment, 3.5 year payback',
            'Renewable energy procurement: 35% reduction in purchased electricity emissions',
            'Process optimization initiatives: 15% improvement in operational efficiency'
          ],
          costBenefitHighlights: [
            `Carbon cost exposure: $${benchmarkData.carbonCostExposure.toLocaleString()} annually at current carbon prices`,
            'Energy efficiency projects: $420/tonne reduction cost with 3-year payback',
            'Operational improvements: 18% cost savings through efficiency measures',
            'Early action advantage: 35% lower implementation costs vs delayed action'
          ]
        };
    }
  };

  const insights = getIndustrySpecificInsights();

  const enhancedData: EnhancedScope1Data = {
    trendData: enhancedTrendData,
    sourceData: enhancedSourceData,
    sourceDataByYear: enhancedSourceDataByYear,
    benchmarkData,
    insights
  };

  return { data: enhancedData, isLoading, error };
};
