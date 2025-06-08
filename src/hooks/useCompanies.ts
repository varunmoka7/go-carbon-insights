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
      // Enhanced mock data with 5 new companies
      const companies: Company[] = [
        {
          id: 'apple',
          name: 'Apple Inc.',
          industry: 'Technology',
          sector: 'Technology',
          total_emissions: 11500,
          scope1_emissions: 95,
          scope2_emissions: 1200,
          scope3_emissions: 10205,
          description: 'Technology company focused on consumer electronics and services'
        },
        {
          id: 'microsoft',
          name: 'Microsoft Corporation',
          industry: 'Technology',
          sector: 'Technology',
          total_emissions: 9800,
          scope1_emissions: 150,
          scope2_emissions: 1800,
          scope3_emissions: 7850,
          description: 'Global technology corporation developing software and cloud services'
        },
        {
          id: 'google',
          name: 'Alphabet Inc. (Google)',
          industry: 'Technology',
          sector: 'Technology',
          total_emissions: 13200,
          scope1_emissions: 200,
          scope2_emissions: 2100,
          scope3_emissions: 10900,
          description: 'Multinational technology conglomerate specializing in Internet services'
        },
        {
          id: 'tesla',
          name: 'Tesla Inc.',
          industry: 'Automotive',
          sector: 'Automotive',
          total_emissions: 8500,
          scope1_emissions: 1200,
          scope2_emissions: 800,
          scope3_emissions: 6500,
          description: 'Electric vehicle and clean energy company'
        },
        {
          id: 'amazon',
          name: 'Amazon.com Inc.',
          industry: 'E-commerce',
          sector: 'Consumer',
          total_emissions: 71540,
          scope1_emissions: 15200,
          scope2_emissions: 5800,
          scope3_emissions: 50540,
          description: 'Multinational technology and e-commerce company'
        },
        {
          id: 'meta',
          name: 'Meta Platforms Inc.',
          industry: 'Technology',
          sector: 'Technology',
          total_emissions: 7300,
          scope1_emissions: 100,
          scope2_emissions: 1400,
          scope3_emissions: 5800,
          description: 'Social media and technology company'
        },
        {
          id: 'bmw',
          name: 'BMW Group',
          industry: 'Automotive',
          sector: 'Automotive',
          total_emissions: 78500,
          scope1_emissions: 25200,
          scope2_emissions: 8500,
          scope3_emissions: 44800,
          description: 'German multinational automotive manufacturing company'
        },
        {
          id: 'volkswagen',
          name: 'Volkswagen Group',
          industry: 'Automotive',
          sector: 'Automotive',
          total_emissions: 125000,
          scope1_emissions: 45000,
          scope2_emissions: 12000,
          scope3_emissions: 68000,
          description: 'German multinational automotive manufacturing company'
        },
        {
          id: 'toyota',
          name: 'Toyota Motor Corporation',
          industry: 'Automotive',
          sector: 'Automotive',
          total_emissions: 95000,
          scope1_emissions: 35000,
          scope2_emissions: 10000,
          scope3_emissions: 50000,
          description: 'Japanese multinational automotive manufacturer'
        },
        {
          id: 'samsung',
          name: 'Samsung Electronics',
          industry: 'Technology',
          sector: 'Technology',
          total_emissions: 14200,
          scope1_emissions: 500,
          scope2_emissions: 2800,
          scope3_emissions: 10900,
          description: 'South Korean multinational electronics corporation'
        },
        {
          id: 'bp',
          name: 'BP plc',
          industry: 'Energy',
          sector: 'Energy',
          total_emissions: 415000,
          scope1_emissions: 180000,
          scope2_emissions: 35000,
          scope3_emissions: 200000,
          description: 'British multinational oil and gas company'
        },
        {
          id: 'shell',
          name: 'Shell plc',
          industry: 'Energy',
          sector: 'Energy',
          total_emissions: 1380000,
          scope1_emissions: 580000,
          scope2_emissions: 120000,
          scope3_emissions: 680000,
          description: 'British multinational oil and gas company'
        },
        {
          id: 'nike',
          name: 'Nike Inc.',
          industry: 'Consumer Goods',
          sector: 'Consumer',
          total_emissions: 12800,
          scope1_emissions: 300,
          scope2_emissions: 1200,
          scope3_emissions: 11300,
          description: 'American multinational corporation specializing in footwear and apparel'
        },
        {
          id: 'unilever',
          name: 'Unilever plc',
          industry: 'Consumer Goods',
          sector: 'Consumer',
          total_emissions: 54000,
          scope1_emissions: 8000,
          scope2_emissions: 4500,
          scope3_emissions: 41500,
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
        // New companies
        {
          id: 'techcorp',
          name: 'TechCorp Global',
          industry: 'Technology',
          sector: 'Technology',
          total_emissions: 25000,
          scope1_emissions: 2000,
          scope2_emissions: 3000,
          scope3_emissions: 20000,
          description: 'Global technology company focused on AI and cloud computing solutions'
        },
        {
          id: 'manufacturingplus',
          name: 'ManufacturingPlus Inc',
          industry: 'Manufacturing',
          sector: 'Manufacturing',
          total_emissions: 250000,
          scope1_emissions: 85000,
          scope2_emissions: 25000,
          scope3_emissions: 140000,
          description: 'Industrial manufacturing company specializing in advanced materials'
        },
        {
          id: 'energytransition',
          name: 'EnergyTransition Ltd',
          industry: 'Energy',
          sector: 'Energy',
          total_emissions: 500000,
          scope1_emissions: 200000,
          scope2_emissions: 50000,
          scope3_emissions: 250000,
          description: 'Energy company transitioning from fossil fuels to renewable sources'
        },
        {
          id: 'consumergoods',
          name: 'ConsumerGoods Co',
          industry: 'Consumer Goods',
          sector: 'Consumer',
          total_emissions: 120000,
          scope1_emissions: 15000,
          scope2_emissions: 8000,
          scope3_emissions: 97000,
          description: 'Consumer goods company focused on sustainable products'
        },
        {
          id: 'healthcare',
          name: 'HealthCare Systems',
          industry: 'Healthcare',
          sector: 'Healthcare',
          total_emissions: 85000,
          scope1_emissions: 12000,
          scope2_emissions: 10000,
          scope3_emissions: 63000,
          description: 'Healthcare systems company providing medical equipment and services'
        }
      ];

      console.log('Companies loaded:', companies.length);
      return companies;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
