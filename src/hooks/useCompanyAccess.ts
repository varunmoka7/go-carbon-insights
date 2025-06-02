
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CompanyAccess {
  id: string;
  user_id: string;
  company_id: string;
  access_level: 'owner' | 'admin' | 'analyst' | 'viewer';
  granted_by?: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
}

export const useUserCompanyAccess = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-company-access', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_company_access')
        .select(`
          *,
          companies:company_id (
            id,
            name,
            industry,
            sector
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching company access:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id
  });
};

export const useGrantCompanyAccess = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (accessData: {
      user_id: string;
      company_id: string;
      access_level: 'owner' | 'admin' | 'analyst' | 'viewer';
      expires_at?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_company_access')
        .insert({
          ...accessData,
          granted_by: user.id
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error granting company access:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-company-access'] });
    }
  });
};
