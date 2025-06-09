
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PublicCompanyData {
  id: string;
  name: string;
  industry: string;
  sector?: string;
  description?: string;
  total_emissions?: number;
  benchmark_year?: number;
  sbti_status?: string;
}

export const useSecurePublicData = () => {
  return useQuery({
    queryKey: ['secure-public-company-data'],
    queryFn: async () => {
      console.log('Fetching data from secure public_company_data view...');
      
      const { data, error } = await supabase
        .from('public_company_data')
        .select('*')
        .order('total_emissions', { ascending: false, nullsFirst: false });
      
      if (error) {
        console.error('Error fetching secure public data:', error);
        // Don't throw error, return empty array to trigger fallback
        return [];
      }
      
      console.log(`Fetched ${data?.length || 0} public company records securely`);
      return data as PublicCompanyData[];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSecurityTest = () => {
  return useQuery({
    queryKey: ['security-test'],
    queryFn: async () => {
      console.log('Running security test...');
      
      const { data, error } = await supabase.rpc('test_view_security');
      
      if (error) {
        console.error('Security test failed:', error);
        // Return empty array instead of throwing to prevent UI breaks
        return [];
      }
      
      console.log('Security test results:', data);
      return data;
    },
    enabled: false, // Only run when explicitly called
    retry: 1,
  });
};
