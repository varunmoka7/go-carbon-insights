
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSupabaseScope2Data = (companyId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['scope2-data', companyId, user?.id],
    queryFn: async () => {
      if (!user?.id || !companyId) {
        throw new Error('User not authenticated or company ID missing');
      }

      // Get emissions trend data
      const { data: emissionsData, error: emissionsError } = await supabase
        .from('emissions_data')
        .select('year, scope2')
        .eq('company_id', companyId)
        .order('year');

      if (emissionsError) {
        console.error('Error fetching emissions data:', emissionsError);
        throw emissionsError;
      }

      // Get scope 2 sources for latest year
      const { data: sourcesData, error: sourcesError } = await supabase
        .from('scope2_emissions')
        .select('source, emissions_by_source, location, percentage')
        .eq('company_id', companyId)
        .eq('year', 2023);

      if (sourcesError) {
        console.error('Error fetching scope 2 sources:', sourcesError);
        // Don't throw - user might not have access to detailed data
      }

      return {
        trendData: emissionsData?.map(item => ({
          year: item.year,
          emissions: item.scope2,
          marketBased: item.scope2,
          locationBased: item.scope2 * 1.15
        })) || [],
        sourceData: sourcesData?.map(item => ({
          source: item.source,
          emissions: item.emissions_by_source
        })) || [],
        locationData: sourcesData?.filter(item => item.location).map(item => ({
          location: item.location!,
          emissions: item.emissions_by_source,
          percentage: item.percentage || '0%',
          renewablePercent: '65%'
        })) || []
      };
    },
    enabled: !!companyId && !!user?.id
  });
};
