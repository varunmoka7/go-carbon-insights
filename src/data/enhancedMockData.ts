export interface Framework {
  name: string;
  status: 'Implemented' | 'In Progress' | 'Planned' | 'Not Started';
  score?: string;
}

export interface EmissionDataPoint {
  year: number;
  scope1: number;
  scope2: number;
  scope3: number;
}

export interface SBTITargets {
  description: string;
  nearTermTarget: string;
  longTermTarget: string;
  baselineYear: number;
  targetYear: number;
  validationStatus: string;
  scope1Reduction: number;
  scope3Reduction: number;
}

export interface PathwayDataPoint {
  year: number;
  emissions: number;
  target: number;
}

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
  
  // Additional properties needed by the application
  emissionsData: EmissionDataPoint[];
  topCarbonFootprints: string[];
  sbtiTargets?: SBTITargets;
  sbtiProgress?: number;
  frameworks: Framework[];
  pathwayData?: PathwayDataPoint[];
  carbonCredits?: number;
  materialityScore?: number;
  supplierDecarbonization?: number;
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
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 420000, scope2: 85000, scope3: 345000 },
      { year: 2020, scope1: 415000, scope2: 83000, scope3: 340000 },
      { year: 2021, scope1: 412000, scope2: 82000, scope3: 338000 },
      { year: 2022, scope1: 408000, scope2: 81000, scope3: 335000 },
      { year: 2023, scope1: 405000, scope2: 80000, scope3: 332000 },
      { year: 2024, scope1: 400000, scope2: 78000, scope3: 330000 }
    ],
    topCarbonFootprints: ['Oil extraction and processing', 'Refinery operations', 'Transportation and logistics'],
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'In Progress' },
      { name: 'CDP', status: 'Planned' }
    ],
    carbonCredits: 0,
    materialityScore: 6.2,
    supplierDecarbonization: 25
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
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 280000, scope2: 56000, scope3: 224000 },
      { year: 2020, scope1: 275000, scope2: 55000, scope3: 220000 },
      { year: 2021, scope1: 270000, scope2: 54000, scope3: 216000 },
      { year: 2022, scope1: 265000, scope2: 53000, scope3: 212000 },
      { year: 2023, scope1: 260000, scope2: 52000, scope3: 208000 },
      { year: 2024, scope1: 255000, scope2: 51000, scope3: 204000 }
    ],
    topCarbonFootprints: ['Refining operations', 'Upstream production', 'Product transportation'],
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'Implemented' },
      { name: 'CDP', status: 'Implemented' }
    ],
    carbonCredits: 15000,
    materialityScore: 6.8,
    supplierDecarbonization: 32
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
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 8500, scope2: 16500, scope3: 60000 },
      { year: 2020, scope1: 8200, scope2: 16000, scope3: 58000 },
      { year: 2021, scope1: 7800, scope2: 15200, scope3: 55000 },
      { year: 2022, scope1: 7500, scope2: 14800, scope3: 52000 },
      { year: 2023, scope1: 7200, scope2: 14300, scope3: 50000 },
      { year: 2024, scope1: 6900, scope2: 13800, scope3: 48000 }
    ],
    topCarbonFootprints: ['Data center operations', 'Logistics and transportation', 'Packaging materials'],
    sbtiTargets: {
      description: 'Net-zero carbon across all operations by 2040, 10 years ahead of the Paris Agreement',
      nearTermTarget: '50% reduction by 2030',
      longTermTarget: 'Net-zero by 2040',
      baselineYear: 2019,
      targetYear: 2040,
      validationStatus: 'Targets Approved',
      scope1Reduction: 50,
      scope3Reduction: 40
    },
    sbtiProgress: 65,
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'Implemented' },
      { name: 'CDP', status: 'Implemented', score: 'A-' }
    ],
    pathwayData: [
      { year: 2019, emissions: 85000, target: 85000 },
      { year: 2020, emissions: 82200, target: 81200 },
      { year: 2021, emissions: 78000, target: 77400 },
      { year: 2022, emissions: 74300, target: 73600 },
      { year: 2023, emissions: 71500, target: 69800 },
      { year: 2024, emissions: 68700, target: 66000 },
      { year: 2030, emissions: 42500, target: 42500 },
      { year: 2040, emissions: 0, target: 0 }
    ],
    carbonCredits: 125000,
    materialityScore: 8.5,
    supplierDecarbonization: 72
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
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 1800, scope2: 3200, scope3: 13000 },
      { year: 2020, scope1: 1700, scope2: 3000, scope3: 12500 },
      { year: 2021, scope1: 1600, scope2: 2800, scope3: 12000 },
      { year: 2022, scope1: 1500, scope2: 2600, scope3: 11500 },
      { year: 2023, scope1: 1400, scope2: 2400, scope3: 11000 },
      { year: 2024, scope1: 1300, scope2: 2200, scope3: 10500 }
    ],
    topCarbonFootprints: ['Cloud infrastructure', 'Business travel', 'Employee commuting'],
    sbtiTargets: {
      description: 'Carbon negative by 2030 and remove all historical emissions by 2050',
      nearTermTarget: 'Carbon negative by 2030',
      longTermTarget: 'Remove all historical emissions by 2050',
      baselineYear: 2020,
      targetYear: 2030,
      validationStatus: 'Targets Approved',
      scope1Reduction: 75,
      scope3Reduction: 50
    },
    sbtiProgress: 78,
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'Implemented' },
      { name: 'CDP', status: 'Implemented', score: 'A' }
    ],
    pathwayData: [
      { year: 2020, emissions: 17200, target: 17200 },
      { year: 2021, emissions: 16400, target: 15480 },
      { year: 2022, emissions: 15600, target: 13760 },
      { year: 2023, emissions: 14800, target: 12040 },
      { year: 2024, emissions: 14000, target: 10320 },
      { year: 2030, emissions: -5000, target: -5000 }
    ],
    carbonCredits: 85000,
    materialityScore: 9.2,
    supplierDecarbonization: 85
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
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 800, scope2: 1500, scope3: 6200 },
      { year: 2020, scope1: 850, scope2: 1600, scope3: 6800 },
      { year: 2021, scope1: 900, scope2: 1700, scope3: 7200 },
      { year: 2022, scope1: 950, scope2: 1800, scope3: 7500 },
      { year: 2023, scope1: 1000, scope2: 1900, scope3: 7800 },
      { year: 2024, scope1: 1050, scope2: 2000, scope3: 8100 }
    ],
    topCarbonFootprints: ['Battery manufacturing', 'Vehicle production', 'Supply chain materials'],
    sbtiTargets: {
      description: 'Achieve carbon neutrality across the entire vehicle lifecycle by 2040',
      nearTermTarget: '50% reduction in manufacturing emissions by 2030',
      longTermTarget: 'Carbon neutral lifecycle by 2040',
      baselineYear: 2020,
      targetYear: 2040,
      validationStatus: 'Under Review',
      scope1Reduction: 50,
      scope3Reduction: 60
    },
    sbtiProgress: 45,
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'In Progress' },
      { name: 'TCFD', status: 'Implemented' }
    ],
    pathwayData: [
      { year: 2020, emissions: 8850, target: 8850 },
      { year: 2021, emissions: 9800, target: 8673 },
      { year: 2022, emissions: 10250, target: 8496 },
      { year: 2023, emissions: 10700, target: 8319 },
      { year: 2024, emissions: 11150, target: 8142 },
      { year: 2030, emissions: 5500, target: 4425 },
      { year: 2040, emissions: 0, target: 0 }
    ],
    carbonCredits: 25000,
    materialityScore: 8.8,
    supplierDecarbonization: 68
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
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 4500, scope2: 8500, scope3: 32000 },
      { year: 2020, scope1: 4300, scope2: 8200, scope3: 30500 },
      { year: 2021, scope1: 4100, scope2: 7900, scope3: 29000 },
      { year: 2022, scope1: 3900, scope2: 7600, scope3: 27500 },
      { year: 2023, scope1: 3700, scope2: 7300, scope3: 26000 },
      { year: 2024, scope1: 3500, scope2: 7000, scope3: 24500 }
    ],
    topCarbonFootprints: ['Vehicle manufacturing', 'Steel production', 'Global supply chain'],
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'Implemented' },
      { name: 'CDP', status: 'Implemented', score: 'B' }
    ],
    carbonCredits: 45000,
    materialityScore: 7.5,
    supplierDecarbonization: 58
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
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 2800, scope2: 5200, scope3: 20000 },
      { year: 2020, scope1: 2700, scope2: 5000, scope3: 19500 },
      { year: 2021, scope1: 2600, scope2: 4800, scope3: 19000 },
      { year: 2022, scope1: 2500, scope2: 4600, scope3: 18500 },
      { year: 2023, scope1: 2400, scope2: 4400, scope3: 18000 },
      { year: 2024, scope1: 2300, scope2: 4200, scope3: 17500 }
    ],
    topCarbonFootprints: ['Supply chain operations', 'Store energy consumption', 'Transportation logistics'],
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'Implemented' },
      { name: 'CDP', status: 'Implemented', score: 'B+' }
    ],
    carbonCredits: 65000,
    materialityScore: 7.8,
    supplierDecarbonization: 62
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
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 550, scope2: 1200, scope3: 8250 },
      { year: 2020, scope1: 520, scope2: 1150, scope3: 7830 },
      { year: 2021, scope1: 480, scope2: 1100, scope3: 7420 },
      { year: 2022, scope1: 450, scope2: 1050, scope3: 7000 },
      { year: 2023, scope1: 420, scope2: 1000, scope3: 6580 },
      { year: 2024, scope1: 390, scope2: 950, scope3: 6160 }
    ],
    topCarbonFootprints: ['Cloud infrastructure', 'Employee commuting', 'Business travel'],
    sbtiTargets: {
      description: 'Achieve net-zero emissions across all operations by 2050 with interim targets',
      nearTermTarget: '50% reduction by 2030',
      longTermTarget: 'Net-zero by 2050',
      baselineYear: 2019,
      targetYear: 2050,
      validationStatus: 'Targets Approved',
      scope1Reduction: 50,
      scope3Reduction: 42
    },
    sbtiProgress: 58,
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'Implemented' },
      { name: 'CDP', status: 'Implemented', score: 'A-' }
    ],
    pathwayData: [
      { year: 2019, emissions: 10000, target: 10000 },
      { year: 2020, emissions: 9500, target: 9500 },
      { year: 2021, emissions: 9000, target: 9000 },
      { year: 2022, emissions: 8500, target: 8500 },
      { year: 2023, emissions: 8000, target: 8000 },
      { year: 2024, emissions: 7500, target: 7500 },
      { year: 2030, emissions: 5000, target: 5000 },
      { year: 2050, emissions: 0, target: 0 }
    ],
    carbonCredits: 12000,
    materialityScore: 8.2,
    supplierDecarbonization: 75
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
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 1800, scope2: 3400, scope3: 12800 },
      { year: 2020, scope1: 1750, scope2: 3300, scope3: 12500 },
      { year: 2021, scope1: 1700, scope2: 3200, scope3: 12200 },
      { year: 2022, scope1: 1650, scope2: 3100, scope3: 11900 },
      { year: 2023, scope1: 1600, scope2: 3000, scope3: 11600 },
      { year: 2024, scope1: 1550, scope2: 2900, scope3: 11300 }
    ],
    topCarbonFootprints: ['Agricultural supply chain', 'Manufacturing operations', 'Packaging materials'],
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'Implemented' },
      { name: 'CDP', status: 'Implemented', score: 'B' }
    ],
    carbonCredits: 35000,
    materialityScore: 7.2,
    supplierDecarbonization: 55
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
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 2800, scope2: 5200, scope3: 20000 },
      { year: 2020, scope1: 2600, scope2: 4800, scope3: 18500 },
      { year: 2021, scope1: 2400, scope2: 4400, scope3: 17000 },
      { year: 2022, scope1: 2500, scope2: 4600, scope3: 17800 },
      { year: 2023, scope1: 2300, scope2: 4200, scope3: 16500 },
      { year: 2024, scope1: 2200, scope2: 4000, scope3: 16000 }
    ],
    topCarbonFootprints: ['Aircraft manufacturing', 'Material processing', 'Supply chain logistics'],
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'Implemented' },
      { name: 'CDP', status: 'In Progress' }
    ],
    carbonCredits: 18000,
    materialityScore: 6.8,
    supplierDecarbonization: 42
  },

  // Technology Sector - Additional Companies
  {
    id: 'apple',
    name: 'Apple Inc.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    description: 'American multinational technology company designing consumer electronics and software',
    headquarters: 'Cupertino, California, USA',
    employees: 164000,
    revenue: 394.3,
    marketCap: 3000.0,
    totalEmissions: 22000,
    emissionsIntensity: 55.8,
    carbonFootprint: 22000,
    energyConsumption: 55000,
    wasteGenerated: 520,
    renewableEnergyPercentage: 95,
    waterUsage: 220,
    sustainabilityRating: 'A',
    sbtiCommitted: true,
    netZeroTarget: 2030,
    keyInitiatives: ['Carbon neutral by 2030', '100% renewable energy', 'Product lifecycle optimization'],
    challenges: ['Supply chain complexity', 'Customer product lifecycle', 'Material sourcing'],
    opportunities: ['Circular design', 'Renewable energy expansion', 'Supply chain transformation'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 2200, scope2: 4300, scope3: 15500 },
      { year: 2020, scope1: 2100, scope2: 4100, scope3: 14800 },
      { year: 2021, scope1: 2000, scope2: 3900, scope3: 14200 },
      { year: 2022, scope1: 1900, scope2: 3700, scope3: 13600 },
      { year: 2023, scope1: 1800, scope2: 3500, scope3: 13000 },
      { year: 2024, scope1: 1700, scope2: 3300, scope3: 12400 }
    ],
    topCarbonFootprints: ['Product manufacturing', 'Supply chain logistics', 'Data centers'],
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'Implemented' },
      { name: 'CDP', status: 'Implemented', score: 'A' }
    ],
    carbonCredits: 95000,
    materialityScore: 9.5,
    supplierDecarbonization: 88
  },
  {
    id: 'google',
    name: 'Alphabet Inc. (Google)',
    sector: 'Technology',
    industry: 'Internet Services',
    description: 'American multinational conglomerate focused on internet services and AI',
    headquarters: 'Mountain View, California, USA',
    employees: 190000,
    revenue: 307.4,
    marketCap: 2100.0,
    totalEmissions: 35000,
    emissionsIntensity: 113.8,
    carbonFootprint: 35000,
    energyConsumption: 85000,
    wasteGenerated: 680,
    renewableEnergyPercentage: 90,
    waterUsage: 380,
    sustainabilityRating: 'A-',
    sbtiCommitted: true,
    netZeroTarget: 2030,
    keyInitiatives: ['Carbon neutrality', 'AI for climate', 'Circular economy'],
    challenges: ['Data center growth', 'Global operations scale', 'Hardware lifecycle'],
    opportunities: ['AI optimization', 'Renewable energy innovation', 'Climate solutions'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 3500, scope2: 6800, scope3: 24700 },
      { year: 2020, scope1: 3300, scope2: 6400, scope3: 23300 },
      { year: 2021, scope1: 3100, scope2: 6000, scope3: 21900 },
      { year: 2022, scope1: 2900, scope2: 5600, scope3: 20500 },
      { year: 2023, scope1: 2700, scope2: 5200, scope3: 19100 },
      { year: 2024, scope1: 2500, scope2: 4800, scope3: 17700 }
    ],
    topCarbonFootprints: ['Data center operations', 'Cloud infrastructure', 'Hardware manufacturing'],
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'Implemented' },
      { name: 'CDP', status: 'Implemented', score: 'A' }
    ],
    carbonCredits: 75000,
    materialityScore: 9.1,
    supplierDecarbonization: 82
  },
  {
    id: 'meta',
    name: 'Meta Platforms Inc.',
    sector: 'Technology',
    industry: 'Social Media',
    description: 'American technology conglomerate focused on social media and virtual reality',
    headquarters: 'Menlo Park, California, USA',
    employees: 77000,
    revenue: 134.9,
    marketCap: 900.0,
    totalEmissions: 16000,
    emissionsIntensity: 118.6,
    carbonFootprint: 16000,
    energyConsumption: 38000,
    wasteGenerated: 320,
    renewableEnergyPercentage: 78,
    waterUsage: 185,
    sustainabilityRating: 'B+',
    sbtiCommitted: true,
    netZeroTarget: 2030,
    keyInitiatives: ['Net zero operations', 'Renewable energy', 'Sustainable data centers'],
    challenges: ['Data center energy growth', 'Global expansion', 'Hardware requirements'],
    opportunities: ['VR efficiency innovation', 'Clean energy infrastructure', 'Remote work optimization'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 1600, scope2: 3100, scope3: 11300 },
      { year: 2020, scope1: 1550, scope2: 3000, scope3: 10950 },
      { year: 2021, scope1: 1500, scope2: 2900, scope3: 10600 },
      { year: 2022, scope1: 1450, scope2: 2800, scope3: 10250 },
      { year: 2023, scope1: 1400, scope2: 2700, scope3: 9900 },
      { year: 2024, scope1: 1350, scope2: 2600, scope3: 9550 }
    ],
    topCarbonFootprints: ['Data center operations', 'Office facilities', 'Employee travel'],
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'In Progress' },
      { name: 'CDP', status: 'Implemented', score: 'B+' }
    ],
    carbonCredits: 42000,
    materialityScore: 8.3,
    supplierDecarbonization: 71
  },
  {
    id: 'samsung',
    name: 'Samsung Electronics',
    sector: 'Technology',
    industry: 'Electronics Manufacturing',
    description: 'South Korean multinational electronics corporation',
    headquarters: 'Suwon, South Korea',
    employees: 267000,
    revenue: 244.2,
    marketCap: 380.0,
    totalEmissions: 48000,
    emissionsIntensity: 196.6,
    carbonFootprint: 48000,
    energyConsumption: 95000,
    wasteGenerated: 980,
    renewableEnergyPercentage: 55,
    waterUsage: 420,
    sustainabilityRating: 'B',
    sbtiCommitted: true,
    netZeroTarget: 2050,
    keyInitiatives: ['RE100 commitment', 'Eco-conscious products', 'Circular economy'],
    challenges: ['Manufacturing energy intensity', 'Global supply chain', 'Product lifecycle'],
    opportunities: ['Renewable energy expansion', 'Energy-efficient manufacturing', 'Product recycling'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD'],
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 4800, scope2: 9200, scope3: 34000 },
      { year: 2020, scope1: 4600, scope2: 8800, scope3: 32600 },
      { year: 2021, scope1: 4400, scope2: 8400, scope3: 31200 },
      { year: 2022, scope1: 4200, scope2: 8000, scope3: 29800 },
      { year: 2023, scope1: 4000, scope2: 7600, scope3: 28400 },
      { year: 2024, scope1: 3800, scope2: 7200, scope3: 27000 }
    ],
    topCarbonFootprints: ['Semiconductor manufacturing', 'Display production', 'Global logistics'],
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'In Progress' },
      { name: 'TCFD', status: 'Implemented' }
    ],
    carbonCredits: 28000,
    materialityScore: 7.1,
    supplierDecarbonization: 52
  },

  // Automotive Sector - Additional Companies
  {
    id: 'bmw',
    name: 'BMW Group',
    sector: 'Manufacturing',
    industry: 'Automotive',
    description: 'German multinational automotive manufacturer of luxury vehicles',
    headquarters: 'Munich, Germany',
    employees: 149000,
    revenue: 142.6,
    marketCap: 58.0,
    totalEmissions: 65000,
    emissionsIntensity: 455.8,
    carbonFootprint: 65000,
    energyConsumption: 125000,
    wasteGenerated: 1800,
    renewableEnergyPercentage: 68,
    waterUsage: 520,
    sustainabilityRating: 'B+',
    sbtiCommitted: true,
    netZeroTarget: 2050,
    keyInitiatives: ['Electric mobility', 'Circular economy', 'Sustainable supply chain'],
    challenges: ['ICE to EV transition', 'Battery supply chain', 'Manufacturing transformation'],
    opportunities: ['Electric vehicle leadership', 'Sustainable materials', 'Digital services'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 6500, scope2: 12500, scope3: 46000 },
      { year: 2020, scope1: 6200, scope2: 11800, scope3: 43000 },
      { year: 2021, scope1: 5900, scope2: 11100, scope3: 40000 },
      { year: 2022, scope1: 5600, scope2: 10400, scope3: 37000 },
      { year: 2023, scope1: 5300, scope2: 9700, scope3: 34000 },
      { year: 2024, scope1: 5000, scope2: 9000, scope3: 31000 }
    ],
    topCarbonFootprints: ['Vehicle manufacturing', 'Steel and aluminum production', 'Supplier operations'],
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'Implemented' },
      { name: 'CDP', status: 'Implemented', score: 'B+' }
    ],
    carbonCredits: 38000,
    materialityScore: 7.8,
    supplierDecarbonization: 64
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen Group',
    sector: 'Manufacturing',
    industry: 'Automotive',
    description: 'German multinational automotive manufacturing corporation',
    headquarters: 'Wolfsburg, Germany',
    employees: 672000,
    revenue: 279.2,
    marketCap: 82.0,
    totalEmissions: 85000,
    emissionsIntensity: 304.5,
    carbonFootprint: 85000,
    energyConsumption: 165000,
    wasteGenerated: 2400,
    waterUsage: 680,
    renewableEnergyPercentage: 62,
    sustainabilityRating: 'B',
    sbtiCommitted: true,
    netZeroTarget: 2050,
    keyInitiatives: ['Way to Zero strategy', 'Electric transformation', 'Sustainable production'],
    challenges: ['Fleet electrification', 'Manufacturing decarbonization', 'Supply chain complexity'],
    opportunities: ['Electric vehicle mass market', 'Battery technology', 'Mobility services'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 8500, scope2: 16300, scope3: 60200 },
      { year: 2020, scope1: 8100, scope2: 15500, scope3: 56400 },
      { year: 2021, scope1: 7700, scope2: 14700, scope3: 52600 },
      { year: 2022, scope1: 7300, scope2: 13900, scope3: 48800 },
      { year: 2023, scope1: 6900, scope2: 13100, scope3: 45000 },
      { year: 2024, scope1: 6500, scope2: 12300, scope3: 41200 }
    ],
    topCarbonFootprints: ['Vehicle production', 'Material extraction', 'Global supply chain'],
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'Implemented' },
      { name: 'CDP', status: 'Implemented', score: 'B' }
    ],
    carbonCredits: 52000,
    materialityScore: 7.5,
    supplierDecarbonization: 58
  },

  // Energy Sector - Additional Companies
  {
    id: 'bp',
    name: 'BP plc',
    sector: 'Energy',
    industry: 'Oil & Gas',
    description: 'British multinational oil and gas company',
    headquarters: 'London, United Kingdom',
    employees: 66800,
    revenue: 241.4,
    marketCap: 95.0,
    totalEmissions: 420000,
    emissionsIntensity: 1740.1,
    carbonFootprint: 420000,
    energyConsumption: 580000,
    wasteGenerated: 8500,
    renewableEnergyPercentage: 25,
    waterUsage: 1800,
    sustainabilityRating: 'C+',
    sbtiCommitted: false,
    netZeroTarget: 2050,
    keyInitiatives: ['Net zero ambition', 'Renewable energy investment', 'Low carbon transition'],
    challenges: ['Energy transition', 'Stranded assets', 'Operational emissions'],
    opportunities: ['Offshore wind', 'Hydrogen production', 'CCUS technology'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 210000, scope2: 42000, scope3: 168000 },
      { year: 2020, scope1: 205000, scope2: 41000, scope3: 164000 },
      { year: 2021, scope1: 200000, scope2: 40000, scope3: 160000 },
      { year: 2022, scope1: 195000, scope2: 39000, scope3: 156000 },
      { year: 2023, scope1: 190000, scope2: 38000, scope3: 152000 },
      { year: 2024, scope1: 185000, scope2: 37000, scope3: 148000 }
    ],
    topCarbonFootprints: ['Oil and gas extraction', 'Refining operations', 'Transportation'],
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'Implemented' },
      { name: 'CDP', status: 'Implemented', score: 'C+' }
    ],
    carbonCredits: 8000,
    materialityScore: 6.8,
    supplierDecarbonization: 28
  },
  {
    id: 'shell',
    name: 'Shell plc',
    sector: 'Energy',
    industry: 'Oil & Gas',
    description: 'British-Dutch multinational oil and gas company',
    headquarters: 'London, United Kingdom',
    employees: 93000,
    revenue: 386.2,
    marketCap: 220.0,
    totalEmissions: 650000,
    emissionsIntensity: 1683.1,
    carbonFootprint: 650000,
    energyConsumption: 850000,
    wasteGenerated: 12000,
    renewableEnergyPercentage: 18,
    waterUsage: 2400,
    sustainabilityRating: 'C',
    sbtiCommitted: false,
    netZeroTarget: 2050,
    keyInitiatives: ['Powering Progress strategy', 'Nature-based solutions', 'Energy transition'],
    challenges: ['Scope 3 emissions', 'Energy transition pace', 'Investment allocation'],
    opportunities: ['LNG expansion', 'Renewable power', 'Carbon capture'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 325000, scope2: 65000, scope3: 260000 },
      { year: 2020, scope1: 318000, scope2: 63600, scope3: 254400 },
      { year: 2021, scope1: 311000, scope2: 62200, scope3: 248800 },
      { year: 2022, scope1: 304000, scope2: 60800, scope3: 243200 },
      { year: 2023, scope1: 297000, scope2: 59400, scope3: 237600 },
      { year: 2024, scope1: 290000, scope2: 58000, scope3: 232000 }
    ],
    topCarbonFootprints: ['Upstream operations', 'LNG processing', 'Chemical production'],
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'Implemented' },
      { name: 'CDP', status: 'Implemented', score: 'C' }
    ],
    carbonCredits: 12000,
    materialityScore: 6.2,
    supplierDecarbonization: 22
  },
  {
    id: 'energytransition',
    name: 'EnergyTransition Ltd',
    sector: 'Energy',
    industry: 'Renewable Energy',
    description: 'Clean energy company focused on renewable power generation',
    headquarters: 'Copenhagen, Denmark',
    employees: 8500,
    revenue: 15.2,
    marketCap: 45.0,
    totalEmissions: 8500,
    emissionsIntensity: 559.2,
    carbonFootprint: 8500,
    energyConsumption: 22000,
    wasteGenerated: 180,
    renewableEnergyPercentage: 95,
    waterUsage: 95,
    sustainabilityRating: 'A+',
    sbtiCommitted: true,
    netZeroTarget: 2025,
    keyInitiatives: ['100% renewable portfolio', 'Green hydrogen', 'Energy storage'],
    challenges: ['Grid integration', 'Intermittency management', 'Technology scaling'],
    opportunities: ['Offshore wind expansion', 'Energy storage solutions', 'Green hydrogen'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 850, scope2: 1600, scope3: 6050 },
      { year: 2020, scope1: 800, scope2: 1500, scope3: 5700 },
      { year: 2021, scope1: 750, scope2: 1400, scope3: 5350 },
      { year: 2022, scope1: 700, scope2: 1300, scope3: 5000 },
      { year: 2023, scope1: 650, scope2: 1200, scope3: 4650 },
      { year: 2024, scope1: 600, scope2: 1100, scope3: 4300 }
    ],
    topCarbonFootprints: ['Construction activities', 'Maintenance operations', 'Supply chain'],
    frameworks: [
      { name: 'GRI', status: 'Implemented' },
      { name: 'SASB', status: 'Implemented' },
      { name: 'TCFD', status: 'Implemented' },
      { name: 'CDP', status: 'Implemented', score: 'A+' }
    ],
    carbonCredits: 85000,
    materialityScore: 9.8,
    supplierDecarbonization: 92
  },

  // Consumer/Retail Sector - Additional Companies
  {
    id: 'nike',
    name: 'Nike Inc.',
    sector: 'Consumer Goods',
    industry: 'Apparel & Footwear',
    description: 'American multinational corporation focused on athletic footwear and apparel',
    headquarters: 'Beaverton, Oregon, USA',
    employees: 83700,
    revenue: 51.2,
    marketCap: 180.0,
    totalEmissions: 14500,
    emissionsIntensity: 283.2,
    carbonFootprint: 14500,
    energyConsumption: 28000,
    wasteGenerated: 420,
    renewableEnergyPercentage: 72,
    waterUsage: 185,
    sustainabilityRating: 'B+',
    sbtiCommitted: true,
    netZeroTarget: 2050,
    keyInitiatives: ['Move to Zero', 'Circular design', 'Sustainable materials'],
    challenges: ['Supply chain complexity', 'Material sourcing', 'Manufacturing emissions'],
    opportunities: ['Circular economy', 'Renewable materials', 'Direct-to-consumer'],
    reportingFrameworks: ['GRI', 'SASB', 'TCFD', 'CDP'],
    lastUpdated: '2024-01-15',
    emissionsData: [
      { year: 2019, scope1: 1450, scope2: 2800, scope3: 10250 },
      { year: 2020, scope1: 1400, scope2: 2700, scope3: 9900 },
      { year: 2021, scope1: 1350, scope2: 2600, scope3: 9550 },
      { year: 2022, scope1: 1300, scope2: 2500, scope3: 9200 },
      { year: 2023, scope1: 1250, scope2: 2400, scope3: 8850 },
      {
