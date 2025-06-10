
import { useSupabaseScope2Data } from './useSupabaseScope2';
import { generateScope2MockData } from '@/utils/scope2DataGenerator';
import { getCompanyById } from '@/data/companyMockData';

export const useEnhancedScope2Data = (companyId: string) => {
  const supabaseQuery = useSupabaseScope2Data(companyId);
  
  // Get company data
  const company = getCompanyById(companyId);
  
  if (!company) {
    return {
      data: null,
      isLoading: supabaseQuery.isLoading,
      error: supabaseQuery.error || new Error('Company not found')
    };
  }

  // Always return generated mock data for now
  const mockData = generateScope2MockData(companyId);
  
  return {
    data: mockData,
    isLoading: supabaseQuery.isLoading,
    error: supabaseQuery.error
  };
};

export type { EnhancedScope2Data } from '@/types/scope2Types';
