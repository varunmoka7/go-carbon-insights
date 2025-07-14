// Comprehensive mock data for Corporate Carbon Emissions GPS Dashboard

// 21 sectors with their industries
export const sectors = [
  {
    id: 'energy',
    name: 'Energy',
    industries: ['Oil & Gas', 'Coal Mining', 'Renewable Energy', 'Energy Trading', 'Pipeline Transportation', 'Oil Refining', 'Gas Distribution', 'Electric Utilities', 'Nuclear Power']
  },
  {
    id: 'materials',
    name: 'Materials',
    industries: ['Steel Production', 'Cement Manufacturing', 'Aluminum Production', 'Chemical Manufacturing', 'Paper & Pulp', 'Glass Manufacturing', 'Mining', 'Plastics Production', 'Fertilizers']
  },
  {
    id: 'industrials',
    name: 'Industrials',
    industries: ['Aerospace & Defense', 'Construction', 'Machinery Manufacturing', 'Transportation Equipment', 'Industrial Conglomerates', 'Electrical Equipment', 'Building Materials', 'Heavy Equipment']
  },
  {
    id: 'consumer_discretionary',
    name: 'Consumer Discretionary',
    industries: ['Automotive', 'Retail', 'Textiles & Apparel', 'Hotels & Restaurants', 'Media & Entertainment', 'Consumer Electronics', 'Furniture', 'Luxury Goods', 'Sports & Recreation']
  },
  {
    id: 'consumer_staples',
    name: 'Consumer Staples',
    industries: ['Food & Beverage', 'Tobacco', 'Household Products', 'Personal Care', 'Food Production', 'Beverage Production', 'Agricultural Products', 'Packaged Foods']
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    industries: ['Pharmaceuticals', 'Medical Devices', 'Healthcare Services', 'Biotechnology', 'Medical Equipment', 'Hospital Management', 'Life Sciences', 'Diagnostics']
  },
  {
    id: 'financials',
    name: 'Financials',
    industries: ['Banking', 'Insurance', 'Asset Management', 'Real Estate', 'Financial Services', 'Investment Banking', 'Private Equity', 'REITs']
  },
  {
    id: 'information_technology',
    name: 'Information Technology',
    industries: ['Software', 'Hardware', 'Semiconductors', 'IT Services', 'Telecommunications', 'Internet Services', 'Data Centers', 'Cloud Computing', 'Cybersecurity']
  },
  {
    id: 'telecommunications',
    name: 'Telecommunications',
    industries: ['Wireless Telecommunications', 'Integrated Telecommunication Services', 'Cable & Satellite', 'Fiber Optics', 'Network Equipment', 'Telecom Infrastructure']
  },
  {
    id: 'utilities',
    name: 'Utilities',
    industries: ['Electric Utilities', 'Gas Utilities', 'Water Utilities', 'Waste Management', 'Independent Power Producers', 'Renewable Utilities', 'Multi-Utilities']
  },
  {
    id: 'real_estate',
    name: 'Real Estate',
    industries: ['Residential REITs', 'Commercial REITs', 'Industrial REITs', 'Real Estate Development', 'Property Management', 'Real Estate Services']
  },
  {
    id: 'transportation',
    name: 'Transportation',
    industries: ['Airlines', 'Railroads', 'Marine Transportation', 'Trucking', 'Logistics', 'Air Freight', 'Express Delivery', 'Public Transportation']
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    industries: ['Crop Production', 'Livestock', 'Forestry', 'Fishing', 'Agricultural Equipment', 'Seeds & Pesticides', 'Food Processing']
  },
  {
    id: 'mining',
    name: 'Mining',
    industries: ['Gold Mining', 'Copper Mining', 'Iron Ore Mining', 'Coal Mining', 'Precious Metals', 'Industrial Minerals', 'Diamond Mining']
  },
  {
    id: 'construction',
    name: 'Construction',
    industries: ['Residential Construction', 'Commercial Construction', 'Infrastructure', 'Engineering Services', 'Construction Materials', 'Heavy Construction']
  },
  {
    id: 'retail',
    name: 'Retail',
    industries: ['Department Stores', 'Specialty Retail', 'E-commerce', 'Grocery Stores', 'Automotive Retail', 'Home Improvement', 'Apparel Retail']
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    industries: ['Hotels & Motels', 'Restaurants', 'Casinos & Gaming', 'Leisure Facilities', 'Travel Services', 'Event Management']
  },
  {
    id: 'media',
    name: 'Media',
    industries: ['Broadcasting', 'Publishing', 'Advertising', 'Film & Television', 'Digital Media', 'News Media', 'Entertainment']
  },
  {
    id: 'logistics',
    name: 'Logistics',
    industries: ['Freight Forwarding', 'Warehousing', 'Supply Chain Management', 'Distribution', 'Third-Party Logistics', 'Cold Chain']
  },
  {
    id: 'aerospace',
    name: 'Aerospace',
    industries: ['Aircraft Manufacturing', 'Space Technology', 'Defense Contractors', 'Satellite Services', 'Aviation Services']
  },
  {
    id: 'biotechnology',
    name: 'Biotechnology',
    industries: ['Biopharmaceuticals', 'Agricultural Biotechnology', 'Industrial Biotechnology', 'Medical Biotechnology', 'Biofuels']
  }
];

// 15 Scope 3 categories (GHG Protocol aligned)
export const scope3Categories = [
  { id: 'cat1', name: 'Purchased goods and services', description: 'Emissions from purchased goods and services' },
  { id: 'cat2', name: 'Capital goods', description: 'Emissions from capital goods' },
  { id: 'cat3', name: 'Fuel and energy related activities', description: 'Emissions from fuel and energy related activities not included in Scope 1 or 2' },
  { id: 'cat4', name: 'Upstream transportation and distribution', description: 'Emissions from upstream transportation and distribution' },
  { id: 'cat5', name: 'Waste generated in operations', description: 'Emissions from waste generated in operations' },
  { id: 'cat6', name: 'Business travel', description: 'Emissions from business travel' },
  { id: 'cat7', name: 'Employee commuting', description: 'Emissions from employee commuting' },
  { id: 'cat8', name: 'Upstream leased assets', description: 'Emissions from upstream leased assets' },
  { id: 'cat9', name: 'Downstream transportation and distribution', description: 'Emissions from downstream transportation and distribution' },
  { id: 'cat10', name: 'Processing of sold products', description: 'Emissions from processing of sold products' },
  { id: 'cat11', name: 'Use of sold products', description: 'Emissions from use of sold products' },
  { id: 'cat12', name: 'End-of-life treatment of sold products', description: 'Emissions from end-of-life treatment of sold products' },
  { id: 'cat13', name: 'Downstream leased assets', description: 'Emissions from downstream leased assets' },
  { id: 'cat14', name: 'Franchises', description: 'Emissions from franchises' },
  { id: 'cat15', name: 'Investments', description: 'Emissions from investments' }
];

// Global regions
export const regions = [
  { id: 'north_america', name: 'North America', countries: ['United States', 'Canada', 'Mexico'] },
  { id: 'europe', name: 'Europe', countries: ['Germany', 'United Kingdom', 'France', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Sweden', 'Norway'] },
  { id: 'asia_pacific', name: 'Asia Pacific', countries: ['China', 'Japan', 'India', 'Australia', 'South Korea', 'Singapore', 'Indonesia', 'Thailand', 'Malaysia'] },
  { id: 'latin_america', name: 'Latin America', countries: ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela'] },
  { id: 'middle_east_africa', name: 'Middle East & Africa', countries: ['Saudi Arabia', 'UAE', 'South Africa', 'Nigeria', 'Egypt', 'Israel', 'Qatar'] }
];

// Generate mock companies data
const generateCompanies = () => {
  const companies = [];
  const companyNames = [
    'Global Energy Corp', 'Sustainable Materials Inc', 'Tech Innovators Ltd', 'Green Manufacturing Co', 'EcoTransport Solutions',
    'Clean Energy Systems', 'Advanced Materials Group', 'Digital Solutions Inc', 'Renewable Power Ltd', 'Smart Industries Corp',
    'NextGen Technologies', 'Sustainable Logistics', 'Green Building Materials', 'EcoFriendly Products', 'CleanTech Innovations',
    'Renewable Resources Inc', 'Sustainable Solutions Ltd', 'Green Energy Partners', 'EcoInnovations Corp', 'CleanTech Systems'
  ];
  
  for (let i = 0; i < 300000; i++) {
    const sector = sectors[i % sectors.length];
    const industry = sector.industries[i % sector.industries.length];
    const region = regions[i % regions.length];
    const country = region.countries[i % region.countries.length];
    
    const baseEmissions = Math.random() * 1000000 + 50000; // Base emissions between 50k-1M tons CO2e
    const scope1 = baseEmissions * (0.2 + Math.random() * 0.3); // 20-50% of total
    const scope2 = baseEmissions * (0.1 + Math.random() * 0.2); // 10-30% of total
    const scope3 = baseEmissions * (0.3 + Math.random() * 0.4); // 30-70% of total
    
    // Generate Scope 3 breakdown
    const scope3Breakdown = {};
    scope3Categories.forEach(cat => {
      scope3Breakdown[cat.id] = scope3 * (Math.random() * 0.2 + 0.02); // 2-22% of scope 3 each
    });
    
    const company = {
      id: `company_${i}`,
      name: `${companyNames[i % companyNames.length]} ${i + 1}`,
      sector: sector.id,
      sectorName: sector.name,
      industry: industry,
      region: region.id,
      regionName: region.name,
      country: country,
      marketCap: Math.random() * 500000000000 + 1000000000, // $1B - $500B
      revenue: Math.random() * 100000000000 + 500000000, // $500M - $100B
      employees: Math.floor(Math.random() * 500000 + 1000), // 1k - 500k employees
      emissions: {
        total: scope1 + scope2 + scope3,
        scope1: scope1,
        scope2: scope2,
        scope3: scope3,
        scope3Breakdown: scope3Breakdown,
        intensity: (scope1 + scope2 + scope3) / (Math.random() * 100000000000 + 500000000), // tons CO2e per $ revenue
        yearOverYear: (Math.random() - 0.5) * 0.4 // -20% to +20% change
      },
      disclosureQuality: Math.random() > 0.3 ? (Math.random() > 0.5 ? 'High' : 'Medium') : 'Low',
      cdpRating: Math.random() > 0.8 ? 'A' : (Math.random() > 0.6 ? 'B' : (Math.random() > 0.4 ? 'C' : 'D')),
      lastUpdated: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      coordinates: [
        -180 + Math.random() * 360, // longitude
        -90 + Math.random() * 180   // latitude
      ]
    };
    
    companies.push(company);
  }
  
  return companies;
};

// Generate SBTi data for CDP A-rated companies
const generateSBTiData = (companies) => {
  const aRatedCompanies = companies.filter(c => c.cdpRating === 'A');
  
  return aRatedCompanies.map(company => {
    const baseYear = 2019 + Math.floor(Math.random() * 3); // 2019-2021
    const targetYear = 2030 + Math.floor(Math.random() * 20); // 2030-2050
    const currentYear = 2024;
    
    const baselineEmissions = company.emissions.total * (1 + Math.random() * 0.3); // 30% higher baseline
    const targetReduction = 0.3 + Math.random() * 0.4; // 30-70% reduction target
    const targetEmissions = baselineEmissions * (1 - targetReduction);
    
    // Generate historical progress
    const historicalData = [];
    for (let year = baseYear; year <= currentYear; year++) {
      const progress = (year - baseYear) / (targetYear - baseYear);
      const idealEmissions = baselineEmissions - (baselineEmissions - targetEmissions) * progress;
      const actualEmissions = idealEmissions * (0.9 + Math.random() * 0.2); // Some variance
      
      historicalData.push({
        year,
        actualEmissions,
        targetEmissions: idealEmissions,
        progress: Math.min(100, progress * 100)
      });
    }
    
    const currentProgress = historicalData[historicalData.length - 1];
    const onTrack = currentProgress.actualEmissions <= currentProgress.targetEmissions * 1.1;
    
    return {
      companyId: company.id,
      companyName: company.name,
      sector: company.sectorName,
      hasNearTermTarget: Math.random() > 0.2,
      hasLongTermTarget: Math.random() > 0.4,
      baseYear,
      targetYear,
      baselineEmissions,
      targetEmissions,
      currentEmissions: company.emissions.total,
      targetReduction: targetReduction * 100,
      currentReduction: ((baselineEmissions - company.emissions.total) / baselineEmissions) * 100,
      status: onTrack ? 'On Track' : (Math.random() > 0.5 ? 'Off Track' : 'Undisclosed'),
      historicalData,
      scope1Target: targetReduction * 0.8 + Math.random() * 0.2,
      scope2Target: targetReduction * 0.9 + Math.random() * 0.1,
      scope3Target: targetReduction * 0.6 + Math.random() * 0.3,
      milestones: [
        { year: 2025, target: 25, actual: 20 + Math.random() * 10 },
        { year: 2030, target: 50, actual: 40 + Math.random() * 20 },
        { year: 2035, target: 75, actual: 60 + Math.random() * 30 }
      ]
    };
  });
};

// Generate time series data for sectors
const generateSectorTimeSeries = () => {
  const timeSeriesData = [];
  
  sectors.forEach(sector => {
    const sectorData = [];
    for (let year = 2019; year <= 2024; year++) {
      const baseEmissions = 10000000 + Math.random() * 50000000; // 10M-60M tons CO2e
      const yearlyChange = Math.pow(0.95 + Math.random() * 0.1, year - 2019); // Slight downward trend
      
      sectorData.push({
        year,
        emissions: baseEmissions * yearlyChange,
        intensity: (baseEmissions * yearlyChange) / (Math.random() * 1000000000000 + 100000000000),
        companies: Math.floor(Math.random() * 15000 + 5000) // 5k-20k companies per sector
      });
    }
    
    timeSeriesData.push({
      sector: sector.id,
      sectorName: sector.name,
      data: sectorData
    });
  });
  
  return timeSeriesData;
};

// Generate geographic heatmap data
const generateGeographicData = () => {
  const geographicData = [];
  
  regions.forEach(region => {
    region.countries.forEach(country => {
      const emissions = Math.random() * 2000000000 + 100000000; // 100M-2B tons CO2e
      const companies = Math.floor(Math.random() * 50000 + 5000); // 5k-55k companies
      
      geographicData.push({
        country,
        region: region.id,
        regionName: region.name,
        emissions,
        companies,
        intensity: emissions / companies,
        coordinates: [
          -180 + Math.random() * 360,
          -90 + Math.random() * 180
        ]
      });
    });
  });
  
  return geographicData;
};

// Mock data exports
export const mockCompanies = generateCompanies();
export const mockSBTiData = generateSBTiData(mockCompanies);
export const mockSectorTimeSeries = generateSectorTimeSeries();
export const mockGeographicData = generateGeographicData();

// Dashboard summary statistics
export const dashboardSummary = {
  totalCompanies: mockCompanies.length,
  totalEmissions: mockCompanies.reduce((sum, c) => sum + c.emissions.total, 0),
  avgEmissionIntensity: mockCompanies.reduce((sum, c) => sum + c.emissions.intensity, 0) / mockCompanies.length,
  sectorsTracked: sectors.length,
  industriesTracked: sectors.reduce((sum, s) => sum + s.industries.length, 0),
  regionsTracked: regions.length,
  cdpARated: mockCompanies.filter(c => c.cdpRating === 'A').length,
  sbtiCommitted: mockSBTiData.length,
  onTrackCompanies: mockSBTiData.filter(s => s.status === 'On Track').length
};

// Emission intensity benchmarks by sector
export const sectorBenchmarks = sectors.map(sector => {
  const sectorCompanies = mockCompanies.filter(c => c.sector === sector.id);
  const intensities = sectorCompanies.map(c => c.emissions.intensity);
  
  return {
    sector: sector.id,
    sectorName: sector.name,
    companies: sectorCompanies.length,
    avgIntensity: intensities.reduce((sum, i) => sum + i, 0) / intensities.length,
    medianIntensity: intensities.sort()[Math.floor(intensities.length / 2)],
    p25Intensity: intensities.sort()[Math.floor(intensities.length * 0.25)],
    p75Intensity: intensities.sort()[Math.floor(intensities.length * 0.75)],
    totalEmissions: sectorCompanies.reduce((sum, c) => sum + c.emissions.total, 0),
    disclosureRate: sectorCompanies.filter(c => c.disclosureQuality !== 'Low').length / sectorCompanies.length
  };
});