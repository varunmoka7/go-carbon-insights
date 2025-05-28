
import { getCompanyById } from '@/data/mockData';

export const useSBTITargets = (companyId: string) => {
  const company = getCompanyById(companyId);
  
  return {
    data: company?.sbtiTargets || null,
    isLoading: false,
    error: company ? null : new Error('Company not found')
  };
};
