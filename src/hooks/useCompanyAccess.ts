
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
      if (!user?.id) {
        console.log('No authenticated user, cannot fetch company access');
        return [];
      }
      
      console.log('Fetching user company access...');
      
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
        console.log('User company access query failed (expected with RLS):', error.message);
        return [];
      }
      
      console.log(`User has access to ${data?.length || 0} companies`);
      return data || [];
    },
    enabled: !!user?.id,
    retry: false, // Don't retry on RLS failures
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
      
      console.log('Granting company access...');
      
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
