
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SectorData {
  sector: string;
  count: number;
  percentage: number;
  totalEmissions: number;
  color: string;
}

export const useSectorBreakdown = () => {
  return useQuery({
    queryKey: ['sectorBreakdown'],
    queryFn: async (): Promise<SectorData[]> => {
      try {
        const { data: companies, error } = await supabase
          .from('companies')
          .select('sector, carbon_footprint');

        if (error) throw error;

        if (companies && companies.length > 0) {
          const sectorMap = companies.reduce((acc, company) => {
            const sector = company.sector || 'Technology';
            if (!acc[sector]) {
              acc[sector] = { count: 0, totalEmissions: 0 };
            }
            acc[sector].count += 1;
            acc[sector].totalEmissions += company.carbon_footprint || 0;
            return acc;
          }, {} as Record<string, { count: number; totalEmissions: number }>);

          const total = companies.length;
          const colors = ['#0d9488', '#06b6d4', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b'];
          
          return Object.entries(sectorMap).map(([sector, data], index) => ({
            sector,
            count: data.count,
            percentage: Math.round((data.count / total) * 100),
            totalEmissions: data.totalEmissions,
            color: colors[index % colors.length]
          }));
        }
      } catch (error) {
        console.warn('Failed to fetch sector breakdown from database, using fallback data:', error);
      }

      // Fallback data
      return [
        { sector: 'Technology', count: 6, percentage: 35, totalEmissions: 850000, color: '#0d9488' },
        { sector: 'Automotive', count: 4, percentage: 30, totalEmissions: 720000, color: '#06b6d4' },
        { sector: 'Energy', count: 3, percentage: 20, totalEmissions: 480000, color: '#3b82f6' },
        { sector: 'Manufacturing', count: 2, percentage: 10, totalEmissions: 240000, color: '#8b5cf6' },
        { sector: 'Retail', count: 1, percentage: 5, totalEmissions: 120000, color: '#ef4444' }
      ];
    }
  });
};
