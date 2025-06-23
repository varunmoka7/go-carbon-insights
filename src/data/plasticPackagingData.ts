
export interface PlasticCompany {
  id: string;
  name: string;
  category: 'producer' | 'converter' | 'brand' | 'waste-management';
  country: string;
  emissions: number; // tonnes CO2e
  circularEconomyScore: number; // 0-100
  toxicityElimination: number; // percentage
  recycledContent: number; // percentage
  recyclabilityScore: number; // 0-100
  revenue: number; // billions USD
  plasticVolume: number; // thousand tonnes
}

export const plasticPackagingCompanies: PlasticCompany[] = [
  // Producers
  {
    id: 'dow-chemical',
    name: 'Dow Chemical',
    category: 'producer',
    country: 'United States',
    emissions: 42000000,
    circularEconomyScore: 78,
    toxicityElimination: 85,
    recycledContent: 15,
    recyclabilityScore: 82,
    revenue: 57.0,
    plasticVolume: 13000
  },
  {
    id: 'basf',
    name: 'BASF',
    category: 'producer',
    country: 'Germany',
    emissions: 38000000,
    circularEconomyScore: 81,
    toxicityElimination: 88,
    recycledContent: 18,
    recyclabilityScore: 85,
    revenue: 63.0,
    plasticVolume: 11500
  },
  {
    id: 'exxonmobil',
    name: 'ExxonMobil Chemical',
    category: 'producer',
    country: 'United States',
    emissions: 45000000,
    circularEconomyScore: 65,
    toxicityElimination: 72,
    recycledContent: 12,
    recyclabilityScore: 75,
    revenue: 413.7,
    plasticVolume: 15200
  },
  // Converters
  {
    id: 'amcor',
    name: 'Amcor',
    category: 'converter',
    country: 'Australia',
    emissions: 2800000,
    circularEconomyScore: 89,
    toxicityElimination: 92,
    recycledContent: 35,
    recyclabilityScore: 91,
    revenue: 12.9,
    plasticVolume: 3400
  },
  {
    id: 'crown-holdings',
    name: 'Crown Holdings',
    category: 'converter',
    country: 'United States',
    emissions: 3200000,
    circularEconomyScore: 76,
    toxicityElimination: 83,
    recycledContent: 28,
    recyclabilityScore: 87,
    revenue: 11.2,
    plasticVolume: 2900
  },
  // Brands
  {
    id: 'coca-cola',
    name: 'The Coca-Cola Company',
    category: 'brand',
    country: 'United States',
    emissions: 25000000,
    circularEconomyScore: 84,
    toxicityElimination: 90,
    recycledContent: 45,
    recyclabilityScore: 88,
    revenue: 38.7,
    plasticVolume: 2800
  },
  {
    id: 'unilever',
    name: 'Unilever',
    category: 'brand',
    country: 'United Kingdom',
    emissions: 18000000,
    circularEconomyScore: 91,
    toxicityElimination: 94,
    recycledContent: 52,
    recyclabilityScore: 93,
    revenue: 60.1,
    plasticVolume: 1900
  },
  {
    id: 'nestle',
    name: 'Nestlé',
    category: 'brand',
    country: 'Switzerland',
    emissions: 22000000,
    circularEconomyScore: 86,
    toxicityElimination: 89,
    recycledContent: 38,
    recyclabilityScore: 85,
    revenue: 94.4,
    plasticVolume: 2200
  },
  // Waste Management
  {
    id: 'veolia',
    name: 'Veolia',
    category: 'waste-management',
    country: 'France',
    emissions: 12000000,
    circularEconomyScore: 95,
    toxicityElimination: 87,
    recycledContent: 78,
    recyclabilityScore: 96,
    revenue: 29.9,
    plasticVolume: 4500
  },
  {
    id: 'waste-management',
    name: 'Waste Management Inc.',
    category: 'waste-management',
    country: 'United States',
    emissions: 15000000,
    circularEconomyScore: 82,
    toxicityElimination: 79,
    recycledContent: 65,
    recyclabilityScore: 89,
    revenue: 17.9,
    plasticVolume: 3800
  }
];

export const plasticPackagingKPIs = {
  totalEmissions: '1.8 Gt CO2e annually',
  wasteGeneration: '300M tonnes annually',
  oceanPollution: '8M tonnes annually',
  recyclingRate: '9% globally',
  circularEconomyPotential: '80% by 2050',
  jobsCreated: '1.5M in circular economy',
  avgCircularScore: 83,
  avgToxicityElimination: 86,
  avgRecycledContent: 35
};

export const valueChainData = {
  stages: [
    {
      name: 'Raw Material Production',
      companies: 15,
      avgEmissions: 41000000,
      description: 'Polymer and resin production from petrochemicals'
    },
    {
      name: 'Packaging Conversion',
      companies: 25,
      avgEmissions: 3000000,
      description: 'Manufacturing of packaging products and containers'
    },
    {
      name: 'Brand Integration',
      companies: 45,
      avgEmissions: 21700000,
      description: 'Product packaging and distribution by consumer brands'
    },
    {
      name: 'Waste Management',
      companies: 35,
      avgEmissions: 13500000,
      description: 'Collection, sorting, recycling, and disposal'
    }
  ]
};

export const benchmarkData = {
  industryLeaders: [
    { name: 'Unilever', score: 91, metric: 'Circular Economy Score' },
    { name: 'Amcor', score: 92, metric: 'Toxicity Elimination' },
    { name: 'Veolia', score: 96, metric: 'Recyclability Score' }
  ],
  sectorAverages: {
    producers: { circularScore: 75, toxicityElimination: 82, recycledContent: 15 },
    converters: { circularScore: 83, toxicityElimination: 88, recycledContent: 32 },
    brands: { circularScore: 87, toxicityElimination: 91, recycledContent: 45 },
    wasteManagement: { circularScore: 89, toxicityElimination: 83, recycledContent: 72 }
  }
};
