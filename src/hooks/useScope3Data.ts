
import { getCompanyById } from '@/data/mockData';

export const useScope3Data = (companyId: string) => {
  const company = getCompanyById(companyId);
  
  if (!company) {
    return {
      data: null,
      isLoading: false,
      error: new Error('Company not found')
    };
  }

  // Generate scope 3 data structure
  const scope3Data = {
    trendData: company.emissionsData.map(item => ({
      year: item.year,
      emissions: item.scope3
    })),
    categoryData: [
      {
        category: 'Purchased Goods & Services',
        emissions: '1,200',
        influenceFactors: 'Supplier engagement, sustainable procurement',
        insights: 'Focus on supplier carbon requirements and local sourcing'
      },
      {
        category: 'Business Travel',
        emissions: '180',
        influenceFactors: 'Travel policy, virtual meetings adoption',
        insights: 'Implement virtual-first meeting policy and efficient routes'
      },
      {
        category: 'Employee Commuting',
        emissions: '150',
        influenceFactors: 'Remote work policy, public transport incentives',
        insights: 'Promote hybrid work model and sustainable transport'
      },
      {
        category: 'Waste Generated',
        emissions: '70',
        influenceFactors: 'Circular design, recycling programs',
        insights: 'Implement waste prevention and composting programs'
      }
    ]
  };

  return {
    data: scope3Data,
    isLoading: false,
    error: null
  };
};
