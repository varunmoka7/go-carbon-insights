
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
  emissionsData: {
    year: string;
    scope1: number;
    scope2: number;
    scope3: number;
  }[];
  frameworks: Framework[];
  sbtiTargets?: {
    description: string;
    nearTermTarget: string;
    longTermTarget: string;
    baselineYear: string;
    targetYear: string;
    scope1Reduction: number;
    scope2Reduction: number;
    scope3Reduction: number;
    validationStatus: string;
    submissionDate: string;
  };
  sbtiProgress?: number;
  carbonCredits?: number;
  materialityScore?: number;
  supplierDecarbonization?: number;
  pathwayData?: {
    year: string;
    emissions: number;
    target: number;
    scope1: number;
    scope2: number;
    scope3: number;
  }[];
}

export interface Framework {
  name: string;
  status: string;
  score?: string;
  description?: string;
  implementationDate?: string;
}

// Generate pathway data for each company
const generatePathwayData = (baseEmissions: number, reductionRate: number = 0.08) => {
  const data = [];
  for (let i = 0; i <= 6; i++) {
    const year = (2024 + i).toString();
    const emissions = Math.round(baseEmissions * Math.pow(1 - reductionRate, i));
    const target = Math.round(baseEmissions * Math.pow(1 - 0.1, i)); // 10% annual target reduction
    data.push({
      year,
      emissions,
      target,
      scope1: Math.round(emissions * 0.15),
      scope2: Math.round(emissions * 0.25),
      scope3: Math.round(emissions * 0.6)
    });
  }
  return data;
};

export const enhancedCompanies: Company[] = [
  // Technology Sector (6 companies)
  {
    id: 'techcorp',
    name: 'TechCorp Solutions',
    industry: 'Software & IT Services',
    sector: 'Technology',
    description: 'Leading global provider of cloud computing solutions and enterprise software platforms.',
    totalEmissions: 85000,
    energyConsumption: 125000,
    wasteGenerated: 850,
    renewableEnergyPercentage: 78,
    topCarbonFootprints: ['Data centers energy consumption', 'Employee business travel', 'Cloud infrastructure'],
    emissionsData: [
      { year: '2019', scope1: 8500, scope2: 21250, scope3: 55250 },
      { year: '2020', scope1: 8200, scope2: 20400, scope3: 53400 },
      { year: '2021', scope1: 7800, scope2: 19500, scope3: 51700 },
      { year: '2022', scope1: 7400, scope2: 18500, scope3: 49100 },
      { year: '2023', scope1: 7000, scope2: 17500, scope3: 46500 },
      { year: '2024', scope1: 6650, scope2: 16625, scope3: 44225 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Implemented', score: '95%', description: 'Science-based targets validated', implementationDate: '2022' },
      { name: 'CDP', status: 'Implemented', score: 'A-', description: 'Climate disclosure leadership', implementationDate: '2021' },
      { name: 'GRI Standards', status: 'Implemented', score: '92%', implementationDate: '2020' },
      { name: 'TCFD', status: 'Implemented', score: '88%', implementationDate: '2021' },
      { name: 'ISO 14001', status: 'Implemented', score: '90%', implementationDate: '2019' }
    ],
    sbtiTargets: {
      description: 'TechCorp commits to reduce absolute Scope 1 and 2 GHG emissions by 50% by 2030 from a 2020 baseline. The company also commits to reduce absolute Scope 3 emissions by 30% by 2030 from the same baseline.',
      nearTermTarget: '50% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2040',
      baselineYear: '2020',
      targetYear: '2030',
      scope1Reduction: 50,
      scope2Reduction: 50,
      scope3Reduction: 30,
      validationStatus: 'Targets Approved',
      submissionDate: '2022-03-15'
    },
    sbtiProgress: 85,
    carbonCredits: 15000,
    materialityScore: 8.5,
    supplierDecarbonization: 72,
    pathwayData: generatePathwayData(85000, 0.08)
  },
  {
    id: 'datastream',
    name: 'DataStream Analytics',
    industry: 'Data Analytics & AI',
    sector: 'Technology',
    description: 'Advanced data analytics and artificial intelligence solutions for enterprise clients.',
    totalEmissions: 62000,
    energyConsumption: 98000,
    wasteGenerated: 620,
    renewableEnergyPercentage: 85,
    topCarbonFootprints: ['AI model training infrastructure', 'Employee commuting', 'Third-party cloud services'],
    emissionsData: [
      { year: '2019', scope1: 6200, scope2: 15500, scope3: 40300 },
      { year: '2020', scope1: 5900, scope2: 14750, scope3: 38350 },
      { year: '2021', scope1: 5600, scope2: 14000, scope3: 36400 },
      { year: '2022', scope1: 5300, scope2: 13250, scope3: 34450 },
      { year: '2023', scope1: 5000, scope2: 12500, scope3: 32500 },
      { year: '2024', scope1: 4750, scope2: 11875, scope3: 30875 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Implemented', score: '92%', implementationDate: '2023' },
      { name: 'CDP', status: 'Implemented', score: 'A', implementationDate: '2022' },
      { name: 'GRI Standards', status: 'Implemented', score: '89%', implementationDate: '2021' },
      { name: 'TCFD', status: 'In Progress', implementationDate: '2024' },
      { name: 'ISO 14001', status: 'Implemented', score: '87%', implementationDate: '2020' }
    ],
    sbtiTargets: {
      description: 'DataStream Analytics commits to reduce absolute Scope 1 and 2 GHG emissions by 55% by 2030 from a 2021 baseline and to reduce Scope 3 emissions by 35% by 2030.',
      nearTermTarget: '55% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2045',
      baselineYear: '2021',
      targetYear: '2030',
      scope1Reduction: 55,
      scope2Reduction: 55,
      scope3Reduction: 35,
      validationStatus: 'Targets Approved',
      submissionDate: '2023-01-20'
    },
    sbtiProgress: 78,
    carbonCredits: 12000,
    materialityScore: 8.2,
    supplierDecarbonization: 68,
    pathwayData: generatePathwayData(62000, 0.09)
  },
  {
    id: 'cybersafe',
    name: 'CyberSafe Security',
    industry: 'Cybersecurity',
    sector: 'Technology',
    description: 'Comprehensive cybersecurity solutions and threat intelligence services.',
    totalEmissions: 45000,
    energyConsumption: 72000,
    wasteGenerated: 450,
    renewableEnergyPercentage: 82,
    topCarbonFootprints: ['Security operations centers', 'Global office operations', 'Employee travel'],
    emissionsData: [
      { year: '2019', scope1: 4500, scope2: 11250, scope3: 29250 },
      { year: '2020', scope1: 4300, scope2: 10750, scope3: 27950 },
      { year: '2021', scope1: 4100, scope2: 10250, scope3: 26650 },
      { year: '2022', scope1: 3900, scope2: 9750, scope3: 25350 },
      { year: '2023', scope1: 3700, scope2: 9250, scope3: 24050 },
      { year: '2024', scope1: 3525, scope2: 8813, scope3: 22913 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'In Progress', implementationDate: '2024' },
      { name: 'CDP', status: 'Implemented', score: 'B+', implementationDate: '2023' },
      { name: 'GRI Standards', status: 'Implemented', score: '85%', implementationDate: '2022' },
      { name: 'TCFD', status: 'Planned', implementationDate: '2025' },
      { name: 'ISO 14001', status: 'Implemented', score: '83%', implementationDate: '2021' }
    ],
    sbtiTargets: {
      description: 'CyberSafe Security commits to reduce absolute Scope 1 and 2 GHG emissions by 45% by 2030 from a 2022 baseline and to reduce Scope 3 emissions by 28% by 2030.',
      nearTermTarget: '45% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2050',
      baselineYear: '2022',
      targetYear: '2030',
      scope1Reduction: 45,
      scope2Reduction: 45,
      scope3Reduction: 28,
      validationStatus: 'Under Review',
      submissionDate: '2024-02-10'
    },
    sbtiProgress: 65,
    carbonCredits: 8500,
    materialityScore: 7.8,
    supplierDecarbonization: 58,
    pathwayData: generatePathwayData(45000, 0.07)
  },
  {
    id: 'cloudnine',
    name: 'CloudNine Infrastructure',
    industry: 'Cloud Computing',
    sector: 'Technology',
    description: 'Next-generation cloud infrastructure and platform-as-a-service provider.',
    totalEmissions: 95000,
    energyConsumption: 145000,
    wasteGenerated: 950,
    renewableEnergyPercentage: 75,
    topCarbonFootprints: ['Data center cooling systems', 'Network infrastructure', 'Hardware manufacturing'],
    emissionsData: [
      { year: '2019', scope1: 9500, scope2: 23750, scope3: 61750 },
      { year: '2020', scope1: 9200, scope2: 23000, scope3: 59800 },
      { year: '2021', scope1: 8900, scope2: 22250, scope3: 57850 },
      { year: '2022', scope1: 8600, scope2: 21500, scope3: 55900 },
      { year: '2023', scope1: 8300, scope2: 20750, scope3: 53950 },
      { year: '2024', scope1: 8075, scope2: 20188, scope3: 52488 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Implemented', score: '88%', implementationDate: '2022' },
      { name: 'CDP', status: 'Implemented', score: 'A-', implementationDate: '2021' },
      { name: 'GRI Standards', status: 'Implemented', score: '91%', implementationDate: '2020' },
      { name: 'TCFD', status: 'Implemented', score: '85%', implementationDate: '2022' },
      { name: 'ISO 14001', status: 'Implemented', score: '89%', implementationDate: '2019' }
    ],
    sbtiTargets: {
      description: 'CloudNine Infrastructure commits to reduce absolute Scope 1 and 2 GHG emissions by 48% by 2030 from a 2020 baseline and to reduce Scope 3 emissions by 32% by 2030.',
      nearTermTarget: '48% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2040',
      baselineYear: '2020',
      targetYear: '2030',
      scope1Reduction: 48,
      scope2Reduction: 48,
      scope3Reduction: 32,
      validationStatus: 'Targets Approved',
      submissionDate: '2022-05-30'
    },
    sbtiProgress: 82,
    carbonCredits: 18000,
    materialityScore: 8.7,
    supplierDecarbonization: 75,
    pathwayData: generatePathwayData(95000, 0.08)
  },
  {
    id: 'smartdevices',
    name: 'SmartDevices Inc',
    industry: 'IoT & Smart Devices',
    sector: 'Technology',
    description: 'Innovative IoT solutions and smart device manufacturing for connected homes and cities.',
    totalEmissions: 78000,
    energyConsumption: 118000,
    wasteGenerated: 780,
    renewableEnergyPercentage: 70,
    topCarbonFootprints: ['Manufacturing processes', 'Product transportation', 'Raw material extraction'],
    emissionsData: [
      { year: '2019', scope1: 7800, scope2: 19500, scope3: 50700 },
      { year: '2020', scope1: 7500, scope2: 18750, scope3: 48750 },
      { year: '2021', scope1: 7200, scope2: 18000, scope3: 46800 },
      { year: '2022', scope1: 6900, scope2: 17250, scope3: 44850 },
      { year: '2023', scope1: 6600, scope2: 16500, scope3: 42900 },
      { year: '2024', scope1: 6300, scope2: 15750, scope3: 40950 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Planned', implementationDate: '2024' },
      { name: 'CDP', status: 'Implemented', score: 'B', implementationDate: '2023' },
      { name: 'GRI Standards', status: 'Implemented', score: '82%', implementationDate: '2022' },
      { name: 'TCFD', status: 'In Progress', implementationDate: '2024' },
      { name: 'ISO 14001', status: 'Implemented', score: '80%', implementationDate: '2021' }
    ],
    sbtiTargets: {
      description: 'SmartDevices Inc commits to reduce absolute Scope 1 and 2 GHG emissions by 42% by 2030 from a 2021 baseline and to reduce Scope 3 emissions by 25% by 2030.',
      nearTermTarget: '42% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2050',
      baselineYear: '2021',
      targetYear: '2030',
      scope1Reduction: 42,
      scope2Reduction: 42,
      scope3Reduction: 25,
      validationStatus: 'In Development',
      submissionDate: 'Pending'
    },
    sbtiProgress: 55,
    carbonCredits: 9500,
    materialityScore: 7.5,
    supplierDecarbonization: 62,
    pathwayData: generatePathwayData(78000, 0.06)
  },
  {
    id: 'digitalsolutions',
    name: 'Digital Solutions Pro',
    industry: 'Digital Transformation',
    sector: 'Technology',
    description: 'Digital transformation consulting and enterprise software development services.',
    totalEmissions: 52000,
    energyConsumption: 85000,
    wasteGenerated: 520,
    renewableEnergyPercentage: 88,
    topCarbonFootprints: ['Office energy consumption', 'Client travel', 'Software development infrastructure'],
    emissionsData: [
      { year: '2019', scope1: 5200, scope2: 13000, scope3: 33800 },
      { year: '2020', scope1: 5000, scope2: 12500, scope3: 32500 },
      { year: '2021', scope1: 4800, scope2: 12000, scope3: 31200 },
      { year: '2022', scope1: 4600, scope2: 11500, scope3: 29900 },
      { year: '2023', scope1: 4400, scope2: 11000, scope3: 28600 },
      { year: '2024', scope1: 4200, scope2: 10500, scope3: 27300 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Implemented', score: '94%', implementationDate: '2023' },
      { name: 'CDP', status: 'Implemented', score: 'A', implementationDate: '2022' },
      { name: 'GRI Standards', status: 'Implemented', score: '93%', implementationDate: '2021' },
      { name: 'TCFD', status: 'Implemented', score: '90%', implementationDate: '2023' },
      { name: 'ISO 14001', status: 'Implemented', score: '91%', implementationDate: '2020' }
    ],
    sbtiTargets: {
      description: 'Digital Solutions Pro commits to reduce absolute Scope 1 and 2 GHG emissions by 60% by 2030 from a 2021 baseline and to reduce Scope 3 emissions by 40% by 2030.',
      nearTermTarget: '60% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2035',
      baselineYear: '2021',
      targetYear: '2030',
      scope1Reduction: 60,
      scope2Reduction: 60,
      scope3Reduction: 40,
      validationStatus: 'Targets Approved',
      submissionDate: '2023-04-12'
    },
    sbtiProgress: 90,
    carbonCredits: 11000,
    materialityScore: 8.9,
    supplierDecarbonization: 85,
    pathwayData: generatePathwayData(52000, 0.1)
  },

  // Manufacturing Sector (6 companies)
  {
    id: 'steelworks',
    name: 'SteelWorks Industries',
    industry: 'Steel Manufacturing',
    sector: 'Manufacturing',
    description: 'Large-scale steel production and processing for construction and automotive industries.',
    totalEmissions: 450000,
    energyConsumption: 680000,
    wasteGenerated: 4500,
    renewableEnergyPercentage: 35,
    topCarbonFootprints: ['Coal-fired furnaces', 'Iron ore processing', 'Steel production processes'],
    emissionsData: [
      { year: '2019', scope1: 270000, scope2: 90000, scope3: 90000 },
      { year: '2020', scope1: 260000, scope2: 87000, scope3: 87000 },
      { year: '2021', scope1: 250000, scope2: 84000, scope3: 84000 },
      { year: '2022', scope1: 240000, scope2: 81000, scope3: 81000 },
      { year: '2023', scope1: 230000, scope2: 78000, scope3: 78000 },
      { year: '2024', scope1: 220000, scope2: 75000, scope3: 75000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'In Progress', implementationDate: '2024' },
      { name: 'CDP', status: 'Implemented', score: 'C+', implementationDate: '2023' },
      { name: 'GRI Standards', status: 'Implemented', score: '75%', implementationDate: '2022' },
      { name: 'TCFD', status: 'Planned', implementationDate: '2025' },
      { name: 'ISO 14001', status: 'Implemented', score: '78%', implementationDate: '2020' }
    ],
    sbtiTargets: {
      description: 'SteelWorks Industries commits to reduce absolute Scope 1 and 2 GHG emissions by 35% by 2030 from a 2020 baseline and to reduce Scope 3 emissions by 20% by 2030.',
      nearTermTarget: '35% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2050',
      baselineYear: '2020',
      targetYear: '2030',
      scope1Reduction: 35,
      scope2Reduction: 35,
      scope3Reduction: 20,
      validationStatus: 'Under Review',
      submissionDate: '2024-01-15'
    },
    sbtiProgress: 45,
    carbonCredits: 25000,
    materialityScore: 6.8,
    supplierDecarbonization: 42,
    pathwayData: generatePathwayData(450000, 0.05)
  },
  {
    id: 'autoparts',
    name: 'AutoParts Global',
    industry: 'Automotive Components',
    sector: 'Manufacturing',
    description: 'Automotive parts manufacturing and supply chain solutions for global car manufacturers.',
    totalEmissions: 320000,
    energyConsumption: 485000,
    wasteGenerated: 3200,
    renewableEnergyPercentage: 42,
    topCarbonFootprints: ['Metal casting operations', 'Assembly line energy', 'Raw material transportation'],
    emissionsData: [
      { year: '2019', scope1: 128000, scope2: 96000, scope3: 96000 },
      { year: '2020', scope1: 124000, scope2: 93000, scope3: 93000 },
      { year: '2021', scope1: 120000, scope2: 90000, scope3: 90000 },
      { year: '2022', scope1: 116000, scope2: 87000, scope3: 87000 },
      { year: '2023', scope1: 112000, scope2: 84000, scope3: 84000 },
      { year: '2024', scope1: 108000, scope2: 81000, scope3: 81000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Implemented', score: '82%', implementationDate: '2023' },
      { name: 'CDP', status: 'Implemented', score: 'B+', implementationDate: '2022' },
      { name: 'GRI Standards', status: 'Implemented', score: '85%', implementationDate: '2021' },
      { name: 'TCFD', status: 'In Progress', implementationDate: '2024' },
      { name: 'ISO 14001', status: 'Implemented', score: '87%', implementationDate: '2020' }
    ],
    sbtiTargets: {
      description: 'AutoParts Global commits to reduce absolute Scope 1 and 2 GHG emissions by 40% by 2030 from a 2021 baseline and to reduce Scope 3 emissions by 25% by 2030.',
      nearTermTarget: '40% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2045',
      baselineYear: '2021',
      targetYear: '2030',
      scope1Reduction: 40,
      scope2Reduction: 40,
      scope3Reduction: 25,
      validationStatus: 'Targets Approved',
      submissionDate: '2023-06-20'
    },
    sbtiProgress: 70,
    carbonCredits: 20000,
    materialityScore: 7.2,
    supplierDecarbonization: 65,
    pathwayData: generatePathwayData(320000, 0.06)
  },
  {
    id: 'chemicalcorp',
    name: 'Chemical Corp Industries',
    industry: 'Chemical Manufacturing',
    sector: 'Manufacturing',
    description: 'Specialty chemicals and industrial materials production for various industries.',
    totalEmissions: 380000,
    energyConsumption: 580000,
    wasteGenerated: 3800,
    renewableEnergyPercentage: 38,
    topCarbonFootprints: ['Chemical processing reactions', 'Steam generation', 'Waste treatment processes'],
    emissionsData: [
      { year: '2019', scope1: 190000, scope2: 95000, scope3: 95000 },
      { year: '2020', scope1: 184000, scope2: 92000, scope3: 92000 },
      { year: '2021', scope1: 178000, scope2: 89000, scope3: 89000 },
      { year: '2022', scope1: 172000, scope2: 86000, scope3: 86000 },
      { year: '2023', scope1: 166000, scope2: 83000, scope3: 83000 },
      { year: '2024', scope1: 160000, scope2: 80000, scope3: 80000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Planned', implementationDate: '2025' },
      { name: 'CDP', status: 'Implemented', score: 'B', implementationDate: '2023' },
      { name: 'GRI Standards', status: 'Implemented', score: '78%', implementationDate: '2022' },
      { name: 'TCFD', status: 'Planned', implementationDate: '2025' },
      { name: 'ISO 14001', status: 'Implemented', score: '81%', implementationDate: '2021' }
    ],
    sbtiTargets: {
      description: 'Chemical Corp Industries commits to reduce absolute Scope 1 and 2 GHG emissions by 38% by 2030 from a 2022 baseline and to reduce Scope 3 emissions by 22% by 2030.',
      nearTermTarget: '38% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2050',
      baselineYear: '2022',
      targetYear: '2030',
      scope1Reduction: 38,
      scope2Reduction: 38,
      scope3Reduction: 22,
      validationStatus: 'In Development',
      submissionDate: 'Pending'
    },
    sbtiProgress: 38,
    carbonCredits: 22000,
    materialityScore: 6.5,
    supplierDecarbonization: 45,
    pathwayData: generatePathwayData(380000, 0.05)
  },
  {
    id: 'textilemanuf',
    name: 'Textile Manufacturing Co',
    industry: 'Textile & Apparel',
    sector: 'Manufacturing',
    description: 'Sustainable textile manufacturing and garment production for global fashion brands.',
    totalEmissions: 280000,
    energyConsumption: 420000,
    wasteGenerated: 2800,
    renewableEnergyPercentage: 55,
    topCarbonFootprints: ['Dyeing and finishing processes', 'Cotton cultivation', 'Transportation and logistics'],
    emissionsData: [
      { year: '2019', scope1: 84000, scope2: 84000, scope3: 112000 },
      { year: '2020', scope1: 82000, scope2: 82000, scope3: 109000 },
      { year: '2021', scope1: 80000, scope2: 80000, scope3: 106000 },
      { year: '2022', scope1: 78000, scope2: 78000, scope3: 103000 },
      { year: '2023', scope1: 76000, scope2: 76000, scope3: 100000 },
      { year: '2024', scope1: 74000, scope2: 74000, scope3: 97000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Implemented', score: '85%', implementationDate: '2022' },
      { name: 'CDP', status: 'Implemented', score: 'B+', implementationDate: '2021' },
      { name: 'GRI Standards', status: 'Implemented', score: '88%', implementationDate: '2020' },
      { name: 'TCFD', status: 'Implemented', score: '83%', implementationDate: '2022' },
      { name: 'ISO 14001', status: 'Implemented', score: '86%', implementationDate: '2019' }
    ],
    sbtiTargets: {
      description: 'Textile Manufacturing Co commits to reduce absolute Scope 1 and 2 GHG emissions by 45% by 2030 from a 2020 baseline and to reduce Scope 3 emissions by 30% by 2030.',
      nearTermTarget: '45% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2040',
      baselineYear: '2020',
      targetYear: '2030',
      scope1Reduction: 45,
      scope2Reduction: 45,
      scope3Reduction: 30,
      validationStatus: 'Targets Approved',
      submissionDate: '2022-09-10'
    },
    sbtiProgress: 75,
    carbonCredits: 18500,
    materialityScore: 7.8,
    supplierDecarbonization: 70,
    pathwayData: generatePathwayData(280000, 0.07)
  },
  {
    id: 'machineworks',
    name: 'MachineWorks Heavy Industries',
    industry: 'Heavy Machinery',
    sector: 'Manufacturing',
    description: 'Industrial machinery and equipment manufacturing for construction and mining sectors.',
    totalEmissions: 520000,
    energyConsumption: 780000,
    wasteGenerated: 5200,
    renewableEnergyPercentage: 28,
    topCarbonFootprints: ['Steel and metal processing', 'Heavy machinery assembly', 'Paint and coating processes'],
    emissionsData: [
      { year: '2019', scope1: 312000, scope2: 104000, scope3: 104000 },
      { year: '2020', scope1: 302000, scope2: 101000, scope3: 101000 },
      { year: '2021', scope1: 292000, scope2: 98000, scope3: 98000 },
      { year: '2022', scope1: 282000, scope2: 95000, scope3: 95000 },
      { year: '2023', scope1: 272000, scope2: 92000, scope3: 92000 },
      { year: '2024', scope1: 262000, scope2: 89000, scope3: 89000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'In Progress', implementationDate: '2024' },
      { name: 'CDP', status: 'Implemented', score: 'C', implementationDate: '2023' },
      { name: 'GRI Standards', status: 'Implemented', score: '72%', implementationDate: '2022' },
      { name: 'TCFD', status: 'Planned', implementationDate: '2026' },
      { name: 'ISO 14001', status: 'Implemented', score: '75%', implementationDate: '2021' }
    ],
    sbtiTargets: {
      description: 'MachineWorks Heavy Industries commits to reduce absolute Scope 1 and 2 GHG emissions by 32% by 2030 from a 2021 baseline and to reduce Scope 3 emissions by 18% by 2030.',
      nearTermTarget: '32% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2050',
      baselineYear: '2021',
      targetYear: '2030',
      scope1Reduction: 32,
      scope2Reduction: 32,
      scope3Reduction: 18,
      validationStatus: 'Under Review',
      submissionDate: '2024-03-08'
    },
    sbtiProgress: 35,
    carbonCredits: 28000,
    materialityScore: 6.2,
    supplierDecarbonization: 38,
    pathwayData: generatePathwayData(520000, 0.04)
  },
  {
    id: 'foodprocessing',
    name: 'Global Food Processing',
    industry: 'Food Processing',
    sector: 'Manufacturing',
    description: 'Large-scale food processing and packaging for retail and foodservice industries.',
    totalEmissions: 350000,
    energyConsumption: 525000,
    wasteGenerated: 3500,
    renewableEnergyPercentage: 48,
    topCarbonFootprints: ['Refrigeration systems', 'Food packaging materials', 'Agricultural supply chain'],
    emissionsData: [
      { year: '2019', scope1: 105000, scope2: 105000, scope3: 140000 },
      { year: '2020', scope1: 102000, scope2: 102000, scope3: 136000 },
      { year: '2021', scope1: 99000, scope2: 99000, scope3: 132000 },
      { year: '2022', scope1: 96000, scope2: 96000, scope3: 128000 },
      { year: '2023', scope1: 93000, scope2: 93000, scope3: 124000 },
      { year: '2024', scope1: 90000, scope2: 90000, scope3: 120000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Implemented', score: '88%', implementationDate: '2023' },
      { name: 'CDP', status: 'Implemented', score: 'A-', implementationDate: '2022' },
      { name: 'GRI Standards', status: 'Implemented', score: '90%', implementationDate: '2021' },
      { name: 'TCFD', status: 'Implemented', score: '86%', implementationDate: '2023' },
      { name: 'ISO 14001', status: 'Implemented', score: '89%', implementationDate: '2020' }
    ],
    sbtiTargets: {
      description: 'Global Food Processing commits to reduce absolute Scope 1 and 2 GHG emissions by 50% by 2030 from a 2021 baseline and to reduce Scope 3 emissions by 35% by 2030.',
      nearTermTarget: '50% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2040',
      baselineYear: '2021',
      targetYear: '2030',
      scope1Reduction: 50,
      scope2Reduction: 50,
      scope3Reduction: 35,
      validationStatus: 'Targets Approved',
      submissionDate: '2023-02-28'
    },
    sbtiProgress: 85,
    carbonCredits: 24000,
    materialityScore: 8.1,
    supplierDecarbonization: 78,
    pathwayData: generatePathwayData(350000, 0.08)
  },

  // Transportation Sector (6 companies)
  {
    id: 'globallogistics',
    name: 'Global Logistics Corp',
    industry: 'Freight & Logistics',
    sector: 'Transportation',
    description: 'International freight transportation and supply chain management services.',
    totalEmissions: 650000,
    energyConsumption: 975000,
    wasteGenerated: 6500,
    renewableEnergyPercentage: 25,
    topCarbonFootprints: ['Diesel truck fleets', 'Ocean freight emissions', 'Warehouse operations'],
    emissionsData: [
      { year: '2019', scope1: 455000, scope2: 65000, scope3: 130000 },
      { year: '2020', scope1: 442000, scope2: 63000, scope3: 126000 },
      { year: '2021', scope1: 429000, scope2: 61000, scope3: 122000 },
      { year: '2022', scope1: 416000, scope2: 59000, scope3: 118000 },
      { year: '2023', scope1: 403000, scope2: 57000, scope3: 114000 },
      { year: '2024', scope1: 390000, scope2: 55000, scope3: 110000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'In Progress', implementationDate: '2024' },
      { name: 'CDP', status: 'Implemented', score: 'B-', implementationDate: '2023' },
      { name: 'GRI Standards', status: 'Implemented', score: '70%', implementationDate: '2022' },
      { name: 'TCFD', status: 'Planned', implementationDate: '2025' },
      { name: 'ISO 14001', status: 'Implemented', score: '73%', implementationDate: '2021' }
    ],
    sbtiTargets: {
      description: 'Global Logistics Corp commits to reduce absolute Scope 1 and 2 GHG emissions by 30% by 2030 from a 2021 baseline and to reduce Scope 3 emissions by 15% by 2030.',
      nearTermTarget: '30% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2050',
      baselineYear: '2021',
      targetYear: '2030',
      scope1Reduction: 30,
      scope2Reduction: 30,
      scope3Reduction: 15,
      validationStatus: 'Under Review',
      submissionDate: '2024-01-30'
    },
    sbtiProgress: 42,
    carbonCredits: 35000,
    materialityScore: 5.8,
    supplierDecarbonization: 35,
    pathwayData: generatePathwayData(650000, 0.04)
  },
  {
    id: 'airlineexpress',
    name: 'AirlineExpress International',
    industry: 'Air Transportation',
    sector: 'Transportation',
    description: 'International passenger and cargo airline with global route network.',
    totalEmissions: 850000,
    energyConsumption: 1275000,
    wasteGenerated: 8500,
    renewableEnergyPercentage: 15,
    topCarbonFootprints: ['Jet fuel consumption', 'Airport ground operations', 'Aircraft manufacturing'],
    emissionsData: [
      { year: '2019', scope1: 680000, scope2: 85000, scope3: 85000 },
      { year: '2020', scope1: 660000, scope2: 82000, scope3: 82000 },
      { year: '2021', scope1: 640000, scope2: 79000, scope3: 79000 },
      { year: '2022', scope1: 620000, scope2: 76000, scope3: 76000 },
      { year: '2023', scope1: 600000, scope2: 73000, scope3: 73000 },
      { year: '2024', scope1: 580000, scope2: 70000, scope3: 70000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Planned', implementationDate: '2025' },
      { name: 'CDP', status: 'Implemented', score: 'C+', implementationDate: '2023' },
      { name: 'GRI Standards', status: 'Implemented', score: '68%', implementationDate: '2022' },
      { name: 'TCFD', status: 'In Progress', implementationDate: '2024' },
      { name: 'ISO 14001', status: 'Implemented', score: '70%', implementationDate: '2021' }
    ],
    sbtiTargets: {
      description: 'AirlineExpress International commits to reduce absolute Scope 1 and 2 GHG emissions by 25% by 2030 from a 2022 baseline and to reduce Scope 3 emissions by 12% by 2030.',
      nearTermTarget: '25% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2050',
      baselineYear: '2022',
      targetYear: '2030',
      scope1Reduction: 25,
      scope2Reduction: 25,
      scope3Reduction: 12,
      validationStatus: 'In Development',
      submissionDate: 'Pending'
    },
    sbtiProgress: 28,
    carbonCredits: 45000,
    materialityScore: 5.2,
    supplierDecarbonization: 25,
    pathwayData: generatePathwayData(850000, 0.03)
  },
  {
    id: 'shippinglines',
    name: 'Ocean Shipping Lines',
    industry: 'Maritime Transportation',
    sector: 'Transportation',
    description: 'Global container shipping and maritime logistics services.',
    totalEmissions: 720000,
    energyConsumption: 1080000,
    wasteGenerated: 7200,
    renewableEnergyPercentage: 18,
    topCarbonFootprints: ['Marine diesel fuel', 'Port operations', 'Container manufacturing'],
    emissionsData: [
      { year: '2019', scope1: 540000, scope2: 72000, scope3: 108000 },
      { year: '2020', scope1: 525000, scope2: 70000, scope3: 105000 },
      { year: '2021', scope1: 510000, scope2: 68000, scope3: 102000 },
      { year: '2022', scope1: 495000, scope2: 66000, scope3: 99000 },
      { year: '2023', scope1: 480000, scope2: 64000, scope3: 96000 },
      { year: '2024', scope1: 465000, scope2: 62000, scope3: 93000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'In Progress', implementationDate: '2024' },
      { name: 'CDP', status: 'Implemented', score: 'C', implementationDate: '2023' },
      { name: 'GRI Standards', status: 'Implemented', score: '65%', implementationDate: '2022' },
      { name: 'TCFD', status: 'Planned', implementationDate: '2026' },
      { name: 'ISO 14001', status: 'Implemented', score: '68%', implementationDate: '2021' }
    ],
    sbtiTargets: {
      description: 'Ocean Shipping Lines commits to reduce absolute Scope 1 and 2 GHG emissions by 28% by 2030 from a 2021 baseline and to reduce Scope 3 emissions by 15% by 2030.',
      nearTermTarget: '28% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2050',
      baselineYear: '2021',
      targetYear: '2030',
      scope1Reduction: 28,
      scope2Reduction: 28,
      scope3Reduction: 15,
      validationStatus: 'Under Review',
      submissionDate: '2024-02-15'
    },
    sbtiProgress: 35,
    carbonCredits: 38000,
    materialityScore: 5.5,
    supplierDecarbonization: 32,
    pathwayData: generatePathwayData(720000, 0.04)
  },
  {
    id: 'railtransport',
    name: 'Continental Rail Transport',
    industry: 'Rail Transportation',
    sector: 'Transportation',
    description: 'Passenger and freight rail services across continental networks.',
    totalEmissions: 420000,
    energyConsumption: 630000,
    wasteGenerated: 4200,
    renewableEnergyPercentage: 45,
    topCarbonFootprints: ['Diesel locomotive fuel', 'Electricity for electric trains', 'Railway infrastructure'],
    emissionsData: [
      { year: '2019', scope1: 252000, scope2: 84000, scope3: 84000 },
      { year: '2020', scope1: 245000, scope2: 82000, scope3: 82000 },
      { year: '2021', scope1: 238000, scope2: 80000, scope3: 80000 },
      { year: '2022', scope1: 231000, scope2: 78000, scope3: 78000 },
      { year: '2023', scope1: 224000, scope2: 76000, scope3: 76000 },
      { year: '2024', scope1: 217000, scope2: 74000, scope3: 74000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Implemented', score: '80%', implementationDate: '2023' },
      { name: 'CDP', status: 'Implemented', score: 'B', implementationDate: '2022' },
      { name: 'GRI Standards', status: 'Implemented', score: '82%', implementationDate: '2021' },
      { name: 'TCFD', status: 'Implemented', score: '78%', implementationDate: '2023' },
      { name: 'ISO 14001', status: 'Implemented', score: '85%', implementationDate: '2020' }
    ],
    sbtiTargets: {
      description: 'Continental Rail Transport commits to reduce absolute Scope 1 and 2 GHG emissions by 40% by 2030 from a 2021 baseline and to reduce Scope 3 emissions by 25% by 2030.',
      nearTermTarget: '40% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2045',
      baselineYear: '2021',
      targetYear: '2030',
      scope1Reduction: 40,
      scope2Reduction: 40,
      scope3Reduction: 25,
      validationStatus: 'Targets Approved',
      submissionDate: '2023-07-12'
    },
    sbtiProgress: 68,
    carbonCredits: 26000,
    materialityScore: 7.0,
    supplierDecarbonization: 60,
    pathwayData: generatePathwayData(420000, 0.06)
  },
  {
    id: 'publictransit',
    name: 'MetroCity Public Transit',
    industry: 'Public Transportation',
    sector: 'Transportation',
    description: 'Urban public transportation systems including buses, metro, and light rail.',
    totalEmissions: 180000,
    energyConsumption: 270000,
    wasteGenerated: 1800,
    renewableEnergyPercentage: 65,
    topCarbonFootprints: ['Bus fleet diesel consumption', 'Electricity for metro systems', 'Infrastructure maintenance'],
    emissionsData: [
      { year: '2019', scope1: 108000, scope2: 36000, scope3: 36000 },
      { year: '2020', scope1: 104000, scope2: 35000, scope3: 35000 },
      { year: '2021', scope1: 100000, scope2: 34000, scope3: 34000 },
      { year: '2022', scope1: 96000, scope2: 33000, scope3: 33000 },
      { year: '2023', scope1: 92000, scope2: 32000, scope3: 32000 },
      { year: '2024', scope1: 88000, scope2: 31000, scope3: 31000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Implemented', score: '90%', implementationDate: '2022' },
      { name: 'CDP', status: 'Implemented', score: 'A-', implementationDate: '2021' },
      { name: 'GRI Standards', status: 'Implemented', score: '88%', implementationDate: '2020' },
      { name: 'TCFD', status: 'Implemented', score: '85%', implementationDate: '2022' },
      { name: 'ISO 14001', status: 'Implemented', score: '90%', implementationDate: '2019' }
    ],
    sbtiTargets: {
      description: 'MetroCity Public Transit commits to reduce absolute Scope 1 and 2 GHG emissions by 55% by 2030 from a 2020 baseline and to reduce Scope 3 emissions by 40% by 2030.',
      nearTermTarget: '55% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2035',
      baselineYear: '2020',
      targetYear: '2030',
      scope1Reduction: 55,
      scope2Reduction: 55,
      scope3Reduction: 40,
      validationStatus: 'Targets Approved',
      submissionDate: '2022-04-25'
    },
    sbtiProgress: 88,
    carbonCredits: 14000,
    materialityScore: 8.5,
    supplierDecarbonization: 82,
    pathwayData: generatePathwayData(180000, 0.09)
  },
  {
    id: 'fleetservices',
    name: 'Commercial Fleet Services',
    industry: 'Fleet Management',
    sector: 'Transportation',
    description: 'Commercial vehicle fleet management and leasing services.',
    totalEmissions: 320000,
    energyConsumption: 480000,
    wasteGenerated: 3200,
    renewableEnergyPercentage: 35,
    topCarbonFootprints: ['Fleet vehicle fuel consumption', 'Vehicle manufacturing', 'Maintenance operations'],
    emissionsData: [
      { year: '2019', scope1: 224000, scope2: 48000, scope3: 48000 },
      { year: '2020', scope1: 218000, scope2: 47000, scope3: 47000 },
      { year: '2021', scope1: 212000, scope2: 46000, scope3: 46000 },
      { year: '2022', scope1: 206000, scope2: 45000, scope3: 45000 },
      { year: '2023', scope1: 200000, scope2: 44000, scope3: 44000 },
      { year: '2024', scope1: 194000, scope2: 43000, scope3: 43000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Planned', implementationDate: '2025' },
      { name: 'CDP', status: 'Implemented', score: 'B-', implementationDate: '2023' },
      { name: 'GRI Standards', status: 'Implemented', score: '75%', implementationDate: '2022' },
      { name: 'TCFD', status: 'In Progress', implementationDate: '2024' },
      { name: 'ISO 14001', status: 'Implemented', score: '78%', implementationDate: '2021' }
    ],
    sbtiTargets: {
      description: 'Commercial Fleet Services commits to reduce absolute Scope 1 and 2 GHG emissions by 35% by 2030 from a 2022 baseline and to reduce Scope 3 emissions by 20% by 2030.',
      nearTermTarget: '35% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2050',
      baselineYear: '2022',
      targetYear: '2030',
      scope1Reduction: 35,
      scope2Reduction: 35,
      scope3Reduction: 20,
      validationStatus: 'In Development',
      submissionDate: 'Pending'
    },
    sbtiProgress: 48,
    carbonCredits: 21000,
    materialityScore: 6.8,
    supplierDecarbonization: 52,
    pathwayData: generatePathwayData(320000, 0.05)
  },

  // Mining Sector (6 companies)
  {
    id: 'goldmining',
    name: 'GoldRush Mining Corp',
    industry: 'Gold Mining',
    sector: 'Mining',
    description: 'Large-scale gold mining operations with global mining sites.',
    totalEmissions: 680000,
    energyConsumption: 1020000,
    wasteGenerated: 6800,
    renewableEnergyPercentage: 22,
    topCarbonFootprints: ['Heavy mining equipment', 'Ore processing facilities', 'Transportation to refineries'],
    emissionsData: [
      { year: '2019', scope1: 476000, scope2: 102000, scope3: 102000 },
      { year: '2020', scope1: 463000, scope2: 99000, scope3: 99000 },
      { year: '2021', scope1: 450000, scope2: 96000, scope3: 96000 },
      { year: '2022', scope1: 437000, scope2: 93000, scope3: 93000 },
      { year: '2023', scope1: 424000, scope2: 90000, scope3: 90000 },
      { year: '2024', scope1: 411000, scope2: 87000, scope3: 87000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'In Progress', implementationDate: '2024' },
      { name: 'CDP', status: 'Implemented', score: 'C', implementationDate: '2023' },
      { name: 'GRI Standards', status: 'Implemented', score: '68%', implementationDate: '2022' },
      { name: 'TCFD', status: 'Planned', implementationDate: '2025' },
      { name: 'ISO 14001', status: 'Implemented', score: '72%', implementationDate: '2021' }
    ],
    sbtiTargets: {
      description: 'GoldRush Mining Corp commits to reduce absolute Scope 1 and 2 GHG emissions by 28% by 2030 from a 2021 baseline and to reduce Scope 3 emissions by 15% by 2030.',
      nearTermTarget: '28% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2050',
      baselineYear: '2021',
      targetYear: '2030',
      scope1Reduction: 28,
      scope2Reduction: 28,
      scope3Reduction: 15,
      validationStatus: 'Under Review',
      submissionDate: '2024-01-20'
    },
    sbtiProgress: 38,
    carbonCredits: 42000,
    materialityScore: 5.5,
    supplierDecarbonization: 28,
    pathwayData: generatePathwayData(680000, 0.04)
  },
  {
    id: 'coalmining',
    name: 'BlackRock Coal Mining',
    industry: 'Coal Mining',
    sector: 'Mining',
    description: 'Coal extraction and processing operations for energy and steel industries.',
    totalEmissions: 920000,
    energyConsumption: 1380000,
    wasteGenerated: 9200,
    renewableEnergyPercentage: 12,
    topCarbonFootprints: ['Coal extraction processes', 'Mine ventilation systems', 'Coal transportation'],
    emissionsData: [
      { year: '2019', scope1: 644000, scope2: 138000, scope3: 138000 },
      { year: '2020', scope1: 626000, scope2: 134000, scope3: 134000 },
      { year: '2021', scope1: 608000, scope2: 130000, scope3: 130000 },
      { year: '2022', scope1: 590000, scope2: 126000, scope3: 126000 },
      { year: '2023', scope1: 572000, scope2: 122000, scope3: 122000 },
      { year: '2024', scope1: 554000, scope2: 118000, scope3: 118000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Planned', implementationDate: '2026' },
      { name: 'CDP', status: 'Implemented', score: 'D+', implementationDate: '2023' },
      { name: 'GRI Standards', status: 'Implemented', score: '58%', implementationDate: '2022' },
      { name: 'TCFD', status: 'Planned', implementationDate: '2027' },
      { name: 'ISO 14001', status: 'In Progress', implementationDate: '2024' }
    ],
    sbtiTargets: {
      description: 'BlackRock Coal Mining commits to reduce absolute Scope 1 and 2 GHG emissions by 22% by 2030 from a 2022 baseline and to reduce Scope 3 emissions by 10% by 2030.',
      nearTermTarget: '22% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2055',
      baselineYear: '2022',
      targetYear: '2030',
      scope1Reduction: 22,
      scope2Reduction: 22,
      scope3Reduction: 10,
      validationStatus: 'In Development',
      submissionDate: 'Pending'
    },
    sbtiProgress: 18,
    carbonCredits: 58000,
    materialityScore: 4.2,
    supplierDecarbonization: 15,
    pathwayData: generatePathwayData(920000, 0.03)
  },
  {
    id: 'ironore',
    name: 'IronPeak Ore Extraction',
    industry: 'Iron Ore Mining',
    sector: 'Mining',
    description: 'Iron ore mining and beneficiation for steel industry supply chain.',
    totalEmissions: 580000,
    energyConsumption: 870000,
    wasteGenerated: 5800,
    renewableEnergyPercentage: 28,
    topCarbonFootprints: ['Ore crushing and grinding', 'Haul truck operations', 'Processing plant energy'],
    emissionsData: [
      { year: '2019', scope1: 406000, scope2: 87000, scope3: 87000 },
      { year: '2020', scope1: 395000, scope2: 85000, scope3: 85000 },
      { year: '2021', scope1: 384000, scope2: 83000, scope3: 83000 },
      { year: '2022', scope1: 373000, scope2: 81000, scope3: 81000 },
      { year: '2023', scope1: 362000, scope2: 79000, scope3: 79000 },
      { year: '2024', scope1: 351000, scope2: 77000, scope3: 77000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'In Progress', implementationDate: '2024' },
      { name: 'CDP', status: 'Implemented', score: 'C+', implementationDate: '2023' },
      { name: 'GRI Standards', status: 'Implemented', score: '72%', implementationDate: '2022' },
      { name: 'TCFD', status: 'In Progress', implementationDate: '2024' },
      { name: 'ISO 14001', status: 'Implemented', score: '75%', implementationDate: '2021' }
    ],
    sbtiTargets: {
      description: 'IronPeak Ore Extraction commits to reduce absolute Scope 1 and 2 GHG emissions by 32% by 2030 from a 2021 baseline and to reduce Scope 3 emissions by 18% by 2030.',
      nearTermTarget: '32% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2050',
      baselineYear: '2021',
      targetYear: '2030',
      scope1Reduction: 32,
      scope2Reduction: 32,
      scope3Reduction: 18,
      validationStatus: 'Under Review',
      submissionDate: '2024-03-05'
    },
    sbtiProgress: 42,
    carbonCredits: 36000,
    materialityScore: 6.0,
    supplierDecarbonization: 38,
    pathwayData: generatePathwayData(580000, 0.04)
  },
  {
    id: 'coppermining',
    name: 'Copper Valley Mining',
    industry: 'Copper Mining',
    sector: 'Mining',
    description: 'Copper mining and smelting operations for electronics and construction industries.',
    totalEmissions: 520000,
    energyConsumption: 780000,
    wasteGenerated: 5200,
    renewableEnergyPercentage: 32,
    topCarbonFootprints: ['Smelting operations', 'Mine extraction equipment', 'Concentrate transportation'],
    emissionsData: [
      { year: '2019', scope1: 364000, scope2: 78000, scope3: 78000 },
      { year: '2020', scope1: 354000, scope2: 76000, scope3: 76000 },
      { year: '2021', scope1: 344000, scope2: 74000, scope3: 74000 },
      { year: '2022', scope1: 334000, scope2: 72000, scope3: 72000 },
      { year: '2023', scope1: 324000, scope2: 70000, scope3: 70000 },
      { year: '2024', scope1: 314000, scope2: 68000, scope3: 68000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Implemented', score: '78%', implementationDate: '2023' },
      { name: 'CDP', status: 'Implemented', score: 'B-', implementationDate: '2022' },
      { name: 'GRI Standards', status: 'Implemented', score: '80%', implementationDate: '2021' },
      { name: 'TCFD', status: 'Implemented', score: '75%', implementationDate: '2023' },
      { name: 'ISO 14001', status: 'Implemented', score: '82%', implementationDate: '2020' }
    ],
    sbtiTargets: {
      description: 'Copper Valley Mining commits to reduce absolute Scope 1 and 2 GHG emissions by 38% by 2030 from a 2021 baseline and to reduce Scope 3 emissions by 22% by 2030.',
      nearTermTarget: '38% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2045',
      baselineYear: '2021',
      targetYear: '2030',
      scope1Reduction: 38,
      scope2Reduction: 38,
      scope3Reduction: 22,
      validationStatus: 'Targets Approved',
      submissionDate: '2023-08-18'
    },
    sbtiProgress: 65,
    carbonCredits: 32000,
    materialityScore: 7.2,
    supplierDecarbonization: 58,
    pathwayData: generatePathwayData(520000, 0.05)
  },
  {
    id: 'nickelextraction',
    name: 'Nickel Extraction Industries',
    industry: 'Nickel Mining',
    sector: 'Mining',
    description: 'Nickel mining and refining for battery and stainless steel production.',
    totalEmissions: 480000,
    energyConsumption: 720000,
    wasteGenerated: 4800,
    renewableEnergyPercentage: 35,
    topCarbonFootprints: ['Nickel refining processes', 'Mine site operations', 'Product shipping'],
    emissionsData: [
      { year: '2019', scope1: 336000, scope2: 72000, scope3: 72000 },
      { year: '2020', scope1: 327000, scope2: 70000, scope3: 70000 },
      { year: '2021', scope1: 318000, scope2: 68000, scope3: 68000 },
      { year: '2022', scope1: 309000, scope2: 66000, scope3: 66000 },
      { year: '2023', scope1: 300000, scope2: 64000, scope3: 64000 },
      { year: '2024', scope1: 291000, scope2: 62000, scope3: 62000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Implemented', score: '82%', implementationDate: '2022' },
      { name: 'CDP', status: 'Implemented', score: 'B+', implementationDate: '2021' },
      { name: 'GRI Standards', status: 'Implemented', score: '85%', implementationDate: '2020' },
      { name: 'TCFD', status: 'Implemented', score: '80%', implementationDate: '2022' },
      { name: 'ISO 14001', status: 'Implemented', score: '87%', implementationDate: '2019' }
    ],
    sbtiTargets: {
      description: 'Nickel Extraction Industries commits to reduce absolute Scope 1 and 2 GHG emissions by 42% by 2030 from a 2020 baseline and to reduce Scope 3 emissions by 25% by 2030.',
      nearTermTarget: '42% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2040',
      baselineYear: '2020',
      targetYear: '2030',
      scope1Reduction: 42,
      scope2Reduction: 42,
      scope3Reduction: 25,
      validationStatus: 'Targets Approved',
      submissionDate: '2022-11-08'
    },
    sbtiProgress: 78,
    carbonCredits: 30000,
    materialityScore: 7.8,
    supplierDecarbonization: 72,
    pathwayData: generatePathwayData(480000, 0.06)
  },
  {
    id: 'aggregates',
    name: 'Mountain Aggregates Co',
    industry: 'Construction Materials',
    sector: 'Mining',
    description: 'Quarrying and processing of construction aggregates and building materials.',
    totalEmissions: 280000,
    energyConsumption: 420000,
    wasteGenerated: 2800,
    renewableEnergyPercentage: 42,
    topCarbonFootprints: ['Quarry blasting operations', 'Aggregate crushing', 'Transportation to construction sites'],
    emissionsData: [
      { year: '2019', scope1: 168000, scope2: 56000, scope3: 56000 },
      { year: '2020', scope1: 163000, scope2: 55000, scope3: 55000 },
      { year: '2021', scope1: 158000, scope2: 54000, scope3: 54000 },
      { year: '2022', scope1: 153000, scope2: 53000, scope3: 53000 },
      { year: '2023', scope1: 148000, scope2: 52000, scope3: 52000 },
      { year: '2024', scope1: 143000, scope2: 51000, scope3: 51000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Planned', implementationDate: '2025' },
      { name: 'CDP', status: 'Implemented', score: 'B', implementationDate: '2023' },
      { name: 'GRI Standards', status: 'Implemented', score: '78%', implementationDate: '2022' },
      { name: 'TCFD', status: 'In Progress', implementationDate: '2024' },
      { name: 'ISO 14001', status: 'Implemented', score: '80%', implementationDate: '2021' }
    ],
    sbtiTargets: {
      description: 'Mountain Aggregates Co commits to reduce absolute Scope 1 and 2 GHG emissions by 35% by 2030 from a 2022 baseline and to reduce Scope 3 emissions by 20% by 2030.',
      nearTermTarget: '35% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2050',
      baselineYear: '2022',
      targetYear: '2030',
      scope1Reduction: 35,
      scope2Reduction: 35,
      scope3Reduction: 20,
      validationStatus: 'In Development',
      submissionDate: 'Pending'
    },
    sbtiProgress: 52,
    carbonCredits: 18000,
    materialityScore: 6.8,
    supplierDecarbonization: 55,
    pathwayData: generatePathwayData(280000, 0.05)
  },

  // FMCG Sector (6 companies)
  {
    id: 'globalconsumer',
    name: 'Global Consumer Brands',
    industry: 'Consumer Goods',
    sector: 'FMCG',
    description: 'Leading multinational consumer goods company with diverse product portfolio.',
    totalEmissions: 420000,
    energyConsumption: 630000,
    wasteGenerated: 4200,
    renewableEnergyPercentage: 58,
    topCarbonFootprints: ['Manufacturing facilities', 'Product packaging', 'Global supply chain'],
    emissionsData: [
      { year: '2019', scope1: 84000, scope2: 126000, scope3: 210000 },
      { year: '2020', scope1: 82000, scope2: 123000, scope3: 205000 },
      { year: '2021', scope1: 80000, scope2: 120000, scope3: 200000 },
      { year: '2022', scope1: 78000, scope2: 117000, scope3: 195000 },
      { year: '2023', scope1: 76000, scope2: 114000, scope3: 190000 },
      { year: '2024', scope1: 74000, scope2: 111000, scope3: 185000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Implemented', score: '90%', implementationDate: '2022' },
      { name: 'CDP', status: 'Implemented', score: 'A-', implementationDate: '2021' },
      { name: 'GRI Standards', status: 'Implemented', score: '92%', implementationDate: '2020' },
      { name: 'TCFD', status: 'Implemented', score: '88%', implementationDate: '2022' },
      { name: 'ISO 14001', status: 'Implemented', score: '91%', implementationDate: '2019' }
    ],
    sbtiTargets: {
      description: 'Global Consumer Brands commits to reduce absolute Scope 1 and 2 GHG emissions by 50% by 2030 from a 2020 baseline and to reduce Scope 3 emissions by 35% by 2030.',
      nearTermTarget: '50% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2040',
      baselineYear: '2020',
      targetYear: '2030',
      scope1Reduction: 50,
      scope2Reduction: 50,
      scope3Reduction: 35,
      validationStatus: 'Targets Approved',
      submissionDate: '2022-07-15'
    },
    sbtiProgress: 88,
    carbonCredits: 28000,
    materialityScore: 8.5,
    supplierDecarbonization: 82,
    pathwayData: generatePathwayData(420000, 0.08)
  },
  {
    id: 'foodbeverage',
    name: 'Premium Food & Beverage Co',
    industry: 'Food & Beverage',
    sector: 'FMCG',
    description: 'Premium food and beverage manufacturing with global distribution network.',
    totalEmissions: 380000,
    energyConsumption: 570000,
    wasteGenerated: 3800,
    renewableEnergyPercentage: 52,
    topCarbonFootprints: ['Agricultural raw materials', 'Manufacturing processes', 'Cold chain distribution'],
    emissionsData: [
      { year: '2019', scope1: 76000, scope2: 114000, scope3: 190000 },
      { year: '2020', scope1: 74000, scope2: 111000, scope3: 185000 },
      { year: '2021', scope1: 72000, scope2: 108000, scope3: 180000 },
      { year: '2022', scope1: 70000, scope2: 105000, scope3: 175000 },
      { year: '2023', scope1: 68000, scope2: 102000, scope3: 170000 },
      { year: '2024', scope1: 66000, scope2: 99000, scope3: 165000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Implemented', score: '85%', implementationDate: '2023' },
      { name: 'CDP', status: 'Implemented', score: 'A-', implementationDate: '2022' },
      { name: 'GRI Standards', status: 'Implemented', score: '87%', implementationDate: '2021' },
      { name: 'TCFD', status: 'Implemented', score: '83%', implementationDate: '2023' },
      { name: 'ISO 14001', status: 'Implemented', score: '86%', implementationDate: '2020' }
    ],
    sbtiTargets: {
      description: 'Premium Food & Beverage Co commits to reduce absolute Scope 1 and 2 GHG emissions by 48% by 2030 from a 2021 baseline and to reduce Scope 3 emissions by 32% by 2030.',
      nearTermTarget: '48% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2045',
      baselineYear: '2021',
      targetYear: '2030',
      scope1Reduction: 48,
      scope2Reduction: 48,
      scope3Reduction: 32,
      validationStatus: 'Targets Approved',
      submissionDate: '2023-03-22'
    },
    sbtiProgress: 78,
    carbonCredits: 25000,
    materialityScore: 8.2,
    supplierDecarbonization: 75,
    pathwayData: generatePathwayData(380000, 0.07)
  },
  {
    id: 'personalcare',
    name: 'PersonalCare Essentials',
    industry: 'Personal Care',
    sector: 'FMCG',
    description: 'Personal care and hygiene products manufacturing and distribution.',
    totalEmissions: 290000,
    energyConsumption: 435000,
    wasteGenerated: 2900,
    renewableEnergyPercentage: 62,
    topCarbonFootprints: ['Chemical ingredient sourcing', 'Product packaging', 'Manufacturing energy'],
    emissionsData: [
      { year: '2019', scope1: 58000, scope2: 87000, scope3: 145000 },
      { year: '2020', scope1: 57000, scope2: 85000, scope3: 142000 },
      { year: '2021', scope1: 56000, scope2: 83000, scope3: 139000 },
      { year: '2022', scope1: 55000, scope2: 81000, scope3: 136000 },
      { year: '2023', scope1: 54000, scope2: 79000, scope3: 133000 },
      { year: '2024', scope1: 53000, scope2: 77000, scope3: 130000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Implemented', score: '88%', implementationDate: '2022' },
      { name: 'CDP', status: 'Implemented', score: 'A', implementationDate: '2021' },
      { name: 'GRI Standards', status: 'Implemented', score: '90%', implementationDate: '2020' },
      { name: 'TCFD', status: 'Implemented', score: '86%', implementationDate: '2022' },
      { name: 'ISO 14001', status: 'Implemented', score: '89%', implementationDate: '2019' }
    ],
    sbtiTargets: {
      description: 'PersonalCare Essentials commits to reduce absolute Scope 1 and 2 GHG emissions by 52% by 2030 from a 2020 baseline and to reduce Scope 3 emissions by 38% by 2030.',
      nearTermTarget: '52% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2035',
      baselineYear: '2020',
      targetYear: '2030',
      scope1Reduction: 52,
      scope2Reduction: 52,
      scope3Reduction: 38,
      validationStatus: 'Targets Approved',
      submissionDate: '2022-10-12'
    },
    sbtiProgress: 85,
    carbonCredits: 20000,
    materialityScore: 8.7,
    supplierDecarbonization: 80,
    pathwayData: generatePathwayData(290000, 0.08)
  },
  {
    id: 'homecleaning',
    name: 'HomeCleaning Solutions',
    industry: 'Home Care Products',
    sector: 'FMCG',
    description: 'Household cleaning and maintenance products for consumer markets.',
    totalEmissions: 220000,
    energyConsumption: 330000,
    wasteGenerated: 2200,
    renewableEnergyPercentage: 68,
    topCarbonFootprints: ['Chemical manufacturing', 'Plastic packaging', 'Transportation logistics'],
    emissionsData: [
      { year: '2019', scope1: 44000, scope2: 66000, scope3: 110000 },
      { year: '2020', scope1: 43000, scope2: 65000, scope3: 108000 },
      { year: '2021', scope1: 42000, scope2: 64000, scope3: 106000 },
      { year: '2022', scope1: 41000, scope2: 63000, scope3: 104000 },
      { year: '2023', scope1: 40000, scope2: 62000, scope3: 102000 },
      { year: '2024', scope1: 39000, scope2: 61000, scope3: 100000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Implemented', score: '92%', implementationDate: '2023' },
      { name: 'CDP', status: 'Implemented', score: 'A', implementationDate: '2022' },
      { name: 'GRI Standards', status: 'Implemented', score: '93%', implementationDate: '2021' },
      { name: 'TCFD', status: 'Implemented', score: '89%', implementationDate: '2023' },
      { name: 'ISO 14001', status: 'Implemented', score: '92%', implementationDate: '2020' }
    ],
    sbtiTargets: {
      description: 'HomeCleaning Solutions commits to reduce absolute Scope 1 and 2 GHG emissions by 55% by 2030 from a 2021 baseline and to reduce Scope 3 emissions by 40% by 2030.',
      nearTermTarget: '55% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2035',
      baselineYear: '2021',
      targetYear: '2030',
      scope1Reduction: 55,
      scope2Reduction: 55,
      scope3Reduction: 40,
      validationStatus: 'Targets Approved',
      submissionDate: '2023-05-30'
    },
    sbtiProgress: 92,
    carbonCredits: 16000,
    materialityScore: 9.0,
    supplierDecarbonization: 88,
    pathwayData: generatePathwayData(220000, 0.09)
  },
  {
    id: 'petcare',
    name: 'Premium Pet Care Products',
    industry: 'Pet Care',
    sector: 'FMCG',
    description: 'Premium pet food and care products for domestic and international markets.',
    totalEmissions: 340000,
    energyConsumption: 510000,
    wasteGenerated: 3400,
    renewableEnergyPercentage: 55,
    topCarbonFootprints: ['Meat and protein sourcing', 'Manufacturing facilities', 'Product distribution'],
    emissionsData: [
      { year: '2019', scope1: 68000, scope2: 102000, scope3: 170000 },
      { year: '2020', scope1: 66000, scope2: 99000, scope3: 165000 },
      { year: '2021', scope1: 64000, scope2: 96000, scope3: 160000 },
      { year: '2022', scope1: 62000, scope2: 93000, scope3: 155000 },
      { year: '2023', scope1: 60000, scope2: 90000, scope3: 150000 },
      { year: '2024', scope1: 58000, scope2: 87000, scope3: 145000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'In Progress', implementationDate: '2024' },
      { name: 'CDP', status: 'Implemented', score: 'B+', implementationDate: '2023' },
      { name: 'GRI Standards', status: 'Implemented', score: '83%', implementationDate: '2022' },
      { name: 'TCFD', status: 'In Progress', implementationDate: '2024' },
      { name: 'ISO 14001', status: 'Implemented', score: '84%', implementationDate: '2021' }
    ],
    sbtiTargets: {
      description: 'Premium Pet Care Products commits to reduce absolute Scope 1 and 2 GHG emissions by 45% by 2030 from a 2022 baseline and to reduce Scope 3 emissions by 28% by 2030.',
      nearTermTarget: '45% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2050',
      baselineYear: '2022',
      targetYear: '2030',
      scope1Reduction: 45,
      scope2Reduction: 45,
      scope3Reduction: 28,
      validationStatus: 'Under Review',
      submissionDate: '2024-04-10'
    },
    sbtiProgress: 68,
    carbonCredits: 22000,
    materialityScore: 7.5,
    supplierDecarbonization: 65,
    pathwayData: generatePathwayData(340000, 0.06)
  },
  {
    id: 'retailchain',
    name: 'MegaRetail Chain',
    industry: 'Retail & Distribution',
    sector: 'FMCG',
    description: 'Large retail chain with supermarkets and convenience stores nationwide.',
    totalEmissions: 480000,
    energyConsumption: 720000,
    wasteGenerated: 4800,
    renewableEnergyPercentage: 45,
    topCarbonFootprints: ['Store refrigeration systems', 'Transportation fleet', 'Supply chain logistics'],
    emissionsData: [
      { year: '2019', scope1: 96000, scope2: 144000, scope3: 240000 },
      { year: '2020', scope1: 94000, scope2: 141000, scope3: 235000 },
      { year: '2021', scope1: 92000, scope2: 138000, scope3: 230000 },
      { year: '2022', scope1: 90000, scope2: 135000, scope3: 225000 },
      { year: '2023', scope1: 88000, scope2: 132000, scope3: 220000 },
      { year: '2024', scope1: 86000, scope2: 129000, scope3: 215000 }
    ],
    frameworks: [
      { name: 'SBTi', status: 'Implemented', score: '80%', implementationDate: '2023' },
      { name: 'CDP', status: 'Implemented', score: 'B', implementationDate: '2022' },
      { name: 'GRI Standards', status: 'Implemented', score: '82%', implementationDate: '2021' },
      { name: 'TCFD', status: 'Implemented', score: '78%', implementationDate: '2023' },
      { name: 'ISO 14001', status: 'Implemented', score: '81%', implementationDate: '2020' }
    ],
    sbtiTargets: {
      description: 'MegaRetail Chain commits to reduce absolute Scope 1 and 2 GHG emissions by 40% by 2030 from a 2021 baseline and to reduce Scope 3 emissions by 25% by 2030.',
      nearTermTarget: '40% reduction in Scope 1&2 by 2030',
      longTermTarget: 'Net-zero by 2045',
      baselineYear: '2021',
      targetYear: '2030',
      scope1Reduction: 40,
      scope2Reduction: 40,
      scope3Reduction: 25,
      validationStatus: 'Targets Approved',
      submissionDate: '2023-09-14'
    },
    sbtiProgress: 72,
    carbonCredits: 32000,
    materialityScore: 7.8,
    supplierDecarbonization: 68,
    pathwayData: generatePathwayData(480000, 0.06)
  }
];

export const getCompanyById = (id: string): Company | undefined => {
  return enhancedCompanies.find(company => company.id === id);
};

export const getCompaniesBySector = (sector: string): Company[] => {
  return enhancedCompanies.filter(company => company.sector === sector);
};

export const getAllSectors = (): string[] => {
  return Array.from(new Set(enhancedCompanies.map(company => company.sector)));
};
