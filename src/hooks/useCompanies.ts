
import { useSupabaseCompanies, useSupabaseCompany } from './useSupabaseCompanies';
import { enhancedCompanies, getCompanyById as getMockCompanyById } from '@/data/enhancedMockData';

export const useCompanies = () => {
  const supabaseQuery = useSupabaseCompanies();
  
  // If Supabase data is loading or there's an error, fallback to mock data
  if (supabaseQuery.isLoading || supabaseQuery.error || !supabaseQuery.data?.length) {
    return {
      data: enhancedCompanies,
      isLoading: supabaseQuery.isLoading,
      error: supabaseQuery.error
    };
  }

  return supabaseQuery;
};

export const useCompany = (companyId: string) => {
  const supabaseQuery = useSupabaseCompany(companyId);
  
  // If Supabase data is loading or there's an error, fallback to mock data
  if (supabaseQuery.isLoading || supabaseQuery.error || !supabaseQuery.data) {
    const mockCompany = getMockCompanyById(companyId);
    return {
      data: mockCompany,
      isLoading: supabaseQuery.isLoading,
      error: supabaseQuery.error || (mockCompany ? null : new Error('Company not found'))
    };
  }

  return supabaseQuery;
};
