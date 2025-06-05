
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSupabaseCompanies = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['companies', user?.id],
    queryFn: async () => {
      console.log('Fetching companies from Supabase...');
      
      // Try to fetch companies from Supabase with new RLS policies
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');
      
      if (error) {
        console.log('Supabase companies query failed (expected with RLS):', error.message);
        // Return empty array to trigger fallback to mock data in useCompanies hook
        return [];
      }
      
      console.log(`Successfully fetched ${data?.length || 0} companies from Supabase`);
      return data || [];
    },
    enabled: true, // Always try to fetch, even without auth
    retry: false, // Don't retry on RLS failures
  });
};

export const useSupabaseCompany = (companyId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['company', companyId, user?.id],
    queryFn: async () => {
      if (!companyId) {
        throw new Error('Company ID is required');
      }

      console.log(`Fetching company ${companyId} from Supabase...`);

      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();
      
      if (companyError) {
        console.log('Supabase company query failed (expected with RLS):', companyError.message);
        // Return null to trigger fallback to mock data
        return null;
      }

      // Try to fetch emissions data - will fail if user doesn't have access
      const { data: emissionsData, error: emissionsError } = await supabase
        .from('emissions_data')
        .select('*')
        .eq('company_id', companyId)
        .order('year');

      if (emissionsError) {
        console.log('Emissions data access restricted (expected with RLS):', emissionsError.message);
      }

      // Try to fetch SBTi targets
      const { data: sbtiTarget, error: sbtiError } = await supabase
        .from('sbti_targets')
        .select('*')
        .eq('company_id', companyId)
        .maybeSingle();

      if (sbtiError) {
        console.log('SBTi data access restricted (expected with RLS):', sbtiError.message);
      }

      // Try to fetch frameworks compliance
      const { data: frameworks, error: frameworksError } = await supabase
        .from('frameworks_compliance')
        .select('*')
        .eq('company_id', companyId);

      if (frameworksError) {
        console.log('Frameworks data access restricted (expected with RLS):', frameworksError.message);
      }

      // Try to fetch public benchmark data
      const { data: benchmarks, error: benchmarksError } = await supabase
        .from('company_benchmarks')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_public_data', true);

      if (benchmarksError) {
        console.log('Benchmarks data access restricted (expected with RLS):', benchmarksError.message);
      }

      return {
        ...company,
        emissionsData: emissionsData || [],
        sbtiTargets: sbtiTarget,
        frameworks: frameworks || [],
        benchmarks: benchmarks || [],
        // Calculate total emissions from latest year if data is available
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
    enabled: !!companyId,
    retry: false, // Don't retry on RLS failures
  });
};
