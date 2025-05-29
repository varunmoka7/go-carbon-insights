
export interface Company {
  id: string;
  name: string;
  industry: string;
  sector: string;
  description: string;
  totalEmissions: number;
  energyConsumption: number;
  wasteGenerated: number;
  renewableEnergyPercentage: number;
  topCarbonFootprints: string[];
  frameworks: Framework[];
  emissionsData: EmissionData[];
  sbtiTargets?: SBTITarget;
  sbtiProgress?: number;
  carbonCredits?: number;
  materialityScore?: number;
  supplierDecarbonization?: number;
}

export interface EmissionData {
  year: number;
  scope1: number;
  scope2: number;
  scope3: number;
}

export interface Framework {
  name: string;
  status: 'Implemented' | 'In Progress' | 'Planned' | 'Not Started';
  score?: number;
}

export interface SBTITarget {
  description: string;
  nearTermTarget: string;
  longTermTarget: string;
  baselineYear: string;
}

// Technology Sector Companies (6)
const technologyCompanies: Company[] = [
  {
    id: 'techcorp',
    name: 'TechCorp Industries',
    industry: 'Software & IT Services',
    sector: 'Technology',
    description: 'Leading global technology company specializing in cloud computing, artificial intelligence, and enterprise software solutions. Committed to achieving carbon neutrality by 2030 through renewable energy adoption and sustainable innovation.',
    totalEmissions: 125000,
    energyConsumption: 285000,
    wasteGenerated: 1200,
    renewableEnergyPercentage: 78,
    topCarbonFootprints: [
      'Data center operations and cloud infrastructure',
      'Employee commuting and business travel',
      'Manufacturing of hardware components'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 85 },
      { name: 'SBTi Targets', status: 'Implemented', score: 92 },
      { name: 'TCFD Reporting', status: 'In Progress', score: 70 },
      { name: 'GRI Standards', status: 'Implemented', score: 88 }
    ],
    emissionsData: [
      { year: 2019, scope1: 15000, scope2: 45000, scope3: 80000 },
      { year: 2020, scope1: 14200, scope2: 42000, scope3: 78000 },
      { year: 2021, scope1: 13500, scope2: 39000, scope3: 75000 },
      { year: 2022, scope1: 12800, scope2: 36000, scope3: 72000 },
      { year: 2023, scope1: 12100, scope2: 33000, scope3: 69000 },
      { year: 2024, scope1: 11500, scope2: 30000, scope3: 65000 }
    ],
    sbtiTargets: {
      description: 'TechCorp commits to reduce absolute Scope 1 and 2 greenhouse gas emissions by 50% by 2030 from a 2019 base year and to achieve net-zero emissions across the value chain by 2050.',
      nearTermTarget: '50% reduction in Scope 1+2 emissions by 2030',
      longTermTarget: 'Net-zero across value chain by 2050',
      baselineYear: '2019'
    },
    sbtiProgress: 78,
    carbonCredits: 12000,
    materialityScore: 8.5,
    supplierDecarbonization: 65
  },
  {
    id: 'cloudtech',
    name: 'CloudTech Solutions',
    industry: 'Cloud Computing',
    sector: 'Technology',
    description: 'Major cloud infrastructure provider focused on sustainable data center operations and green computing solutions.',
    totalEmissions: 98000,
    energyConsumption: 320000,
    wasteGenerated: 980,
    renewableEnergyPercentage: 85,
    topCarbonFootprints: [
      'Data center cooling and power consumption',
      'Server manufacturing and replacement',
      'Network infrastructure operations'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 88 },
      { name: 'SBTi Targets', status: 'Implemented', score: 90 },
      { name: 'TCFD Reporting', status: 'Implemented', score: 82 },
      { name: 'GRI Standards', status: 'Implemented', score: 85 }
    ],
    emissionsData: [
      { year: 2019, scope1: 8000, scope2: 35000, scope3: 65000 },
      { year: 2020, scope1: 7500, scope2: 32000, scope3: 62000 },
      { year: 2021, scope1: 7000, scope2: 29000, scope3: 59000 },
      { year: 2022, scope1: 6500, scope2: 26000, scope3: 56000 },
      { year: 2023, scope1: 6000, scope2: 23000, scope3: 53000 },
      { year: 2024, scope1: 5500, scope2: 20000, scope3: 50000 }
    ],
    sbtiTargets: {
      description: 'CloudTech commits to reduce Scope 1 and 2 emissions by 60% by 2030 and achieve carbon neutrality by 2040.',
      nearTermTarget: '60% reduction in Scope 1+2 emissions by 2030',
      longTermTarget: 'Carbon neutrality by 2040',
      baselineYear: '2019'
    },
    sbtiProgress: 82,
    carbonCredits: 15000,
    materialityScore: 9.0,
    supplierDecarbonization: 72
  },
  {
    id: 'cybersec',
    name: 'CyberSec Innovations',
    industry: 'Cybersecurity',
    sector: 'Technology',
    description: 'Leading cybersecurity firm providing enterprise security solutions with a focus on sustainable digital infrastructure.',
    totalEmissions: 45000,
    energyConsumption: 125000,
    wasteGenerated: 420,
    renewableEnergyPercentage: 68,
    topCarbonFootprints: [
      'Office buildings and facilities',
      'Employee travel and commuting',
      'IT equipment and servers'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'In Progress', score: 65 },
      { name: 'SBTi Targets', status: 'Planned', score: 40 },
      { name: 'TCFD Reporting', status: 'In Progress', score: 55 },
      { name: 'GRI Standards', status: 'Implemented', score: 75 }
    ],
    emissionsData: [
      { year: 2019, scope1: 5000, scope2: 18000, scope3: 27000 },
      { year: 2020, scope1: 4800, scope2: 16500, scope3: 25500 },
      { year: 2021, scope1: 4600, scope2: 15000, scope3: 24000 },
      { year: 2022, scope1: 4400, scope2: 13500, scope3: 22500 },
      { year: 2023, scope1: 4200, scope2: 12000, scope3: 21000 },
      { year: 2024, scope1: 4000, scope2: 10500, scope3: 19500 }
    ],
    sbtiProgress: 45,
    carbonCredits: 5000,
    materialityScore: 7.2,
    supplierDecarbonization: 38
  },
  {
    id: 'aitech',
    name: 'AI Tech Dynamics',
    industry: 'Artificial Intelligence',
    sector: 'Technology',
    description: 'AI and machine learning company developing sustainable computing solutions for enterprise applications.',
    totalEmissions: 78000,
    energyConsumption: 195000,
    wasteGenerated: 680,
    renewableEnergyPercentage: 72,
    topCarbonFootprints: [
      'High-performance computing infrastructure',
      'Model training and data processing',
      'Research and development facilities'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 80 },
      { name: 'SBTi Targets', status: 'In Progress', score: 70 },
      { name: 'TCFD Reporting', status: 'In Progress', score: 68 },
      { name: 'GRI Standards', status: 'Implemented', score: 82 }
    ],
    emissionsData: [
      { year: 2019, scope1: 8500, scope2: 28000, scope3: 48500 },
      { year: 2020, scope1: 8200, scope2: 26500, scope3: 46000 },
      { year: 2021, scope1: 7900, scope2: 25000, scope3: 43500 },
      { year: 2022, scope1: 7600, scope2: 23500, scope3: 41000 },
      { year: 2023, scope1: 7300, scope2: 22000, scope3: 38500 },
      { year: 2024, scope1: 7000, scope2: 20500, scope3: 36000 }
    ],
    sbtiProgress: 68,
    carbonCredits: 8500,
    materialityScore: 8.1,
    supplierDecarbonization: 55
  },
  {
    id: 'greendata',
    name: 'GreenData Systems',
    industry: 'Data Analytics',
    sector: 'Technology',
    description: 'Data analytics company specializing in environmental monitoring and sustainability reporting solutions.',
    totalEmissions: 32000,
    energyConsumption: 88000,
    wasteGenerated: 285,
    renewableEnergyPercentage: 88,
    topCarbonFootprints: [
      'Data processing and analytics infrastructure',
      'Client implementation travel',
      'Office operations and facilities'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 92 },
      { name: 'SBTi Targets', status: 'Implemented', score: 95 },
      { name: 'TCFD Reporting', status: 'Implemented', score: 88 },
      { name: 'GRI Standards', status: 'Implemented', score: 90 }
    ],
    emissionsData: [
      { year: 2019, scope1: 3500, scope2: 12000, scope3: 19500 },
      { year: 2020, scope1: 3200, scope2: 11000, scope3: 18000 },
      { year: 2021, scope1: 2900, scope2: 10000, scope3: 16500 },
      { year: 2022, scope1: 2600, scope2: 9000, scope3: 15000 },
      { year: 2023, scope1: 2300, scope2: 8000, scope3: 13500 },
      { year: 2024, scope1: 2000, scope2: 7000, scope3: 12000 }
    ],
    sbtiTargets: {
      description: 'GreenData commits to achieving net-zero emissions by 2035 and helping clients reduce their carbon footprint by 30%.',
      nearTermTarget: '70% reduction in total emissions by 2030',
      longTermTarget: 'Net-zero emissions by 2035',
      baselineYear: '2019'
    },
    sbtiProgress: 88,
    carbonCredits: 3500,
    materialityScore: 9.2,
    supplierDecarbonization: 78
  },
  {
    id: 'digitalwave',
    name: 'DigitalWave Technologies',
    industry: 'Software Development',
    sector: 'Technology',
    description: 'Enterprise software development company focused on creating sustainable digital solutions for various industries.',
    totalEmissions: 56000,
    energyConsumption: 145000,
    wasteGenerated: 520,
    renewableEnergyPercentage: 65,
    topCarbonFootprints: [
      'Software development infrastructure',
      'Client support and maintenance',
      'Employee workspace and facilities'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'In Progress', score: 70 },
      { name: 'SBTi Targets', status: 'Planned', score: 35 },
      { name: 'TCFD Reporting', status: 'Not Started', score: 25 },
      { name: 'GRI Standards', status: 'In Progress', score: 68 }
    ],
    emissionsData: [
      { year: 2019, scope1: 6000, scope2: 22000, scope3: 32000 },
      { year: 2020, scope1: 5800, scope2: 20500, scope3: 30500 },
      { year: 2021, scope1: 5600, scope2: 19000, scope3: 29000 },
      { year: 2022, scope1: 5400, scope2: 17500, scope3: 27500 },
      { year: 2023, scope1: 5200, scope2: 16000, scope3: 26000 },
      { year: 2024, scope1: 5000, scope2: 14500, scope3: 24500 }
    ],
    sbtiProgress: 42,
    carbonCredits: 6200,
    materialityScore: 6.8,
    supplierDecarbonization: 45
  }
];

// Manufacturing Sector Companies (6)
const manufacturingCompanies: Company[] = [
  {
    id: 'greenmanufacturing',
    name: 'Green Manufacturing Co.',
    industry: 'Industrial Equipment',
    sector: 'Manufacturing',
    description: 'Sustainable manufacturing company producing industrial equipment with focus on circular economy principles and renewable energy integration.',
    totalEmissions: 285000,
    energyConsumption: 450000,
    wasteGenerated: 3500,
    renewableEnergyPercentage: 55,
    topCarbonFootprints: [
      'Manufacturing processes and production lines',
      'Raw material extraction and processing',
      'Product transportation and logistics'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 78 },
      { name: 'SBTi Targets', status: 'In Progress', score: 65 },
      { name: 'TCFD Reporting', status: 'In Progress', score: 60 },
      { name: 'GRI Standards', status: 'Implemented', score: 80 }
    ],
    emissionsData: [
      { year: 2019, scope1: 120000, scope2: 65000, scope3: 125000 },
      { year: 2020, scope1: 115000, scope2: 62000, scope3: 120000 },
      { year: 2021, scope1: 110000, scope2: 59000, scope3: 115000 },
      { year: 2022, scope1: 105000, scope2: 56000, scope3: 110000 },
      { year: 2023, scope1: 100000, scope2: 53000, scope3: 105000 },
      { year: 2024, scope1: 95000, scope2: 50000, scope3: 100000 }
    ],
    sbtiTargets: {
      description: 'Green Manufacturing commits to reduce Scope 1 and 2 emissions by 45% by 2030 and achieve net-zero manufacturing by 2050.',
      nearTermTarget: '45% reduction in Scope 1+2 emissions by 2030',
      longTermTarget: 'Net-zero manufacturing by 2050',
      baselineYear: '2019'
    },
    sbtiProgress: 62,
    carbonCredits: 18000,
    materialityScore: 8.3,
    supplierDecarbonization: 58
  },
  {
    id: 'steelworks',
    name: 'Advanced Steel Works',
    industry: 'Steel Production',
    sector: 'Manufacturing',
    description: 'Major steel production company implementing hydrogen-based steel making and carbon capture technologies.',
    totalEmissions: 820000,
    energyConsumption: 1200000,
    wasteGenerated: 12000,
    renewableEnergyPercentage: 28,
    topCarbonFootprints: [
      'Blast furnace operations and steel production',
      'Coking coal consumption',
      'Iron ore processing and transportation'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 72 },
      { name: 'SBTi Targets', status: 'In Progress', score: 55 },
      { name: 'TCFD Reporting', status: 'Implemented', score: 68 },
      { name: 'GRI Standards', status: 'Implemented', score: 75 }
    ],
    emissionsData: [
      { year: 2019, scope1: 650000, scope2: 85000, scope3: 120000 },
      { year: 2020, scope1: 635000, scope2: 82000, scope3: 115000 },
      { year: 2021, scope1: 620000, scope2: 79000, scope3: 110000 },
      { year: 2022, scope1: 605000, scope2: 76000, scope3: 105000 },
      { year: 2023, scope1: 590000, scope2: 73000, scope3: 100000 },
      { year: 2024, scope1: 575000, scope2: 70000, scope3: 95000 }
    ],
    sbtiProgress: 48,
    carbonCredits: 25000,
    materialityScore: 7.8,
    supplierDecarbonization: 42
  },
  {
    id: 'chemworks',
    name: 'ChemWorks Industries',
    industry: 'Chemical Production',
    sector: 'Manufacturing',
    description: 'Chemical manufacturing company transitioning to bio-based chemicals and sustainable production processes.',
    totalEmissions: 445000,
    energyConsumption: 680000,
    wasteGenerated: 5800,
    renewableEnergyPercentage: 42,
    topCarbonFootprints: [
      'Chemical reaction processes',
      'Steam and heat generation',
      'Feedstock transportation and processing'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 75 },
      { name: 'SBTi Targets', status: 'Implemented', score: 68 },
      { name: 'TCFD Reporting', status: 'In Progress', score: 62 },
      { name: 'GRI Standards', status: 'Implemented', score: 78 }
    ],
    emissionsData: [
      { year: 2019, scope1: 280000, scope2: 75000, scope3: 115000 },
      { year: 2020, scope1: 270000, scope2: 72000, scope3: 110000 },
      { year: 2021, scope1: 260000, scope2: 69000, scope3: 105000 },
      { year: 2022, scope1: 250000, scope2: 66000, scope3: 100000 },
      { year: 2023, scope1: 240000, scope2: 63000, scope3: 95000 },
      { year: 2024, scope1: 230000, scope2: 60000, scope3: 90000 }
    ],
    sbtiTargets: {
      description: 'ChemWorks commits to reduce absolute emissions by 40% by 2030 and transition to 80% bio-based chemicals by 2040.',
      nearTermTarget: '40% absolute emission reduction by 2030',
      longTermTarget: '80% bio-based chemicals by 2040',
      baselineYear: '2019'
    },
    sbtiProgress: 58,
    carbonCredits: 22000,
    materialityScore: 8.0,
    supplierDecarbonization: 52
  },
  {
    id: 'autoparts',
    name: 'AutoParts Global',
    industry: 'Automotive Components',
    sector: 'Manufacturing',
    description: 'Automotive parts manufacturer focusing on electric vehicle components and sustainable manufacturing practices.',
    totalEmissions: 195000,
    energyConsumption: 325000,
    wasteGenerated: 2400,
    renewableEnergyPercentage: 68,
    topCarbonFootprints: [
      'Metal stamping and forming operations',
      'Assembly line operations',
      'Component transportation and logistics'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 82 },
      { name: 'SBTi Targets', status: 'Implemented', score: 85 },
      { name: 'TCFD Reporting', status: 'Implemented', score: 78 },
      { name: 'GRI Standards', status: 'Implemented', score: 85 }
    ],
    emissionsData: [
      { year: 2019, scope1: 85000, scope2: 45000, scope3: 85000 },
      { year: 2020, scope1: 80000, scope2: 42000, scope3: 80000 },
      { year: 2021, scope1: 75000, scope2: 39000, scope3: 75000 },
      { year: 2022, scope1: 70000, scope2: 36000, scope3: 70000 },
      { year: 2023, scope1: 65000, scope2: 33000, scope3: 65000 },
      { year: 2024, scope1: 60000, scope2: 30000, scope3: 60000 }
    ],
    sbtiTargets: {
      description: 'AutoParts Global commits to reduce Scope 1 and 2 emissions by 55% by 2030 and achieve carbon neutrality by 2045.',
      nearTermTarget: '55% reduction in Scope 1+2 emissions by 2030',
      longTermTarget: 'Carbon neutrality by 2045',
      baselineYear: '2019'
    },
    sbtiProgress: 75,
    carbonCredits: 14500,
    materialityScore: 8.6,
    supplierDecarbonization: 68
  },
  {
    id: 'textiles',
    name: 'Sustainable Textiles Inc.',
    industry: 'Textile Manufacturing',
    sector: 'Manufacturing',
    description: 'Textile manufacturer pioneering sustainable fabrics and circular fashion solutions with renewable energy adoption.',
    totalEmissions: 125000,
    energyConsumption: 220000,
    wasteGenerated: 1850,
    renewableEnergyPercentage: 72,
    topCarbonFootprints: [
      'Fabric dyeing and finishing processes',
      'Cotton and fiber processing',
      'Textile machinery operations'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'In Progress', score: 68 },
      { name: 'SBTi Targets', status: 'Planned', score: 45 },
      { name: 'TCFD Reporting', status: 'In Progress', score: 55 },
      { name: 'GRI Standards', status: 'Implemented', score: 72 }
    ],
    emissionsData: [
      { year: 2019, scope1: 45000, scope2: 35000, scope3: 55000 },
      { year: 2020, scope1: 43000, scope2: 33000, scope3: 52000 },
      { year: 2021, scope1: 41000, scope2: 31000, scope3: 49000 },
      { year: 2022, scope1: 39000, scope2: 29000, scope3: 46000 },
      { year: 2023, scope1: 37000, scope2: 27000, scope3: 43000 },
      { year: 2024, scope1: 35000, scope2: 25000, scope3: 40000 }
    ],
    sbtiProgress: 52,
    carbonCredits: 8800,
    materialityScore: 7.5,
    supplierDecarbonization: 48
  },
  {
    id: 'packaging',
    name: 'EcoPack Solutions',
    industry: 'Packaging Materials',
    sector: 'Manufacturing',
    description: 'Packaging manufacturer specializing in biodegradable and recyclable packaging solutions for various industries.',
    totalEmissions: 88000,
    energyConsumption: 165000,
    wasteGenerated: 980,
    renewableEnergyPercentage: 78,
    topCarbonFootprints: [
      'Paper and cardboard production',
      'Printing and coating operations',
      'Raw material transportation'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 85 },
      { name: 'SBTi Targets', status: 'Implemented', score: 88 },
      { name: 'TCFD Reporting', status: 'Implemented', score: 80 },
      { name: 'GRI Standards', status: 'Implemented', score: 88 }
    ],
    emissionsData: [
      { year: 2019, scope1: 32000, scope2: 25000, scope3: 38000 },
      { year: 2020, scope1: 30000, scope2: 23000, scope3: 35000 },
      { year: 2021, scope1: 28000, scope2: 21000, scope3: 32000 },
      { year: 2022, scope1: 26000, scope2: 19000, scope3: 29000 },
      { year: 2023, scope1: 24000, scope2: 17000, scope3: 26000 },
      { year: 2024, scope1: 22000, scope2: 15000, scope3: 23000 }
    ],
    sbtiTargets: {
      description: 'EcoPack commits to reduce absolute emissions by 60% by 2030 and achieve 100% renewable packaging by 2035.',
      nearTermTarget: '60% absolute emission reduction by 2030',
      longTermTarget: '100% renewable packaging by 2035',
      baselineYear: '2019'
    },
    sbtiProgress: 82,
    carbonCredits: 7200,
    materialityScore: 8.8,
    supplierDecarbonization: 72
  }
];

// Transportation Sector Companies (6)
const transportationCompanies: Company[] = [
  {
    id: 'globallogistics',
    name: 'Global Logistics Corp',
    industry: 'Freight & Logistics',
    sector: 'Transportation',
    description: 'International logistics company transitioning to electric delivery vehicles and sustainable supply chain solutions.',
    totalEmissions: 340000,
    energyConsumption: 185000,
    wasteGenerated: 1200,
    renewableEnergyPercentage: 45,
    topCarbonFootprints: [
      'Freight transportation and delivery vehicles',
      'Warehouse operations and facilities',
      'Air freight and international shipping'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 75 },
      { name: 'SBTi Targets', status: 'In Progress', score: 62 },
      { name: 'TCFD Reporting', status: 'In Progress', score: 58 },
      { name: 'GRI Standards', status: 'Implemented', score: 78 }
    ],
    emissionsData: [
      { year: 2019, scope1: 220000, scope2: 35000, scope3: 105000 },
      { year: 2020, scope1: 210000, scope2: 33000, scope3: 100000 },
      { year: 2021, scope1: 200000, scope2: 31000, scope3: 95000 },
      { year: 2022, scope1: 190000, scope2: 29000, scope3: 90000 },
      { year: 2023, scope1: 180000, scope2: 27000, scope3: 85000 },
      { year: 2024, scope1: 170000, scope2: 25000, scope3: 80000 }
    ],
    sbtiTargets: {
      description: 'Global Logistics commits to reduce transport emissions by 50% by 2030 and achieve net-zero logistics by 2050.',
      nearTermTarget: '50% reduction in transport emissions by 2030',
      longTermTarget: 'Net-zero logistics by 2050',
      baselineYear: '2019'
    },
    sbtiProgress: 58,
    carbonCredits: 16500,
    materialityScore: 8.2,
    supplierDecarbonization: 48
  },
  {
    id: 'airlines',
    name: 'SkyGreen Airlines',
    industry: 'Aviation',
    sector: 'Transportation',
    description: 'Major airline investing in sustainable aviation fuels and carbon offset programs for passenger and cargo flights.',
    totalEmissions: 1250000,
    energyConsumption: 2800000,
    wasteGenerated: 8500,
    renewableEnergyPercentage: 25,
    topCarbonFootprints: [
      'Jet fuel consumption for passenger flights',
      'Ground operations and airport facilities',
      'Aircraft manufacturing and maintenance'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 70 },
      { name: 'SBTi Targets', status: 'In Progress', score: 55 },
      { name: 'TCFD Reporting', status: 'Implemented', score: 65 },
      { name: 'GRI Standards', status: 'Implemented', score: 72 }
    ],
    emissionsData: [
      { year: 2019, scope1: 980000, scope2: 45000, scope3: 285000 },
      { year: 2020, scope1: 750000, scope2: 35000, scope3: 220000 },
      { year: 2021, scope1: 820000, scope2: 38000, scope3: 240000 },
      { year: 2022, scope1: 900000, scope2: 42000, scope3: 265000 },
      { year: 2023, scope1: 950000, scope2: 43000, scope3: 275000 },
      { year: 2024, scope1: 980000, scope2: 44000, scope3: 280000 }
    ],
    sbtiProgress: 35,
    carbonCredits: 85000,
    materialityScore: 7.5,
    supplierDecarbonization: 32
  },
  {
    id: 'shipping',
    name: 'OceanShip Maritime',
    industry: 'Maritime Shipping',
    sector: 'Transportation',
    description: 'International shipping company implementing green ammonia fuel and wind-assisted propulsion technologies.',
    totalEmissions: 680000,
    energyConsumption: 1450000,
    wasteGenerated: 3200,
    renewableEnergyPercentage: 18,
    topCarbonFootprints: [
      'Marine fuel consumption',
      'Port operations and cargo handling',
      'Ship construction and maintenance'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'In Progress', score: 62 },
      { name: 'SBTi Targets', status: 'Planned', score: 38 },
      { name: 'TCFD Reporting', status: 'In Progress', score: 52 },
      { name: 'GRI Standards', status: 'Implemented', score: 68 }
    ],
    emissionsData: [
      { year: 2019, scope1: 520000, scope2: 25000, scope3: 155000 },
      { year: 2020, scope1: 510000, scope2: 24000, scope3: 150000 },
      { year: 2021, scope1: 500000, scope2: 23000, scope3: 145000 },
      { year: 2022, scope1: 490000, scope2: 22000, scope3: 140000 },
      { year: 2023, scope1: 480000, scope2: 21000, scope3: 135000 },
      { year: 2024, scope1: 470000, scope2: 20000, scope3: 130000 }
    ],
    sbtiProgress: 42,
    carbonCredits: 35000,
    materialityScore: 7.8,
    supplierDecarbonization: 38
  },
  {
    id: 'railcorp',
    name: 'RailCorp Express',
    industry: 'Railway Transportation',
    sector: 'Transportation',
    description: 'Railway company operating electric and hybrid trains with focus on sustainable passenger and freight transport.',
    totalEmissions: 125000,
    energyConsumption: 385000,
    wasteGenerated: 850,
    renewableEnergyPercentage: 68,
    topCarbonFootprints: [
      'Electric train operations',
      'Railway infrastructure maintenance',
      'Station facilities and operations'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 88 },
      { name: 'SBTi Targets', status: 'Implemented', score: 85 },
      { name: 'TCFD Reporting', status: 'Implemented', score: 82 },
      { name: 'GRI Standards', status: 'Implemented', score: 85 }
    ],
    emissionsData: [
      { year: 2019, scope1: 35000, scope2: 45000, scope3: 55000 },
      { year: 2020, scope1: 33000, scope2: 42000, scope3: 52000 },
      { year: 2021, scope1: 31000, scope2: 39000, scope3: 49000 },
      { year: 2022, scope1: 29000, scope2: 36000, scope3: 46000 },
      { year: 2023, scope1: 27000, scope2: 33000, scope3: 43000 },
      { year: 2024, scope1: 25000, scope2: 30000, scope3: 40000 }
    ],
    sbtiTargets: {
      description: 'RailCorp commits to achieve 100% renewable electricity by 2030 and carbon neutrality by 2040.',
      nearTermTarget: '100% renewable electricity by 2030',
      longTermTarget: 'Carbon neutrality by 2040',
      baselineYear: '2019'
    },
    sbtiProgress: 78,
    carbonCredits: 8500,
    materialityScore: 8.5,
    supplierDecarbonization: 65
  },
  {
    id: 'urbanmobility',
    name: 'Urban Mobility Solutions',
    industry: 'Public Transportation',
    sector: 'Transportation',
    description: 'Urban transportation company operating electric buses and sustainable mobility solutions for smart cities.',
    totalEmissions: 85000,
    energyConsumption: 245000,
    wasteGenerated: 420,
    renewableEnergyPercentage: 82,
    topCarbonFootprints: [
      'Electric bus fleet operations',
      'Charging infrastructure',
      'Maintenance facilities'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 90 },
      { name: 'SBTi Targets', status: 'Implemented', score: 92 },
      { name: 'TCFD Reporting', status: 'Implemented', score: 85 },
      { name: 'GRI Standards', status: 'Implemented', score: 88 }
    ],
    emissionsData: [
      { year: 2019, scope1: 25000, scope2: 28000, scope3: 37000 },
      { year: 2020, scope1: 23000, scope2: 25000, scope3: 34000 },
      { year: 2021, scope1: 21000, scope2: 22000, scope3: 31000 },
      { year: 2022, scope1: 19000, scope2: 19000, scope3: 28000 },
      { year: 2023, scope1: 17000, scope2: 16000, scope3: 25000 },
      { year: 2024, scope1: 15000, scope2: 13000, scope3: 22000 }
    ],
    sbtiTargets: {
      description: 'Urban Mobility commits to achieve zero-emission public transport by 2030 and carbon negative operations by 2040.',
      nearTermTarget: 'Zero-emission public transport by 2030',
      longTermTarget: 'Carbon negative operations by 2040',
      baselineYear: '2019'
    },
    sbtiProgress: 88,
    carbonCredits: 5500,
    materialityScore: 9.1,
    supplierDecarbonization: 78
  },
  {
    id: 'fleetmanagement',
    name: 'FleetGreen Management',
    industry: 'Fleet Services',
    sector: 'Transportation',
    description: 'Fleet management company specializing in electric vehicle transition and sustainable transportation solutions.',
    totalEmissions: 165000,
    energyConsumption: 125000,
    wasteGenerated: 680,
    renewableEnergyPercentage: 75,
    topCarbonFootprints: [
      'Commercial vehicle operations',
      'Fleet maintenance and servicing',
      'Vehicle manufacturing and disposal'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 82 },
      { name: 'SBTi Targets', status: 'In Progress', score: 72 },
      { name: 'TCFD Reporting', status: 'In Progress', score: 68 },
      { name: 'GRI Standards', status: 'Implemented', score: 80 }
    ],
    emissionsData: [
      { year: 2019, scope1: 95000, scope2: 22000, scope3: 58000 },
      { year: 2020, scope1: 90000, scope2: 20000, scope3: 55000 },
      { year: 2021, scope1: 85000, scope2: 18000, scope3: 52000 },
      { year: 2022, scope1: 80000, scope2: 16000, scope3: 49000 },
      { year: 2023, scope1: 75000, scope2: 14000, scope3: 46000 },
      { year: 2024, scope1: 70000, scope2: 12000, scope3: 43000 }
    ],
    sbtiProgress: 68,
    carbonCredits: 12000,
    materialityScore: 8.2,
    supplierDecarbonization: 62
  }
];

// Mining Sector Companies (6)
const miningCompanies: Company[] = [
  {
    id: 'coppermining',
    name: 'Copper Mountain Mining',
    industry: 'Copper Mining',
    sector: 'Mining',
    description: 'Copper mining company implementing renewable energy and sustainable extraction practices for global metal supply.',
    totalEmissions: 580000,
    energyConsumption: 950000,
    wasteGenerated: 15000,
    renewableEnergyPercentage: 35,
    topCarbonFootprints: [
      'Heavy machinery and excavation equipment',
      'Ore processing and smelting operations',
      'Mine site electricity and heating'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 68 },
      { name: 'SBTi Targets', status: 'In Progress', score: 52 },
      { name: 'TCFD Reporting', status: 'Implemented', score: 62 },
      { name: 'GRI Standards', status: 'Implemented', score: 75 }
    ],
    emissionsData: [
      { year: 2019, scope1: 380000, scope2: 95000, scope3: 125000 },
      { year: 2020, scope1: 370000, scope2: 92000, scope3: 120000 },
      { year: 2021, scope1: 360000, scope2: 89000, scope3: 115000 },
      { year: 2022, scope1: 350000, scope2: 86000, scope3: 110000 },
      { year: 2023, scope1: 340000, scope2: 83000, scope3: 105000 },
      { year: 2024, scope1: 330000, scope2: 80000, scope3: 100000 }
    ],
    sbtiTargets: {
      description: 'Copper Mountain commits to reduce Scope 1 and 2 emissions by 35% by 2030 and achieve net-zero mining by 2050.',
      nearTermTarget: '35% reduction in Scope 1+2 emissions by 2030',
      longTermTarget: 'Net-zero mining by 2050',
      baselineYear: '2019'
    },
    sbtiProgress: 48,
    carbonCredits: 28000,
    materialityScore: 7.8,
    supplierDecarbonization: 42
  },
  {
    id: 'ironore',
    name: 'IronCore Extractors',
    industry: 'Iron Ore Mining',
    sector: 'Mining',
    description: 'Iron ore mining company transitioning to hydrogen-powered equipment and renewable energy for mining operations.',
    totalEmissions: 720000,
    energyConsumption: 1200000,
    wasteGenerated: 22000,
    renewableEnergyPercentage: 28,
    topCarbonFootprints: [
      'Iron ore extraction and processing',
      'Heavy diesel equipment operations',
      'Rail transport to ports'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'In Progress', score: 62 },
      { name: 'SBTi Targets', status: 'Planned', score: 38 },
      { name: 'TCFD Reporting', status: 'In Progress', score: 55 },
      { name: 'GRI Standards', status: 'Implemented', score: 70 }
    ],
    emissionsData: [
      { year: 2019, scope1: 520000, scope2: 105000, scope3: 125000 },
      { year: 2020, scope1: 510000, scope2: 102000, scope3: 120000 },
      { year: 2021, scope1: 500000, scope2: 99000, scope3: 115000 },
      { year: 2022, scope1: 490000, scope2: 96000, scope3: 110000 },
      { year: 2023, scope1: 480000, scope2: 93000, scope3: 105000 },
      { year: 2024, scope1: 470000, scope2: 90000, scope3: 100000 }
    ],
    sbtiProgress: 42,
    carbonCredits: 32000,
    materialityScore: 7.5,
    supplierDecarbonization: 35
  },
  {
    id: 'goldmining',
    name: 'Golden Valley Resources',
    industry: 'Gold Mining',
    sector: 'Mining',
    description: 'Gold mining company implementing solar power and water recycling technologies for sustainable precious metal extraction.',
    totalEmissions: 285000,
    energyConsumption: 485000,
    wasteGenerated: 8500,
    renewableEnergyPercentage: 48,
    topCarbonFootprints: [
      'Gold extraction and refining processes',
      'Underground mining operations',
      'Chemical processing and waste treatment'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 75 },
      { name: 'SBTi Targets', status: 'In Progress', score: 62 },
      { name: 'TCFD Reporting', status: 'Implemented', score: 68 },
      { name: 'GRI Standards', status: 'Implemented', score: 78 }
    ],
    emissionsData: [
      { year: 2019, scope1: 180000, scope2: 55000, scope3: 70000 },
      { year: 2020, scope1: 175000, scope2: 52000, scope3: 68000 },
      { year: 2021, scope1: 170000, scope2: 49000, scope3: 66000 },
      { year: 2022, scope1: 165000, scope2: 46000, scope3: 64000 },
      { year: 2023, scope1: 160000, scope2: 43000, scope3: 62000 },
      { year: 2024, scope1: 155000, scope2: 40000, scope3: 60000 }
    ],
    sbtiProgress: 58,
    carbonCredits: 18500,
    materialityScore: 8.0,
    supplierDecarbonization: 52
  },
  {
    id: 'coalmining',
    name: 'BlackRock Coal Corp',
    industry: 'Coal Mining',
    sector: 'Mining',
    description: 'Coal mining company diversifying into renewable energy and implementing carbon capture technologies.',
    totalEmissions: 950000,
    energyConsumption: 1500000,
    wasteGenerated: 35000,
    renewableEnergyPercentage: 15,
    topCarbonFootprints: [
      'Coal extraction and processing',
      'Methane emissions from coal seams',
      'Heavy machinery and transportation'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'In Progress', score: 58 },
      { name: 'SBTi Targets', status: 'Not Started', score: 25 },
      { name: 'TCFD Reporting', status: 'In Progress', score: 48 },
      { name: 'GRI Standards', status: 'Implemented', score: 65 }
    ],
    emissionsData: [
      { year: 2019, scope1: 720000, scope2: 125000, scope3: 155000 },
      { year: 2020, scope1: 710000, scope2: 122000, scope3: 150000 },
      { year: 2021, scope1: 700000, scope2: 119000, scope3: 145000 },
      { year: 2022, scope1: 690000, scope2: 116000, scope3: 140000 },
      { year: 2023, scope1: 680000, scope2: 113000, scope3: 135000 },
      { year: 2024, scope1: 670000, scope2: 110000, scope3: 130000 }
    ],
    sbtiProgress: 28,
    carbonCredits: 45000,
    materialityScore: 6.5,
    supplierDecarbonization: 25
  },
  {
    id: 'lithium',
    name: 'LithiumTech Extractors',
    industry: 'Lithium Mining',
    sector: 'Mining',
    description: 'Lithium mining company supporting battery production with sustainable extraction methods and water conservation.',
    totalEmissions: 145000,
    energyConsumption: 285000,
    wasteGenerated: 3200,
    renewableEnergyPercentage: 65,
    topCarbonFootprints: [
      'Lithium brine processing',
      'Solar evaporation pond operations',
      'Chemical refining processes'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 85 },
      { name: 'SBTi Targets', status: 'Implemented', score: 88 },
      { name: 'TCFD Reporting', status: 'Implemented', score: 82 },
      { name: 'GRI Standards', status: 'Implemented', score: 85 }
    ],
    emissionsData: [
      { year: 2019, scope1: 65000, scope2: 35000, scope3: 55000 },
      { year: 2020, scope1: 62000, scope2: 32000, scope3: 52000 },
      { year: 2021, scope1: 59000, scope2: 29000, scope3: 49000 },
      { year: 2022, scope1: 56000, scope2: 26000, scope3: 46000 },
      { year: 2023, scope1: 53000, scope2: 23000, scope3: 43000 },
      { year: 2024, scope1: 50000, scope2: 20000, scope3: 40000 }
    ],
    sbtiTargets: {
      description: 'LithiumTech commits to achieve carbon neutrality by 2035 and support the clean energy transition.',
      nearTermTarget: '60% reduction in total emissions by 2030',
      longTermTarget: 'Carbon neutrality by 2035',
      baselineYear: '2019'
    },
    sbtiProgress: 82,
    carbonCredits: 12000,
    materialityScore: 8.8,
    supplierDecarbonization: 72
  },
  {
    id: 'aggregates',
    name: 'StoneWorks Aggregates',
    industry: 'Construction Materials',
    sector: 'Mining',
    description: 'Aggregate and construction materials company implementing electric quarrying equipment and sustainable practices.',
    totalEmissions: 220000,
    energyConsumption: 385000,
    wasteGenerated: 5800,
    renewableEnergyPercentage: 52,
    topCarbonFootprints: [
      'Quarrying and crushing operations',
      'Cement and concrete production',
      'Material transportation to construction sites'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 72 },
      { name: 'SBTi Targets', status: 'In Progress', score: 58 },
      { name: 'TCFD Reporting', status: 'In Progress', score: 62 },
      { name: 'GRI Standards', status: 'Implemented', score: 75 }
    ],
    emissionsData: [
      { year: 2019, scope1: 125000, scope2: 45000, scope3: 65000 },
      { year: 2020, scope1: 120000, scope2: 42000, scope3: 62000 },
      { year: 2021, scope1: 115000, scope2: 39000, scope3: 59000 },
      { year: 2022, scope1: 110000, scope2: 36000, scope3: 56000 },
      { year: 2023, scope1: 105000, scope2: 33000, scope3: 53000 },
      { year: 2024, scope1: 100000, scope2: 30000, scope3: 50000 }
    ],
    sbtiProgress: 55,
    carbonCredits: 15500,
    materialityScore: 7.8,
    supplierDecarbonization: 48
  }
];

// FMCG Sector Companies (6)
const fmcgCompanies: Company[] = [
  {
    id: 'retailgiant',
    name: 'Retail Giant',
    industry: 'Consumer Goods Retail',
    sector: 'FMCG',
    description: 'Major retail chain implementing sustainable packaging, renewable energy in stores, and circular economy principles.',
    totalEmissions: 185000,
    energyConsumption: 425000,
    wasteGenerated: 2800,
    renewableEnergyPercentage: 68,
    topCarbonFootprints: [
      'Store operations and refrigeration systems',
      'Supply chain and product transportation',
      'Packaging and consumer goods production'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 82 },
      { name: 'SBTi Targets', status: 'Implemented', score: 85 },
      { name: 'TCFD Reporting', status: 'Implemented', score: 78 },
      { name: 'GRI Standards', status: 'Implemented', score: 85 }
    ],
    emissionsData: [
      { year: 2019, scope1: 55000, scope2: 65000, scope3: 85000 },
      { year: 2020, scope1: 52000, scope2: 62000, scope3: 80000 },
      { year: 2021, scope1: 49000, scope2: 59000, scope3: 75000 },
      { year: 2022, scope1: 46000, scope2: 56000, scope3: 70000 },
      { year: 2023, scope1: 43000, scope2: 53000, scope3: 65000 },
      { year: 2024, scope1: 40000, scope2: 50000, scope3: 60000 }
    ],
    sbtiTargets: {
      description: 'Retail Giant commits to reduce absolute emissions by 55% by 2030 and achieve net-zero retail operations by 2040.',
      nearTermTarget: '55% absolute emission reduction by 2030',
      longTermTarget: 'Net-zero retail operations by 2040',
      baselineYear: '2019'
    },
    sbtiProgress: 78,
    carbonCredits: 14500,
    materialityScore: 8.5,
    supplierDecarbonization: 68
  },
  {
    id: 'foodbeverage',
    name: 'Global Food & Beverage Co',
    industry: 'Food & Beverage',
    sector: 'FMCG',
    description: 'International food and beverage company focusing on sustainable agriculture and regenerative farming practices.',
    totalEmissions: 420000,
    energyConsumption: 685000,
    wasteGenerated: 8500,
    renewableEnergyPercentage: 58,
    topCarbonFootprints: [
      'Agricultural supply chain and farming',
      'Food processing and manufacturing',
      'Cold chain and refrigerated transport'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 78 },
      { name: 'SBTi Targets', status: 'Implemented', score: 82 },
      { name: 'TCFD Reporting', status: 'Implemented', score: 75 },
      { name: 'GRI Standards', status: 'Implemented', score: 82 }
    ],
    emissionsData: [
      { year: 2019, scope1: 85000, scope2: 95000, scope3: 280000 },
      { year: 2020, scope1: 82000, scope2: 92000, scope3: 270000 },
      { year: 2021, scope1: 79000, scope2: 89000, scope3: 260000 },
      { year: 2022, scope1: 76000, scope2: 86000, scope3: 250000 },
      { year: 2023, scope1: 73000, scope2: 83000, scope3: 240000 },
      { year: 2024, scope1: 70000, scope2: 80000, scope3: 230000 }
    ],
    sbtiTargets: {
      description: 'Global Food & Beverage commits to reduce Scope 1 and 2 emissions by 50% by 2030 and achieve net-zero across value chain by 2050.',
      nearTermTarget: '50% reduction in Scope 1+2 emissions by 2030',
      longTermTarget: 'Net-zero across value chain by 2050',
      baselineYear: '2019'
    },
    sbtiProgress: 68,
    carbonCredits: 28000,
    materialityScore: 8.2,
    supplierDecarbonization: 58
  },
  {
    id: 'personalcare',
    name: 'BeautyGreen Personal Care',
    industry: 'Personal Care & Cosmetics',
    sector: 'FMCG',
    description: 'Personal care company pioneering sustainable beauty products with biodegradable packaging and ethical sourcing.',
    totalEmissions: 95000,
    energyConsumption: 185000,
    wasteGenerated: 1200,
    renewableEnergyPercentage: 78,
    topCarbonFootprints: [
      'Manufacturing and product formulation',
      'Packaging production and materials',
      'Global distribution and retail'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 88 },
      { name: 'SBTi Targets', status: 'Implemented', score: 90 },
      { name: 'TCFD Reporting', status: 'Implemented', score: 85 },
      { name: 'GRI Standards', status: 'Implemented', score: 88 }
    ],
    emissionsData: [
      { year: 2019, scope1: 22000, scope2: 28000, scope3: 55000 },
      { year: 2020, scope1: 20000, scope2: 25000, scope3: 52000 },
      { year: 2021, scope1: 18000, scope2: 22000, scope3: 49000 },
      { year: 2022, scope1: 16000, scope2: 19000, scope3: 46000 },
      { year: 2023, scope1: 14000, scope2: 16000, scope3: 43000 },
      { year: 2024, scope1: 12000, scope2: 13000, scope3: 40000 }
    ],
    sbtiTargets: {
      description: 'BeautyGreen commits to achieve carbon neutrality by 2030 and pioneer sustainable beauty industry practices.',
      nearTermTarget: '70% reduction in total emissions by 2030',
      longTermTarget: 'Carbon neutrality by 2030',
      baselineYear: '2019'
    },
    sbtiProgress: 85,
    carbonCredits: 8000,
    materialityScore: 9.0,
    supplierDecarbonization: 78
  },
  {
    id: 'household',
    name: 'CleanHome Products',
    industry: 'Household Products',
    sector: 'FMCG',
    description: 'Household products manufacturer developing eco-friendly cleaning solutions and sustainable packaging alternatives.',
    totalEmissions: 125000,
    energyConsumption: 225000,
    wasteGenerated: 1850,
    renewableEnergyPercentage: 65,
    topCarbonFootprints: [
      'Chemical production and formulation',
      'Plastic packaging and containers',
      'Product distribution and logistics'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 80 },
      { name: 'SBTi Targets', status: 'In Progress', score: 72 },
      { name: 'TCFD Reporting', status: 'In Progress', score: 68 },
      { name: 'GRI Standards', status: 'Implemented', score: 82 }
    ],
    emissionsData: [
      { year: 2019, scope1: 35000, scope2: 38000, scope3: 62000 },
      { year: 2020, scope1: 33000, scope2: 36000, scope3: 59000 },
      { year: 2021, scope1: 31000, scope2: 34000, scope3: 56000 },
      { year: 2022, scope1: 29000, scope2: 32000, scope3: 53000 },
      { year: 2023, scope1: 27000, scope2: 30000, scope3: 50000 },
      { year: 2024, scope1: 25000, scope2: 28000, scope3: 47000 }
    ],
    sbtiProgress: 68,
    carbonCredits: 9500,
    materialityScore: 8.0,
    supplierDecarbonization: 62
  },
  {
    id: 'pharma',
    name: 'HealthTech Pharmaceuticals',
    industry: 'Pharmaceuticals',
    sector: 'FMCG',
    description: 'Pharmaceutical company implementing green chemistry and sustainable drug manufacturing processes.',
    totalEmissions: 285000,
    energyConsumption: 485000,
    wasteGenerated: 4200,
    renewableEnergyPercentage: 48,
    topCarbonFootprints: [
      'Chemical synthesis and drug manufacturing',
      'Research and development facilities',
      'Cold chain pharmaceutical distribution'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'Implemented', score: 75 },
      { name: 'SBTi Targets', status: 'In Progress', score: 65 },
      { name: 'TCFD Reporting', status: 'Implemented', score: 70 },
      { name: 'GRI Standards', status: 'Implemented', score: 78 }
    ],
    emissionsData: [
      { year: 2019, scope1: 95000, scope2: 85000, scope3: 125000 },
      { year: 2020, scope1: 92000, scope2: 82000, scope3: 120000 },
      { year: 2021, scope1: 89000, scope2: 79000, scope3: 115000 },
      { year: 2022, scope1: 86000, scope2: 76000, scope3: 110000 },
      { year: 2023, scope1: 83000, scope2: 73000, scope3: 105000 },
      { year: 2024, scope1: 80000, scope2: 70000, scope3: 100000 }
    ],
    sbtiProgress: 58,
    carbonCredits: 18500,
    materialityScore: 7.8,
    supplierDecarbonization: 52
  },
  {
    id: 'tobacco',
    name: 'TobaccoLeaf Industries',
    industry: 'Tobacco Products',
    sector: 'FMCG',
    description: 'Tobacco company transitioning to alternative products and implementing sustainable agriculture practices.',
    totalEmissions: 165000,
    energyConsumption: 285000,
    wasteGenerated: 2400,
    renewableEnergyPercentage: 42,
    topCarbonFootprints: [
      'Tobacco farming and curing processes',
      'Manufacturing and processing facilities',
      'Product packaging and distribution'
    ],
    frameworks: [
      { name: 'CDP Climate Change', status: 'In Progress', score: 62 },
      { name: 'SBTi Targets', status: 'Planned', score: 45 },
      { name: 'TCFD Reporting', status: 'In Progress', score: 55 },
      { name: 'GRI Standards', status: 'Implemented', score: 68 }
    ],
    emissionsData: [
      { year: 2019, scope1: 65000, scope2: 45000, scope3: 75000 },
      { year: 2020, scope1: 63000, scope2: 43000, scope3: 72000 },
      { year: 2021, scope1: 61000, scope2: 41000, scope3: 69000 },
      { year: 2022, scope1: 59000, scope2: 39000, scope3: 66000 },
      { year: 2023, scope1: 57000, scope2: 37000, scope3: 63000 },
      { year: 2024, scope1: 55000, scope2: 35000, scope3: 60000 }
    ],
    sbtiProgress: 48,
    carbonCredits: 12500,
    materialityScore: 7.2,
    supplierDecarbonization: 42
  }
];

// Combine all companies
export const enhancedCompanies: Company[] = [
  ...technologyCompanies,
  ...manufacturingCompanies,
  ...transportationCompanies,
  ...miningCompanies,
  ...fmcgCompanies
];

export const getCompanyById = (id: string): Company | undefined => {
  return enhancedCompanies.find(company => company.id === id);
};

export const getCompaniesBySector = (sector: string): Company[] => {
  return enhancedCompanies.filter(company => company.sector === sector);
};
