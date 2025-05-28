
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSBTITargets = (companyId: string) => {
  return useQuery({
    queryKey: ['sbti', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sbti_targets')
        .select('*')
        .eq('company_id', companyId)
        .single();
      
      if (error) throw error;
      
      return {
        nearTerm2030: {
          scope1And2Reduction: data.near_term_2030_scope1_2,
          scope3Reduction: data.near_term_2030_scope3
        },
        currentProgress: {
          scope1And2Achieved: data.current_progress_scope1_2,
          scope3Achieved: data.current_progress_scope3
        }
      };
    },
    enabled: !!companyId,
  });
};
