-- Batch 3: Auto-generate metadata for next 40 incomplete industry_taxonomy records
-- Fill missing description, ghg_protocol_alignment, cdp_category, and sbti_pathway fields

UPDATE public.industry_taxonomy 
SET 
  description = CASE 
    WHEN industry LIKE '%Automotive%' OR industry LIKE '%Vehicle%' OR industry LIKE '%Car%' THEN 
      'Manufacturing and assembly of motor vehicles with significant Scope 1 emissions from production processes and Scope 3 emissions from vehicle lifecycle and supply chain operations.'
    WHEN industry LIKE '%Aerospace%' OR industry LIKE '%Aircraft%' OR industry LIKE '%Aviation%' THEN 
      'Design, manufacturing and maintenance of aircraft and aerospace systems with high energy-intensive production processes and complex global supply chains.'
    WHEN industry LIKE '%Steel%' OR industry LIKE '%Iron%' OR industry LIKE '%Metal%' THEN 
      'Production of steel and metal products through energy-intensive smelting and refining processes, representing one of the highest carbon intensity manufacturing sectors.'
    WHEN industry LIKE '%Chemical%' OR industry LIKE '%Petrochemical%' THEN 
      'Manufacturing of chemical products and petrochemicals with significant process emissions, energy consumption, and complex supply chain emissions profiles.'
    WHEN industry LIKE '%Cement%' OR industry LIKE '%Construction Materials%' THEN 
      'Production of cement and construction materials with substantial process emissions from limestone calcination and high energy requirements for kiln operations.'
    WHEN industry LIKE '%Oil%' OR industry LIKE '%Gas%' OR industry LIKE '%Petroleum%' THEN 
      'Exploration, extraction, refining and distribution of oil and gas products with significant Scope 1, 2, and 3 emissions across the value chain.'
    WHEN industry LIKE '%Power%' OR industry LIKE '%Electric%' OR industry LIKE '%Utility%' THEN 
      'Generation, transmission and distribution of electrical power with emissions profiles varying significantly by generation mix and grid carbon intensity.'
    WHEN industry LIKE '%Mining%' OR industry LIKE '%Coal%' THEN 
      'Extraction and processing of mineral resources with significant direct emissions from extraction processes and substantial Scope 3 emissions from product usage.'
    WHEN industry LIKE '%Food%' OR industry LIKE '%Agriculture%' OR industry LIKE '%Beverage%' THEN 
      'Production and processing of food and agricultural products with emissions from farming practices, processing, packaging, and distribution networks.'
    WHEN industry LIKE '%Textile%' OR industry LIKE '%Apparel%' OR industry LIKE '%Fashion%' THEN 
      'Manufacturing of textiles, clothing and fashion products with significant supply chain emissions from raw material production and global manufacturing networks.'
    WHEN industry LIKE '%Technology%' OR industry LIKE '%Software%' OR industry LIKE '%IT%' THEN 
      'Development and provision of technology products and services with primary emissions from energy consumption in data centers and supply chain manufacturing.'
    WHEN industry LIKE '%Pharmaceutical%' OR industry LIKE '%Healthcare%' THEN 
      'Research, development and manufacturing of pharmaceutical products with moderate direct emissions but significant supply chain complexity and regulatory requirements.'
    WHEN industry LIKE '%Financial%' OR industry LIKE '%Bank%' OR industry LIKE '%Insurance%' THEN 
      'Provision of financial services with minimal direct operational emissions but significant financed emissions through investment and lending portfolios.'
    WHEN industry LIKE '%Retail%' OR industry LIKE '%Consumer%' THEN 
      'Retail and consumer goods operations with primary emissions from supply chain, transportation, and facility operations across extensive distribution networks.'
    WHEN industry LIKE '%Transport%' OR industry LIKE '%Shipping%' OR industry LIKE '%Logistics%' THEN 
      'Transportation and logistics services with significant direct emissions from fuel consumption and substantial supply chain coordination responsibilities.'
    ELSE 
      'Industry operations with varying emissions profiles depending on production processes, energy consumption patterns, and supply chain complexity requiring tailored decarbonization approaches.'
  END,
  
  ghg_protocol_alignment = CASE 
    WHEN industry LIKE '%Oil%' OR industry LIKE '%Gas%' OR industry LIKE '%Petroleum%' OR industry LIKE '%Mining%' OR industry LIKE '%Coal%' THEN 
      'Scope 1: Direct emissions from extraction/refining processes; Scope 2: Energy consumption at facilities; Scope 3: Significant downstream product use emissions'
    WHEN industry LIKE '%Power%' OR industry LIKE '%Electric%' OR industry LIKE '%Utility%' THEN 
      'Scope 1: Direct emissions from power generation; Scope 2: Minimal auxiliary energy; Scope 3: Transmission losses and infrastructure lifecycle'
    WHEN industry LIKE '%Steel%' OR industry LIKE '%Cement%' OR industry LIKE '%Chemical%' OR industry LIKE '%Metal%' THEN 
      'Scope 1: High process emissions from industrial operations; Scope 2: Substantial electricity consumption; Scope 3: Raw material extraction and product use'
    WHEN industry LIKE '%Automotive%' OR industry LIKE '%Aerospace%' OR industry LIKE '%Manufacturing%' THEN 
      'Scope 1: Manufacturing process emissions; Scope 2: Facility energy consumption; Scope 3: Extensive supply chain and product lifecycle emissions'
    WHEN industry LIKE '%Financial%' OR industry LIKE '%Bank%' OR industry LIKE '%Insurance%' THEN 
      'Scope 1: Minimal direct emissions; Scope 2: Office building energy; Scope 3: Financed emissions constitute majority of carbon footprint'
    WHEN industry LIKE '%Technology%' OR industry LIKE '%Software%' OR industry LIKE '%IT%' THEN 
      'Scope 1: Minimal direct emissions; Scope 2: Data center and office energy consumption; Scope 3: Supply chain manufacturing and product use'
    WHEN industry LIKE '%Retail%' OR industry LIKE '%Consumer%' THEN 
      'Scope 1: Vehicle fleet and facility emissions; Scope 2: Store and warehouse energy; Scope 3: Extensive supply chain and product lifecycle'
    WHEN industry LIKE '%Food%' OR industry LIKE '%Agriculture%' OR industry LIKE '%Beverage%' THEN 
      'Scope 1: Agricultural processes and facility operations; Scope 2: Processing and storage energy; Scope 3: Supply chain and distribution emissions'
    WHEN industry LIKE '%Transport%' OR industry LIKE '%Shipping%' OR industry LIKE '%Logistics%' THEN 
      'Scope 1: Direct fuel consumption from fleet operations; Scope 2: Facility energy consumption; Scope 3: Supply chain coordination emissions'
    ELSE 
      'Scope 1: Direct operational emissions; Scope 2: Purchased energy consumption; Scope 3: Supply chain and value chain emissions varying by industry'
  END,

  cdp_category = CASE 
    WHEN industry LIKE '%Oil%' OR industry LIKE '%Gas%' OR industry LIKE '%Petroleum%' THEN 'Energy'
    WHEN industry LIKE '%Mining%' OR industry LIKE '%Coal%' OR industry LIKE '%Metal%' THEN 'Materials'
    WHEN industry LIKE '%Power%' OR industry LIKE '%Electric%' OR industry LIKE '%Utility%' THEN 'Energy'
    WHEN industry LIKE '%Steel%' OR industry LIKE '%Cement%' OR industry LIKE '%Chemical%' THEN 'Materials'
    WHEN industry LIKE '%Automotive%' OR industry LIKE '%Aerospace%' THEN 'Manufacturing'
    WHEN industry LIKE '%Food%' OR industry LIKE '%Agriculture%' OR industry LIKE '%Beverage%' THEN 'Consumer Staples'
    WHEN industry LIKE '%Financial%' OR industry LIKE '%Bank%' OR industry LIKE '%Insurance%' THEN 'Financial Services'
    WHEN industry LIKE '%Technology%' OR industry LIKE '%Software%' OR industry LIKE '%IT%' THEN 'Information Technology'
    WHEN industry LIKE '%Pharmaceutical%' OR industry LIKE '%Healthcare%' THEN 'Health Care'
    WHEN industry LIKE '%Retail%' OR industry LIKE '%Consumer%' THEN 'Consumer Discretionary'
    WHEN industry LIKE '%Textile%' OR industry LIKE '%Apparel%' OR industry LIKE '%Fashion%' THEN 'Consumer Discretionary'
    WHEN industry LIKE '%Transport%' OR industry LIKE '%Shipping%' OR industry LIKE '%Logistics%' THEN 'Transportation'
    WHEN industry LIKE '%Real Estate%' OR industry LIKE '%Construction%' THEN 'Real Estate'
    ELSE 'Industrials'
  END,

  sbti_pathway = CASE 
    WHEN industry LIKE '%Oil%' OR industry LIKE '%Gas%' OR industry LIKE '%Petroleum%' THEN 
      'Oil and Gas: Absolute contraction approach with 2.5% annual reduction in production emissions and methane intensity targets'
    WHEN industry LIKE '%Power%' OR industry LIKE '%Electric%' OR industry LIKE '%Utility%' THEN 
      'Power Generation: Sectoral decarbonization approach aligned with 1.5°C pathway requiring renewable energy transition'
    WHEN industry LIKE '%Steel%' OR industry LIKE '%Metal%' THEN 
      'Steel: Sectoral decarbonization approach with technology transition to hydrogen-based production and circular economy principles'
    WHEN industry LIKE '%Cement%' THEN 
      'Cement: Sectoral decarbonization approach focusing on alternative fuels, energy efficiency, and carbon capture technologies'
    WHEN industry LIKE '%Aviation%' OR industry LIKE '%Aerospace%' OR industry LIKE '%Aircraft%' THEN 
      'Aviation: Sectoral approach with sustainable aviation fuels, operational efficiency, and technology advancement requirements'
    WHEN industry LIKE '%Automotive%' OR industry LIKE '%Vehicle%' THEN 
      'Transport OEMs: Sectoral decarbonization approach with vehicle electrification and lifecycle emissions reduction'
    WHEN industry LIKE '%Shipping%' THEN 
      'Shipping: Sectoral approach requiring alternative fuels transition and operational efficiency improvements'
    WHEN industry LIKE '%Financial%' OR industry LIKE '%Bank%' OR industry LIKE '%Insurance%' THEN 
      'Financial Services: Temperature rating methodology for financed emissions with 1.5°C portfolio alignment targets'
    WHEN industry LIKE '%Aluminum%' OR industry LIKE '%Aluminium%' THEN 
      'Aluminum: Sectoral decarbonization approach with renewable energy transition and smelting technology advancement'
    WHEN industry LIKE '%Chemical%' OR industry LIKE '%Petrochemical%' THEN 
      'Chemicals: Absolute contraction approach with focus on process optimization, renewable feedstocks, and circular economy'
    WHEN industry LIKE '%Food%' OR industry LIKE '%Agriculture%' OR industry LIKE '%Beverage%' THEN 
      'Food, Beverage & Agriculture: Absolute contraction approach with regenerative agriculture and supply chain transformation'
    ELSE 
      'Absolute contraction approach: Economy-wide 4.2% annual reduction in absolute emissions aligned with 1.5°C temperature goal'
  END,

  updated_at = now()

WHERE id IN (
  SELECT id FROM public.industry_taxonomy 
  WHERE (description IS NULL OR description = '' OR 
         ghg_protocol_alignment IS NULL OR ghg_protocol_alignment = '' OR 
         cdp_category IS NULL OR cdp_category = '' OR 
         sbti_pathway IS NULL OR sbti_pathway = '')
  ORDER BY created_at ASC, industry ASC
  LIMIT 40
);

-- Log completion status
DO $$
DECLARE
  updated_count INTEGER;
  remaining_count INTEGER;
  total_count INTEGER;
BEGIN
  -- Get counts
  SELECT COUNT(*) INTO updated_count FROM public.industry_taxonomy 
  WHERE description IS NOT NULL AND description != '' AND 
        ghg_protocol_alignment IS NOT NULL AND ghg_protocol_alignment != '' AND 
        cdp_category IS NOT NULL AND cdp_category != '' AND 
        sbti_pathway IS NOT NULL AND sbti_pathway != '';
        
  SELECT COUNT(*) INTO remaining_count FROM public.industry_taxonomy 
  WHERE (description IS NULL OR description = '' OR 
         ghg_protocol_alignment IS NULL OR ghg_protocol_alignment = '' OR 
         cdp_category IS NULL OR cdp_category = '' OR 
         sbti_pathway IS NULL OR sbti_pathway = '');
         
  SELECT COUNT(*) INTO total_count FROM public.industry_taxonomy;
  
  RAISE NOTICE 'Batch 3 Complete: % industries fully populated, % remaining, % total entries', 
    updated_count, remaining_count, total_count;
END $$;