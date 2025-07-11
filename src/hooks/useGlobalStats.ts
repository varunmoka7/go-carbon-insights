
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
        // Fetch real data from Supabase
        const [companiesResult, sectorsResult, emissionsResult] = await Promise.allSettled([
          supabase.from('companies').select('id, carbon_footprint'),
          supabase.from('industry_taxonomy').select('sector'),
          supabase.from('emissions_data').select('scope1, scope2, scope3')
        ]);

        let totalCompanies = 112; // Default fallback
        let sectorsCount = 21; // Default fallback  
        let totalEmissions = 2400000; // Default fallback

        // Get company count
        if (companiesResult.status === 'fulfilled' && companiesResult.value.data) {
          totalCompanies = companiesResult.value.data.length;
        }

        // Get unique sectors count
        if (sectorsResult.status === 'fulfilled' && sectorsResult.value.data) {
          const uniqueSectors = new Set(sectorsResult.value.data.map(item => item.sector));
          sectorsCount = uniqueSectors.size;
        }

        // Calculate total emissions
        if (emissionsResult.status === 'fulfilled' && emissionsResult.value.data) {
          totalEmissions = emissionsResult.value.data.reduce((sum, emission) => 
            sum + (emission.scope1 || 0) + (emission.scope2 || 0) + (emission.scope3 || 0), 0
          );
        }

        return {
          totalCompanies,
          totalEmissions,
          sectorsCount,
          countriesCount: 12, // Mock data for now
          monthlyGrowthRate: 23, // Mock data for now
          transparencyIndex: 42, // Mock data for now
          dataCompleteness: 87, // Mock data for now
          platformUptime: 99.9 // Mock data for now
        };
      } catch (error) {
        console.error('Error fetching global stats:', error);
        // Fallback to mock data
        return {
          totalCompanies: 112,
          totalEmissions: 2400000,
          sectorsCount: 21,
          countriesCount: 12,
          monthlyGrowthRate: 23,
          transparencyIndex: 42,
          dataCompleteness: 87,
          platformUptime: 99.9
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
