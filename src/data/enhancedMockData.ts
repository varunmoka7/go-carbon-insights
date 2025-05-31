
export interface EnhancedCompany {
  id: string;
  name: string;
  sector: string;
  industry: string;
  description: string;
  headquarters: string;
  employees: number;
  revenue: number; // in billions USD
  marketCap: number; // in billions USD
  totalEmissions: number; // in tCO2e
  emissionsIntensity: number; // tCO2e per million USD revenue
  carbonFootprint: number;
  energyConsumption: number; // MWh
  wasteGenerated: number; // tons
  renewableEnergyPercentage: number;
  waterUsage: number; // million gallons
  sustainabilityRating: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
  sbtiCommitted: boolean;
  netZeroTarget: number | null; // target year
  keyInitiatives: string[];
  challenges: string[];
  opportunities: string[];
  reportingFrameworks: string[];
  lastUpdated: string;
}

export const enhancedCompanies: EnhancedCompany[] = [
  // Energy Sector - Oil & Gas
  {
    id: 'saudi_aramco',
    name: 'Saudi Aramco',
    sector: 'Energy',
    industry: 'Oil & Gas',
    description: 'World\'s largest oil company and leading integrated energy and chemicals enterprise',
    headquarters: 'Dhahran, Saudi Arabia',
    employees: 70000,
    revenue: 535.0,
    marketCap: 2100.0,
    totalEmissions: 850000,
    emissionsIntensity: 1588.8,
    carbonFootprint: 850000,
    energyConsumption: 950000,
    wasteGenerated: 12000,
    renewableEnergyPercentage: 5,
    waterUsage: 2800,
    sustainabilityRating: 'C',
    sbtiCommitted: false,
    netZeroTarget: 2060,
    keyInitiatives: ['Carbon capture and storage', 'Methane leak detection', 'Renewable energy projects'],
    challenges: ['Fossil fuel dependency', 'Regulatory pressure', 'Energy transition'],
    opportunities: ['Blue hydrogen production', 'CCUS technology', 'Renewable energy expansion'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD'],
    lastUpdated: '2024-01-15'
  },
  {
    id: 'exxonmobil',
    name: 'ExxonMobil',
    sector: 'Energy',
    industry: 'Oil & Gas',
    description: 'American multinational oil and gas corporation',
    headquarters: 'Irving, Texas, USA',
    employees: 62000,
    revenue: 413.7,
    marketCap: 450.0,
    totalEmissions: 560000,
    emissionsIntensity: 1353.1,
    carbonFootprint: 560000,
    energyConsumption: 720000,
    wasteGenerated: 7800,
    renewableEnergyPercentage: 12,
    waterUsage: 2200,
    sustainabilityRating: 'C+',
    sbtiCommitted: false,
    netZeroTarget: 2050,
    keyInitiatives: ['Low-carbon solutions', 'Advanced recycling', 'Carbon capture'],
    challenges: ['Climate litigation', 'Stranded assets', 'Energy transition'],
    opportunities: ['Biofuels development', 'Carbon capture', 'Chemical recycling'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15'
  },

  // Technology Sector
  {
    id: 'amazon',
    name: 'Amazon',
    sector: 'Technology',
    industry: 'E-commerce & Cloud',
    description: 'American multinational technology company focusing on e-commerce and cloud computing',
    headquarters: 'Seattle, Washington, USA',
    employees: 1540000,
    revenue: 574.8,
    marketCap: 1650.0,
    totalEmissions: 85000,
    emissionsIntensity: 147.9,
    carbonFootprint: 85000,
    energyConsumption: 180000,
    wasteGenerated: 1800,
    renewableEnergyPercentage: 65,
    waterUsage: 890,
    sustainabilityRating: 'B+',
    sbtiCommitted: true,
    netZeroTarget: 2040,
    keyInitiatives: ['Climate Pledge', 'Electric delivery fleet', 'Renewable energy projects'],
    challenges: ['Logistics emissions', 'Packaging waste', 'Energy-intensive operations'],
    opportunities: ['Clean energy infrastructure', 'Sustainable packaging', 'Carbon-neutral delivery'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    sector: 'Technology',
    industry: 'Software & Cloud',
    description: 'American multinational technology corporation developing software and cloud services',
    headquarters: 'Redmond, Washington, USA',
    employees: 228000,
    revenue: 230.0,
    marketCap: 2800.0,
    totalEmissions: 18000,
    emissionsIntensity: 78.3,
    carbonFootprint: 18000,
    energyConsumption: 42000,
    wasteGenerated: 420,
    renewableEnergyPercentage: 75,
    waterUsage: 180,
    sustainabilityRating: 'A-',
    sbtiCommitted: true,
    netZeroTarget: 2030,
    keyInitiatives: ['Carbon negative by 2030', 'AI for sustainability', 'Green software'],
    challenges: ['Data center energy use', 'Supply chain emissions', 'Customer product use'],
    opportunities: ['Carbon removal technology', 'Sustainable cloud services', 'Green AI solutions'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15'
  },
  {
    id: 'tesla',
    name: 'Tesla',
    sector: 'Manufacturing',
    industry: 'Electric Vehicles',
    description: 'American electric vehicle and clean energy company',
    headquarters: 'Austin, Texas, USA',
    employees: 140000,
    revenue: 96.8,
    marketCap: 800.0,
    totalEmissions: 8500,
    emissionsIntensity: 87.8,
    carbonFootprint: 8500,
    energyConsumption: 18000,
    wasteGenerated: 280,
    renewableEnergyPercentage: 85,
    waterUsage: 120,
    sustainabilityRating: 'A',
    sbtiCommitted: true,
    netZeroTarget: 2040,
    keyInitiatives: ['Electric vehicle acceleration', 'Battery recycling', 'Solar energy systems'],
    challenges: ['Battery supply chain', 'Manufacturing scale-up', 'Charging infrastructure'],
    opportunities: ['Battery technology advancement', 'Energy storage systems', 'Autonomous driving'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD'],
    lastUpdated: '2024-01-15'
  },

  // Manufacturing - Automotive
  {
    id: 'toyota',
    name: 'Toyota',
    sector: 'Manufacturing',
    industry: 'Automotive',
    description: 'Japanese multinational automotive manufacturer',
    headquarters: 'Toyota City, Japan',
    employees: 375000,
    revenue: 274.5,
    marketCap: 250.0,
    totalEmissions: 45000,
    emissionsIntensity: 163.9,
    carbonFootprint: 45000,
    energyConsumption: 75000,
    wasteGenerated: 1200,
    renewableEnergyPercentage: 45,
    waterUsage: 420,
    sustainabilityRating: 'B+',
    sbtiCommitted: true,
    netZeroTarget: 2050,
    keyInitiatives: ['Hybrid technology', 'Hydrogen fuel cells', 'Manufacturing efficiency'],
    challenges: ['ICE vehicle transition', 'Supply chain complexity', 'Regional energy grids'],
    opportunities: ['Electric vehicle expansion', 'Hydrogen mobility', 'Circular economy'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15'
  },

  // Retail
  {
    id: 'walmart',
    name: 'Walmart',
    sector: 'Retail',
    industry: 'Retail',
    description: 'American multinational retail corporation',
    headquarters: 'Bentonville, Arkansas, USA',
    employees: 2100000,
    revenue: 648.1,
    marketCap: 520.0,
    totalEmissions: 28000,
    emissionsIntensity: 43.2,
    carbonFootprint: 28000,
    energyConsumption: 75000,
    wasteGenerated: 2800,
    renewableEnergyPercentage: 45,
    waterUsage: 850,
    sustainabilityRating: 'B',
    sbtiCommitted: true,
    netZeroTarget: 2040,
    keyInitiatives: ['Project Gigaton', 'Renewable energy', 'Sustainable sourcing'],
    challenges: ['Supply chain scope 3', 'Store energy use', 'Packaging waste'],
    opportunities: ['Supplier engagement', 'Electric delivery', 'Circular retail'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15'
  },

  // Add the original companies to maintain compatibility
  {
    id: 'techcorp',
    name: 'TechCorp Solutions',
    sector: 'Technology',
    industry: 'Software Development',
    description: 'Leading software development company focusing on cloud solutions',
    headquarters: 'San Francisco, California, USA',
    employees: 5200,
    revenue: 2.8,
    marketCap: 15.0,
    totalEmissions: 3100,
    emissionsIntensity: 1107.1,
    carbonFootprint: 3100,
    energyConsumption: 12450,
    wasteGenerated: 245,
    renewableEnergyPercentage: 75,
    waterUsage: 85,
    sustainabilityRating: 'A-',
    sbtiCommitted: true,
    netZeroTarget: 2050,
    keyInitiatives: ['100% renewable energy', 'Green software development', 'Remote work optimization'],
    challenges: ['Data center efficiency', 'Employee commuting', 'Supply chain visibility'],
    opportunities: ['Carbon-neutral cloud services', 'Sustainable software practices', 'Digital transformation'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15'
  },

  // Consumer Goods
  {
    id: 'nestle',
    name: 'Nestle',
    sector: 'Consumer Goods',
    industry: 'Food & Beverage',
    description: 'Swiss multinational food and drink corporation',
    headquarters: 'Vevey, Switzerland',
    employees: 273000,
    revenue: 94.4,
    marketCap: 320.0,
    totalEmissions: 18000,
    emissionsIntensity: 190.7,
    carbonFootprint: 18000,
    energyConsumption: 48000,
    wasteGenerated: 850,
    renewableEnergyPercentage: 48,
    waterUsage: 1200,
    sustainabilityRating: 'B+',
    sbtiCommitted: true,
    netZeroTarget: 2050,
    keyInitiatives: ['Regenerative agriculture', 'Sustainable packaging', 'Water stewardship'],
    challenges: ['Agricultural supply chain', 'Packaging waste', 'Water scarcity'],
    opportunities: ['Plant-based products', 'Circular packaging', 'Climate-smart agriculture'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15'
  },

  // Aerospace
  {
    id: 'boeing',
    name: 'Boeing',
    sector: 'Manufacturing',
    industry: 'Aerospace',
    description: 'American multinational aerospace corporation',
    headquarters: 'Chicago, Illinois, USA',
    employees: 156000,
    revenue: 66.6,
    marketCap: 140.0,
    totalEmissions: 28000,
    emissionsIntensity: 420.4,
    carbonFootprint: 28000,
    energyConsumption: 45000,
    wasteGenerated: 850,
    renewableEnergyPercentage: 35,
    waterUsage: 320,
    sustainabilityRating: 'B-',
    sbtiCommitted: true,
    netZeroTarget: 2050,
    keyInitiatives: ['Sustainable aviation fuels', 'Efficient aircraft design', 'Manufacturing optimization'],
    challenges: ['Aviation industry emissions', 'Long product lifecycles', 'Customer operations'],
    opportunities: ['Electric aircraft', 'Sustainable aviation fuels', 'Advanced materials'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15'
  }
];

// Helper functions for data processing
export const getCompanyById = (id: string): EnhancedCompany | undefined => {
  return enhancedCompanies.find(company => company.id === id);
};

export const getCompaniesBySector = (sector: string): EnhancedCompany[] => {
  return enhancedCompanies.filter(company => company.sector === sector);
};

export const getTopEmitters = (limit: number = 10): EnhancedCompany[] => {
  return enhancedCompanies
    .sort((a, b) => b.totalEmissions - a.totalEmissions)
    .slice(0, limit);
};

export const getTopPerformers = (limit: number = 10): EnhancedCompany[] => {
  const ratingOrder = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
  return enhancedCompanies
    .sort((a, b) => ratingOrder.indexOf(a.sustainabilityRating) - ratingOrder.indexOf(b.sustainabilityRating))
    .slice(0, limit);
};

export const getSectorBreakdown = () => {
  const sectors = [...new Set(enhancedCompanies.map(c => c.sector))];
  return sectors.map(sector => ({
    sector,
    companies: getCompaniesBySector(sector).length,
    totalEmissions: getCompaniesBySector(sector).reduce((sum, c) => sum + c.totalEmissions, 0),
    avgSustainabilityRating: getCompaniesBySector(sector)[0]?.sustainabilityRating || 'C'
  }));
};

export default enhancedCompanies;
