
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
    emissionsData: [
      { year: 2019, scope1: 12000, scope2: 35000, scope3: 120000, renewablePercentage: 38.0 },
      { year: 2020, scope1: 11800, scope2: 34000, scope3: 118000, renewablePercentage: 42.0 },
      { year: 2021, scope1: 11500, scope2: 33000, scope3: 115000, renewablePercentage: 46.0 },
      { year: 2022, scope1: 11200, scope2: 32000, scope3: 112000, renewablePercentage: 50.5 },
      { year: 2023, scope1: 11000, scope2: 31000, scope3: 110000, renewablePercentage: 54.2 },
      { year: 2024, scope1: 10800, scope2: 30000, scope3: 108000, renewablePercentage: 58.2 }
    ]
  }
];

export const getCompanyById = (id: string): CompanyDetails | undefined => {
  return enhancedCompanies.find(company => company.id === id);
};

export const getAllCompanies = (): CompanyDetails[] => {
  return enhancedCompanies;
};
