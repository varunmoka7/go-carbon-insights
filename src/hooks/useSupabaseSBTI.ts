
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseSBTITargets = (companyId: string) => {
  return useQuery({
    queryKey: ['sbti-targets', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sbti_targets')
        .select('*')
        .eq('company_id', companyId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching SBTi targets:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!companyId
  });
};

export const useSupabaseSBTIPathway = (companyId: string) => {
  return useQuery({
    queryKey: ['sbti-pathway', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sbti_pathway_data')
        .select('*')
        .eq('company_id', companyId)
        .order('year');
      
      if (error) {
        console.error('Error fetching SBTi pathway data:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!companyId
  });
};
