
import { useSupabaseScope2Data } from './useSupabaseScope2';
import { getCompanyById } from '@/data/companyMockData';

export const useScope2Data = (companyId: string) => {
  const supabaseQuery = useSupabaseScope2Data(companyId);
  
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

    // Generate year-specific data
    const generateYearSpecificData = () => {
      const sourceDataByYear: Record<string, any[]> = {};
      const locationDataByYear: Record<string, any[]> = {};
      
      company.emissionsData.forEach(yearData => {
        const year = yearData.year.toString();
        const totalScope2 = yearData.scope2;
        
        
        // Enhanced industry-specific source distributions with more varied sources
        const getSourceDistribution = () => {
          switch (company.industry) {
            case 'Technology':
              return {
                'Data Center Electricity': 0.55,
                'Office Buildings': 0.20,
                'Cooling Systems': 0.15,
                'Server Infrastructure': 0.10
              };
            case 'E-commerce':
              return {
                'Warehouse Operations': 0.45,
                'Distribution Centers': 0.25,
                'Automated Systems': 0.20,
                'Climate Control': 0.10
              };
            case 'Automotive':
              return {
                'Manufacturing Lines': 0.50,
                'Paint & Finishing': 0.20,
                'Assembly Operations': 0.18,
                'Quality Testing': 0.12
              };
            case 'Energy':
              return {
                'Processing Facilities': 0.40,
                'Control Systems': 0.25,
                'Pumping Stations': 0.20,
                'Administrative Buildings': 0.15
              };
            case 'Consumer Goods':
              return {
                'Production Lines': 0.40,
                'Packaging Operations': 0.25,
                'Quality Control': 0.20,
                'Warehouse Lighting': 0.15
              };
            case 'Food & Beverage':
              return {
                'Processing Equipment': 0.35,
                'Refrigeration Systems': 0.30,
                'Packaging Lines': 0.20,
                'Facility Operations': 0.15
              };
            case 'Retail':
              return {
                'Store Operations': 0.50,
                'Refrigeration Units': 0.25,
                'Lighting Systems': 0.15,
                'Security Systems': 0.10
              };
            case 'Healthcare':
              return {
                'Medical Equipment': 0.35,
                'HVAC Systems': 0.25,
                'Laboratory Operations': 0.25,
                'Administrative Areas': 0.15
              };
            default:
              return {
                'Primary Operations': 0.50,
                'Support Systems': 0.25,
                'Facilities Management': 0.15,
                'Administrative Functions': 0.10
              };
          }
        };

        const sourceDistribution = getSourceDistribution();
        
        sourceDataByYear[year] = Object.entries(sourceDistribution).map(([source, percentage]) => ({
          source,
          emissions: Math.round(totalScope2 * percentage)
        }));

        // Enhanced location data with more diverse regions based on company headquarters
        const renewableImprovement = (2024 - yearData.year) * 2; // 2% improvement per year
        const baseRenewable = company.renewable_energy_percentage || 65;
        
        const getLocationData = () => {
          // Get company-specific regional distribution
          const getRegionalDistribution = () => {
            if (company.headquarters.includes('USA') || company.headquarters.includes('United States')) {
              return {
                'United States': { percentage: 0.60, renewable: baseRenewable - renewableImprovement },
                'Canada': { percentage: 0.15, renewable: (baseRenewable - renewableImprovement) + 20 },
                'Mexico': { percentage: 0.15, renewable: (baseRenewable - renewableImprovement) - 10 },
                'Other Americas': { percentage: 0.10, renewable: (baseRenewable - renewableImprovement) + 5 }
              };
            } else if (company.headquarters.includes('Germany') || company.headquarters.includes('United Kingdom') || company.headquarters.includes('London')) {
              return {
                'Germany': { percentage: 0.35, renewable: (baseRenewable - renewableImprovement) + 25 },
                'United Kingdom': { percentage: 0.25, renewable: (baseRenewable - renewableImprovement) + 15 },
                'France': { percentage: 0.20, renewable: (baseRenewable - renewableImprovement) + 30 },
                'Other Europe': { percentage: 0.20, renewable: (baseRenewable - renewableImprovement) + 10 }
              };
            } else if (company.headquarters.includes('Japan') || company.headquarters.includes('Korea') || company.headquarters.includes('China')) {
              return {
                'Japan': { percentage: 0.30, renewable: (baseRenewable - renewableImprovement) - 15 },
                'South Korea': { percentage: 0.25, renewable: (baseRenewable - renewableImprovement) - 20 },
                'China': { percentage: 0.25, renewable: (baseRenewable - renewableImprovement) - 25 },
                'Other Asia': { percentage: 0.20, renewable: (baseRenewable - renewableImprovement) - 10 }
              };
            } else if (company.headquarters.includes('Saudi Arabia')) {
              return {
                'Saudi Arabia': { percentage: 0.45, renewable: Math.max(5, (baseRenewable - renewableImprovement) - 50) },
                'UAE': { percentage: 0.25, renewable: (baseRenewable - renewableImprovement) - 30 },
                'Qatar': { percentage: 0.15, renewable: (baseRenewable - renewableImprovement) - 40 },
                'Other Middle East': { percentage: 0.15, renewable: (baseRenewable - renewableImprovement) - 35 }
              };
            } else {
              return {
                'North America': { percentage: 0.45, renewable: baseRenewable - renewableImprovement },
                'Europe': { percentage: 0.30, renewable: (baseRenewable - renewableImprovement) + 15 },
                'Asia Pacific': { percentage: 0.25, renewable: (baseRenewable - renewableImprovement) - 20 }
              };
            }
          };

          const regionalData = getRegionalDistribution();
          
          return Object.entries(regionalData).map(([location, data]) => ({
            location,
            emissions: Math.round(totalScope2 * data.percentage),
            percentage: `${Math.round(data.percentage * 100)}%`,
            renewablePercent: `${Math.max(5, Math.min(95, data.renewable))}%`
          }));
        };

        locationDataByYear[year] = getLocationData();
      });
      
      return { sourceDataByYear, locationDataByYear };
    };

    const { sourceDataByYear, locationDataByYear } = generateYearSpecificData();
    const latestScope2 = company.emissionsData[company.emissionsData.length - 1]?.scope2 || 20000;

    // Enhanced source distribution for latest year
    const getSourceDistribution = () => {
      switch (company.industry) {
        case 'Technology':
          return {
            'Data Center Electricity': 0.55,
            'Office Buildings': 0.20,
            'Cooling Systems': 0.15,
            'Server Infrastructure': 0.10
          };
        case 'E-commerce':
          return {
            'Warehouse Operations': 0.45,
            'Distribution Centers': 0.25,
            'Automated Systems': 0.20,
            'Climate Control': 0.10
          };
        case 'Automotive':
          return {
            'Manufacturing Lines': 0.50,
            'Paint & Finishing': 0.20,
            'Assembly Operations': 0.18,
            'Quality Testing': 0.12
          };
        case 'Energy':
          return {
            'Processing Facilities': 0.40,
            'Control Systems': 0.25,
            'Pumping Stations': 0.20,
            'Administrative Buildings': 0.15
          };
        case 'Consumer Goods':
          return {
            'Production Lines': 0.40,
            'Packaging Operations': 0.25,
            'Quality Control': 0.20,
            'Warehouse Lighting': 0.15
          };
        case 'Food & Beverage':
          return {
            'Processing Equipment': 0.35,
            'Refrigeration Systems': 0.30,
            'Packaging Lines': 0.20,
            'Facility Operations': 0.15
          };
        case 'Retail':
          return {
            'Store Operations': 0.50,
            'Refrigeration Units': 0.25,
            'Lighting Systems': 0.15,
            'Security Systems': 0.10
          };
        case 'Healthcare':
          return {
            'Medical Equipment': 0.35,
            'HVAC Systems': 0.25,
            'Laboratory Operations': 0.25,
            'Administrative Areas': 0.15
          };
        default:
          return {
            'Primary Operations': 0.50,
            'Support Systems': 0.25,
            'Facilities Management': 0.15,
            'Administrative Functions': 0.10
          };
      }
    };

    const sourceDistribution = getSourceDistribution();
    
    // Enhanced location-based data for current year
    const getLocationData = () => {
      const getRegionalDistribution = () => {
        if (company.headquarters.includes('USA') || company.headquarters.includes('United States')) {
          return {
            'United States': { percentage: 0.60, renewable: company.renewable_energy_percentage || 65 },
            'Canada': { percentage: 0.15, renewable: (company.renewable_energy_percentage || 65) + 20 },
            'Mexico': { percentage: 0.15, renewable: (company.renewable_energy_percentage || 65) - 10 },
            'Other Americas': { percentage: 0.10, renewable: (company.renewable_energy_percentage || 65) + 5 }
          };
        } else if (company.headquarters.includes('Germany') || company.headquarters.includes('United Kingdom') || company.headquarters.includes('London')) {
          return {
            'Germany': { percentage: 0.35, renewable: (company.renewable_energy_percentage || 65) + 25 },
            'United Kingdom': { percentage: 0.25, renewable: (company.renewable_energy_percentage || 65) + 15 },
            'France': { percentage: 0.20, renewable: (company.renewable_energy_percentage || 65) + 30 },
            'Other Europe': { percentage: 0.20, renewable: (company.renewable_energy_percentage || 65) + 10 }
          };
        } else if (company.headquarters.includes('Japan') || company.headquarters.includes('Korea') || company.headquarters.includes('China')) {
          return {
            'Japan': { percentage: 0.30, renewable: (company.renewable_energy_percentage || 65) - 15 },
            'South Korea': { percentage: 0.25, renewable: (company.renewable_energy_percentage || 65) - 20 },
            'China': { percentage: 0.25, renewable: (company.renewable_energy_percentage || 65) - 25 },
            'Other Asia': { percentage: 0.20, renewable: (company.renewable_energy_percentage || 65) - 10 }
          };
        } else if (company.headquarters.includes('Saudi Arabia')) {
          return {
            'Saudi Arabia': { percentage: 0.45, renewable: Math.max(5, (company.renewable_energy_percentage || 65) - 50) },
            'UAE': { percentage: 0.25, renewable: (company.renewable_energy_percentage || 65) - 30 },
            'Qatar': { percentage: 0.15, renewable: (company.renewable_energy_percentage || 65) - 40 },
            'Other Middle East': { percentage: 0.15, renewable: (company.renewable_energy_percentage || 65) - 35 }
          };
        } else {
          return {
            'North America': { percentage: 0.45, renewable: company.renewable_energy_percentage || 65 },
            'Europe': { percentage: 0.30, renewable: (company.renewable_energy_percentage || 65) + 15 },
            'Asia Pacific': { percentage: 0.25, renewable: (company.renewable_energy_percentage || 65) - 20 }
          };
        }
      };

      const regionalData = getRegionalDistribution();
      
      return Object.entries(regionalData).map(([location, data]) => ({
        location,
        emissions: Math.round(latestScope2 * data.percentage),
        percentage: `${Math.round(data.percentage * 100)}%`,
        renewablePercent: `${Math.max(5, Math.min(95, data.renewable))}%`
      }));
    };

    return {
      data: {
        trendData: company.emissionsData.map(item => ({
          year: item.year,
          emissions: item.scope2,
          marketBased: item.scope2,
          locationBased: Math.round(item.scope2 * 1.15)
        })),
        sourceData: Object.entries(sourceDistribution).map(([source, percentage]) => ({
          source,
          emissions: Math.round(latestScope2 * percentage)
        })),
        locationData: getLocationData(),
        sourceDataByYear,
        locationDataByYear
      },
      isLoading: supabaseQuery.isLoading,
      error: supabaseQuery.error
    };
  }

  return supabaseQuery;
};
