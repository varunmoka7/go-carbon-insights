
export interface SectorData {
  id: string;
  title: string;
  status: 'live' | 'coming-soon' | 'planned';
  impact: string;
  keyChallenge: string;
  companiesTracked: string;
  primaryMetrics: string[];
  visual: string;
  statusBadge: string;
  timeline?: string;
  route?: string;
  globalEmissionPercentage: number;
  description: string;
}

export const industryGlobalStats = {
  globalGHGEmissions: '36.7 Gt CO2e',
  keyIndustryContributors: '8 sectors (80% of emissions)',
  companiesTracked: '5,000+',
  sectorCoverage: '12 major industries'
};

export const sectorsData: SectorData[] = [
  {
    id: 'plastic-packaging',
    title: 'Plastic Packaging & Materials',
    status: 'live',
    impact: '3.4% of global GHG emissions (1.8 Gt CO2e annually)',
    keyChallenge: '300M tonnes waste generation, 8M tonnes ocean pollution',
    companiesTracked: '150+ across value chain (producers, converters, consumer goods, waste management)',
    primaryMetrics: ['Emissions intensity', 'Circular economy score', 'Toxicity elimination', 'End-of-life tracking'],
    visual: 'plastic-packaging',
    statusBadge: 'Live Analysis Available',
    route: '/industry-analysis/plastic-packaging',
    globalEmissionPercentage: 3.4,
    description: 'Comprehensive analysis of plastic packaging value chain emissions and circular economy metrics'
  },
  {
    id: 'methane-emissions',
    title: 'Methane Emissions Management',
    status: 'coming-soon',
    impact: '16% of global GHG emissions (28x more potent than CO2)',
    keyChallenge: '570 Mt emissions annually from agriculture, oil & gas, waste',
    companiesTracked: '200+ across agriculture, energy, waste sectors',
    primaryMetrics: ['Leak detection', 'Capture efficiency', 'Conversion technology', 'Supply chain tracking'],
    visual: 'methane-management',
    statusBadge: 'In Development - Q2 2025',
    timeline: 'Q2 2025',
    globalEmissionPercentage: 16,
    description: 'Advanced methane monitoring and reduction strategies across high-emission sectors'
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy Transition',
    status: 'planned',
    impact: '73% of global emissions from energy sector',
    keyChallenge: '1.5°C pathway requires 90% renewable electricity by 2050',
    companiesTracked: '300+ utilities, energy companies, corporate renewable buyers',
    primaryMetrics: ['Renewable capacity', 'Grid integration', 'Storage deployment', 'Corporate PPAs'],
    visual: 'renewable-energy',
    statusBadge: 'Roadmap - Q3 2025',
    timeline: 'Q3 2025',
    globalEmissionPercentage: 73,
    description: 'Energy transition tracking and renewable energy deployment analysis'
  },
  {
    id: 'agriculture-land-use',
    title: 'Agriculture & Land Use',
    status: 'planned',
    impact: '24% of global emissions including deforestation',
    keyChallenge: 'Feed 10B people while reducing agricultural emissions 50%',
    companiesTracked: '250+ food companies, agricultural inputs, processors',
    primaryMetrics: ['Regenerative practices', 'Deforestation tracking', 'Methane reduction', 'Soil carbon'],
    visual: 'agriculture',
    statusBadge: 'Roadmap - Q4 2025',
    timeline: 'Q4 2025',
    globalEmissionPercentage: 24,
    description: 'Sustainable agriculture and land use transformation analysis'
  },
  {
    id: 'transportation-logistics',
    title: 'Transportation & Logistics',
    status: 'planned',
    impact: '16% of global emissions from transport sector',
    keyChallenge: 'Decarbonize freight, shipping, and personal mobility',
    companiesTracked: '200+ logistics, automotive, shipping, aviation companies',
    primaryMetrics: ['Fleet electrification', 'Biofuel adoption', 'Route optimization', 'Modal shift'],
    visual: 'transportation',
    statusBadge: 'Roadmap - Q1 2026',
    timeline: 'Q1 2026',
    globalEmissionPercentage: 16,
    description: 'Transport decarbonization and logistics optimization analysis'
  },
  {
    id: 'built-environment',
    title: 'Built Environment & Construction',
    status: 'planned',
    impact: '37% of global emissions including building operations and construction',
    keyChallenge: 'Net-zero buildings and sustainable construction materials',
    companiesTracked: '180+ construction, real estate, building materials companies',
    primaryMetrics: ['Embodied carbon', 'Operational efficiency', 'Green building certification', 'Material innovation'],
    visual: 'construction',
    statusBadge: 'Roadmap - Q2 2026',
    timeline: 'Q2 2026',
    globalEmissionPercentage: 37,
    description: 'Building sector decarbonization and sustainable construction analysis'
  }
];

export const developmentRoadmap = {
  liveSectors: 1,
  inDevelopment: 1,
  planned: 4,
  totalPlanned: 12,
  lastUpdated: '2024-12-15',
  nextRelease: 'Q2 2025 - Methane Emissions Management'
};

export const frameworkAlignment = [
  {
    name: 'Science-Based Targets Initiative (SBTi)',
    description: 'Sector-specific target setting and validation'
  },
  {
    name: 'Carbon Disclosure Project (CDP)',
    description: 'Industry-specific questionnaires and scoring'
  },
  {
    name: 'Corporate Sustainability Reporting Directive (CSRD)',
    description: 'Double materiality by sector'
  },
  {
    name: 'Task Force on Climate-related Financial Disclosures (TCFD)',
    description: 'Sector-specific risk scenarios'
  }
];

export const userEngagementMetrics = {
  mostAccessedSectors: [
    { name: 'Plastic Packaging', percentage: 65 },
    { name: 'Methane Management', percentage: 20 },
    { name: 'Renewable Energy', percentage: 15 }
  ],
  userRequests: [
    { name: 'Agriculture', percentage: 40 },
    { name: 'Transportation', percentage: 25 },
    { name: 'Built Environment', percentage: 20 },
    { name: 'Others', percentage: 15 }
  ],
  geographicInterest: [
    { name: 'Europe', percentage: 45 },
    { name: 'North America', percentage: 30 },
    { name: 'Asia-Pacific', percentage: 20 },
    { name: 'Others', percentage: 5 }
  ]
};
