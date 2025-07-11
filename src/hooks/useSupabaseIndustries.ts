import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseIndustries = () => {
  return useQuery({
    queryKey: ['industries'],
    queryFn: async () => {
      console.log('Fetching industries from Supabase...');
      
      const { data, error } = await supabase
        .from('industry_taxonomy')
        .select('*')
        .order('sector, industry');
      
      if (error) {
        console.error('Error fetching industries:', error);
        throw error;
      }
      
      console.log(`Successfully fetched ${data?.length || 0} industries`);
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSupabaseSectors = () => {
  return useQuery({
    queryKey: ['sectors'],
    queryFn: async () => {
      console.log('Fetching sectors from Supabase...');
      
      const { data, error } = await supabase
        .from('industry_taxonomy')
        .select('sector')
        .order('sector');
      
      if (error) {
        console.error('Error fetching sectors:', error);
        throw error;
      }
      
      // Get unique sectors
      const uniqueSectors = [...new Set(data?.map(item => item.sector) || [])];
      console.log(`Successfully fetched ${uniqueSectors.length} unique sectors`);
      
      return uniqueSectors;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};