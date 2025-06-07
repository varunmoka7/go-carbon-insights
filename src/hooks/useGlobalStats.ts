
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GlobalStats {
  totalCompanies: number;
  totalEmissions: number;
  sectorsCount: number;
  countriesCount: number;
  monthlyGrowthRate: number;
  transparencyIndex: number;
  dataCompleteness: number;
  platformUptime: number;
}

export const useGlobalStats = () => {
  return useQuery({
    queryKey: ['globalStats'],
    queryFn: async (): Promise<GlobalStats> => {
      try {
        // Try to get metrics from database
        const { data: metrics, error } = await supabase
          .from('platform_metrics')
          .select('metric_name, metric_value');

        if (error) throw error;

        if (metrics && metrics.length > 0) {
          const metricsMap = metrics.reduce((acc, metric) => {
            acc[metric.metric_name] = metric.metric_value;
            return acc;
          }, {} as Record<string, number>);

          return {
            totalCompanies: metricsMap.total_companies || 15,
            totalEmissions: metricsMap.total_emissions || 2400000,
            sectorsCount: metricsMap.sectors_covered || 8,
            countriesCount: metricsMap.countries_represented || 12,
            monthlyGrowthRate: metricsMap.monthly_growth_rate || 23,
            transparencyIndex: metricsMap.transparency_index || 42,
            dataCompleteness: metricsMap.data_completeness || 87,
            platformUptime: metricsMap.platform_uptime || 99.9
          };
        }
      } catch (error) {
        console.warn('Failed to fetch platform metrics from database, using fallback data:', error);
      }

      // Fallback data
      return {
        totalCompanies: 15,
        totalEmissions: 2400000,
        sectorsCount: 8,
        countriesCount: 12,
        monthlyGrowthRate: 23,
        transparencyIndex: 42,
        dataCompleteness: 87,
        platformUptime: 99.9
      };
    }
  });
};
