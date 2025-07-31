import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface Organization {
  id: string;
  name: string;
  industry_id?: string;
  size_category?: 'small' | 'medium' | 'large';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  invited_at: string;
  joined_at?: string;
}

export interface OrganizationPrivacySettings {
  id: string;
  organization_id: string;
  share_benchmarking: boolean;
  share_aggregated: boolean;
  anonymize_data: boolean;
  retention_period_days: number;
  updated_at: string;
}

interface UseOrganizationContextReturn {
  currentOrganization: Organization | null;
  organizationMembers: OrganizationMember[];
  privacySettings: OrganizationPrivacySettings | null;
  userRole: 'owner' | 'admin' | 'member' | 'viewer' | null;
  isLoading: boolean;
  error: string | null;
  createOrganization: (data: Partial<Organization>) => Promise<{ success: boolean; error?: string }>;
  updateOrganization: (data: Partial<Organization>) => Promise<{ success: boolean; error?: string }>;
  inviteMember: (email: string, role: OrganizationMember['role']) => Promise<{ success: boolean; error?: string }>;
  updatePrivacySettings: (settings: Partial<OrganizationPrivacySettings>) => Promise<{ success: boolean; error?: string }>;
  refreshOrganization: () => Promise<void>;
}

const useOrganizationContext = (): UseOrganizationContextReturn => {
  const { user } = useAuth();
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizationMembers, setOrganizationMembers] = useState<OrganizationMember[]>([]);
  const [privacySettings, setPrivacySettings] = useState<OrganizationPrivacySettings | null>(null);
  const [userRole, setUserRole] = useState<'owner' | 'admin' | 'member' | 'viewer' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user's organization on mount
  useEffect(() => {
    if (user) {
      loadUserOrganization();
    } else {
      setCurrentOrganization(null);
      setOrganizationMembers([]);
      setPrivacySettings(null);
      setUserRole(null);
      setIsLoading(false);
    }
  }, [user]);

  const loadUserOrganization = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get user's organization membership
      const { data: memberships, error: membershipError } = await supabase
        .from('organization_members')
        .select(`
          *,
          organizations (*)
        `)
        .eq('user_id', user.id);

      if (membershipError) throw membershipError;

      if (memberships && memberships.length > 0) {
        const membership = memberships[0];
        const organization = membership.organizations as Organization;
        
        setCurrentOrganization(organization);
        setUserRole(membership.role);

        // Load organization members
        await loadOrganizationMembers(organization.id);
        
        // Load privacy settings
        await loadPrivacySettings(organization.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load organization');
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrganizationMembers = async (organizationId: string) => {
    try {
      const { data: members, error } = await supabase
        .from('organization_members')
        .select('*')
        .eq('organization_id', organizationId);

      if (error) throw error;
      setOrganizationMembers(members || []);
    } catch (err) {
      console.error('Failed to load organization members:', err);
    }
  };

  const loadPrivacySettings = async (organizationId: string) => {
    try {
      const { data: settings, error } = await supabase
        .from('organization_privacy_settings')
        .select('*')
        .eq('organization_id', organizationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      setPrivacySettings(settings);
    } catch (err) {
      console.error('Failed to load privacy settings:', err);
    }
  };

  const createOrganization = async (data: Partial<Organization>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Create organization
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .insert({
          ...data,
          created_by: user.id
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Add user as owner
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: organization.id,
          user_id: user.id,
          role: 'owner',
          joined_at: new Date().toISOString()
        });

      if (memberError) throw memberError;

      // Create default privacy settings
      const { error: privacyError } = await supabase
        .from('organization_privacy_settings')
        .insert({
          organization_id: organization.id,
          share_benchmarking: false,
          share_aggregated: false,
          anonymize_data: true,
          retention_period_days: 2555
        });

      if (privacyError) throw privacyError;

      // Refresh organization data
      await loadUserOrganization();

      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create organization' };
    }
  };

  const updateOrganization = async (data: Partial<Organization>): Promise<{ success: boolean; error?: string }> => {
    if (!currentOrganization) return { success: false, error: 'No organization selected' };

    try {
      const { error } = await supabase
        .from('organizations')
        .update(data)
        .eq('id', currentOrganization.id);

      if (error) throw error;

      // Refresh organization data
      await loadUserOrganization();

      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update organization' };
    }
  };

  const inviteMember = async (email: string, role: OrganizationMember['role']): Promise<{ success: boolean; error?: string }> => {
    if (!currentOrganization) return { success: false, error: 'No organization selected' };

    try {
      // TODO: Implement actual invitation logic (email sending, etc.)
      // For now, just create a placeholder invitation
      const { error } = await supabase
        .from('organization_members')
        .insert({
          organization_id: currentOrganization.id,
          user_id: 'placeholder', // This would be resolved when user accepts invitation
          role,
          invited_at: new Date().toISOString()
        });

      if (error) throw error;

      // Refresh members list
      await loadOrganizationMembers(currentOrganization.id);

      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to invite member' };
    }
  };

  const updatePrivacySettings = async (settings: Partial<OrganizationPrivacySettings>): Promise<{ success: boolean; error?: string }> => {
    if (!currentOrganization) return { success: false, error: 'No organization selected' };

    try {
      const { error } = await supabase
        .from('organization_privacy_settings')
        .upsert({
          organization_id: currentOrganization.id,
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Refresh privacy settings
      await loadPrivacySettings(currentOrganization.id);

      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update privacy settings' };
    }
  };

  const refreshOrganization = useCallback(async () => {
    await loadUserOrganization();
  }, [user]);

  return {
    currentOrganization,
    organizationMembers,
    privacySettings,
    userRole,
    isLoading,
    error,
    createOrganization,
    updateOrganization,
    inviteMember,
    updatePrivacySettings,
    refreshOrganization
  };
};

export default useOrganizationContext; 