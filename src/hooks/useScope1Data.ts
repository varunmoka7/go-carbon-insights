
import { useSupabaseScope1Data } from './useSupabaseScope1';
import { getCompanyById } from '@/data/enhancedMockData';

export const useScope1Data = (companyId: string) => {
  const supabaseQuery = useSupabaseScope1Data(companyId);
  
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

    const scope1Data = {
      trendData: company.emissionsData.map(item => ({
        year: item.year,
        emissions: item.scope1
      })),
      sourceData: [
        { source: 'Natural Gas', emissions: company.emissionsData[5]?.scope1 * 0.4 || 4600 },
        { source: 'Diesel Fuel', emissions: company.emissionsData[5]?.scope1 * 0.3 || 3450 },
        { source: 'Company Vehicles', emissions: company.emissionsData[5]?.scope1 * 0.2 || 2300 },
        { source: 'Refrigerants', emissions: company.emissionsData[5]?.scope1 * 0.1 || 1150 }
      ]
    };

    return {
      data: scope1Data,
      isLoading: supabaseQuery.isLoading,
      error: supabaseQuery.error
    };
  }

  return supabaseQuery;
};
