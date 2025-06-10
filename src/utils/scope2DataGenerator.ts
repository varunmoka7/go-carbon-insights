
import { getCompanyById } from '@/data/companyMockData';
import { EnhancedScope2Data } from '@/types/scope2Types';

export const generateScope2MockData = (companyId: string): EnhancedScope2Data | null => {
  const company = getCompanyById(companyId);
  
  if (!company) {
    return null;
  }

  // Industry-specific source distributions
  const getSourceDistribution = () => {
    switch (company.industry) {
      case 'Technology':
        return {
          'Purchased Electricity': 0.75,
          'Steam & Heating': 0.15,
          'Cooling': 0.10
        };
      case 'Automotive':
        return {
          'Purchased Electricity': 0.60,
          'Steam & Heating': 0.30,
          'Cooling': 0.10
        };
      case 'Energy':
        return {
          'Purchased Electricity': 0.40,
          'Steam & Heating': 0.35,
          'Cooling': 0.25
        };
      case 'Consumer Goods':
      case 'Food & Beverage':
      case 'Retail':
        return {
          'Purchased Electricity': 0.65,
          'Steam & Heating': 0.20,
          'Cooling': 0.15
        };
      case 'Healthcare':
        return {
          'Purchased Electricity': 0.70,
          'Steam & Heating': 0.18,
          'Cooling': 0.12
        };
      default:
        return {
          'Purchased Electricity': 0.70,
          'Steam & Heating': 0.20,
          'Cooling': 0.10
        };
    }
  };

  const sourceDistribution = getSourceDistribution();
  const latestEmissions = company.emissionsData[company.emissionsData.length - 1];

  // Generate year-specific source data
  const sourceDataByYear: Record<string, any[]> = {};
  const locationDataByYear: Record<string, any[]> = {};

  company.emissionsData.forEach(yearData => {
    const year = yearData.year.toString();
    const scope2 = yearData.scope2;
    
    sourceDataByYear[year] = [
      { 
        source: 'Purchased Electricity', 
        emissions: Math.round(scope2 * sourceDistribution['Purchased Electricity']),
        percentage: `${Math.round(sourceDistribution['Purchased Electricity'] * 100)}%`,
        costPerMWh: 85 + Math.random() * 30,
        renewablePercent: `${Math.min(95, company.renewable_energy_percentage + (2024 - yearData.year) * 2)}%`
      },
      { 
        source: 'Steam & Heating', 
        emissions: Math.round(scope2 * sourceDistribution['Steam & Heating']),
        percentage: `${Math.round(sourceDistribution['Steam & Heating'] * 100)}%`,
        costPerMWh: 65 + Math.random() * 20,
        renewablePercent: `${Math.min(80, (company.renewable_energy_percentage + (2024 - yearData.year) * 2) * 0.6)}%`
      },
      { 
        source: 'Cooling', 
        emissions: Math.round(scope2 * sourceDistribution['Cooling']),
        percentage: `${Math.round(sourceDistribution['Cooling'] * 100)}%`,
        costPerMWh: 95 + Math.random() * 25,
        renewablePercent: `${Math.min(75, (company.renewable_energy_percentage + (2024 - yearData.year) * 2) * 0.5)}%`
      }
    ];

    // Location-based emissions distribution
    const regionDistribution = company.sector === 'Energy' ? 
      { northAmerica: 0.35, europe: 0.45, asiaPacific: 0.20 } :
      { northAmerica: 0.45, europe: 0.30, asiaPacific: 0.25 };

    locationDataByYear[year] = [
      { 
        location: 'North America', 
        emissions: Math.round(scope2 * regionDistribution.northAmerica), 
        percentage: `${Math.round(regionDistribution.northAmerica * 100)}%`,
        renewablePercent: `${Math.min(95, company.renewable_energy_percentage + (2024 - yearData.year) * 2)}%`,
        gridIntensity: 0.45
      },
      { 
        location: 'Europe', 
        emissions: Math.round(scope2 * regionDistribution.europe), 
        percentage: `${Math.round(regionDistribution.europe * 100)}%`,
        renewablePercent: `${Math.min(95, (company.renewable_energy_percentage + (2024 - yearData.year) * 2) + 15)}%`,
        gridIntensity: 0.32
      },
      { 
        location: 'Asia Pacific', 
        emissions: Math.round(scope2 * regionDistribution.asiaPacific), 
        percentage: `${Math.round(regionDistribution.asiaPacific * 100)}%`,
        renewablePercent: `${Math.max(25, (company.renewable_energy_percentage + (2024 - yearData.year) * 2) - 20)}%`,
        gridIntensity: 0.65
      }
    ];
  });

  // Renewable energy targets and progress
  const renewableTargets = {
    2025: Math.min(100, company.renewable_energy_percentage + 5),
    2030: Math.min(100, company.renewable_energy_percentage + 15),
    2050: 100
  };

  // Energy efficiency improvements
  const efficiencyData = company.emissionsData.map(item => ({
    year: item.year,
    energyIntensity: (item.scope2 / company.revenue) * 1000, // kWh per $1000 revenue
    improvementRate: item.year > 2019 ? 
      ((company.emissionsData[0].scope2 - item.scope2) / company.emissionsData[0].scope2) * 100 : 0
  }));

  return {
    company: {
      id: company.id,
      name: company.name,
      sector: company.sector,
      industry: company.industry,
      renewableEnergyPercent: company.renewable_energy_percentage,
      energyIntensity: latestEmissions.scope2 / company.revenue,
      totalEnergyConsumption: latestEmissions.scope2 * 2.5 // Rough conversion
    },
    trendData: company.emissionsData.map(item => ({
      year: item.year,
      emissions: item.scope2,
      marketBased: item.scope2,
      locationBased: Math.round(item.scope2 * 1.15),
      renewablePercent: Math.min(95, company.renewable_energy_percentage + (2024 - item.year) * 2)
    })),
    sourceData: sourceDataByYear['2024'] || [],
    locationData: locationDataByYear['2024'] || [],
    sourceDataByYear,
    locationDataByYear,
    renewableTargets,
    efficiencyData,
    insights: {
      keyFindings: [
        `${company.renewable_energy_percentage}% renewable energy in current operations`,
        `${Math.round(((company.emissionsData[0].scope2 - latestEmissions.scope2) / company.emissionsData[0].scope2) * 100)}% reduction since 2019`,
        company.sector === 'Technology' ? 'Leading in data center efficiency' : 'Focusing on manufacturing efficiency'
      ],
      opportunities: [
        'Power Purchase Agreements (PPAs) for renewable energy',
        'Energy efficiency upgrades in facilities',
        'Battery storage for grid optimization'
      ],
      challenges: [
        'Grid dependency in high-carbon regions',
        'Renewable energy intermittency',
        'Capital investment for infrastructure'
      ]
    }
  };
};
