
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSupabaseSBTITargets = (companyId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['sbti-targets', companyId, user?.id],
    queryFn: async () => {
      if (!user?.id || !companyId) {
        throw new Error('User not authenticated or company ID missing');
      }

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
    enabled: !!companyId && !!user?.id
  });
};

export const useSupabaseSBTIPathway = (companyId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['sbti-pathway', companyId, user?.id],
    queryFn: async () => {
      if (!user?.id || !companyId) {
        throw new Error('User not authenticated or company ID missing');
      }

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
    enabled: !!companyId && !!user?.id
  });
};
