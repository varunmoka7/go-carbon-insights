
import { useSupabaseCompanies, useSupabaseCompany } from './useSupabaseCompanies';
import { companies, getCompanyById as getMockCompanyById } from '@/data/companyMockData';
import { PublicCompanyData } from './useSecurePublicData';

// Transform mock data to match the secure public view structure
const transformMockDataToPublicStructure = (mockCompanies: typeof companies): PublicCompanyData[] => {
  return mockCompanies.map(company => ({
    id: company.id,
    name: company.name,
    industry: company.industry || 'Unknown',
    sector: company.sector,
    description: company.description,
    total_emissions: company.carbon_footprint || undefined,
    benchmark_year: 2024, // Default benchmark year for mock data
    sbti_status: undefined
  }));
};

export const useCompanies = () => {
  const supabaseQuery = useSupabaseCompanies();
  
  // If Supabase data is loading or there's an error, fallback to transformed mock data
  if (supabaseQuery.isLoading || supabaseQuery.error || !supabaseQuery.data?.length) {
    const transformedMockData = transformMockDataToPublicStructure(companies);
    return {
      data: transformedMockData,
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
    
    // Transform mock company to include expected properties
    if (mockCompany) {
      const transformedCompany = {
        ...mockCompany,
        total_emissions: mockCompany.carbon_footprint,
        benchmark_year: 2024,
        sbti_status: undefined
      };
      
      return {
        data: transformedCompany,
        isLoading: supabaseQuery.isLoading,
        error: null
      };
    }
    
    return {
      data: null,
      isLoading: supabaseQuery.isLoading,
      error: supabaseQuery.error || new Error('Company not found')
    };
  }

  return supabaseQuery;
};
