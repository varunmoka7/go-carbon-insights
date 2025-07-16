
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DonationFormData } from '@/types/donation';

interface DonationContextType {
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  lastDonationId: string | null;
  setLastDonationId: (id: string | null) => void;
  formData: Partial<DonationFormData>;
  updateFormData: (data: Partial<DonationFormData>) => void;
  resetForm: () => void;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

const initialFormData: Partial<DonationFormData> = {
  amount: undefined,
  frequency: 'one-time',
  designations: [],
  comment: '',
  isAnonymous: false,
  donorName: '',
  donorEmail: '',
};

export const DonationProvider = ({ children }: { children: ReactNode }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastDonationId, setLastDonationId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DonationFormData>>(initialFormData);

  const updateFormData = (data: Partial<DonationFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setLastDonationId(null);
  };

  return (
    <DonationContext.Provider value={{
      isSubmitting,
      setIsSubmitting,
      lastDonationId,
      setLastDonationId,
      formData,
      updateFormData,
      resetForm,
    }}>
      {children}
    </DonationContext.Provider>
  );
};

export const useDonation = () => {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
};
