
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseScope2Data = (companyId: string) => {
  return useQuery({
    queryKey: ['scope2-data', companyId],
    queryFn: async () => {
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
        .eq('year', 2023); // Get latest year data

      if (sourcesError) {
        console.error('Error fetching scope 2 sources:', sourcesError);
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
          renewablePercent: '65%' // Default value, can be enhanced later
        })) || []
      };
    },
    enabled: !!companyId
  });
};
