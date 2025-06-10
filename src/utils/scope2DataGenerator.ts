
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

  // Generate energy KPIs with proper status types
  const getKPIStatus = (value: number, threshold: number): 'good' | 'average' | 'poor' => {
    if (value > threshold * 1.2) return 'good';
    if (value < threshold * 0.8) return 'poor';
    return 'average';
  };

  const energyKPIs = {
    gridCarbonIntensity: {
      value: 0.42,
      unit: 'kg CO2/MWh',
      industryAvg: 0.55,
      status: 'good' as const
    },
    renewableEnergyPercent: {
      value: company.renewable_energy_percentage,
      status: (company.renewable_energy_percentage > 70 ? 'good' : 'average') as 'good' | 'average' | 'poor',
      target: 100
    },
    energyIntensity: {
      value: Math.round((latestEmissions.scope2 / company.revenue) * 1000),
      unit: 'kWh/$1000 revenue',
      rank: Math.floor(Math.random() * 10) + 1,
      total: 20
    },
    industryRank: {
      position: Math.floor(Math.random() * 8) + 1,
      total: 20,
      sector: company.sector
    },
    annualReduction: {
      value: Math.round(((company.emissionsData[0].scope2 - latestEmissions.scope2) / company.emissionsData[0].scope2) * 100 * 10) / 10,
      target: 5,
      status: 'good' as const
    },
    carbonCostExposure: {
      value: latestEmissions.scope2 * 50, // $50 per tonne
      trend: 'decreasing' as const
    }
  };

  // Generate benchmarking data
  const benchmarking = {
    efficiencyRank: Math.floor(Math.random() * 10) + 1,
    intensityPercentile: Math.floor(Math.random() * 30) + 70,
    renewableRank: Math.floor(Math.random() * 8) + 1,
    regionalRank: Math.floor(Math.random() * 5) + 1
  };

  // Generate regional data with proper status types and all required properties
  const getGridStatus = (intensity: number): 'good' | 'average' | 'poor' => {
    if (intensity < 0.4) return 'good';
    if (intensity > 0.6) return 'poor';
    return 'average';
  };

  const regionalData = [
    {
      region: 'North America',
      gridIntensity: 0.45,
      gridStatus: getGridStatus(0.45),
      consumptionPercent: 45,
      renewablePercent: 35,
      renewableProgress: 35,
      emissions: Math.round(latestEmissions.scope2 * 0.45),
      efficiency: 'High',
      opportunities: ['Solar PPAs', 'Wind procurement', 'Battery storage'],
      achievements: ['15% renewable increase', '20% efficiency gains']
    },
    {
      region: 'Europe',
      gridIntensity: 0.32,
      gridStatus: getGridStatus(0.32),
      consumptionPercent: 30,
      renewablePercent: 65,
      renewableProgress: 65,
      emissions: Math.round(latestEmissions.scope2 * 0.30),
      efficiency: 'Very High',
      opportunities: ['Offshore wind', 'Green hydrogen', 'Heat pumps'],
      achievements: ['50% renewable energy', '30% carbon reduction']
    },
    {
      region: 'Asia Pacific',
      gridIntensity: 0.65,
      gridStatus: getGridStatus(0.65),
      consumptionPercent: 25,
      renewablePercent: 25,
      renewableProgress: 25,
      emissions: Math.round(latestEmissions.scope2 * 0.25),
      efficiency: 'Medium',
      opportunities: ['Solar expansion', 'Energy storage', 'Grid modernization'],
      achievements: ['10% renewable growth', 'Grid efficiency improvements']
    }
  ];

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
    energyKPIs,
    benchmarking,
    regionalData,
    insights: {
      keyFindings: [
        `${company.renewable_energy_percentage}% renewable energy in current operations`,
        `${Math.round(((company.emissionsData[0].scope2 - latestEmissions.scope2) / company.emissionsData[0].scope2) * 100)}% reduction since 2019`,
        company.sector === 'Technology' ? 'Leading in data center efficiency' : 'Focusing on manufacturing efficiency'
      ],
      opportunities: [
        {
          title: 'Power Purchase Agreements (PPAs)',
          impact: 'High',
          description: 'Long-term renewable energy contracts for cost stability'
        },
        {
          title: 'Energy efficiency upgrades',
          impact: 'Medium',
          description: 'HVAC and lighting system improvements'
        },
        {
          title: 'Battery storage integration',
          impact: 'Medium',
          description: 'Grid optimization and demand management'
        }
      ],
      challenges: [
        'Grid dependency in high-carbon regions',
        'Renewable energy intermittency',
        'Capital investment for infrastructure'
      ],
      marketLocationExplanation: {
        marketBased: 'Reflects actual energy procurement choices and renewable energy certificates',
        locationBased: 'Based on average grid emission factors for operational locations',
        impact: `Market-based approach shows ${Math.round(((latestEmissions.scope2 * 1.15 - latestEmissions.scope2) / (latestEmissions.scope2 * 1.15)) * 100)}% lower emissions due to clean energy investments`
      },
      highlights: [
        `${company.renewable_energy_percentage}% renewable energy portfolio`,
        `${Math.round(((company.emissionsData[0].scope2 - latestEmissions.scope2) / company.emissionsData[0].scope2) * 100)}% scope 2 reduction achieved`,
        'Industry-leading energy efficiency initiatives'
      ]
    }
  };
};
