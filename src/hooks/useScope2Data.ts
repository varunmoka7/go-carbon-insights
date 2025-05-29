
import { getCompanyById } from '@/data/enhancedMockData';

export const useScope2Data = (companyId: string) => {
  const company = getCompanyById(companyId);
  
  if (!company) {
    return {
      data: null,
      isLoading: false,
      error: new Error('Company not found')
    };
  }

  const scope2Data = {
    trendData: company.emissionsData.map(item => ({
      year: item.year,
      emissions: item.scope2,
      marketBased: item.scope2,
      locationBased: item.scope2 * 1.15
    })),
    sourceData: [
      { source: 'Purchased Electricity', emissions: company.emissionsData[5]?.scope2 * 0.7 || 23450 },
      { source: 'Steam & Heating', emissions: company.emissionsData[5]?.scope2 * 0.2 || 6700 },
      { source: 'Cooling', emissions: company.emissionsData[5]?.scope2 * 0.1 || 3350 }
    ],
    locationData: [
      { location: 'North America', emissions: (company.emissionsData[5]?.scope2 * 0.45) || 15075, percentage: '45%', renewablePercent: '65%' },
      { location: 'Europe', emissions: (company.emissionsData[5]?.scope2 * 0.30) || 10050, percentage: '30%', renewablePercent: '80%' },
      { location: 'Asia Pacific', emissions: (company.emissionsData[5]?.scope2 * 0.25) || 8375, percentage: '25%', renewablePercent: '45%' }
    ]
  };

  return {
    data: scope2Data,
    isLoading: false,
    error: null
  };
};
