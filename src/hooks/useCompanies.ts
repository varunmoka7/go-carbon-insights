
import { companies, getCompanyById } from '@/data/mockData';

export const useCompanies = () => {
  return {
    data: companies,
    isLoading: false,
    error: null
  };
};

export const useCompany = (companyId: string) => {
  const company = getCompanyById(companyId);
  return {
    data: company,
    isLoading: false,
    error: company ? null : new Error('Company not found')
  };
};
