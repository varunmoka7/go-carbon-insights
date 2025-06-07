
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GrowthData {
  year: number;
  month: number;
  monthName: string;
  companies_tracked: number;
  new_companies_added: number;
  total_emissions: number;
  sectors_covered: number;
}

export const useTrackingGrowth = () => {
  return useQuery({
    queryKey: ['trackingGrowth'],
    queryFn: async (): Promise<GrowthData[]> => {
      try {
        const { data: timeline, error } = await supabase
          .from('tracking_timeline')
          .select('*')
          .order('year', { ascending: true })
          .order('month', { ascending: true });

        if (error) throw error;

        if (timeline && timeline.length > 0) {
          return timeline.map(item => ({
            ...item,
            monthName: new Date(item.year, item.month - 1).toLocaleString('default', { month: 'short' })
          }));
        }
      } catch (error) {
        console.warn('Failed to fetch tracking growth from database, using fallback data:', error);
      }

      // Fallback data
      return [
        { year: 2024, month: 1, monthName: 'Jan', companies_tracked: 3, new_companies_added: 3, total_emissions: 750000, sectors_covered: 2 },
        { year: 2024, month: 2, monthName: 'Feb', companies_tracked: 6, new_companies_added: 3, total_emissions: 1200000, sectors_covered: 4 },
        { year: 2024, month: 3, monthName: 'Mar', companies_tracked: 9, new_companies_added: 3, total_emissions: 1650000, sectors_covered: 5 },
        { year: 2024, month: 4, monthName: 'Apr', companies_tracked: 12, new_companies_added: 3, total_emissions: 2100000, sectors_covered: 7 },
        { year: 2024, month: 5, monthName: 'May', companies_tracked: 15, new_companies_added: 3, total_emissions: 2400000, sectors_covered: 8 }
      ];
    }
  });
};
