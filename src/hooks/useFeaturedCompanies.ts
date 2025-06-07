
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FeaturedCompany {
  id: string;
  name: string;
  sector: string;
  carbon_footprint: number;
  renewable_energy_percentage?: number;
  featured: boolean;
  achievement?: string;
}

export const useFeaturedCompanies = () => {
  return useQuery({
    queryKey: ['featuredCompanies'],
    queryFn: async (): Promise<FeaturedCompany[]> => {
      try {
        const { data: companies, error } = await supabase
          .from('companies')
          .select('id, name, sector, carbon_footprint, renewable_energy_percentage, featured')
          .eq('featured', true);

        if (error) throw error;

        if (companies && companies.length > 0) {
          return companies.map(company => ({
            ...company,
            achievement: getRandomAchievement()
          }));
        }
      } catch (error) {
        console.warn('Failed to fetch featured companies from database, using fallback data:', error);
      }

      // Fallback data
      return [
        { id: 'apple', name: 'Apple Inc.', sector: 'Technology', carbon_footprint: 22800, renewable_energy_percentage: 75, featured: true, achievement: 'Carbon neutral by 2030 commitment' },
        { id: 'microsoft', name: 'Microsoft Corporation', sector: 'Technology', carbon_footprint: 15600, renewable_energy_percentage: 60, featured: true, achievement: 'Carbon negative by 2030 goal' },
        { id: 'tesla', name: 'Tesla Inc.', sector: 'Automotive', carbon_footprint: 8500, renewable_energy_percentage: 45, featured: true, achievement: 'Leading EV manufacturer' },
        { id: 'bp', name: 'BP plc', sector: 'Energy', carbon_footprint: 55700, renewable_energy_percentage: 15, featured: true, achievement: 'Net zero by 2050 target' }
      ];
    }
  });
};

function getRandomAchievement(): string {
  const achievements = [
    'Carbon neutral certification achieved',
    'Leading transparency in reporting',
    'Best-in-class emission reduction',
    'Science-based targets approved',
    'Renewable energy leader',
    'Supply chain excellence'
  ];
  return achievements[Math.floor(Math.random() * achievements.length)];
}
