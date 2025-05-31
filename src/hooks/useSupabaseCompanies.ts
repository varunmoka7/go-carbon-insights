
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};

export const useSupabaseCompany = (companyId: string) => {
  return useQuery({
    queryKey: ['company', companyId],
    queryFn: async () => {
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();
      
      if (companyError) {
        console.error('Error fetching company:', companyError);
        throw companyError;
      }

      // Fetch emissions data
      const { data: emissionsData, error: emissionsError } = await supabase
        .from('emissions_data')
        .select('*')
        .eq('company_id', companyId)
        .order('year');

      if (emissionsError) {
        console.error('Error fetching emissions data:', emissionsError);
      }

      // Fetch SBTi targets
      const { data: sbtiTarget, error: sbtiError } = await supabase
        .from('sbti_targets')
        .select('*')
        .eq('company_id', companyId)
        .maybeSingle();

      if (sbtiError) {
        console.error('Error fetching SBTi targets:', sbtiError);
      }

      // Fetch frameworks compliance
      const { data: frameworks, error: frameworksError } = await supabase
        .from('frameworks_compliance')
        .select('*')
        .eq('company_id', companyId);

      if (frameworksError) {
        console.error('Error fetching frameworks:', frameworksError);
      }

      return {
        ...company,
        emissionsData: emissionsData || [],
        sbtiTargets: sbtiTarget,
        frameworks: frameworks || [],
        // Calculate total emissions from latest year
        totalEmissions: emissionsData && emissionsData.length > 0 
          ? emissionsData[emissionsData.length - 1].scope1 + 
            emissionsData[emissionsData.length - 1].scope2 + 
            emissionsData[emissionsData.length - 1].scope3
          : 0
      };
    },
    enabled: !!companyId
  });
};
