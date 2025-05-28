
import { getCompanyById } from '@/data/mockData';

export const useScope2Data = (companyId: string) => {
  const company = getCompanyById(companyId);
  
  return {
    data: company?.scope2Data || null,
    isLoading: false,
    error: company ? null : new Error('Company not found')
  };
};
