
import { useSupabaseScope3Data } from './useSupabaseScope3';
import { getCompanyById } from '@/data/enhancedMockData';

export const useScope3Data = (companyId: string) => {
  const supabaseQuery = useSupabaseScope3Data(companyId);
  
  // Always provide fallback data to ensure charts display
  const company = getCompanyById(companyId);
  
  if (!company) {
    return {
      data: null,
      isLoading: supabaseQuery.isLoading,
      error: supabaseQuery.error || new Error('Company not found')
    };
  }

  // Generate comprehensive scope 3 data structure based on company
  const getScope3DataForCompany = () => {
    const baseEmissions = company.emissionsData[company.emissionsData.length - 1]?.scope3 || 1750;
    
    return {
      trendData: company.emissionsData.map(item => ({
        year: item.year,
        emissions: item.scope3
      })),
      categoryData: [
        {
          category: 'Purchased Goods & Services',
          emissions: Math.round(baseEmissions * 0.45).toString(),
          influenceFactors: 'Supplier engagement, sustainable procurement',
          insights: 'Focus on supplier carbon requirements and local sourcing'
        },
        {
          category: 'Capital Goods',
          emissions: Math.round(baseEmissions * 0.12).toString(),
          influenceFactors: 'Equipment selection, lifecycle assessment',
          insights: 'Prioritize energy-efficient equipment and circular design'
        },
        {
          category: 'Fuel & Energy Related Activities',
          emissions: Math.round(baseEmissions * 0.08).toString(),
          influenceFactors: 'Energy mix, transmission losses',
          insights: 'Switch to renewable energy sources and improve efficiency'
        },
        {
          category: 'Transportation & Distribution (Upstream)',
          emissions: Math.round(baseEmissions * 0.06).toString(),
          influenceFactors: 'Logistics optimization, supplier location',
          insights: 'Optimize supply chain routes and use low-carbon transport'
        },
        {
          category: 'Waste Generated in Operations',
          emissions: Math.round(baseEmissions * 0.03).toString(),
          influenceFactors: 'Waste management, recycling programs',
          insights: 'Implement waste prevention and composting programs'
        },
        {
          category: 'Business Travel',
          emissions: Math.round(baseEmissions * 0.05).toString(),
          influenceFactors: 'Travel policy, virtual meetings adoption',
          insights: 'Implement virtual-first meeting policy and efficient routes'
        },
        {
          category: 'Employee Commuting',
          emissions: Math.round(baseEmissions * 0.04).toString(),
          influenceFactors: 'Remote work policy, public transport incentives',
          insights: 'Promote hybrid work model and sustainable transport'
        },
        {
          category: 'Leased Assets (Upstream)',
          emissions: Math.round(baseEmissions * 0.02).toString(),
          influenceFactors: 'Lease agreements, asset efficiency',
          insights: 'Include carbon criteria in leasing decisions'
        },
        {
          category: 'Transportation & Distribution (Downstream)',
          emissions: Math.round(baseEmissions * 0.04).toString(),
          influenceFactors: 'Distribution network, customer location',
          insights: 'Optimize distribution and offer local pickup options'
        },
        {
          category: 'Processing of Sold Products',
          emissions: Math.round(baseEmissions * 0.03).toString(),
          influenceFactors: 'Product design, processing requirements',
          insights: 'Design products for minimal processing needs'
        },
        {
          category: 'Use of Sold Products',
          emissions: Math.round(baseEmissions * 0.08).toString(),
          influenceFactors: 'Product efficiency, user behavior',
          insights: 'Improve product energy efficiency and user education'
        },
        {
          category: 'End-of-Life Treatment of Sold Products',
          emissions: Math.round(baseEmissions * 0.02).toString(),
          influenceFactors: 'Product recyclability, disposal methods',
          insights: 'Design for circularity and establish take-back programs'
        },
        {
          category: 'Leased Assets (Downstream)',
          emissions: Math.round(baseEmissions * 0.01).toString(),
          influenceFactors: 'Asset utilization, tenant behavior',
          insights: 'Provide guidance for efficient asset use'
        },
        {
          category: 'Franchises',
          emissions: Math.round(baseEmissions * 0.01).toString(),
          influenceFactors: 'Franchise operations, standardization',
          insights: 'Implement carbon standards across franchise network'
        },
        {
          category: 'Investments',
          emissions: Math.round(baseEmissions * 0.01).toString(),
          influenceFactors: 'Investment portfolio, ESG criteria',
          insights: 'Apply ESG criteria to investment decisions'
        }
      ]
    };
  };

  // Use Supabase data if available, otherwise use enhanced fallback
  if (supabaseQuery.data?.trendData?.length && supabaseQuery.data?.categoryData?.length) {
    return supabaseQuery;
  }

  return {
    data: getScope3DataForCompany(),
    isLoading: false,
    error: null
  };
};
