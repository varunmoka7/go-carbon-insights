-- Update missing information for industries in taxonomy table

-- Update Shell Companies
UPDATE industry_taxonomy 
SET 
  description = 'Special-purpose or inactive legal entities',
  ghg_protocol_alignment = 'Scope 3: Organizational structure emissions',
  cdp_category = 'Financial Services',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Financials' AND industry = 'Shell Companies';

-- Update Solar
UPDATE industry_taxonomy 
SET 
  description = 'Solar panel design, manufacturing or integration',
  ghg_protocol_alignment = 'Scope 3: Supply chain and materials',
  cdp_category = 'Technology Hardware & Equipment',
  sbti_pathway = 'Already aligned with net-zero',
  updated_at = now()
WHERE sector = 'IT & Communications' AND industry = 'Solar';

-- Update Residential Construction
UPDATE industry_taxonomy 
SET 
  description = 'Building of housing units and developments',
  ghg_protocol_alignment = 'Scope 1: Construction operations',
  cdp_category = 'Real Estate',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Consumer Goods & Services' AND industry = 'Residential Construction';

-- Update Textile Manufacturing
UPDATE industry_taxonomy 
SET 
  description = 'Weaving, dyeing, and finishing of fabrics',
  ghg_protocol_alignment = 'Scope 3: Upstream textile sourcing',
  cdp_category = 'Textiles, Apparel & Luxury Goods',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Consumer Goods & Services' AND industry = 'Textile Manufacturing';

-- Update Software - Infrastructure
UPDATE industry_taxonomy 
SET 
  description = 'Backend services, databases, APIs',
  ghg_protocol_alignment = 'Scope 2: Electricity for servers and cooling',
  cdp_category = 'Software & IT Services',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'IT & Communications' AND industry = 'Software - Infrastructure';

-- Update Software - Application
UPDATE industry_taxonomy 
SET 
  description = 'Development of end-user software tools',
  ghg_protocol_alignment = 'Scope 2: Cloud/data center energy use',
  cdp_category = 'Software & IT Services',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'IT & Communications' AND industry = 'Software - Application';

-- Update Resorts & Casinos
UPDATE industry_taxonomy 
SET 
  description = 'Lodging and entertainment with high utility load',
  ghg_protocol_alignment = 'Scope 2: Energy-intensive operations',
  cdp_category = 'Consumer Services',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Consumer Goods & Services' AND industry = 'Resorts & Casinos';

-- Update Utilities - Regulated Gas
UPDATE industry_taxonomy 
SET 
  description = 'Regulated natural gas transmission & delivery',
  ghg_protocol_alignment = 'Scope 1: Direct fuel combustion emissions',
  cdp_category = 'Utilities',
  sbti_pathway = 'Sectoral decarbonization approach',
  updated_at = now()
WHERE sector = 'Energy & Utilities' AND industry = 'Utilities - Regulated Gas';

-- Update Restaurants
UPDATE industry_taxonomy 
SET 
  description = 'Foodservice businesses and dining outlets',
  ghg_protocol_alignment = 'Scope 1: Cooking + refrigeration + upstream food',
  cdp_category = 'Food, Beverage & Tobacco',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Consumer Goods & Services' AND industry = 'Restaurants';

-- Update Real Estate - Diversified
UPDATE industry_taxonomy 
SET 
  description = 'Mixed-use real estate portfolios',
  ghg_protocol_alignment = 'Scope 2: Building operations and utilities',
  cdp_category = 'Real Estate',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Real Estate' AND industry = 'Real Estate - Diversified';

-- Update Personal Services
UPDATE industry_taxonomy 
SET 
  description = 'Grooming, wellness, and lifestyle services',
  ghg_protocol_alignment = 'Scope 2: Facility and energy use',
  cdp_category = 'Consumer Services',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Consumer Goods & Services' AND industry = 'Personal Services';

-- Update Telecom Services
UPDATE industry_taxonomy 
SET 
  description = 'Mobile, broadband, and fiber network services',
  ghg_protocol_alignment = 'Scope 2: Electricity for network infrastructure',
  cdp_category = 'Telecommunications Services',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'IT & Communications' AND industry = 'Telecom Services';

-- Update Scientific & Technical Instruments
UPDATE industry_taxonomy 
SET 
  description = 'Precision tools and measurement systems',
  ghg_protocol_alignment = 'Scope 3: Manufacturing-intensive emissions',
  cdp_category = 'Technology Hardware & Equipment',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'IT & Communications' AND industry = 'Scientific & Technical Instruments';

-- Update Utilities - Regulated Electric
UPDATE industry_taxonomy 
SET 
  description = 'Licensed power generation & grid supply',
  ghg_protocol_alignment = 'Scope 1: Fossil-fuel-based power',
  cdp_category = 'Utilities',
  sbti_pathway = 'Sectoral decarbonization approach',
  updated_at = now()
WHERE sector = 'Energy & Utilities' AND industry = 'Utilities - Regulated Electric';

-- Update REIT - Office
UPDATE industry_taxonomy 
SET 
  description = 'Commercial offices under REIT structure',
  ghg_protocol_alignment = 'Scope 2: Building energy and HVAC systems',
  cdp_category = 'Real Estate',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Real Estate' AND industry = 'REIT - Office';

-- Update Tobacco
UPDATE industry_taxonomy 
SET 
  description = 'Manufacturing and marketing of tobacco products',
  ghg_protocol_alignment = 'Scope 3: Agricultural sourcing and retail',
  cdp_category = 'Food, Beverage & Tobacco',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Consumer Goods & Services' AND industry = 'Tobacco';

-- Update Uranium
UPDATE industry_taxonomy 
SET 
  description = 'Extraction and refinement of uranium',
  ghg_protocol_alignment = 'Scope 1: Mining and processing',
  cdp_category = 'Materials',
  sbti_pathway = 'Sectoral decarbonization approach',
  updated_at = now()
WHERE sector = 'Energy & Utilities' AND industry = 'Uranium';

-- Update Utilities - Independent Power Producers
UPDATE industry_taxonomy 
SET 
  description = 'Private sector electricity generation',
  ghg_protocol_alignment = 'Scope 1: Power plant emissions',
  cdp_category = 'Utilities',
  sbti_pathway = 'Sectoral decarbonization approach',
  updated_at = now()
WHERE sector = 'Energy & Utilities' AND industry = 'Utilities - Independent Power Producers';

-- Update REIT - Hotel & Motel
UPDATE industry_taxonomy 
SET 
  description = 'Hospitality-focused real estate investments',
  ghg_protocol_alignment = 'Scope 2: Lodging operations and utilities',
  cdp_category = 'Real Estate',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Real Estate' AND industry = 'REIT - Hotel & Motel';

-- Update Thermal Coal
UPDATE industry_taxonomy 
SET 
  description = 'Coal mining and thermal power generation',
  ghg_protocol_alignment = 'Scope 1: High-intensity fuel combustion',
  cdp_category = 'Materials',
  sbti_pathway = 'Sectoral decarbonization approach',
  updated_at = now()
WHERE sector = 'Energy & Utilities' AND industry = 'Thermal Coal';

-- Update Specialty Retail
UPDATE industry_taxonomy 
SET 
  description = 'Focused product retail chains (e.g., footwear)',
  ghg_protocol_alignment = 'Scope 3: Product supply and packaging',
  cdp_category = 'Retailing',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Consumer Goods & Services' AND industry = 'Specialty Retail';

-- Update Pharmaceutical Retailers
UPDATE industry_taxonomy 
SET 
  description = 'Distribution and sale of medications',
  ghg_protocol_alignment = 'Scope 3: Upstream pharma logistics',
  cdp_category = 'Pharmaceuticals & Life Sciences',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Healthcare & Life Sciences' AND industry = 'Pharmaceutical Retailers';

-- Update Travel Services
UPDATE industry_taxonomy 
SET 
  description = 'Agencies offering tours, bookings, etc.',
  ghg_protocol_alignment = 'Scope 3: Travel chain emissions',
  cdp_category = 'Consumer Services',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Consumer Goods & Services' AND industry = 'Travel Services';

-- Update Recreational Vehicles
UPDATE industry_taxonomy 
SET 
  description = 'RV manufacturing and sales',
  ghg_protocol_alignment = 'Scope 3: Use-phase fuel and materials',
  cdp_category = 'Automobiles & Components',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Consumer Goods & Services' AND industry = 'Recreational Vehicles';

-- Update Utilities - Renewable
UPDATE industry_taxonomy 
SET 
  description = 'Wind, solar, hydro energy production',
  ghg_protocol_alignment = 'Scope 3: Equipment lifecycle',
  cdp_category = 'Utilities',
  sbti_pathway = 'Already aligned with net-zero',
  updated_at = now()
WHERE sector = 'Energy & Utilities' AND industry = 'Utilities - Renewable';

-- Update Packaged Foods
UPDATE industry_taxonomy 
SET 
  description = 'Processed and sealed food production',
  ghg_protocol_alignment = 'Scope 3: Agricultural and packaging upstream',
  cdp_category = 'Food, Beverage & Tobacco',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Consumer Goods & Services' AND industry = 'Packaged Foods';

-- Update Utilities - Regulated Water
UPDATE industry_taxonomy 
SET 
  description = 'Provision and management of potable water',
  ghg_protocol_alignment = 'Scope 2: Pumping, filtration energy use',
  cdp_category = 'Utilities',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Energy & Utilities' AND industry = 'Utilities - Regulated Water';

-- Update Semiconductor Equipment & Materials
UPDATE industry_taxonomy 
SET 
  description = 'Equipment and wafers for chip production',
  ghg_protocol_alignment = 'Scope 3: Manufacturing and energy-intensive',
  cdp_category = 'Technology Hardware & Equipment',
  sbti_pathway = 'Sectoral decarbonization approach',
  updated_at = now()
WHERE sector = 'IT & Communications' AND industry = 'Semiconductor Equipment & Materials';

-- Update REIT - Diversified
UPDATE industry_taxonomy 
SET 
  description = 'Multi-asset real estate investment structures',
  ghg_protocol_alignment = 'Scope 2: Building operations',
  cdp_category = 'Real Estate',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Real Estate' AND industry = 'REIT - Diversified';

-- Update Utilities - Diversified
UPDATE industry_taxonomy 
SET 
  description = 'Combination of gas, electric, and water services',
  ghg_protocol_alignment = 'Scope 1 & 2: Mixed utility footprints',
  cdp_category = 'Utilities',
  sbti_pathway = 'Sectoral decarbonization approach',
  updated_at = now()
WHERE sector = 'Energy & Utilities' AND industry = 'Utilities - Diversified';

-- Update Real Estate - Development
UPDATE industry_taxonomy 
SET 
  description = 'Ground-up construction and property development',
  ghg_protocol_alignment = 'Scope 1: Building operations + supply emissions',
  cdp_category = 'Real Estate',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Real Estate' AND industry = 'Real Estate - Development';

-- Update Packaging & Containers
UPDATE industry_taxonomy 
SET 
  description = 'Design and production of food-grade packaging',
  ghg_protocol_alignment = 'Scope 3: Material sourcing and disposal',
  cdp_category = 'Household & Personal Products',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Consumer Goods & Services' AND industry = 'Packaging & Containers';

-- Update Semiconductors
UPDATE industry_taxonomy 
SET 
  description = 'Chip and processor manufacturing',
  ghg_protocol_alignment = 'Scope 1 & 2: Energy and process emissions',
  cdp_category = 'Technology Hardware & Equipment',
  sbti_pathway = 'Sectoral decarbonization approach',
  updated_at = now()
WHERE sector = 'IT & Communications' AND industry = 'Semiconductors';

-- Update Real Estate Services
UPDATE industry_taxonomy 
SET 
  description = 'Property management and facility operations',
  ghg_protocol_alignment = 'Scope 2: Operational energy footprint',
  cdp_category = 'Real Estate',
  sbti_pathway = 'Absolute emissions reduction',
  updated_at = now()
WHERE sector = 'Real Estate' AND industry = 'Real Estate Services';

-- Verification query to confirm updates
SELECT 
  COUNT(*) as total_records,
  COUNT(CASE WHEN description IS NOT NULL AND description != '' THEN 1 END) as with_description,
  COUNT(CASE WHEN ghg_protocol_alignment IS NOT NULL AND ghg_protocol_alignment != '' THEN 1 END) as with_ghg_alignment,
  COUNT(CASE WHEN cdp_category IS NOT NULL AND cdp_category != '' THEN 1 END) as with_cdp_category,
  COUNT(CASE WHEN sbti_pathway IS NOT NULL AND sbti_pathway != '' THEN 1 END) as with_sbti_pathway
FROM industry_taxonomy;