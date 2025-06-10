
import { useQuery } from '@tanstack/react-query';

export interface Company {
  id: string;
  name: string;
  industry: string;
  sector?: string;
  total_emissions: number;
  scope1_emissions?: number;
  scope2_emissions?: number;
  scope3_emissions?: number;
  description?: string;
}

export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async (): Promise<Company[]> => {
      // Standardized list of 20 companies with complete data
      const companies: Company[] = [
        {
          id: 'apple',
          name: 'Apple Inc.',
          industry: 'Technology',
          sector: 'Technology',
          total_emissions: 22000,
          scope1_emissions: 1700,
          scope2_emissions: 3300,
          scope3_emissions: 12400,
          description: 'Technology company focused on consumer electronics and services'
        },
        {
          id: 'microsoft',
          name: 'Microsoft Corporation',
          industry: 'Technology',
          sector: 'Technology',
          total_emissions: 18000,
          scope1_emissions: 1300,
          scope2_emissions: 2200,
          scope3_emissions: 10500,
          description: 'Global technology corporation developing software and cloud services'
        },
        {
          id: 'google',
          name: 'Alphabet Inc. (Google)',
          industry: 'Technology',
          sector: 'Technology',
          total_emissions: 35000,
          scope1_emissions: 2500,
          scope2_emissions: 4800,
          scope3_emissions: 17700,
          description: 'Multinational technology conglomerate specializing in Internet services'
        },
        {
          id: 'amazon',
          name: 'Amazon.com Inc.',
          industry: 'E-commerce',
          sector: 'Technology',
          total_emissions: 85000,
          scope1_emissions: 6900,
          scope2_emissions: 13800,
          scope3_emissions: 48000,
          description: 'Multinational technology and e-commerce company'
        },
        {
          id: 'meta',
          name: 'Meta Platforms Inc.',
          industry: 'Technology',
          sector: 'Technology',
          total_emissions: 16000,
          scope1_emissions: 1350,
          scope2_emissions: 2600,
          scope3_emissions: 9550,
          description: 'Social media and technology company'
        },
        {
          id: 'samsung',
          name: 'Samsung Electronics',
          industry: 'Technology',
          sector: 'Technology',
          total_emissions: 48000,
          scope1_emissions: 3800,
          scope2_emissions: 7200,
          scope3_emissions: 27000,
          description: 'South Korean multinational electronics corporation'
        },
        {
          id: 'tesla',
          name: 'Tesla Inc.',
          industry: 'Automotive',
          sector: 'Automotive',
          total_emissions: 11150,
          scope1_emissions: 1050,
          scope2_emissions: 2000,
          scope3_emissions: 8100,
          description: 'Electric vehicle and clean energy company'
        },
        {
          id: 'toyota',
          name: 'Toyota Motor Corporation',
          industry: 'Automotive',
          sector: 'Automotive',
          total_emissions: 45000,
          scope1_emissions: 3500,
          scope2_emissions: 7000,
          scope3_emissions: 24500,
          description: 'Japanese multinational automotive manufacturer'
        },
        {
          id: 'bmw',
          name: 'BMW Group',
          industry: 'Automotive',
          sector: 'Automotive',
          total_emissions: 65000,
          scope1_emissions: 5000,
          scope2_emissions: 9000,
          scope3_emissions: 31000,
          description: 'German multinational automotive manufacturing company'
        },
        {
          id: 'volkswagen',
          name: 'Volkswagen Group',
          industry: 'Automotive',
          sector: 'Automotive',
          total_emissions: 85000,
          scope1_emissions: 6500,
          scope2_emissions: 12300,
          scope3_emissions: 41200,
          description: 'German multinational automotive manufacturing company'
        },
        {
          id: 'bp',
          name: 'BP plc',
          industry: 'Energy',
          sector: 'Energy',
          total_emissions: 420000,
          scope1_emissions: 185000,
          scope2_emissions: 37000,
          scope3_emissions: 148000,
          description: 'British multinational oil and gas company'
        },
        {
          id: 'shell',
          name: 'Shell plc',
          industry: 'Energy',
          sector: 'Energy',
          total_emissions: 650000,
          scope1_emissions: 290000,
          scope2_emissions: 58000,
          scope3_emissions: 232000,
          description: 'British multinational oil and gas company'
        },
        {
          id: 'exxonmobil',
          name: 'ExxonMobil',
          industry: 'Energy',
          sector: 'Energy',
          total_emissions: 560000,
          scope1_emissions: 255000,
          scope2_emissions: 51000,
          scope3_emissions: 204000,
          description: 'American multinational oil and gas corporation'
        },
        {
          id: 'nike',
          name: 'Nike Inc.',
          industry: 'Consumer Goods',
          sector: 'Consumer',
          total_emissions: 14500,
          scope1_emissions: 1250,
          scope2_emissions: 2400,
          scope3_emissions: 8850,
          description: 'American multinational corporation specializing in footwear and apparel'
        },
        {
          id: 'unilever',
          name: 'Unilever plc',
          industry: 'Consumer Goods',
          sector: 'Consumer',
          total_emissions: 22000,
          scope1_emissions: 1700,
          scope2_emissions: 3300,
          scope3_emissions: 12400,
          description: 'British multinational consumer goods company'
        },
        {
          id: 'nestle',
          name: 'Nestlé S.A.',
          industry: 'Food & Beverage',
          sector: 'Consumer',
          total_emissions: 92000,
          scope1_emissions: 18000,
          scope2_emissions: 8500,
          scope3_emissions: 65500,
          description: 'Swiss multinational food and drink processing conglomerate'
        },
        {
          id: 'walmart',
          name: 'Walmart Inc.',
          industry: 'Retail',
          sector: 'Consumer',
          total_emissions: 28000,
          scope1_emissions: 2300,
          scope2_emissions: 4200,
          scope3_emissions: 17500,
          description: 'American multinational retail corporation'
        },
        {
          id: 'procter_gamble',
          name: 'Procter & Gamble',
          industry: 'Consumer Goods',
          sector: 'Consumer',
          total_emissions: 35000,
          scope1_emissions: 2800,
          scope2_emissions: 5200,
          scope3_emissions: 22000,
          description: 'American multinational consumer goods corporation'
        },
        {
          id: 'coca_cola',
          name: 'The Coca-Cola Company',
          industry: 'Food & Beverage',
          sector: 'Consumer',
          total_emissions: 45000,
          scope1_emissions: 3600,
          scope2_emissions: 6500,
          scope3_emissions: 28900,
          description: 'American multinational beverage corporation'
        },
        {
          id: 'johnson_johnson',
          name: 'Johnson & Johnson',
          industry: 'Healthcare',
          sector: 'Healthcare',
          total_emissions: 32000,
          scope1_emissions: 2560,
          scope2_emissions: 4800,
          scope3_emissions: 20640,
          description: 'American multinational pharmaceutical and medical technologies corporation'
        }
      ];

      console.log('Companies loaded:', companies.length);
      return companies;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
