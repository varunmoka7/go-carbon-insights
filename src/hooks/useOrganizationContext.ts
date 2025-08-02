// Temporarily disabled organization context due to missing database table
// This hook was trying to query 'organization_members' table which doesn't exist in the current schema

import React, { createContext, useContext } from 'react';

export interface Organization {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: string;
  joined_at: string;
}

interface OrganizationContextType {
  organization: Organization | null;
  membership: OrganizationMember | null;
  isLoading: boolean;
  error: string | null;
  createOrganization: (name: string) => Promise<void>;
  joinOrganization: (organizationId: string) => Promise<void>;
  updateMemberRole: (memberId: string, role: string) => Promise<void>;
  leaveOrganization: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganizationContext = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    // Return default empty context instead of throwing error
    return {
      organization: null,
      membership: null,
      isLoading: false,
      error: null,
      createOrganization: async () => {
        console.warn('Organization functionality is temporarily disabled');
      },
      joinOrganization: async () => {
        console.warn('Organization functionality is temporarily disabled');
      },
      updateMemberRole: async () => {
        console.warn('Organization functionality is temporarily disabled');
      },
      leaveOrganization: async () => {
        console.warn('Organization functionality is temporarily disabled');
      },
    };
  }
  return context;
};

// Temporary provider that returns disabled state
export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value: OrganizationContextType = {
    organization: null,
    membership: null,
    isLoading: false,
    error: null,
    createOrganization: async () => {
      console.warn('Organization functionality is temporarily disabled');
    },
    joinOrganization: async () => {
      console.warn('Organization functionality is temporarily disabled');
    },
    updateMemberRole: async () => {
      console.warn('Organization functionality is temporarily disabled');
    },
    leaveOrganization: async () => {
      console.warn('Organization functionality is temporarily disabled');
    },
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};