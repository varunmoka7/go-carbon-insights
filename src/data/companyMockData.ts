
export interface EmissionDataPoint {
  year: number;
  scope1: number;
  scope2: number;
  scope3: number;
}

export interface Company {
  id: string;
  name: string;
  sector: string;
  industry: string;
  description: string;
  headquarters: string;
  employees: number;
  revenue: number;
  renewable_energy_percentage: number;
  emissionsData: EmissionDataPoint[];
}

export const companies: Company[] = [
  {
    id: 'apple',
    name: 'Apple Inc.',
    sector: 'Technology',
    industry: 'Technology',
    description: 'Technology company focused on consumer electronics and services',
    headquarters: 'Cupertino, California, USA',
    employees: 164000,
    revenue: 394.3,
    renewable_energy_percentage: 95,
    emissionsData: [
      { year: 2019, scope1: 2200, scope2: 4300, scope3: 15500 },
      { year: 2020, scope1: 2100, scope2: 4100, scope3: 14800 },
      { year: 2021, scope1: 2000, scope2: 3900, scope3: 14200 },
      { year: 2022, scope1: 1900, scope2: 3700, scope3: 13600 },
      { year: 2023, scope1: 1800, scope2: 3500, scope3: 13000 },
      { year: 2024, scope1: 1700, scope2: 3300, scope3: 12400 }
    ]
  },
  {
    id: 'microsoft',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    industry: 'Technology',
    description: 'Global technology corporation developing software and cloud services',
    headquarters: 'Redmond, Washington, USA',
    employees: 228000,
    revenue: 230.0,
    renewable_energy_percentage: 75,
    emissionsData: [
      { year: 2019, scope1: 1800, scope2: 3200, scope3: 13000 },
      { year: 2020, scope1: 1700, scope2: 3000, scope3: 12500 },
      { year: 2021, scope1: 1600, scope2: 2800, scope3: 12000 },
      { year: 2022, scope1: 1500, scope2: 2600, scope3: 11500 },
      { year: 2023, scope1: 1400, scope2: 2400, scope3: 11000 },
      { year: 2024, scope1: 1300, scope2: 2200, scope3: 10500 }
    ]
  },
  {
    id: 'google',
    name: 'Alphabet Inc. (Google)',
    sector: 'Technology',
    industry: 'Technology',
    description: 'Multinational technology conglomerate specializing in Internet services',
    headquarters: 'Mountain View, California, USA',
    employees: 190000,
    revenue: 307.4,
    renewable_energy_percentage: 90,
    emissionsData: [
      { year: 2019, scope1: 3500, scope2: 6800, scope3: 24700 },
      { year: 2020, scope1: 3300, scope2: 6400, scope3: 23300 },
      { year: 2021, scope1: 3100, scope2: 6000, scope3: 21900 },
      { year: 2022, scope1: 2900, scope2: 5600, scope3: 20500 },
      { year: 2023, scope1: 2700, scope2: 5200, scope3: 19100 },
      { year: 2024, scope1: 2500, scope2: 4800, scope3: 17700 }
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon.com Inc.',
    sector: 'Technology',
    industry: 'E-commerce',
    description: 'Multinational technology and e-commerce company',
    headquarters: 'Seattle, Washington, USA',
    employees: 1540000,
    revenue: 574.8,
    renewable_energy_percentage: 65,
    emissionsData: [
      { year: 2019, scope1: 8500, scope2: 16500, scope3: 60000 },
      { year: 2020, scope1: 8200, scope2: 16000, scope3: 58000 },
      { year: 2021, scope1: 7800, scope2: 15200, scope3: 55000 },
      { year: 2022, scope1: 7500, scope2: 14800, scope3: 52000 },
      { year: 2023, scope1: 7200, scope2: 14300, scope3: 50000 },
      { year: 2024, scope1: 6900, scope2: 13800, scope3: 48000 }
    ]
  },
  {
    id: 'meta',
    name: 'Meta Platforms Inc.',
    sector: 'Technology',
    industry: 'Technology',
    description: 'Social media and technology company',
    headquarters: 'Menlo Park, California, USA',
    employees: 77000,
    revenue: 134.9,
    renewable_energy_percentage: 78,
    emissionsData: [
      { year: 2019, scope1: 1600, scope2: 3100, scope3: 11300 },
      { year: 2020, scope1: 1550, scope2: 3000, scope3: 10950 },
      { year: 2021, scope1: 1500, scope2: 2900, scope3: 10600 },
      { year: 2022, scope1: 1450, scope2: 2800, scope3: 10250 },
      { year: 2023, scope1: 1400, scope2: 2700, scope3: 9900 },
      { year: 2024, scope1: 1350, scope2: 2600, scope3: 9550 }
    ]
  },
  {
    id: 'samsung',
    name: 'Samsung Electronics',
    sector: 'Technology',
    industry: 'Technology',
    description: 'South Korean multinational electronics corporation',
    headquarters: 'Suwon, South Korea',
    employees: 267000,
    revenue: 244.2,
    renewable_energy_percentage: 55,
    emissionsData: [
      { year: 2019, scope1: 4800, scope2: 9200, scope3: 34000 },
      { year: 2020, scope1: 4600, scope2: 8800, scope3: 32600 },
      { year: 2021, scope1: 4400, scope2: 8400, scope3: 31200 },
      { year: 2022, scope1: 4200, scope2: 8000, scope3: 29800 },
      { year: 2023, scope1: 4000, scope2: 7600, scope3: 28400 },
      { year: 2024, scope1: 3800, scope2: 7200, scope3: 27000 }
    ]
  },
  {
    id: 'tesla',
    name: 'Tesla Inc.',
    sector: 'Automotive',
    industry: 'Automotive',
    description: 'Electric vehicle and clean energy company',
    headquarters: 'Austin, Texas, USA',
    employees: 140000,
    revenue: 96.8,
    renewable_energy_percentage: 85,
    emissionsData: [
      { year: 2019, scope1: 800, scope2: 1500, scope3: 6200 },
      { year: 2020, scope1: 850, scope2: 1600, scope3: 6800 },
      { year: 2021, scope1: 900, scope2: 1700, scope3: 7200 },
      { year: 2022, scope1: 950, scope2: 1800, scope3: 7500 },
      { year: 2023, scope1: 1000, scope2: 1900, scope3: 7800 },
      { year: 2024, scope1: 1050, scope2: 2000, scope3: 8100 }
    ]
  },
  {
    id: 'toyota',
    name: 'Toyota Motor Corporation',
    sector: 'Automotive',
    industry: 'Automotive',
    description: 'Japanese multinational automotive manufacturer',
    headquarters: 'Toyota City, Japan',
    employees: 375000,
    revenue: 274.5,
    renewable_energy_percentage: 45,
    emissionsData: [
      { year: 2019, scope1: 4500, scope2: 8500, scope3: 32000 },
      { year: 2020, scope1: 4300, scope2: 8200, scope3: 30500 },
      { year: 2021, scope1: 4100, scope2: 7900, scope3: 29000 },
      { year: 2022, scope1: 3900, scope2: 7600, scope3: 27500 },
      { year: 2023, scope1: 3700, scope2: 7300, scope3: 26000 },
      { year: 2024, scope1: 3500, scope2: 7000, scope3: 24500 }
    ]
  },
  {
    id: 'bmw',
    name: 'BMW Group',
    sector: 'Automotive',
    industry: 'Automotive',
    description: 'German multinational automotive manufacturing company',
    headquarters: 'Munich, Germany',
    employees: 149000,
    revenue: 142.6,
    renewable_energy_percentage: 68,
    emissionsData: [
      { year: 2019, scope1: 6500, scope2: 12500, scope3: 46000 },
      { year: 2020, scope1: 6200, scope2: 11800, scope3: 43000 },
      { year: 2021, scope1: 5900, scope2: 11100, scope3: 40000 },
      { year: 2022, scope1: 5600, scope2: 10400, scope3: 37000 },
      { year: 2023, scope1: 5300, scope2: 9700, scope3: 34000 },
      { year: 2024, scope1: 5000, scope2: 9000, scope3: 31000 }
    ]
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen Group',
    sector: 'Automotive',
    industry: 'Automotive',
    description: 'German multinational automotive manufacturing company',
    headquarters: 'Wolfsburg, Germany',
    employees: 672000,
    revenue: 279.2,
    renewable_energy_percentage: 62,
    emissionsData: [
      { year: 2019, scope1: 8500, scope2: 16300, scope3: 60200 },
      { year: 2020, scope1: 8100, scope2: 15500, scope3: 56400 },
      { year: 2021, scope1: 7700, scope2: 14700, scope3: 52600 },
      { year: 2022, scope1: 7300, scope2: 13900, scope3: 48800 },
      { year: 2023, scope1: 6900, scope2: 13100, scope3: 45000 },
      { year: 2024, scope1: 6500, scope2: 12300, scope3: 41200 }
    ]
  },
  {
    id: 'bp',
    name: 'BP plc',
    sector: 'Energy',
    industry: 'Energy',
    description: 'British multinational oil and gas company',
    headquarters: 'London, United Kingdom',
    employees: 66800,
    revenue: 241.4,
    renewable_energy_percentage: 25,
    emissionsData: [
      { year: 2019, scope1: 210000, scope2: 42000, scope3: 168000 },
      { year: 2020, scope1: 205000, scope2: 41000, scope3: 164000 },
      { year: 2021, scope1: 200000, scope2: 40000, scope3: 160000 },
      { year: 2022, scope1: 195000, scope2: 39000, scope3: 156000 },
      { year: 2023, scope1: 190000, scope2: 38000, scope3: 152000 },
      { year: 2024, scope1: 185000, scope2: 37000, scope3: 148000 }
    ]
  },
  {
    id: 'shell',
    name: 'Shell plc',
    sector: 'Energy',
    industry: 'Energy',
    description: 'British multinational oil and gas company',
    headquarters: 'London, United Kingdom',
    employees: 93000,
    revenue: 386.2,
    renewable_energy_percentage: 18,
    emissionsData: [
      { year: 2019, scope1: 325000, scope2: 65000, scope3: 260000 },
      { year: 2020, scope1: 318000, scope2: 63600, scope3: 254400 },
      { year: 2021, scope1: 311000, scope2: 62200, scope3: 248800 },
      { year: 2022, scope1: 304000, scope2: 60800, scope3: 243200 },
      { year: 2023, scope1: 297000, scope2: 59400, scope3: 237600 },
      { year: 2024, scope1: 290000, scope2: 58000, scope3: 232000 }
    ]
  },
  {
    id: 'exxonmobil',
    name: 'ExxonMobil',
    sector: 'Energy',
    industry: 'Energy',
    description: 'American multinational oil and gas corporation',
    headquarters: 'Irving, Texas, USA',
    employees: 62000,
    revenue: 413.7,
    renewable_energy_percentage: 12,
    emissionsData: [
      { year: 2019, scope1: 280000, scope2: 56000, scope3: 224000 },
      { year: 2020, scope1: 275000, scope2: 55000, scope3: 220000 },
      { year: 2021, scope1: 270000, scope2: 54000, scope3: 216000 },
      { year: 2022, scope1: 265000, scope2: 53000, scope3: 212000 },
      { year: 2023, scope1: 260000, scope2: 52000, scope3: 208000 },
      { year: 2024, scope1: 255000, scope2: 51000, scope3: 204000 }
    ]
  },
  {
    id: 'nike',
    name: 'Nike Inc.',
    sector: 'Consumer',
    industry: 'Consumer Goods',
    description: 'American multinational corporation specializing in footwear and apparel',
    headquarters: 'Beaverton, Oregon, USA',
    employees: 83700,
    revenue: 51.2,
    renewable_energy_percentage: 72,
    emissionsData: [
      { year: 2019, scope1: 1450, scope2: 2800, scope3: 10250 },
      { year: 2020, scope1: 1400, scope2: 2700, scope3: 9900 },
      { year: 2021, scope1: 1350, scope2: 2600, scope3: 9550 },
      { year: 2022, scope1: 1300, scope2: 2500, scope3: 9200 },
      { year: 2023, scope1: 1250, scope2: 2400, scope3: 8850 },
      { year: 2024, scope1: 1250, scope2: 2400, scope3: 8850 }
    ]
  },
  {
    id: 'unilever',
    name: 'Unilever plc',
    sector: 'Consumer',
    industry: 'Consumer Goods',
    description: 'British multinational consumer goods company',
    headquarters: 'London, United Kingdom',
    employees: 190000,
    revenue: 62.0,
    renewable_energy_percentage: 58,
    emissionsData: [
      { year: 2019, scope1: 2200, scope2: 4300, scope3: 15500 },
      { year: 2020, scope1: 2100, scope2: 4100, scope3: 14800 },
      { year: 2021, scope1: 2000, scope2: 3900, scope3: 14200 },
      { year: 2022, scope1: 1900, scope2: 3700, scope3: 13600 },
      { year: 2023, scope1: 1800, scope2: 3500, scope3: 13000 },
      { year: 2024, scope1: 1700, scope2: 3300, scope3: 12400 }
    ]
  },
  {
    id: 'nestle',
    name: 'Nestlé S.A.',
    sector: 'Consumer',
    industry: 'Food & Beverage',
    description: 'Swiss multinational food and drink processing conglomerate',
    headquarters: 'Vevey, Switzerland',
    employees: 273000,
    revenue: 94.4,
    renewable_energy_percentage: 42,
    emissionsData: [
      { year: 2019, scope1: 20000, scope2: 10000, scope3: 72000 },
      { year: 2020, scope1: 19500, scope2: 9500, scope3: 70000 },
      { year: 2021, scope1: 19000, scope2: 9000, scope3: 68000 },
      { year: 2022, scope1: 18500, scope2: 8750, scope3: 66500 },
      { year: 2023, scope1: 18250, scope2: 8600, scope3: 66000 },
      { year: 2024, scope1: 18000, scope2: 8500, scope3: 65500 }
    ]
  },
  {
    id: 'walmart',
    name: 'Walmart Inc.',
    sector: 'Consumer',
    industry: 'Retail',
    description: 'American multinational retail corporation',
    headquarters: 'Bentonville, Arkansas, USA',
    employees: 2100000,
    revenue: 648.1,
    renewable_energy_percentage: 45,
    emissionsData: [
      { year: 2019, scope1: 2800, scope2: 5200, scope3: 20000 },
      { year: 2020, scope1: 2700, scope2: 5000, scope3: 19500 },
      { year: 2021, scope1: 2600, scope2: 4800, scope3: 19000 },
      { year: 2022, scope1: 2500, scope2: 4600, scope3: 18500 },
      { year: 2023, scope1: 2400, scope2: 4400, scope3: 18000 },
      { year: 2024, scope1: 2300, scope2: 4200, scope3: 17500 }
    ]
  },
  {
    id: 'procter_gamble',
    name: 'Procter & Gamble',
    sector: 'Consumer',
    industry: 'Consumer Goods',
    description: 'American multinational consumer goods corporation',
    headquarters: 'Cincinnati, Ohio, USA',
    employees: 118000,
    revenue: 82.0,
    renewable_energy_percentage: 65,
    emissionsData: [
      { year: 2019, scope1: 3200, scope2: 6000, scope3: 25000 },
      { year: 2020, scope1: 3100, scope2: 5800, scope3: 24200 },
      { year: 2021, scope1: 3000, scope2: 5600, scope3: 23400 },
      { year: 2022, scope1: 2900, scope2: 5400, scope3: 22600 },
      { year: 2023, scope1: 2850, scope2: 5300, scope3: 22200 },
      { year: 2024, scope1: 2800, scope2: 5200, scope3: 22000 }
    ]
  },
  {
    id: 'coca_cola',
    name: 'The Coca-Cola Company',
    sector: 'Consumer',
    industry: 'Food & Beverage',
    description: 'American multinational beverage corporation',
    headquarters: 'Atlanta, Georgia, USA',
    employees: 82500,
    revenue: 43.0,
    renewable_energy_percentage: 52,
    emissionsData: [
      { year: 2019, scope1: 4200, scope2: 7500, scope3: 32500 },
      { year: 2020, scope1: 4000, scope2: 7200, scope3: 31200 },
      { year: 2021, scope1: 3850, scope2: 7000, scope3: 30500 },
      { year: 2022, scope1: 3750, scope2: 6800, scope3: 29800 },
      { year: 2023, scope1: 3680, scope2: 6650, scope3: 29350 },
      { year: 2024, scope1: 3600, scope2: 6500, scope3: 28900 }
    ]
  },
  {
    id: 'johnson_johnson',
    name: 'Johnson & Johnson',
    sector: 'Healthcare',
    industry: 'Healthcare',
    description: 'American multinational pharmaceutical and medical technologies corporation',
    headquarters: 'New Brunswick, New Jersey, USA',
    employees: 152700,
    revenue: 99.1,
    renewable_energy_percentage: 60,
    emissionsData: [
      { year: 2019, scope1: 2900, scope2: 5400, scope3: 23200 },
      { year: 2020, scope1: 2800, scope2: 5200, scope3: 22400 },
      { year: 2021, scope1: 2720, scope2: 5080, scope3: 21800 },
      { year: 2022, scope1: 2650, scope2: 4960, scope3: 21300 },
      { year: 2023, scope1: 2600, scope2: 4900, scope3: 21000 },
      { year: 2024, scope1: 2560, scope2: 4800, scope3: 20640 }
    ]
  }
];

export const getCompanyById = (id: string): Company | undefined => {
  return companies.find(company => company.id === id);
};

export const getCompaniesBySector = (sector: string): Company[] => {
  return companies.filter(company => company.sector === sector);
};

export default companies;
