import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useIndustryTaxonomy = (emissionsArchetype?: string) => {
  return useQuery({
    queryKey: ['industry-taxonomy', emissionsArchetype],
    queryFn: async () => {
      let query = supabase
        .from('industry_taxonomy')
        .select('*')
        .order('sector', { ascending: true })
        .order('industry', { ascending: true });
      
      if (emissionsArchetype) {
        query = query.eq('emissions_archetype', emissionsArchetype);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: true,
  });
};