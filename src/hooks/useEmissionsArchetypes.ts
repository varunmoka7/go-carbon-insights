import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEmissionsArchetypes = () => {
  return useQuery({
    queryKey: ['emissions-archetypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emissions_archetypes')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};