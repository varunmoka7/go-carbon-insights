
export const companies = [
  {
    id: 'techcorp',
    name: 'TechCorp Solutions',
    industry: 'Technology',
    sector: 'Information Technology',
    description: 'Leading software development company',
    carbon_footprint: 85000,
    energy_consumption: 45000,
    waste_generated: 1200,
    renewable_energy_percentage: 75,
    top_carbon_footprints: ['Data Centers', 'Office Buildings', 'Employee Commuting']
  },
  {
    id: 'greenmanu',
    name: 'GreenManufacturing Inc',
    industry: 'Manufacturing',
    sector: 'Industrial',
    description: 'Sustainable manufacturing solutions',
    carbon_footprint: 320000,
    energy_consumption: 180000,
    waste_generated: 8500,
    renewable_energy_percentage: 45,
    top_carbon_footprints: ['Production Facilities', 'Raw Materials', 'Transportation']
  },
  {
    id: 'oceanlog',
    name: 'Ocean Logistics',
    industry: 'Transportation',
    sector: 'Logistics',
    description: 'Global shipping and logistics',
    carbon_footprint: 450000,
    energy_consumption: 220000,
    waste_generated: 3200,
    renewable_energy_percentage: 25,
    top_carbon_footprints: ['Fleet Operations', 'Fuel Consumption', 'Warehouses']
  },
  {
    id: 'energyplus',
    name: 'EnergyPlus Corp',
    industry: 'Energy',
    sector: 'Utilities',
    description: 'Renewable energy provider',
    carbon_footprint: 150000,
    energy_consumption: 95000,
    waste_generated: 2100,
    renewable_energy_percentage: 85,
    top_carbon_footprints: ['Grid Operations', 'Maintenance', 'Infrastructure']
  },
  {
    id: 'retailchain',
    name: 'RetailChain Global',
    industry: 'Retail',
    sector: 'Consumer Goods',
    description: 'International retail chain',
    carbon_footprint: 280000,
    energy_consumption: 140000,
    waste_generated: 12000,
    renewable_energy_percentage: 55,
    top_carbon_footprints: ['Store Operations', 'Supply Chain', 'Packaging']
  },
  {
    id: 'agrifarm',
    name: 'AgriFarm Enterprises',
    industry: 'Agriculture',
    sector: 'Agriculture',
    description: 'Sustainable farming operations',
    carbon_footprint: 195000,
    energy_consumption: 85000,
    waste_generated: 15000,
    renewable_energy_percentage: 40,
    top_carbon_footprints: ['Livestock', 'Fertilizers', 'Machinery']
  },
  {
    id: 'pharmalife',
    name: 'PharmaLife Sciences',
    industry: 'Pharmaceuticals',
    sector: 'Healthcare',
    description: 'Pharmaceutical research and development',
    carbon_footprint: 125000,
    energy_consumption: 65000,
    waste_generated: 2800,
    renewable_energy_percentage: 60,
    top_carbon_footprints: ['R&D Facilities', 'Manufacturing', 'Cold Chain']
  },
  {
    id: 'buildtech',
    name: 'BuildTech Construction',
    industry: 'Construction',
    sector: 'Real Estate',
    description: 'Commercial construction company',
    carbon_footprint: 380000,
    energy_consumption: 165000,
    waste_generated: 25000,
    renewable_energy_percentage: 30,
    top_carbon_footprints: ['Construction Materials', 'Heavy Machinery', 'Transportation']
  },
  {
    id: 'financeplus',
    name: 'FinancePlus Bank',
    industry: 'Financial Services',
    sector: 'Banking',
    description: 'Digital banking solutions',
    carbon_footprint: 95000,
    energy_consumption: 52000,
    waste_generated: 800,
    renewable_energy_percentage: 70,
    top_carbon_footprints: ['Data Centers', 'Branch Operations', 'Business Travel']
  },
  {
    id: 'foodglobal',
    name: 'FoodGlobal Corp',
    industry: 'Food & Beverages',
    sector: 'Consumer Goods',
    description: 'Food processing and distribution',
    carbon_footprint: 245000,
    energy_consumption: 115000,
    waste_generated: 18000,
    renewable_energy_percentage: 35,
    top_carbon_footprints: ['Processing Plants', 'Cold Storage', 'Packaging']
  }
];

export const emissionsData = [
  // TechCorp Solutions
  { company_id: 'techcorp', year: 2019, scope1: 15000, scope2: 25000, scope3: 45000 },
  { company_id: 'techcorp', year: 2020, scope1: 14500, scope2: 24000, scope3: 44000 },
  { company_id: 'techcorp', year: 2021, scope1: 14000, scope2: 23000, scope3: 43000 },
  { company_id: 'techcorp', year: 2022, scope1: 13500, scope2: 22000, scope3: 42000 },
  { company_id: 'techcorp', year: 2023, scope1: 13000, scope2: 21000, scope3: 41000 },
  { company_id: 'techcorp', year: 2024, scope1: 12500, scope2: 20000, scope3: 40000 },
  
  // GreenManufacturing Inc
  { company_id: 'greenmanu', year: 2019, scope1: 85000, scope2: 95000, scope3: 140000 },
  { company_id: 'greenmanu', year: 2020, scope1: 82000, scope2: 92000, scope3: 135000 },
  { company_id: 'greenmanu', year: 2021, scope1: 79000, scope2: 89000, scope3: 130000 },
  { company_id: 'greenmanu', year: 2022, scope1: 76000, scope2: 86000, scope3: 125000 },
  { company_id: 'greenmanu', year: 2023, scope1: 73000, scope2: 83000, scope3: 120000 },
  { company_id: 'greenmanu', year: 2024, scope1: 70000, scope2: 80000, scope3: 115000 },
  
  // Ocean Logistics
  { company_id: 'oceanlog', year: 2019, scope1: 180000, scope2: 85000, scope3: 185000 },
  { company_id: 'oceanlog', year: 2020, scope1: 175000, scope2: 82000, scope3: 180000 },
  { company_id: 'oceanlog', year: 2021, scope1: 170000, scope2: 79000, scope3: 175000 },
  { company_id: 'oceanlog', year: 2022, scope1: 165000, scope2: 76000, scope3: 170000 },
  { company_id: 'oceanlog', year: 2023, scope1: 160000, scope2: 73000, scope3: 165000 },
  { company_id: 'oceanlog', year: 2024, scope1: 155000, scope2: 70000, scope3: 160000 },
  
  // Continue for remaining companies...
  { company_id: 'energyplus', year: 2019, scope1: 45000, scope2: 35000, scope3: 70000 },
  { company_id: 'energyplus', year: 2024, scope1: 40000, scope2: 30000, scope3: 65000 },
  
  { company_id: 'retailchain', year: 2019, scope1: 65000, scope2: 75000, scope3: 140000 },
  { company_id: 'retailchain', year: 2024, scope1: 58000, scope2: 68000, scope3: 125000 },
  
  { company_id: 'agrifarm', year: 2019, scope1: 85000, scope2: 45000, scope3: 65000 },
  { company_id: 'agrifarm', year: 2024, scope1: 80000, scope2: 40000, scope3: 60000 },
  
  { company_id: 'pharmalife', year: 2019, scope1: 35000, scope2: 40000, scope3: 50000 },
  { company_id: 'pharmalife', year: 2024, scope1: 32000, scope2: 36000, scope3: 45000 },
  
  { company_id: 'buildtech', year: 2019, scope1: 145000, scope2: 85000, scope3: 150000 },
  { company_id: 'buildtech', year: 2024, scope1: 135000, scope2: 78000, scope3: 140000 },
  
  { company_id: 'financeplus', year: 2019, scope1: 25000, scope2: 35000, scope3: 35000 },
  { company_id: 'financeplus', year: 2024, scope1: 22000, scope2: 31000, scope3: 32000 },
  
  { company_id: 'foodglobal', year: 2019, scope1: 75000, scope2: 65000, scope3: 105000 },
  { company_id: 'foodglobal', year: 2024, scope1: 68000, scope2: 58000, scope3: 95000 }
];

export const sbtiTargets = [
  {
    company_id: 'techcorp',
    description: 'Commit to reduce absolute scope 1 and 2 GHG emissions by 50% by 2030 and scope 3 emissions by 25% by 2030',
    near_term_target: '50% reduction by 2030',
    long_term_target: 'Net-zero by 2050',
    baseline_year: 2019,
    target_year: 2030,
    near_term_2030_scope1_2: 50,
    near_term_2030_scope3: 25,
    current_progress_scope1_2: 65,
    current_progress_scope3: 35,
    progress_percentage: 75,
    status: 'Targets Approved'
  },
  {
    company_id: 'greenmanu',
    description: 'Reduce scope 1 and 2 emissions by 42% and scope 3 emissions by 25% by 2030',
    near_term_target: '42% reduction by 2030',
    long_term_target: 'Net-zero by 2050',
    baseline_year: 2019,
    target_year: 2030,
    near_term_2030_scope1_2: 42,
    near_term_2030_scope3: 25,
    current_progress_scope1_2: 55,
    current_progress_scope3: 28,
    progress_percentage: 68,
    status: 'Targets Approved'
  },
  {
    company_id: 'oceanlog',
    description: 'Reduce absolute scope 1 and 2 emissions by 46% and scope 3 emissions by 28% by 2030',
    near_term_target: '46% reduction by 2030',
    long_term_target: 'Net-zero by 2050',
    baseline_year: 2019,
    target_year: 2030,
    near_term_2030_scope1_2: 46,
    near_term_2030_scope3: 28,
    current_progress_scope1_2: 42,
    current_progress_scope3: 22,
    progress_percentage: 55,
    status: 'Under Review'
  }
];

export const carbonStrategies = [
  {
    company_id: 'techcorp',
    strategy_type: 'Energy Efficiency',
    description: 'Upgrade to energy-efficient data centers and equipment',
    expected_reduction: 15000,
    implementation_year: 2025,
    status: 'in_progress'
  },
  {
    company_id: 'techcorp',
    strategy_type: 'Renewable Energy',
    description: 'Install solar panels on all office buildings',
    expected_reduction: 8000,
    implementation_year: 2024,
    status: 'completed'
  },
  {
    company_id: 'greenmanu',
    strategy_type: 'Process Optimization',
    description: 'Implement lean manufacturing processes',
    expected_reduction: 25000,
    implementation_year: 2025,
    status: 'planned'
  }
];

export const frameworksCompliance = [
  {
    company_id: 'techcorp',
    framework_name: 'GRI Standards',
    status: 'Compliant',
    description: 'Full compliance with GRI 305 emissions reporting',
    last_updated: '2024-01-15'
  },
  {
    company_id: 'techcorp',
    framework_name: 'TCFD',
    status: 'Partial',
    description: 'Climate risk disclosure in progress',
    last_updated: '2024-02-20'
  },
  {
    company_id: 'greenmanu',
    framework_name: 'CDP',
    status: 'Compliant',
    description: 'A- rating in climate disclosure',
    last_updated: '2024-01-30'
  }
];
