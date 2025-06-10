
import { getCompanyById } from '@/data/companyMockData';
import { categorizeScope3Data, generateFallbackScope3Distribution } from './scope3Categorization';

export interface Scope3CategoryData {
  category: string;
  emissions: number;
  percentage: string;
  description: string;
  influenceFactors: string[];
  reductionPotential: string;
  actionable: boolean;
}

export interface EnhancedScope3Data {
  company: {
    id: string;
    name: string;
    sector: string;
    industry: string;
    totalScope3: number;
    scope3Intensity: number;
  };
  categoryData: Scope3CategoryData[];
  trendData: Array<{
    year: number;
    emissions: number;
    upstreamEmissions: number;
    downstreamEmissions: number;
  }>;
  upstreamDownstreamData: ReturnType<typeof categorizeScope3Data>;
  yearlyData: Record<string, Scope3CategoryData[]>;
  insights: {
    keyFindings: string[];
    priorityCategories: string[];
    reductionOpportunities: string[];
    supplierEngagement: string[];
  };
}

const SCOPE3_CATEGORIES = [
  'Purchased Goods & Services',
  'Capital Goods', 
  'Fuel and Energy Related Activities',
  'Transportation & Distribution (Upstream)',
  'Waste Generated in Operations',
  'Business Travel',
  'Employee Commuting',
  'Leased Assets (Upstream)',
  'Transportation & Distribution (Downstream)',
  'Processing of Sold Products',
  'Use of Sold Products',
  'End-of-Life Treatment of Sold Products',
  'Leased Assets (Downstream)',
  'Franchises',
  'Investments'
];

export const generateScope3MockData = (companyId: string): EnhancedScope3Data | null => {
  const company = getCompanyById(companyId);
  
  if (!company) {
    return null;
  }

  const latestEmissions = company.emissionsData[company.emissionsData.length - 1];

  // Industry-specific category distributions
  const getCategoryDistribution = () => {
    switch (company.industry) {
      case 'Technology':
        return {
          'Purchased Goods & Services': 0.45,
          'Use of Sold Products': 0.25,
          'Transportation & Distribution (Upstream)': 0.08,
          'Business Travel': 0.06,
          'Employee Commuting': 0.05,
          'Capital Goods': 0.04,
          'End-of-Life Treatment of Sold Products': 0.03,
          'Fuel and Energy Related Activities': 0.02,
          'Waste Generated in Operations': 0.01,
          'Transportation & Distribution (Downstream)': 0.01
        };
      case 'Automotive':
        return {
          'Purchased Goods & Services': 0.35,
          'Use of Sold Products': 0.30,
          'Transportation & Distribution (Upstream)': 0.12,
          'Capital Goods': 0.08,
          'End-of-Life Treatment of Sold Products': 0.06,
          'Business Travel': 0.03,
          'Employee Commuting': 0.03,
          'Fuel and Energy Related Activities': 0.02,
          'Transportation & Distribution (Downstream)': 0.01
        };
      case 'Energy':
        return {
          'Use of Sold Products': 0.70,
          'Purchased Goods & Services': 0.12,
          'Transportation & Distribution (Upstream)': 0.08,
          'Capital Goods': 0.04,
          'Business Travel': 0.02,
          'Employee Commuting': 0.02,
          'Fuel and Energy Related Activities': 0.01,
          'Transportation & Distribution (Downstream)': 0.01
        };
      case 'Consumer Goods':
      case 'Food & Beverage':
        return {
          'Purchased Goods & Services': 0.40,
          'Use of Sold Products': 0.20,
          'Transportation & Distribution (Upstream)': 0.15,
          'Transportation & Distribution (Downstream)': 0.08,
          'End-of-Life Treatment of Sold Products': 0.06,
          'Capital Goods': 0.04,
          'Business Travel': 0.03,
          'Employee Commuting': 0.02,
          'Waste Generated in Operations': 0.01,
          'Fuel and Energy Related Activities': 0.01
        };
      case 'Retail':
        return {
          'Purchased Goods & Services': 0.50,
          'Transportation & Distribution (Upstream)': 0.20,
          'Use of Sold Products': 0.15,
          'Transportation & Distribution (Downstream)': 0.05,
          'Business Travel': 0.03,
          'Employee Commuting': 0.03,
          'Capital Goods': 0.02,
          'End-of-Life Treatment of Sold Products': 0.01,
          'Waste Generated in Operations': 0.01
        };
      case 'Healthcare':
        return {
          'Purchased Goods & Services': 0.45,
          'Use of Sold Products': 0.20,
          'Transportation & Distribution (Upstream)': 0.12,
          'Business Travel': 0.08,
          'Employee Commuting': 0.05,
          'Capital Goods': 0.04,
          'Waste Generated in Operations': 0.03,
          'End-of-Life Treatment of Sold Products': 0.02,
          'Fuel and Energy Related Activities': 0.01
        };
      default:
        return {
          'Purchased Goods & Services': 0.40,
          'Use of Sold Products': 0.25,
          'Transportation & Distribution (Upstream)': 0.12,
          'Business Travel': 0.08,
          'Employee Commuting': 0.05,
          'Capital Goods': 0.04,
          'End-of-Life Treatment of Sold Products': 0.03,
          'Transportation & Distribution (Downstream)': 0.02,
          'Fuel and Energy Related Activities': 0.01
        };
    }
  };

  const categoryDistribution = getCategoryDistribution();

  // Generate category data for latest year
  const generateCategoryData = (scope3Total: number): Scope3CategoryData[] => {
    return Object.entries(categoryDistribution).map(([category, percentage]) => {
      const emissions = Math.round(scope3Total * percentage);
      
      const getDescription = (cat: string) => {
        switch (cat) {
          case 'Purchased Goods & Services':
            return 'Emissions from purchased goods and services throughout the supply chain';
          case 'Use of Sold Products':
            return 'Emissions from the use phase of sold products by end consumers';
          case 'Transportation & Distribution (Upstream)':
            return 'Transportation and distribution of purchased goods and materials';
          case 'Business Travel':
            return 'Employee business travel via air, rail, and road transport';
          case 'Employee Commuting':
            return 'Employee commuting to and from work';
          case 'Capital Goods':
            return 'Manufacturing of capital equipment and infrastructure';
          default:
            return `Emissions associated with ${cat.toLowerCase()}`;
        }
      };

      const getInfluenceFactors = (cat: string) => {
        switch (cat) {
          case 'Purchased Goods & Services':
            return ['Supplier selection', 'Material choices', 'Supply chain optimization'];
          case 'Use of Sold Products':
            return ['Product design', 'Energy efficiency', 'User behavior'];
          case 'Transportation & Distribution (Upstream)':
            return ['Logistics optimization', 'Modal shift', 'Supplier proximity'];
          case 'Business Travel':
            return ['Travel policies', 'Virtual meetings', 'Transportation choices'];
          default:
            return ['Industry practices', 'Technology adoption', 'Operational efficiency'];
        }
      };

      const getReductionPotential = (cat: string) => {
        switch (cat) {
          case 'Purchased Goods & Services':
            return '30-50%';
          case 'Use of Sold Products':
            return '20-40%';
          case 'Transportation & Distribution (Upstream)':
            return '25-35%';
          case 'Business Travel':
            return '40-60%';
          default:
            return '15-30%';
        }
      };

      return {
        category,
        emissions,
        percentage: `${Math.round(percentage * 100)}%`,
        description: getDescription(category),
        influenceFactors: getInfluenceFactors(category),
        reductionPotential: getReductionPotential(category),
        actionable: ['Purchased Goods & Services', 'Business Travel', 'Employee Commuting', 'Transportation & Distribution (Upstream)'].includes(category)
      };
    });
  };

  const categoryData = generateCategoryData(latestEmissions.scope3);

  // Generate yearly category data
  const yearlyData: Record<string, Scope3CategoryData[]> = {};
  company.emissionsData.forEach(yearData => {
    yearlyData[yearData.year.toString()] = generateCategoryData(yearData.scope3);
  });

  // Generate trend data with upstream/downstream breakdown
  const trendData = company.emissionsData.map(item => {
    const upstreamCategories = ['Purchased Goods & Services', 'Capital Goods', 'Fuel and Energy Related Activities', 
                               'Transportation & Distribution (Upstream)', 'Waste Generated in Operations', 
                               'Business Travel', 'Employee Commuting', 'Leased Assets (Upstream)'];
    
    const yearCategories = generateCategoryData(item.scope3);
    const upstreamEmissions = yearCategories
      .filter(cat => upstreamCategories.includes(cat.category))
      .reduce((sum, cat) => sum + cat.emissions, 0);
    
    return {
      year: item.year,
      emissions: item.scope3,
      upstreamEmissions,
      downstreamEmissions: item.scope3 - upstreamEmissions
    };
  });

  // Calculate upstream/downstream breakdown
  const upstreamDownstreamData = categorizeScope3Data(categoryData);

  // Generate insights
  const topCategories = categoryData
    .sort((a, b) => b.emissions - a.emissions)
    .slice(0, 3)
    .map(cat => cat.category);

  const insights = {
    keyFindings: [
      `Top emission source: ${topCategories[0]} (${categoryData.find(c => c.category === topCategories[0])?.percentage})`,
      `Upstream vs Downstream: ${upstreamDownstreamData.upstream.percentage}% vs ${upstreamDownstreamData.downstream.percentage}%`,
      `${Math.round(((company.emissionsData[0].scope3 - latestEmissions.scope3) / company.emissionsData[0].scope3) * 100)}% reduction since 2019`
    ],
    priorityCategories: topCategories,
    reductionOpportunities: [
      `${topCategories[0]}: Supplier engagement and sustainable sourcing`,
      `${topCategories[1]}: Technology and process optimization`,
      'Business Travel: Virtual meeting adoption and travel policies'
    ],
    supplierEngagement: [
      'Implement supplier carbon assessment program',
      'Set science-based targets for key suppliers',
      'Develop green procurement policies',
      'Collaborate on circular economy initiatives'
    ]
  };

  return {
    company: {
      id: company.id,
      name: company.name,
      sector: company.sector,
      industry: company.industry,
      totalScope3: latestEmissions.scope3,
      scope3Intensity: latestEmissions.scope3 / company.revenue
    },
    categoryData,
    trendData,
    upstreamDownstreamData,
    yearlyData,
    insights
  };
};
