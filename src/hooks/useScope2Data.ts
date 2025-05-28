
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useScope2Data = (companyId: string) => {
  return useQuery({
    queryKey: ['scope2', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scope2_emissions')
        .select('*')
        .eq('company_id', companyId)
        .order('year');
      
      if (error) throw error;
      
      // Transform data for charts
      const trendData = data.reduce((acc: any[], curr) => {
        const existingYear = acc.find(item => item.year === curr.year.toString());
        if (existingYear) {
          existingYear.emissions += curr.emissions_by_source;
        } else {
          acc.push({
            year: curr.year.toString(),
            emissions: curr.emissions_by_source
          });
        }
        return acc;
      }, []);

      const sourceData = data.reduce((acc: any[], curr) => {
        const existingSource = acc.find(item => item.source === curr.source);
        if (existingSource) {
          existingSource.emissions += curr.emissions_by_source;
        } else {
          acc.push({
            source: curr.source,
            emissions: curr.emissions_by_source
          });
        }
        return acc;
      }, []);

      const locationData = data
        .filter(item => item.location)
        .reduce((acc: any[], curr) => {
          const existingLocation = acc.find(item => item.location === curr.location);
          if (existingLocation) {
            existingLocation.emissions += curr.emissions_by_source;
          } else {
            acc.push({
              location: curr.location,
              emissions: curr.emissions_by_source,
              percentage: curr.percentage || '0%'
            });
          }
          return acc;
        }, []);

      return { trendData, sourceData, locationData };
    },
    enabled: !!companyId,
  });
};
