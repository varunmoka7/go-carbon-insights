
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useScope3Data = (companyId: string) => {
  return useQuery({
    queryKey: ['scope3', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scope3_emissions')
        .select('*')
        .eq('company_id', companyId)
        .order('year');
      
      if (error) throw error;
      
      // Transform data for charts
      const trendData = data.reduce((acc: any[], curr) => {
        const existingYear = acc.find(item => item.year === curr.year.toString());
        if (existingYear) {
          existingYear.emissions += curr.emissions_by_category;
        } else {
          acc.push({
            year: curr.year.toString(),
            emissions: curr.emissions_by_category
          });
        }
        return acc;
      }, []);

      const categoryData = data.reduce((acc: any[], curr) => {
        const existingCategory = acc.find(item => item.category === curr.category);
        if (existingCategory) {
          existingCategory.emissions += curr.emissions_by_category;
        } else {
          acc.push({
            category: curr.category,
            emissions: curr.emissions_by_category,
            influenceFactors: curr.influence_factors || '',
            insights: curr.insights || ''
          });
        }
        return acc;
      }, []);

      return { trendData, categoryData };
    },
    enabled: !!companyId,
  });
};
