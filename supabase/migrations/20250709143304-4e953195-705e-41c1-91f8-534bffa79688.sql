-- Resume metadata generation for next 40 incomplete industries
-- Update missing fields for description, ghg_protocol_alignment, cdp_category, and sbti_pathway

-- Update the next batch of 40 incomplete industries
UPDATE industry_taxonomy SET 
  description = CASE industry
    WHEN 'Advertising Agencies' THEN 'Marketing and advertising service provision'
    WHEN 'Aerospace & Defense' THEN 'Aircraft and defense system manufacturing'
    WHEN 'Agricultural Inputs' THEN 'Fertilizer and agricultural chemical manufacturing'
    WHEN 'AI Infrastructure' THEN 'Artificial intelligence computing infrastructure'
    WHEN 'Airports & Air Services' THEN 'Airport operations and aviation support services'
    WHEN 'Aluminum' THEN 'Aluminum smelting and processing operations'
    WHEN 'Ammonia Production' THEN 'Low-carbon ammonia synthesis and distribution'
    WHEN 'Apparel Manufacturing' THEN 'Clothing design and textile production'
    WHEN 'Apparel Retail' THEN 'Fashion retail and clothing distribution'
    WHEN 'Asset Management' THEN 'Investment portfolio management and advisory services'
    WHEN 'Auto Manufacturers' THEN 'Vehicle design and automotive assembly'
    WHEN 'Auto Parts' THEN 'Automotive component manufacturing and supply'
    WHEN 'Auto & Truck Dealerships' THEN 'Vehicle sales and automotive services'
    WHEN 'Banks - Diversified' THEN 'Full-service commercial and investment banking'
    WHEN 'Banks - Regional' THEN 'Regional commercial banking and lending'
    WHEN 'Battery Recycling' THEN 'Used battery collection and processing'
    WHEN 'Beverages - Brewers' THEN 'Beer production and brewing operations'
    WHEN 'Beverages - Non-Alcoholic' THEN 'Soft drink manufacturing and distribution'
    WHEN 'Beverages - Wineries & Distilleries' THEN 'Wine and spirits production'
    WHEN 'Bio-based Chemicals' THEN 'Renewable feedstock chemical manufacturing'
    WHEN 'Biochar Production' THEN 'Carbon sequestration through pyrolysis processing'
    WHEN 'Biodegradable Plastics' THEN 'Compostable plastic material manufacturing'
    WHEN 'Biogas' THEN 'Organic waste to energy conversion'
    WHEN 'Biotechnology' THEN 'Biological research and therapeutic development'
    WHEN 'Broadcasting' THEN 'Television and radio content distribution'
    WHEN 'Building Materials' THEN 'Construction material manufacturing and supply'
    WHEN 'Building Products & Equipment' THEN 'Construction material and equipment manufacturing'
    WHEN 'Business Equipment & Supplies' THEN 'Office equipment and supply manufacturing'
    WHEN 'Capital Markets' THEN 'Investment banking and securities trading'
    WHEN 'Carbon Capture (CCUS)' THEN 'Direct CO2 capture and storage systems'
    WHEN 'Carbon Offset Registries' THEN 'Carbon credit registry and verification services'
    WHEN 'Carbon Trading Platforms' THEN 'Carbon market trading and exchange services'
    WHEN 'Cement' THEN 'Cement production and clinker manufacturing'
    WHEN 'Chemicals' THEN 'Industrial chemical manufacturing and processing'
    WHEN 'Coking Coal' THEN 'Metallurgical coal production for steelmaking'
    WHEN 'Communication Equipment' THEN 'Telecommunications equipment manufacturing'
    WHEN 'Computer Hardware' THEN 'Computer and hardware device manufacturing'
    WHEN 'Confectioners' THEN 'Candy and confectionery manufacturing'
    WHEN 'Conglomerates' THEN 'Diversified industrial holding companies'
    WHEN 'Consulting Services' THEN 'Professional advisory and consulting services'
  END,
  ghg_protocol_alignment = CASE industry
    WHEN 'Advertising Agencies' THEN 'Scope 3 Category 6: Business travel and digital advertising'
    WHEN 'Aerospace & Defense' THEN 'Scope 1 manufacturing and Scope 3 use-phase'
    WHEN 'Agricultural Inputs' THEN 'Scope 1 chemical production and use-phase emissions'
    WHEN 'AI Infrastructure' THEN 'Scope 2 high-intensity compute operations'
    WHEN 'Airports & Air Services' THEN 'Scope 1 ground operations and Scope 3 aircraft'
    WHEN 'Aluminum' THEN 'Scope 2 electricity-intensive smelting operations'
    WHEN 'Ammonia Production' THEN 'Scope 1 process emissions from synthesis reactions'
    WHEN 'Apparel Manufacturing' THEN 'Scope 3 Category 1: Raw material sourcing dominant'
    WHEN 'Apparel Retail' THEN 'Scope 3 Category 1: Product procurement dominant'
    WHEN 'Asset Management' THEN 'Scope 3 Category 15: Financed emissions dominate'
    WHEN 'Auto Manufacturers' THEN 'Lifecycle emissions from production to fuel combustion'
    WHEN 'Auto Parts' THEN 'Scope 3 Category 11: Use-phase emissions dominant'
    WHEN 'Auto & Truck Dealerships' THEN 'Scope 3 Category 11: Vehicle use-phase emissions'
    WHEN 'Banks - Diversified' THEN 'Scope 3 Category 15: Financed emissions dominate'
    WHEN 'Banks - Regional' THEN 'Scope 3 Category 15: Financed emissions dominate'
    WHEN 'Battery Recycling' THEN 'Scope 1 processing and negative emissions potential'
    WHEN 'Beverages - Brewers' THEN 'Scope 3 Category 1: Agricultural input sourcing'
    WHEN 'Beverages - Non-Alcoholic' THEN 'Scope 3 Category 1: Ingredient sourcing dominant'
    WHEN 'Beverages - Wineries & Distilleries' THEN 'Scope 3 Category 1: Agricultural sourcing focus'
    WHEN 'Bio-based Chemicals' THEN 'Scope 1 direct emissions from chemical processing'
    WHEN 'Biochar Production' THEN 'Scope 1 and lifecycle carbon sequestration benefits'
    WHEN 'Biodegradable Plastics' THEN 'Scope 1 manufacturing and positive end-of-life'
    WHEN 'Biogas' THEN 'Scope 1 biogas production and methane capture'
    WHEN 'Biotechnology' THEN 'Scope 2 laboratory operations and R&D facilities'
    WHEN 'Broadcasting' THEN 'Scope 2 transmission infrastructure operations'
    WHEN 'Building Materials' THEN 'Scope 1 manufacturing and embodied carbon'
    WHEN 'Building Products & Equipment' THEN 'Scope 1 manufacturing and embodied carbon'
    WHEN 'Business Equipment & Supplies' THEN 'Scope 1 manufacturing and use-phase considerations'
    WHEN 'Capital Markets' THEN 'Scope 3 Category 15: Financed emissions dominate'
    WHEN 'Carbon Capture (CCUS)' THEN 'Scope 2 electricity for compression and storage'
    WHEN 'Carbon Offset Registries' THEN 'Carbon accounting and verification services'
    WHEN 'Carbon Trading Platforms' THEN 'Facilitating carbon market transactions'
    WHEN 'Cement' THEN 'Scope 1 process emissions from clinker production'
    WHEN 'Chemicals' THEN 'Scope 1 direct emissions from chemical processes'
    WHEN 'Coking Coal' THEN 'Scope 1 extraction and Scope 3 steel production'
    WHEN 'Communication Equipment' THEN 'Scope 1 manufacturing and use-phase efficiency'
    WHEN 'Computer Hardware' THEN 'Scope 1 manufacturing and use-phase considerations'
    WHEN 'Confectioners' THEN 'Scope 1 manufacturing and Scope 3 ingredients'
    WHEN 'Conglomerates' THEN 'Multi-sector emissions across portfolio companies'
    WHEN 'Consulting Services' THEN 'Scope 3 Category 6: Business travel dominant'
  END,
  cdp_category = CASE industry
    WHEN 'Advertising Agencies' THEN 'Media'
    WHEN 'Aerospace & Defense' THEN 'Aerospace & Defense'
    WHEN 'Agricultural Inputs' THEN 'Chemicals'
    WHEN 'AI Infrastructure' THEN 'Technology Hardware & Equipment'
    WHEN 'Airports & Air Services' THEN 'Transportation'
    WHEN 'Aluminum' THEN 'Materials'
    WHEN 'Ammonia Production' THEN 'Chemicals'
    WHEN 'Apparel Manufacturing' THEN 'Apparel'
    WHEN 'Apparel Retail' THEN 'Retailing'
    WHEN 'Asset Management' THEN 'Diversified Financials'
    WHEN 'Auto Manufacturers' THEN 'Automotive'
    WHEN 'Auto Parts' THEN 'Automotive'
    WHEN 'Auto & Truck Dealerships' THEN 'Retailing'
    WHEN 'Banks - Diversified' THEN 'Banks'
    WHEN 'Banks - Regional' THEN 'Banks'
    WHEN 'Battery Recycling' THEN 'Commercial Services & Supplies'
    WHEN 'Beverages - Brewers' THEN 'Food, Beverage & Tobacco'
    WHEN 'Beverages - Non-Alcoholic' THEN 'Food, Beverage & Tobacco'
    WHEN 'Beverages - Wineries & Distilleries' THEN 'Food, Beverage & Tobacco'
    WHEN 'Bio-based Chemicals' THEN 'Chemicals'
    WHEN 'Biochar Production' THEN 'Materials'
    WHEN 'Biodegradable Plastics' THEN 'Chemicals'
    WHEN 'Biogas' THEN 'Utilities'
    WHEN 'Biotechnology' THEN 'Pharmaceuticals, Biotechnology & Life Sciences'
    WHEN 'Broadcasting' THEN 'Media'
    WHEN 'Building Materials' THEN 'Materials'
    WHEN 'Building Products & Equipment' THEN 'Capital Goods'
    WHEN 'Business Equipment & Supplies' THEN 'Commercial Services & Supplies'
    WHEN 'Capital Markets' THEN 'Diversified Financials'
    WHEN 'Carbon Capture (CCUS)' THEN 'Utilities'
    WHEN 'Carbon Offset Registries' THEN 'Diversified Financials'
    WHEN 'Carbon Trading Platforms' THEN 'Diversified Financials'
    WHEN 'Cement' THEN 'Materials'
    WHEN 'Chemicals' THEN 'Chemicals'
    WHEN 'Coking Coal' THEN 'Energy'
    WHEN 'Communication Equipment' THEN 'Technology Hardware & Equipment'
    WHEN 'Computer Hardware' THEN 'Technology Hardware & Equipment'
    WHEN 'Confectioners' THEN 'Food, Beverage & Tobacco'
    WHEN 'Conglomerates' THEN 'Capital Goods'
    WHEN 'Consulting Services' THEN 'Commercial Services & Supplies'
  END,
  sbti_pathway = CASE industry
    WHEN 'Advertising Agencies' THEN 'Absolute emissions reduction'
    WHEN 'Aerospace & Defense' THEN 'Sectoral decarbonization approach'
    WHEN 'Agricultural Inputs' THEN 'Sectoral decarbonization approach'
    WHEN 'AI Infrastructure' THEN 'Absolute emissions reduction'
    WHEN 'Airports & Air Services' THEN 'Absolute emissions reduction'
    WHEN 'Aluminum' THEN 'Sectoral decarbonization approach'
    WHEN 'Ammonia Production' THEN 'Sectoral decarbonization approach'
    WHEN 'Apparel Manufacturing' THEN 'Absolute emissions reduction'
    WHEN 'Apparel Retail' THEN 'Absolute emissions reduction'
    WHEN 'Asset Management' THEN 'Portfolio-based targets'
    WHEN 'Auto Manufacturers' THEN 'Sectoral decarbonization approach'
    WHEN 'Auto Parts' THEN 'Sectoral decarbonization approach'
    WHEN 'Auto & Truck Dealerships' THEN 'Absolute emissions reduction'
    WHEN 'Banks - Diversified' THEN 'Portfolio-based targets'
    WHEN 'Banks - Regional' THEN 'Portfolio-based targets'
    WHEN 'Battery Recycling' THEN 'Already aligned with net-zero'
    WHEN 'Beverages - Brewers' THEN 'Absolute emissions reduction'
    WHEN 'Beverages - Non-Alcoholic' THEN 'Absolute emissions reduction'
    WHEN 'Beverages - Wineries & Distilleries' THEN 'Absolute emissions reduction'
    WHEN 'Bio-based Chemicals' THEN 'Absolute emissions reduction'
    WHEN 'Biochar Production' THEN 'Already aligned with net-zero'
    WHEN 'Biodegradable Plastics' THEN 'Already aligned with net-zero'
    WHEN 'Biogas' THEN 'Already aligned with net-zero'
    WHEN 'Biotechnology' THEN 'Absolute emissions reduction'
    WHEN 'Broadcasting' THEN 'Absolute emissions reduction'
    WHEN 'Building Materials' THEN 'Sectoral decarbonization approach'
    WHEN 'Building Products & Equipment' THEN 'Absolute emissions reduction'
    WHEN 'Business Equipment & Supplies' THEN 'Absolute emissions reduction'
    WHEN 'Capital Markets' THEN 'Portfolio-based targets'
    WHEN 'Carbon Capture (CCUS)' THEN 'Already aligned with net-zero'
    WHEN 'Carbon Offset Registries' THEN 'Already aligned with net-zero'
    WHEN 'Carbon Trading Platforms' THEN 'Already aligned with net-zero'
    WHEN 'Cement' THEN 'Sectoral decarbonization approach'
    WHEN 'Chemicals' THEN 'Sectoral decarbonization approach'
    WHEN 'Coking Coal' THEN 'Sectoral decarbonization approach'
    WHEN 'Communication Equipment' THEN 'Absolute emissions reduction'
    WHEN 'Computer Hardware' THEN 'Absolute emissions reduction'
    WHEN 'Confectioners' THEN 'Absolute emissions reduction'
    WHEN 'Conglomerates' THEN 'Absolute emissions reduction'
    WHEN 'Consulting Services' THEN 'Absolute emissions reduction'
  END
WHERE industry IN (
  'Advertising Agencies', 'Aerospace & Defense', 'Agricultural Inputs', 'AI Infrastructure', 
  'Airports & Air Services', 'Aluminum', 'Ammonia Production', 'Apparel Manufacturing', 
  'Apparel Retail', 'Asset Management', 'Auto Manufacturers', 'Auto Parts', 
  'Auto & Truck Dealerships', 'Banks - Diversified', 'Banks - Regional', 'Battery Recycling', 
  'Beverages - Brewers', 'Beverages - Non-Alcoholic', 'Beverages - Wineries & Distilleries', 
  'Bio-based Chemicals', 'Biochar Production', 'Biodegradable Plastics', 'Biogas', 
  'Biotechnology', 'Broadcasting', 'Building Materials', 'Building Products & Equipment', 
  'Business Equipment & Supplies', 'Capital Markets', 'Carbon Capture (CCUS)', 
  'Carbon Offset Registries', 'Carbon Trading Platforms', 'Cement', 'Chemicals', 
  'Coking Coal', 'Communication Equipment', 'Computer Hardware', 'Confectioners', 
  'Conglomerates', 'Consulting Services'
) AND (
  description IS NULL OR description = '' OR 
  ghg_protocol_alignment IS NULL OR ghg_protocol_alignment = '' OR 
  cdp_category IS NULL OR cdp_category = '' OR 
  sbti_pathway IS NULL OR sbti_pathway = ''
);

-- Update the timestamp for modified records
UPDATE industry_taxonomy 
SET updated_at = NOW() 
WHERE industry IN (
  'Advertising Agencies', 'Aerospace & Defense', 'Agricultural Inputs', 'AI Infrastructure', 
  'Airports & Air Services', 'Aluminum', 'Ammonia Production', 'Apparel Manufacturing', 
  'Apparel Retail', 'Asset Management', 'Auto Manufacturers', 'Auto Parts', 
  'Auto & Truck Dealerships', 'Banks - Diversified', 'Banks - Regional', 'Battery Recycling', 
  'Beverages - Brewers', 'Beverages - Non-Alcoholic', 'Beverages - Wineries & Distilleries', 
  'Bio-based Chemicals', 'Biochar Production', 'Biodegradable Plastics', 'Biogas', 
  'Biotechnology', 'Broadcasting', 'Building Materials', 'Building Products & Equipment', 
  'Business Equipment & Supplies', 'Capital Markets', 'Carbon Capture (CCUS)', 
  'Carbon Offset Registries', 'Carbon Trading Platforms', 'Cement', 'Chemicals', 
  'Coking Coal', 'Communication Equipment', 'Computer Hardware', 'Confectioners', 
  'Conglomerates', 'Consulting Services'
);