
import { useSupabaseScope2Data } from './useSupabaseScope2';
import { getCompanyById } from '@/data/enhancedMockData';

export const useScope2Data = (companyId: string) => {
  const supabaseQuery = useSupabaseScope2Data(companyId);
  
  // If Supabase data is loading or there's an error, fallback to mock data
  if (supabaseQuery.isLoading || supabaseQuery.error || !supabaseQuery.data?.trendData?.length) {
    const company = getCompanyById(companyId);
    
    if (!company) {
      return {
        data: null,
        isLoading: supabaseQuery.isLoading,
        error: supabaseQuery.error || new Error('Company not found')
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
      isLoading: supabaseQuery.isLoading,
      error: supabaseQuery.error
    };
  }

  return supabaseQuery;
};
