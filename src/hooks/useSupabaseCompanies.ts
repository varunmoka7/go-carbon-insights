
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSupabaseCompanies = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['companies', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No authenticated user, returning empty companies list');
        return [];
      }

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id
  });
};

export const useSupabaseCompany = (companyId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['company', companyId, user?.id],
    queryFn: async () => {
      if (!user?.id || !companyId) {
        throw new Error('User not authenticated or company ID missing');
      }

      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();
      
      if (companyError) {
        console.error('Error fetching company:', companyError);
        throw companyError;
      }

      // Fetch emissions data - only accessible if user has company access
      const { data: emissionsData, error: emissionsError } = await supabase
        .from('emissions_data')
        .select('*')
        .eq('company_id', companyId)
        .order('year');

      if (emissionsError) {
        console.error('Error fetching emissions data:', emissionsError);
        // Don't throw error - user might not have access to private data
      }

      // Fetch SBTi targets - accessible based on company access
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

      // Fetch public benchmark data (accessible to all users)
      const { data: benchmarks, error: benchmarksError } = await supabase
        .from('company_benchmarks')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_public_data', true);

      if (benchmarksError) {
        console.error('Error fetching benchmarks:', benchmarksError);
      }

      return {
        ...company,
        emissionsData: emissionsData || [],
        sbtiTargets: sbtiTarget,
        frameworks: frameworks || [],
        benchmarks: benchmarks || [],
        // Calculate total emissions from latest year
        totalEmissions: emissionsData && emissionsData.length > 0 
          ? emissionsData[emissionsData.length - 1].scope1 + 
            emissionsData[emissionsData.length - 1].scope2 + 
            emissionsData[emissionsData.length - 1].scope3
          : 0,
        // Add mock data for properties not in database yet (fallback for missing data)
        topCarbonFootprints: company?.top_carbon_footprints || [
          'Manufacturing Operations',
          'Supply Chain Transport',
          'Employee Commuting'
        ],
        energyConsumption: company?.energy_consumption || 50000,
        wasteGenerated: company?.waste_generated || 2500,
        renewableEnergyPercentage: company?.renewable_energy_percentage || 45,
        sbtiProgress: sbtiTarget?.progress_percentage || 0
      };
    },
    enabled: !!companyId && !!user?.id
  });
};
