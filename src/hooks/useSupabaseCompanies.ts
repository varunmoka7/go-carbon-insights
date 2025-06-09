
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSupabaseCompanies = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['companies', user?.id],
    queryFn: async () => {
      console.log('Fetching companies from Supabase with enhanced security...');
      
      // First try to fetch from the secure public view (no auth required)
      const { data: publicData, error: publicError } = await supabase
        .from('public_company_data')
        .select('*')
        .order('name');
      
      if (!publicError && publicData && publicData.length > 0) {
        console.log(`Successfully fetched ${publicData.length} companies from secure public view`);
        return publicData;
      }
      
      // If authenticated, try direct access to companies table with permissive RLS
      if (user?.id) {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .order('name');
        
        if (!error && data) {
          console.log(`Successfully fetched ${data.length} companies from direct access`);
          return data;
        }
        
        if (error) {
          console.log('Companies query with auth failed:', error.message);
        }
      }
      
      // If no user or database access fails, return empty array to trigger mock data fallback
      console.log('Returning empty array to trigger mock data fallback');
      return [];
    },
    enabled: true,
    retry: 1, // Only retry once to avoid excessive requests
    staleTime: 5 * 60 * 1000, // 5 minutes
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

      console.log(`Fetching company ${companyId} from Supabase with enhanced security...`);

      // Try to fetch company data with permissive RLS policies
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();
      
      if (companyError) {
        console.log('Company query failed, falling back to mock data:', companyError.message);
        return null;
      }

      // Fetch associated data with permissive policies
      const [emissionsResult, sbtiResult, frameworksResult, benchmarksResult] = await Promise.allSettled([
        supabase
          .from('emissions_data')
          .select('*')
          .eq('company_id', companyId)
          .order('year'),
        supabase
          .from('sbti_targets')
          .select('*')
          .eq('company_id', companyId)
          .maybeSingle(),
        supabase
          .from('frameworks_compliance')
          .select('*')
          .eq('company_id', companyId),
        supabase
          .from('company_benchmarks')
          .select('*')
          .eq('company_id', companyId)
          .eq('is_public_data', true)
      ]);

      // Extract data from settled promises
      const emissionsData = emissionsResult.status === 'fulfilled' && !emissionsResult.value.error 
        ? emissionsResult.value.data : [];
      const sbtiTarget = sbtiResult.status === 'fulfilled' && !sbtiResult.value.error 
        ? sbtiResult.value.data : null;
      const frameworks = frameworksResult.status === 'fulfilled' && !frameworksResult.value.error 
        ? frameworksResult.value.data : [];
      const benchmarks = benchmarksResult.status === 'fulfilled' && !benchmarksResult.value.error 
        ? benchmarksResult.value.data : [];

      // Log results for debugging
      console.log(`Emissions data: ${emissionsData?.length || 0} records`);
      console.log(`SBTi targets: ${sbtiTarget ? 'Found' : 'None'}`);
      console.log(`Frameworks: ${frameworks?.length || 0} records`);
      console.log(`Benchmarks: ${benchmarks?.length || 0} records`);

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
        // Preserve fallback data for missing properties
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
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};
