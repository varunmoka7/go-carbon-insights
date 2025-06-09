
import { useSupabaseScope2Data } from './useSupabaseScope2';
import { getCompanyById } from '@/data/companyMockData';
import { EnhancedScope2Data } from '@/types/scope2Types';
import { generateScope2MockData } from '@/utils/scope2DataGenerator';

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

  return {
    data: generateScope2MockData(company),
    isLoading: supabaseQuery.isLoading,
    error: supabaseQuery.error
  };
};

export type { EnhancedScope2Data };
