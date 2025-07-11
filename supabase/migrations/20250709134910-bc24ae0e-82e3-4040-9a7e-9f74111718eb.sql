-- Update industry_taxonomy table with complete dataset (185 rows)
-- Use UPSERT to replace or insert rows based on industry field

INSERT INTO public.industry_taxonomy (
  sector, 
  industry, 
  emissions_archetype, 
  description, 
  ghg_protocol_alignment, 
  cdp_category, 
  sbti_pathway
) VALUES
-- Clean Technology
('Clean Technology', 'Biochar Production', 'Lifecycle-dependent', '', '', '', ''),
('Clean Technology', 'Ammonia Production', 'Lifecycle-dependent', '', '', '', ''),
('Clean Technology', 'Hydrogen Production', 'Operational Emitter', '', '', '', ''),
('Clean Technology', 'Direct Air Capture (DAC)', 'Lifecycle-dependent', '', '', '', ''),
('Clean Technology', 'Sustainable Aviation Fuel (SAF)', 'Use-phase Dominant', '', '', '', ''),
('Clean Technology', 'Synthetic Fuels', 'Lifecycle-dependent', '', '', '', ''),
('Clean Technology', 'Bio-based Chemicals', 'Operational Emitter', '', '', '', ''),
('Clean Technology', 'Green Hydrogen', 'Lifecycle-dependent', '', '', '', ''),
('Clean Technology', 'Geothermal Energy', 'Operational Emitter', '', '', '', ''),
('Clean Technology', 'Carbon Capture (CCUS)', 'Offset-focused', '', '', '', ''),

-- Consumer Goods & Services
('Consumer Goods & Services', 'Education & Training Services', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Packaging & Containers', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Personal Services', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Recreational Vehicles', 'Use-phase Dominant', '', '', '', ''),
('Consumer Goods & Services', 'Residential Construction', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Resorts & Casinos', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Restaurants', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Specialty Retail', 'Upstream-heavy', '', '', '', ''),
('Consumer Goods & Services', 'Textile Manufacturing', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Travel Services', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Beverages - Brewers', 'Upstream-heavy', '', '', '', ''),
('Consumer Goods & Services', 'Beverages - Wineries & Distilleries', 'Upstream-heavy', '', '', '', ''),
('Consumer Goods & Services', 'Confectioners', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Discount Stores', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Luxury Goods', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Packaged Foods', 'Upstream-heavy', '', '', '', ''),
('Consumer Goods & Services', 'Household & Personal Products', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Grocery Stores', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Food Distribution', 'Upstream-heavy', '', '', '', ''),
('Consumer Goods & Services', 'Farm Products', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Beverages - Non-Alcoholic', 'Upstream-heavy', '', '', '', ''),
('Consumer Goods & Services', 'Lodging', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Furnishings, Fixtures & Appliances', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Internet Retail', 'Upstream-heavy', '', '', '', ''),
('Consumer Goods & Services', 'Leisure', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Apparel Manufacturing', 'Upstream-heavy', '', '', '', ''),
('Consumer Goods & Services', 'Apparel Retail', 'Upstream-heavy', '', '', '', ''),
('Consumer Goods & Services', 'Auto Manufacturers', 'Use-phase Dominant', '', '', '', ''),
('Consumer Goods & Services', 'Auto Parts', 'Use-phase Dominant', '', '', '', ''),
('Consumer Goods & Services', 'Auto & Truck Dealerships', 'Use-phase Dominant', '', '', '', ''),
('Consumer Goods & Services', 'Footwear & Accessories', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Tobacco', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Gambling', 'Lifecycle-dependent', '', '', '', ''),
('Consumer Goods & Services', 'Home Improvement Retail', 'Upstream-heavy', '', '', '', ''),
('Consumer Goods & Services', 'Department Stores', 'Lifecycle-dependent', '', '', '', ''),

-- Energy & Utilities
('Energy & Utilities', 'Utilities - Regulated Gas', 'Operational Emitter', '', '', '', ''),
('Energy & Utilities', 'Utilities - Diversified', 'Operational Emitter', '', '', '', ''),
('Energy & Utilities', 'Utilities - Independent Power Producers', 'Operational Emitter', '', '', '', ''),
('Energy & Utilities', 'Utilities - Regulated Electric', 'Operational Emitter', '', '', '', ''),
('Energy & Utilities', 'Utilities - Regulated Water', 'Operational Emitter', '', '', '', ''),
('Energy & Utilities', 'Oil & Gas Equipment & Services', 'Use-phase Dominant', '', '', '', ''),
('Energy & Utilities', 'Uranium', 'Lifecycle-dependent', '', '', '', ''),
('Energy & Utilities', 'Thermal Coal', 'Lifecycle-dependent', '', '', '', ''),
('Energy & Utilities', 'Oil & Gas Midstream', 'Use-phase Dominant', '', '', '', ''),
('Energy & Utilities', 'Oil & Gas Integrated', 'Use-phase Dominant', '', '', '', ''),
('Energy & Utilities', 'Utilities - Renewable', 'Operational Emitter', '', '', '', ''),
('Energy & Utilities', 'Oil & Gas E&P', 'Use-phase Dominant', '', '', '', ''),
('Energy & Utilities', 'Oil & Gas Refining & Marketing', 'Use-phase Dominant', '', '', '', ''),
('Energy & Utilities', 'Oil & Gas Drilling', 'Use-phase Dominant', '', '', '', ''),

-- Environmental Markets
('Environmental Markets', 'Nature-Based Offsets Projects (REDD+, etc.)', 'Offset-focused', '', '', '', ''),
('Environmental Markets', 'Carbon Trading Platforms', 'Offset-focused', '', '', '', ''),
('Environmental Markets', 'Forest Carbon Projects', 'Offset-focused', '', '', '', ''),
('Environmental Markets', 'Carbon Offset Registries', 'Offset-focused', '', '', '', ''),

-- Financials
('Financials', 'Shell Companies', 'Lifecycle-dependent', '', '', '', ''),
('Financials', 'Mortgage Finance', 'Lifecycle-dependent', '', '', '', ''),
('Financials', 'Insurance - Specialty', 'Financed Emissions (Scope 3 Cat 15)', '', '', '', ''),
('Financials', 'Insurance - Reinsurance', 'Financed Emissions (Scope 3 Cat 15)', '', '', '', ''),
('Financials', 'Insurance - Property & Casualty', 'Financed Emissions (Scope 3 Cat 15)', '', '', '', ''),
('Financials', 'Insurance - Life', 'Financed Emissions (Scope 3 Cat 15)', '', '', '', ''),
('Financials', 'Insurance - Diversified', 'Financed Emissions (Scope 3 Cat 15)', '', '', '', ''),
('Financials', 'Insurance - Brokers', 'Financed Emissions (Scope 3 Cat 15)', '', '', '', ''),
('Financials', 'Financial Conglomerates', 'Financed Emissions (Scope 3 Cat 15)', '', '', '', ''),
('Financials', 'Credit Services', 'Lifecycle-dependent', '', '', '', ''),
('Financials', 'Capital Markets', 'Financed Emissions (Scope 3 Cat 15)', '', '', '', ''),
('Financials', 'Banks - Regional', 'Financed Emissions (Scope 3 Cat 15)', '', '', '', ''),
('Financials', 'Banks - Diversified', 'Financed Emissions (Scope 3 Cat 15)', '', '', '', ''),
('Financials', 'Asset Management', 'Financed Emissions (Scope 3 Cat 15)', '', '', '', ''),
('Financials', 'Financial Data & Stock Exchanges', 'Financed Emissions (Scope 3 Cat 15)', '', '', '', ''),

-- Healthcare & Life Sciences
('Healthcare & Life Sciences', 'Medical Distribution', 'Lifecycle-dependent', '', '', '', ''),
('Healthcare & Life Sciences', 'Digital Health Platforms', 'Lifecycle-dependent', '', '', '', ''),
('Healthcare & Life Sciences', 'Genomics & Precision Medicine', 'Lifecycle-dependent', '', '', '', ''),
('Healthcare & Life Sciences', 'Pharmaceutical Retailers', 'Upstream-heavy', '', '', '', ''),
('Healthcare & Life Sciences', 'Medical Instruments & Supplies', 'Lifecycle-dependent', '', '', '', ''),
('Healthcare & Life Sciences', 'Medical Waste Management', 'Lifecycle-dependent', '', '', '', ''),
('Healthcare & Life Sciences', 'Medical Devices', 'Lifecycle-dependent', '', '', '', ''),
('Healthcare & Life Sciences', 'Drug Manufacturers - Specialty & Generic', 'Lifecycle-dependent', '', '', '', ''),
('Healthcare & Life Sciences', 'Healthcare Plans', 'Lifecycle-dependent', '', '', '', ''),
('Healthcare & Life Sciences', 'Health Information Services', 'Lifecycle-dependent', '', '', '', ''),
('Healthcare & Life Sciences', 'Drug Manufacturers - General', 'Lifecycle-dependent', '', '', '', ''),
('Healthcare & Life Sciences', 'Diagnostics & Research', 'Lifecycle-dependent', '', '', '', ''),
('Healthcare & Life Sciences', 'Biotechnology', 'Lifecycle-dependent', '', '', '', ''),
('Healthcare & Life Sciences', 'Medical Care Facilities', 'Lifecycle-dependent', '', '', '', ''),

-- IT & Communications
('IT & Communications', 'Consumer Electronics', 'Use-phase Dominant', '', '', '', ''),
('IT & Communications', 'Electronic Components', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Electronics & Computer Distribution', 'Use-phase Dominant', '', '', '', ''),
('IT & Communications', 'Gig/Platform Delivery Services', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Marketplace Aggregators', 'Upstream-heavy', '', '', '', ''),
('IT & Communications', 'Drone Manufacturing & Services', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Software - Infrastructure', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Solar', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Information Technology Services', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Scientific & Technical Instruments', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Software - Application', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Semiconductors', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Semiconductor Equipment & Materials', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Cybersecurity & Cloud Protection Firms', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Telecom Services', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Data Centers', 'Scope 2-heavy', '', '', '', ''),
('IT & Communications', 'Crypto Mining', 'Scope 2-heavy', '', '', '', ''),
('IT & Communications', 'Advertising Agencies', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Broadcasting', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Space Launch Services', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Foundation Model Developers', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'AI Infrastructure', 'Scope 2-heavy', '', '', '', ''),
('IT & Communications', 'Electronic Gaming & Multimedia', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Entertainment', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Computer Hardware', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Internet Content & Information', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Publishing', 'Lifecycle-dependent', '', '', '', ''),
('IT & Communications', 'Communication Equipment', 'Lifecycle-dependent', '', '', '', ''),

-- Industrials & Capital Goods
('Industrials & Capital Goods', 'Micro-Mobility', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'EV Battery Manufacturing', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Electric Vertical Takeoff & Landing (eVTOL)', 'Use-phase Dominant', '', '', '', ''),
('Industrials & Capital Goods', 'Airports & Air Services', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Pollution & Treatment Controls', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Infrastructure Operations', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Integrated Freight & Logistics', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Marine Shipping', 'Use-phase Dominant', '', '', '', ''),
('Industrials & Capital Goods', 'Metal Fabrication', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Engineering & Construction', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Railroads', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Rental & Leasing Services', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Security & Protection Services', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Specialty Business Services', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Specialty Industrial Machinery', 'Use-phase Dominant', '', '', '', ''),
('Industrials & Capital Goods', 'Staffing & Employment Services', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Industrial Distribution', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Tools & Accessories', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Waste Management', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Electrical Equipment & Parts', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Consulting Services', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Conglomerates', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Business Equipment & Supplies', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Building Products & Equipment', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Airlines', 'Use-phase Dominant', '', '', '', ''),
('Industrials & Capital Goods', 'Aerospace & Defense', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Trucking', 'Lifecycle-dependent', '', '', '', ''),
('Industrials & Capital Goods', 'Farm & Heavy Construction Machinery', 'Use-phase Dominant', '', '', '', ''),

-- Infrastructure
('Infrastructure', 'Waste-to-Energy', 'Lifecycle-dependent', '', '', '', ''),
('Infrastructure', 'Biogas', 'Lifecycle-dependent', '', '', '', ''),
('Infrastructure', 'Battery Recycling', 'Lifecycle-dependent', '', '', '', ''),
('Infrastructure', 'Power Transmission & Distribution', 'Operational Emitter', '', '', '', ''),

-- Materials & Processing
('Materials & Processing', 'Other Industrial Metals & Mining', 'Operational Emitter', '', '', '', ''),
('Materials & Processing', 'Lumber & Wood Production', 'Lifecycle-dependent', '', '', '', ''),
('Materials & Processing', 'Other Precious Metals & Mining', 'Operational Emitter', '', '', '', ''),
('Materials & Processing', 'Gold', 'Lifecycle-dependent', '', '', '', ''),
('Materials & Processing', 'Copper', 'Lifecycle-dependent', '', '', '', ''),
('Materials & Processing', 'Coking Coal', 'Lifecycle-dependent', '', '', '', ''),
('Materials & Processing', 'Chemicals', 'Operational Emitter', '', '', '', ''),
('Materials & Processing', 'Biodegradable Plastics', 'Lifecycle-dependent', '', '', '', ''),
('Materials & Processing', 'Mycelium & Algae-Based Materials', 'Lifecycle-dependent', '', '', '', ''),
('Materials & Processing', 'Building Materials', 'Lifecycle-dependent', '', '', '', ''),
('Materials & Processing', 'Aluminum', 'Lifecycle-dependent', '', '', '', ''),
('Materials & Processing', 'Green Steel', 'Operational Emitter', '', '', '', ''),
('Materials & Processing', 'Cement', 'Operational Emitter', '', '', '', ''),
('Materials & Processing', 'Paper & Paper Products', 'Lifecycle-dependent', '', '', '', ''),
('Materials & Processing', 'Agricultural Inputs', 'Lifecycle-dependent', '', '', '', ''),
('Materials & Processing', 'Specialty Chemicals', 'Operational Emitter', '', '', '', ''),
('Materials & Processing', 'Steel', 'Operational Emitter', '', '', '', ''),
('Materials & Processing', 'Silver', 'Lifecycle-dependent', '', '', '', ''),

-- Other Services & Technologies
('Other Services & Technologies', 'Marine Aquaculture', 'Lifecycle-dependent', '', '', '', ''),
('Other Services & Technologies', 'ESG Ratings & Disclosure Services', 'Lifecycle-dependent', '', '', '', ''),
('Other Services & Technologies', 'Corporate Legal & Risk Advisory', 'Lifecycle-dependent', '', '', '', ''),

-- Real Estate
('Real Estate', 'REIT - Retail', 'Upstream-heavy', '', '', '', ''),
('Real Estate', 'REIT - Specialty', 'Lifecycle-dependent', '', '', '', ''),
('Real Estate', 'REIT - Mortgage', 'Lifecycle-dependent', '', '', '', ''),
('Real Estate', 'REIT - Industrial', 'Lifecycle-dependent', '', '', '', ''),
('Real Estate', 'REIT - Hotel & Motel', 'Lifecycle-dependent', '', '', '', ''),
('Real Estate', 'Real Estate Services', 'Lifecycle-dependent', '', '', '', ''),
('Real Estate', 'REIT - Diversified', 'Lifecycle-dependent', '', '', '', ''),
('Real Estate', 'Real Estate - Diversified', 'Lifecycle-dependent', '', '', '', ''),
('Real Estate', 'Real Estate - Development', 'Lifecycle-dependent', '', '', '', ''),
('Real Estate', 'REIT - Office', 'Lifecycle-dependent', '', '', '', ''),
('Real Estate', 'REIT - Healthcare Facilities', 'Lifecycle-dependent', '', '', '', ''),
('Real Estate', 'REIT - Residential', 'Lifecycle-dependent', '', '', '', '')

ON CONFLICT (industry) 
DO UPDATE SET
  sector = EXCLUDED.sector,
  emissions_archetype = EXCLUDED.emissions_archetype,
  updated_at = now();