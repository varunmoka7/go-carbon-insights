
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseScope1Data = (companyId: string) => {
  return useQuery({
    queryKey: ['scope1-data', companyId],
    queryFn: async () => {
      // Get emissions trend data
      const { data: emissionsData, error: emissionsError } = await supabase
        .from('emissions_data')
        .select('year, scope1')
        .eq('company_id', companyId)
        .order('year');

      if (emissionsError) {
        console.error('Error fetching emissions data:', emissionsError);
        throw emissionsError;
      }

      // Get scope 1 sources
      const { data: sourcesData, error: sourcesError } = await supabase
        .from('scope1_emissions')
        .select('source, emissions_by_source')
        .eq('company_id', companyId)
        .eq('year', 2024); // Get latest year data

      if (sourcesError) {
        console.error('Error fetching scope 1 sources:', sourcesError);
      }

      return {
        trendData: emissionsData?.map(item => ({
          year: item.year,
          emissions: item.scope1
        })) || [],
        sourceData: sourcesData?.map(item => ({
          source: item.source,
          emissions: item.emissions_by_source
        })) || []
      };
    },
    enabled: !!companyId
  });
};
