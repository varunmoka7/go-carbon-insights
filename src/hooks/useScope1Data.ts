
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useScope1Data = (companyId: string) => {
  return useQuery({
    queryKey: ['scope1', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scope1_emissions')
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

      return { trendData, sourceData };
    },
    enabled: !!companyId,
  });
};
