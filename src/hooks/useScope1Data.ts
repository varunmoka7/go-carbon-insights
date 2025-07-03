
import { useSupabaseScope1Data } from './useSupabaseScope1';
import { getCompanyById } from '@/data/companyMockData';

export const useScope1Data = (companyId: string) => {
  const supabaseQuery = useSupabaseScope1Data(companyId);
  
  // If Supabase data is loading or there's an error, fallback to mock data
  if (supabaseQuery.isLoading || supabaseQuery.error || !supabaseQuery.data?.trendData?.length) {
    const company = getCompanyById(companyId);
    
    if (!company) {
      return {
        data: null,
        isLoading: supabaseQuery.isLoading,
        error: supabaseQuery.error || new Error('Company not found')
      };
    }

    // Generate year-specific source data based on company characteristics
    const generateSourceDataByYear = () => {
      const sourceDataByYear: Record<string, any[]> = {};
      
      company.emissionsData.forEach(yearData => {
        const year = yearData.year.toString();
        const totalScope1 = yearData.scope1;
        
        // Enhanced industry-specific source distributions with realistic variations
        const getSourceDistribution = () => {
          // Add year-based evolution factor (gradual improvement over time)
          const yearFactor = (yearData.year - 2019) * 0.02; // 2% annual improvement
          
          switch (company.industry) {
            case 'Technology':
              return {
                'Data Center Cooling': Math.max(0.35, 0.45 - yearFactor),
                'Emergency Generators': Math.max(0.15, 0.25 - yearFactor * 0.5),
                'Company Vehicles': Math.max(0.15, 0.20 - yearFactor),
                'Refrigerants': Math.min(0.15, 0.10 + yearFactor * 0.3),
                'Process Heating': Math.max(0.08, 0.12 - yearFactor * 0.2)
              };
            case 'E-commerce':
              return {
                'Warehouse Heating': Math.max(0.25, 0.35 - yearFactor),
                'Fleet Vehicles': Math.max(0.30, 0.40 - yearFactor * 0.8),
                'Backup Generators': Math.max(0.10, 0.15 - yearFactor * 0.5),
                'Refrigeration': Math.min(0.20, 0.15 + yearFactor * 0.3),
                'Material Handling': Math.max(0.05, 0.08 - yearFactor * 0.2)
              };
            case 'Automotive':
              return {
                'Manufacturing Furnaces': Math.max(0.40, 0.50 - yearFactor),
                'Paint Booth Operations': Math.max(0.15, 0.20 - yearFactor * 0.3),
                'Test Vehicle Fleet': Math.max(0.12, 0.18 - yearFactor),
                'Facility Heating': Math.max(0.08, 0.12 - yearFactor * 0.2),
                'Welding & Cutting': Math.max(0.08, 0.10 - yearFactor * 0.1)
              };
            case 'Energy':
              return {
                'Processing Equipment': Math.max(0.45, 0.55 - yearFactor),
                'Flaring Operations': Math.max(0.20, 0.25 - yearFactor * 0.5),
                'Pipeline Compression': Math.max(0.12, 0.15 - yearFactor * 0.3),
                'Facility Operations': Math.max(0.08, 0.10 - yearFactor * 0.2),
                'Emergency Systems': Math.max(0.05, 0.08 - yearFactor * 0.1)
              };
            case 'Consumer Goods':
              return {
                'Manufacturing Heat': Math.max(0.30, 0.40 - yearFactor),
                'Packaging Processes': Math.max(0.18, 0.25 - yearFactor * 0.4),
                'Distribution Fleet': Math.max(0.20, 0.25 - yearFactor * 0.6),
                'Facility HVAC': Math.max(0.12, 0.15 - yearFactor * 0.2),
                'Quality Testing': Math.max(0.05, 0.08 - yearFactor * 0.1)
              };
            case 'Food & Beverage':
              return {
                'Production Boilers': Math.max(0.35, 0.45 - yearFactor),
                'Refrigeration Systems': Math.max(0.25, 0.30 - yearFactor * 0.3),
                'Delivery Vehicles': Math.max(0.15, 0.20 - yearFactor * 0.5),
                'Processing Equipment': Math.max(0.10, 0.15 - yearFactor * 0.2),
                'Steam Generation': Math.max(0.08, 0.12 - yearFactor * 0.1)
              };
            case 'Retail':
              return {
                'Store HVAC Systems': Math.max(0.30, 0.40 - yearFactor),
                'Refrigeration Units': Math.max(0.25, 0.30 - yearFactor * 0.3),
                'Delivery Fleet': Math.max(0.20, 0.25 - yearFactor * 0.6),
                'Backup Generators': Math.max(0.08, 0.12 - yearFactor * 0.2),
                'Warehouse Operations': Math.max(0.05, 0.08 - yearFactor * 0.1)
              };
            case 'Healthcare':
              return {
                'Medical Equipment': Math.max(0.25, 0.35 - yearFactor),
                'HVAC & Sterilization': Math.max(0.20, 0.30 - yearFactor * 0.3),
                'Emergency Generators': Math.max(0.15, 0.20 - yearFactor * 0.2),
                'Laboratory Operations': Math.max(0.12, 0.18 - yearFactor * 0.3),
                'Transport Vehicles': Math.max(0.08, 0.12 - yearFactor * 0.4)
              };
            default:
              return {
                'Facility Heating': Math.max(0.30, 0.40 - yearFactor),
                'Fleet Vehicles': Math.max(0.25, 0.30 - yearFactor * 0.5),
                'Process Equipment': Math.max(0.15, 0.20 - yearFactor * 0.3),
                'Backup Systems': Math.max(0.10, 0.15 - yearFactor * 0.2),
                'Other Operations': Math.max(0.05, 0.08 - yearFactor * 0.1)
              };
          }
        };

        const sourceDistribution = getSourceDistribution();
        
        // Create source data based on the distribution percentages
        sourceDataByYear[year] = Object.entries(sourceDistribution).map(([source, percentage]) => ({
          source,
          emissions: Math.round(totalScope1 * percentage)
        }));
      });
      
      return sourceDataByYear;
    };

    const sourceDataByYear = generateSourceDataByYear();
    const latestYearData = sourceDataByYear['2024'] || sourceDataByYear[Object.keys(sourceDataByYear).sort().pop() || '2024'] || [];
    
    const scope1Data = {
      trendData: company.emissionsData.map(item => ({
        year: item.year,
        emissions: item.scope1
      })),
      sourceData: latestYearData,
      sourceDataByYear
    };

    return {
      data: scope1Data,
      isLoading: supabaseQuery.isLoading,
      error: supabaseQuery.error
    };
  }

  return supabaseQuery;
};
