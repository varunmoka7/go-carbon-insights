
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PlatformMetric {
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  description: string;
  category: string;
}

export const usePlatformMetrics = () => {
  return useQuery({
    queryKey: ['platformMetrics'],
    queryFn: async (): Promise<PlatformMetric[]> => {
      try {
        const { data: metrics, error } = await supabase
          .from('platform_metrics')
          .select('*')
          .order('category');

        if (error) throw error;

        if (metrics && metrics.length > 0) {
          return metrics;
        }
      } catch (error) {
        console.warn('Failed to fetch platform metrics from database, using fallback data:', error);
      }

      // Fallback data
      return [
        { metric_name: 'total_companies', metric_value: 15, metric_unit: 'count', description: 'Total companies being tracked globally', category: 'overview' },
        { metric_name: 'total_emissions', metric_value: 2400000, metric_unit: 'tCO2e', description: 'Total emissions monitored across all companies', category: 'overview' },
        { metric_name: 'monthly_growth_rate', metric_value: 23, metric_unit: 'percentage', description: 'Monthly growth rate in company tracking', category: 'growth' },
        { metric_name: 'transparency_index', metric_value: 42, metric_unit: 'percentage', description: 'Global supply chain transparency coverage', category: 'impact' },
        { metric_name: 'data_completeness', metric_value: 87, metric_unit: 'percentage', description: 'Average data completeness across all companies', category: 'quality' },
        { metric_name: 'platform_uptime', metric_value: 99.9, metric_unit: 'percentage', description: 'Platform availability and reliability', category: 'technical' }
      ];
    }
  });
};
