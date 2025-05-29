
export interface FrameworkStatus {
  SBTI: boolean;
  CSRD: boolean;
  CDP: boolean;
  UNGC: boolean;
  SDG: boolean;
}

export interface CompanyDetails {
  id: string;
  name: string;
  industry: string;
  sector: string;
  description: string;
  topCarbonFootprints: string[];
  frameworks: FrameworkStatus;
  sbtiTargets?: {
    description: string;
    nearTermTarget: string;
    longTermTarget: string;
    baselineYear: number;
    targetYear: number;
  };
  carbonFootprint: number;
  totalEmissions: number;
  energyConsumption: number;
  wasteGenerated: number;
  renewableEnergyPercentage: number;
  reportingYear: number;
  emissionsData: Array<{
    year: number;
    scope1: number;
    scope2: number;
    scope3: number;
    renewablePercentage?: number;
  }>;
  // New fields for carbon strategy
  carbonCredits?: number;
  materialityScore?: number;
  supplierDecarbonization?: number;
  sbtiProgress?: number;
}

export const enhancedCompanies: CompanyDetails[] = [
  {
    id: 'techcorp',
    name: 'TechCorp Industries',
    industry: 'Technology',
    sector: 'Software & IT Services',
    description: 'Leading cloud computing and software solutions provider with global data centers and operations spanning 40+ countries. Committed to sustainable technology infrastructure and carbon-neutral cloud services.',
    topCarbonFootprints: ['Data center operations', 'Employee business travel', 'Cloud infrastructure'],
    frameworks: {
      SBTI: true,
      CSRD: true,
      CDP: true,
      UNGC: true,
      SDG: false
    },
    sbtiTargets: {
      description: 'Committed to reducing absolute Scope 1 and 2 GHG emissions by 50% by 2030 from a 2019 base year and achieving net-zero emissions by 2050.',
      nearTermTarget: '50% reduction in Scope 1 & 2 emissions by 2030',
      longTermTarget: 'Net-zero emissions by 2050',
      baselineYear: 2019,
      targetYear: 2030
    },
    carbonFootprint: 125000,
    totalEmissions: 125000,
    energyConsumption: 85000,
    wasteGenerated: 1200,
    renewableEnergyPercentage: 68.5,
    reportingYear: 2024,
    carbonCredits: 15000,
    materialityScore: 8.5,
    supplierDecarbonization: 72,
    sbtiProgress: 84,
    emissionsData: [
      { year: 2019, scope1: 15000, scope2: 45000, scope3: 80000, renewablePercentage: 45.0 },
      { year: 2020, scope1: 14200, scope2: 42000, scope3: 78000, renewablePercentage: 49.5 },
      { year: 2021, scope1: 13500, scope2: 40000, scope3: 75000, renewablePercentage: 54.0 },
      { year: 2022, scope1: 12800, scope2: 38000, scope3: 72000, renewablePercentage: 58.5 },
      { year: 2023, scope1: 12000, scope2: 35000, scope3: 68000, renewablePercentage: 63.0 },
      { year: 2024, scope1: 11500, scope2: 33500, scope3: 65000, renewablePercentage: 68.5 }
    ]
  },
  {
    id: 'greenmanufacturing',
    name: 'Green Manufacturing Co.',
    industry: 'Manufacturing',
    sector: 'Industrial Equipment',
    description: 'Sustainable manufacturing company specializing in eco-friendly industrial equipment with renewable energy integration. Pioneer in circular economy practices and zero-waste manufacturing processes.',
    topCarbonFootprints: ['Manufacturing processes', 'Raw material production', 'Product transportation'],
    frameworks: {
      SBTI: true,
      CSRD: false,
      CDP: true,
      UNGC: true,
      SDG: true
    },
    sbtiTargets: {
      description: 'Committed to reducing absolute Scope 1 and 2 GHG emissions by 42% by 2030 from a 2020 base year.',
      nearTermTarget: '42% reduction in Scope 1 & 2 emissions by 2030',
      longTermTarget: 'Net-zero emissions by 2045',
      baselineYear: 2020,
      targetYear: 2030
    },
    carbonFootprint: 89000,
    totalEmissions: 89000,
    energyConsumption: 65000,
    wasteGenerated: 850,
    renewableEnergyPercentage: 72.3,
    reportingYear: 2024,
    carbonCredits: 12500,
    materialityScore: 9.2,
    supplierDecarbonization: 85,
    sbtiProgress: 78,
    emissionsData: [
      { year: 2019, scope1: 25000, scope2: 18000, scope3: 52000, renewablePercentage: 52.0 },
      { year: 2020, scope1: 24000, scope2: 17500, scope3: 50000, renewablePercentage: 56.5 },
      { year: 2021, scope1: 22800, scope2: 16800, scope3: 48000, renewablePercentage: 61.0 },
      { year: 2022, scope1: 21500, scope2: 16000, scope3: 45000, renewablePercentage: 65.5 },
      { year: 2023, scope1: 20200, scope2: 15200, scope3: 42000, renewablePercentage: 69.0 },
      { year: 2024, scope1: 19000, scope2: 14500, scope3: 40000, renewablePercentage: 72.3 }
    ]
  },
  {
    id: 'retailgiant',
    name: 'Retail Giant',
    industry: 'Retail',
    sector: 'Consumer Goods',
    description: 'Global retail chain with 2000+ stores worldwide, focusing on sustainable supply chain and renewable energy adoption. Leading initiatives in sustainable packaging and circular retail models.',
    topCarbonFootprints: ['Supply chain logistics', 'Store operations', 'Product manufacturing'],
    frameworks: {
      SBTI: false,
      CSRD: true,
      CDP: true,
      UNGC: false,
      SDG: true
    },
    carbonFootprint: 156000,
    totalEmissions: 156000,
    energyConsumption: 95000,
    wasteGenerated: 2100,
    renewableEnergyPercentage: 58.2,
    reportingYear: 2024,
    carbonCredits: 8200,
    materialityScore: 7.8,
    supplierDecarbonization: 65,
    sbtiProgress: 62,
    emissionsData: [
      { year: 2019, scope1: 12000, scope2: 35000, scope3: 120000, renewablePercentage: 38.0 },
      { year: 2020, scope1: 11800, scope2: 34000, scope3: 118000, renewablePercentage: 42.0 },
      { year: 2021, scope1: 11500, scope2: 33000, scope3: 115000, renewablePercentage: 46.0 },
      { year: 2022, scope1: 11200, scope2: 32000, scope3: 112000, renewablePercentage: 50.5 },
      { year: 2023, scope1: 11000, scope2: 31000, scope3: 110000, renewablePercentage: 54.2 },
      { year: 2024, scope1: 10800, scope2: 30000, scope3: 108000, renewablePercentage: 58.2 }
    ]
  },
  // Additional 17 companies from 7 different sectors
  {
    id: 'innovatech',
    name: 'InnovaTech Solutions',
    industry: 'Technology',
    sector: 'Software Development',
    description: 'AI and machine learning solutions provider focused on sustainable technology.',
    topCarbonFootprints: ['Data processing', 'Office operations', 'Employee commuting'],
    frameworks: { SBTI: true, CSRD: true, CDP: false, UNGC: true, SDG: true },
    carbonFootprint: 45000,
    totalEmissions: 45000,
    energyConsumption: 32000,
    wasteGenerated: 280,
    renewableEnergyPercentage: 85.2,
    reportingYear: 2024,
    carbonCredits: 5500,
    materialityScore: 8.8,
    supplierDecarbonization: 78,
    sbtiProgress: 89,
    emissionsData: [{ year: 2024, scope1: 5000, scope2: 15000, scope3: 25000, renewablePercentage: 85.2 }]
  },
  {
    id: 'cloudtech',
    name: 'CloudTech Enterprises',
    industry: 'Technology',
    sector: 'Cloud Services',
    description: 'Enterprise cloud infrastructure and services provider.',
    topCarbonFootprints: ['Server operations', 'Cooling systems', 'Network infrastructure'],
    frameworks: { SBTI: true, CSRD: false, CDP: true, UNGC: false, SDG: true },
    carbonFootprint: 98000,
    totalEmissions: 98000,
    energyConsumption: 78000,
    wasteGenerated: 450,
    renewableEnergyPercentage: 75.5,
    reportingYear: 2024,
    carbonCredits: 11200,
    materialityScore: 8.2,
    supplierDecarbonization: 82,
    sbtiProgress: 76,
    emissionsData: [{ year: 2024, scope1: 12000, scope2: 28000, scope3: 58000, renewablePercentage: 75.5 }]
  },
  {
    id: 'steelworks',
    name: 'Advanced Steel Works',
    industry: 'Manufacturing',
    sector: 'Steel Production',
    description: 'Modern steel manufacturing with focus on green steel technologies.',
    topCarbonFootprints: ['Steel production', 'Energy consumption', 'Raw materials'],
    frameworks: { SBTI: true, CSRD: true, CDP: true, UNGC: true, SDG: false },
    carbonFootprint: 445000,
    totalEmissions: 445000,
    energyConsumption: 320000,
    wasteGenerated: 8500,
    renewableEnergyPercentage: 35.8,
    reportingYear: 2024,
    carbonCredits: 28000,
    materialityScore: 9.5,
    supplierDecarbonization: 55,
    sbtiProgress: 45,
    emissionsData: [{ year: 2024, scope1: 180000, scope2: 85000, scope3: 180000, renewablePercentage: 35.8 }]
  },
  {
    id: 'autoparts',
    name: 'EcoParts Manufacturing',
    industry: 'Manufacturing',
    sector: 'Automotive Parts',
    description: 'Sustainable automotive parts manufacturer for electric vehicles.',
    topCarbonFootprints: ['Component manufacturing', 'Transportation', 'Assembly operations'],
    frameworks: { SBTI: false, CSRD: true, CDP: true, UNGC: true, SDG: true },
    carbonFootprint: 125000,
    totalEmissions: 125000,
    energyConsumption: 95000,
    wasteGenerated: 1850,
    renewableEnergyPercentage: 62.4,
    reportingYear: 2024,
    carbonCredits: 9800,
    materialityScore: 8.1,
    supplierDecarbonization: 68,
    sbtiProgress: 72,
    emissionsData: [{ year: 2024, scope1: 35000, scope2: 28000, scope3: 62000, renewablePercentage: 62.4 }]
  },
  {
    id: 'energycorp',
    name: 'GreenPower Energy Corp',
    industry: 'Energy',
    sector: 'Renewable Energy',
    description: 'Leading renewable energy provider with wind and solar operations.',
    topCarbonFootprints: ['Equipment manufacturing', 'Maintenance operations', 'Grid connections'],
    frameworks: { SBTI: true, CSRD: true, CDP: true, UNGC: true, SDG: true },
    carbonFootprint: 78000,
    totalEmissions: 78000,
    energyConsumption: 25000,
    wasteGenerated: 420,
    renewableEnergyPercentage: 98.5,
    reportingYear: 2024,
    carbonCredits: 45000,
    materialityScore: 9.8,
    supplierDecarbonization: 92,
    sbtiProgress: 95,
    emissionsData: [{ year: 2024, scope1: 8000, scope2: 2000, scope3: 68000, renewablePercentage: 98.5 }]
  },
  {
    id: 'oilrefinery',
    name: 'Legacy Oil Refinery',
    industry: 'Energy',
    sector: 'Oil & Gas',
    description: 'Traditional oil refinery transitioning to cleaner operations.',
    topCarbonFootprints: ['Refining processes', 'Flaring operations', 'Transportation'],
    frameworks: { SBTI: false, CSRD: true, CDP: true, UNGC: false, SDG: false },
    carbonFootprint: 890000,
    totalEmissions: 890000,
    energyConsumption: 520000,
    wasteGenerated: 12000,
    renewableEnergyPercentage: 15.2,
    reportingYear: 2024,
    carbonCredits: 15000,
    materialityScore: 6.5,
    supplierDecarbonization: 35,
    sbtiProgress: 25,
    emissionsData: [{ year: 2024, scope1: 420000, scope2: 180000, scope3: 290000, renewablePercentage: 15.2 }]
  },
  {
    id: 'healthsystem',
    name: 'Metropolitan Health System',
    industry: 'Healthcare',
    sector: 'Hospital Networks',
    description: 'Large healthcare network with sustainable medical practices.',
    topCarbonFootprints: ['Facility operations', 'Medical equipment', 'Transportation'],
    frameworks: { SBTI: true, CSRD: false, CDP: true, UNGC: true, SDG: true },
    carbonFootprint: 145000,
    totalEmissions: 145000,
    energyConsumption: 115000,
    wasteGenerated: 2800,
    renewableEnergyPercentage: 48.7,
    reportingYear: 2024,
    carbonCredits: 8500,
    materialityScore: 7.9,
    supplierDecarbonization: 58,
    sbtiProgress: 65,
    emissionsData: [{ year: 2024, scope1: 25000, scope2: 45000, scope3: 75000, renewablePercentage: 48.7 }]
  },
  {
    id: 'pharmatech',
    name: 'BioTech Pharmaceuticals',
    industry: 'Healthcare',
    sector: 'Pharmaceuticals',
    description: 'Biotechnology company developing sustainable pharmaceutical solutions.',
    topCarbonFootprints: ['Research facilities', 'Manufacturing', 'Cold chain logistics'],
    frameworks: { SBTI: true, CSRD: true, CDP: true, UNGC: true, SDG: true },
    carbonFootprint: 185000,
    totalEmissions: 185000,
    energyConsumption: 125000,
    wasteGenerated: 1950,
    renewableEnergyPercentage: 55.3,
    reportingYear: 2024,
    carbonCredits: 12800,
    materialityScore: 8.6,
    supplierDecarbonization: 74,
    sbtiProgress: 81,
    emissionsData: [{ year: 2024, scope1: 45000, scope2: 55000, scope3: 85000, renewablePercentage: 55.3 }]
  },
  {
    id: 'financialbank',
    name: 'Sustainable Finance Bank',
    industry: 'Financial Services',
    sector: 'Banking',
    description: 'Green banking institution focused on sustainable finance.',
    topCarbonFootprints: ['Office operations', 'Data centers', 'Business travel'],
    frameworks: { SBTI: true, CSRD: true, CDP: true, UNGC: true, SDG: true },
    carbonFootprint: 35000,
    totalEmissions: 35000,
    energyConsumption: 28000,
    wasteGenerated: 180,
    renewableEnergyPercentage: 88.4,
    reportingYear: 2024,
    carbonCredits: 4200,
    materialityScore: 8.9,
    supplierDecarbonization: 85,
    sbtiProgress: 92,
    emissionsData: [{ year: 2024, scope1: 3000, scope2: 12000, scope3: 20000, renewablePercentage: 88.4 }]
  },
  {
    id: 'insurancecorp',
    name: 'EcoInsurance Corporation',
    industry: 'Financial Services',
    sector: 'Insurance',
    description: 'Insurance company specializing in climate risk assessment.',
    topCarbonFootprints: ['Office buildings', 'IT infrastructure', 'Claims processing'],
    frameworks: { SBTI: false, CSRD: true, CDP: true, UNGC: false, SDG: true },
    carbonFootprint: 42000,
    totalEmissions: 42000,
    energyConsumption: 35000,
    wasteGenerated: 220,
    renewableEnergyPercentage: 72.1,
    reportingYear: 2024,
    carbonCredits: 3800,
    materialityScore: 7.6,
    supplierDecarbonization: 68,
    sbtiProgress: 74,
    emissionsData: [{ year: 2024, scope1: 4000, scope2: 15000, scope3: 23000, renewablePercentage: 72.1 }]
  },
  {
    id: 'logistics',
    name: 'GreenLogistics Express',
    industry: 'Transportation',
    sector: 'Logistics & Shipping',
    description: 'Sustainable logistics company with electric vehicle fleet.',
    topCarbonFootprints: ['Vehicle fleet', 'Warehouse operations', 'Packaging'],
    frameworks: { SBTI: true, CSRD: false, CDP: true, UNGC: true, SDG: false },
    carbonFootprint: 285000,
    totalEmissions: 285000,
    energyConsumption: 185000,
    wasteGenerated: 3200,
    renewableEnergyPercentage: 42.8,
    reportingYear: 2024,
    carbonCredits: 18500,
    materialityScore: 8.3,
    supplierDecarbonization: 61,
    sbtiProgress: 69,
    emissionsData: [{ year: 2024, scope1: 125000, scope2: 45000, scope3: 115000, renewablePercentage: 42.8 }]
  },
  {
    id: 'airline',
    name: 'SkyGreen Airlines',
    industry: 'Transportation',
    sector: 'Aviation',
    description: 'Commercial airline investing in sustainable aviation fuels.',
    topCarbonFootprints: ['Aircraft operations', 'Ground operations', 'Maintenance'],
    frameworks: { SBTI: true, CSRD: true, CDP: true, UNGC: false, SDG: true },
    carbonFootprint: 1250000,
    totalEmissions: 1250000,
    energyConsumption: 890000,
    wasteGenerated: 4500,
    renewableEnergyPercentage: 12.5,
    reportingYear: 2024,
    carbonCredits: 85000,
    materialityScore: 7.2,
    supplierDecarbonization: 45,
    sbtiProgress: 38,
    emissionsData: [{ year: 2024, scope1: 980000, scope2: 85000, scope3: 185000, renewablePercentage: 12.5 }]
  },
  {
    id: 'foodprocessor',
    name: 'Organic Food Processors',
    industry: 'Food & Agriculture',
    sector: 'Food Processing',
    description: 'Organic food processing company with regenerative agriculture focus.',
    topCarbonFootprints: ['Processing facilities', 'Refrigeration', 'Transportation'],
    frameworks: { SBTI: false, CSRD: true, CDP: false, UNGC: true, SDG: true },
    carbonFootprint: 165000,
    totalEmissions: 165000,
    energyConsumption: 125000,
    wasteGenerated: 2850,
    renewableEnergyPercentage: 58.9,
    reportingYear: 2024,
    carbonCredits: 9200,
    materialityScore: 8.4,
    supplierDecarbonization: 71,
    sbtiProgress: 66,
    emissionsData: [{ year: 2024, scope1: 35000, scope2: 48000, scope3: 82000, renewablePercentage: 58.9 }]
  },
  {
    id: 'agritech',
    name: 'Precision AgriTech',
    industry: 'Food & Agriculture',
    sector: 'Agricultural Technology',
    description: 'Technology company developing precision farming solutions.',
    topCarbonFootprints: ['Equipment manufacturing', 'Field operations', 'Research facilities'],
    frameworks: { SBTI: true, CSRD: false, CDP: true, UNGC: true, SDG: true },
    carbonFootprint: 78000,
    totalEmissions: 78000,
    energyConsumption: 55000,
    wasteGenerated: 680,
    renewableEnergyPercentage: 67.3,
    reportingYear: 2024,
    carbonCredits: 6800,
    materialityScore: 8.7,
    supplierDecarbonization: 79,
    sbtiProgress: 83,
    emissionsData: [{ year: 2024, scope1: 15000, scope2: 22000, scope3: 41000, renewablePercentage: 67.3 }]
  },
  {
    id: 'chemicals',
    name: 'GreenChem Industries',
    industry: 'Chemicals',
    sector: 'Specialty Chemicals',
    description: 'Chemical manufacturer focused on green chemistry innovations.',
    topCarbonFootprints: ['Chemical processes', 'Steam generation', 'Raw materials'],
    frameworks: { SBTI: true, CSRD: true, CDP: true, UNGC: true, SDG: false },
    carbonFootprint: 335000,
    totalEmissions: 335000,
    energyConsumption: 245000,
    wasteGenerated: 5200,
    renewableEnergyPercentage: 38.7,
    reportingYear: 2024,
    carbonCredits: 22500,
    materialityScore: 9.1,
    supplierDecarbonization: 62,
    sbtiProgress: 57,
    emissionsData: [{ year: 2024, scope1: 145000, scope2: 68000, scope3: 122000, renewablePercentage: 38.7 }]
  },
  {
    id: 'materials',
    name: 'Advanced Materials Corp',
    industry: 'Materials',
    sector: 'Advanced Materials',
    description: 'Innovative materials company developing sustainable alternatives.',
    topCarbonFootprints: ['Material synthesis', 'Testing facilities', 'Supply chain'],
    frameworks: { SBTI: false, CSRD: true, CDP: true, UNGC: false, SDG: true },
    carbonFootprint: 145000,
    totalEmissions: 145000,
    energyConsumption: 115000,
    wasteGenerated: 1850,
    renewableEnergyPercentage: 52.6,
    reportingYear: 2024,
    carbonCredits: 11500,
    materialityScore: 8.0,
    supplierDecarbonization: 65,
    sbtiProgress: 71,
    emissionsData: [{ year: 2024, scope1: 45000, scope2: 38000, scope3: 62000, renewablePercentage: 52.6 }]
  },
  {
    id: 'textiles',
    name: 'Sustainable Textiles Ltd',
    industry: 'Consumer Goods',
    sector: 'Textiles & Apparel',
    description: 'Textile manufacturer using organic and recycled materials.',
    topCarbonFootprints: ['Fabric production', 'Dyeing processes', 'Transportation'],
    frameworks: { SBTI: true, CSRD: false, CDP: false, UNGC: true, SDG: true },
    carbonFootprint: 95000,
    totalEmissions: 95000,
    energyConsumption: 78000,
    wasteGenerated: 1450,
    renewableEnergyPercentage: 61.8,
    reportingYear: 2024,
    carbonCredits: 7200,
    materialityScore: 7.8,
    supplierDecarbonization: 69,
    sbtiProgress: 75,
    emissionsData: [{ year: 2024, scope1: 22000, scope2: 28000, scope3: 45000, renewablePercentage: 61.8 }]
  },
  {
    id: 'electronics',
    name: 'EcoElectronics Manufacturing',
    industry: 'Consumer Goods',
    sector: 'Electronics',
    description: 'Electronics manufacturer focused on circular economy principles.',
    topCarbonFootprints: ['Component assembly', 'Testing operations', 'Packaging'],
    frameworks: { SBTI: true, CSRD: true, CDP: true, UNGC: false, SDG: true },
    carbonFootprint: 185000,
    totalEmissions: 185000,
    energyConsumption: 145000,
    wasteGenerated: 2250,
    renewableEnergyPercentage: 64.2,
    reportingYear: 2024,
    carbonCredits: 13800,
    materialityScore: 8.5,
    supplierDecarbonization: 73,
    sbtiProgress: 79,
    emissionsData: [{ year: 2024, scope1: 42000, scope2: 58000, scope3: 85000, renewablePercentage: 64.2 }]
  }
];

export const getCompanyById = (id: string): CompanyDetails | undefined => {
  return enhancedCompanies.find(company => company.id === id);
};

export const getAllCompanies = (): CompanyDetails[] => {
  return enhancedCompanies;
};

export const getCompaniesBySector = (sector: string): CompanyDetails[] => {
  return enhancedCompanies.filter(company => company.sector === sector);
};
