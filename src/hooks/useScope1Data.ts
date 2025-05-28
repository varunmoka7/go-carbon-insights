
import { getCompanyById } from '@/data/mockData';

export const useScope1Data = (companyId: string) => {
  const company = getCompanyById(companyId);
  
  return {
    data: company?.scope1Data || null,
    isLoading: false,
    error: company ? null : new Error('Company not found')
  };
};
