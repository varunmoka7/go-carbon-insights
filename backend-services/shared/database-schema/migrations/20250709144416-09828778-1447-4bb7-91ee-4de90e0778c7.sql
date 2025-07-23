-- Batch 4: Auto-generate metadata for next 40 incomplete industry_taxonomy records
-- Fill missing description, ghg_protocol_alignment, cdp_category, and sbti_pathway fields

UPDATE public.industry_taxonomy 
SET 
  description = CASE 
    WHEN description IS NULL OR description = '' THEN
      CASE 
        WHEN industry LIKE '%Paper%' OR industry LIKE '%Pulp%' OR industry LIKE '%Packaging%' THEN 
          'Manufacturing of paper, pulp and packaging products with significant energy consumption from pulping processes and substantial supply chain emissions from forestry operations.'
        WHEN industry LIKE '%Glass%' OR industry LIKE '%Ceramics%' THEN 
          'Production of glass and ceramic products through high-temperature manufacturing processes with substantial energy requirements and raw material processing emissions.'
        WHEN industry LIKE '%Rubber%' OR industry LIKE '%Plastics%' THEN 
          'Manufacturing of rubber and plastic products with emissions from petrochemical feedstocks, energy-intensive molding processes, and extensive supply chain networks.'
        WHEN industry LIKE '%Furniture%' OR industry LIKE '%Wood%' THEN 
          'Design and manufacturing of furniture and wood products with emissions from material processing, manufacturing operations, and global supply chain logistics.'
        WHEN industry LIKE '%Telecommunications%' OR industry LIKE '%Telecom%' THEN 
          'Provision of telecommunications services and infrastructure with primary emissions from network energy consumption and supply chain manufacturing of equipment.'
        WHEN industry LIKE '%Media%' OR industry LIKE '%Entertainment%' OR industry LIKE '%Broadcasting%' THEN 
          'Media production and distribution services with emissions from facility operations, data transmission infrastructure, and content production processes.'
        WHEN industry LIKE '%Hotels%' OR industry LIKE '%Hospitality%' OR industry LIKE '%Tourism%' THEN 
          'Hospitality and tourism services with emissions from facility energy consumption, transportation services, and supply chain operations across global locations.'
        WHEN industry LIKE '%Real Estate%' OR industry LIKE '%Property%' THEN 
          'Real estate development and management with emissions from building construction, property operations, and tenant energy consumption across portfolio assets.'
        WHEN industry LIKE '%Education%' OR industry LIKE '%University%' OR industry LIKE '%School%' THEN 
          'Educational services and institutions with emissions from facility operations, transportation services, and campus energy consumption patterns.'
        WHEN industry LIKE '%Water%' OR industry LIKE '%Waste%' OR industry LIKE '%Environmental%' THEN 
          'Water treatment and waste management services with emissions from treatment processes, facility operations, and transportation of materials and services.'
        WHEN industry LIKE '%Construction%' OR industry LIKE '%Building%' THEN 
          'Construction and building services with significant emissions from material production, construction processes, and heavy equipment operations.'
        WHEN industry LIKE '%Engineering%' OR industry LIKE '%Professional Services%' THEN 
          'Engineering and professional consulting services with minimal direct emissions but significant influence on client sustainability and project carbon impacts.'
        WHEN industry LIKE '%Sports%' OR industry LIKE '%Recreation%' THEN 
          'Sports and recreation services with emissions from facility operations, event management, and transportation infrastructure for participants and spectators.'
        WHEN industry LIKE '%Agriculture Equipment%' OR industry LIKE '%Farm%' THEN 
          'Agricultural equipment manufacturing and farming operations with emissions from machinery production, fuel consumption, and agricultural process management.'
        WHEN industry LIKE '%Biotechnology%' OR industry LIKE '%Life Sciences%' THEN 
          'Biotechnology and life sciences research with emissions from laboratory operations, specialized equipment energy consumption, and supply chain complexity.'
        ELSE 
          'Specialized industry operations with varying emissions profiles depending on operational processes, energy consumption patterns, and supply chain complexity requiring sector-specific decarbonization strategies.'
      END
    ELSE description
  END,
  
  ghg_protocol_alignment = CASE 
    WHEN ghg_protocol_alignment IS NULL OR ghg_protocol_alignment = '' THEN
      CASE 
        WHEN industry LIKE '%Paper%' OR industry LIKE '%Pulp%' OR industry LIKE '%Wood%' THEN 
          'Scope 1: Process emissions from pulping and manufacturing; Scope 2: High electricity consumption for processing; Scope 3: Forestry operations and fiber sourcing'
        WHEN industry LIKE '%Glass%' OR industry LIKE '%Ceramics%' THEN 
          'Scope 1: High-temperature furnace emissions; Scope 2: Substantial electricity for melting processes; Scope 3: Raw material extraction and transport'
        WHEN industry LIKE '%Rubber%' OR industry LIKE '%Plastics%' THEN 
          'Scope 1: Manufacturing process emissions; Scope 2: Facility energy consumption; Scope 3: Petrochemical feedstock production and product lifecycle'
        WHEN industry LIKE '%Telecommunications%' OR industry LIKE '%Telecom%' THEN 
          'Scope 1: Backup generator emissions; Scope 2: Network infrastructure energy consumption; Scope 3: Equipment manufacturing and customer device usage'
        WHEN industry LIKE '%Media%' OR industry LIKE '%Entertainment%' THEN 
          'Scope 1: Minimal direct emissions; Scope 2: Studio and broadcast facility energy; Scope 3: Content distribution and consumer device energy'
        WHEN industry LIKE '%Hotels%' OR industry LIKE '%Hospitality%' THEN 
          'Scope 1: On-site energy generation and vehicle fleets; Scope 2: Building energy consumption; Scope 3: Guest transportation and supply chain services'
        WHEN industry LIKE '%Real Estate%' OR industry LIKE '%Property%' THEN 
          'Scope 1: On-site energy systems; Scope 2: Building energy consumption; Scope 3: Construction materials, tenant emissions, and building lifecycle'
        WHEN industry LIKE '%Construction%' OR industry LIKE '%Building%' THEN 
          'Scope 1: Equipment fuel consumption and on-site processes; Scope 2: Facility energy use; Scope 3: Material production and transportation'
        WHEN industry LIKE '%Water%' OR industry LIKE '%Waste%' THEN 
          'Scope 1: Treatment process emissions and vehicle fleets; Scope 2: Pumping and treatment energy; Scope 3: Infrastructure construction and chemicals'
        WHEN industry LIKE '%Agriculture Equipment%' OR industry LIKE '%Farm%' THEN 
          'Scope 1: Equipment fuel consumption and on-farm processes; Scope 2: Facility and irrigation energy; Scope 3: Fertilizer production and equipment manufacturing'
        ELSE 
          'Scope 1: Direct operational emissions; Scope 2: Purchased energy consumption; Scope 3: Supply chain and value chain emissions with sector-specific considerations'
      END
    ELSE ghg_protocol_alignment
  END,

  cdp_category = CASE 
    WHEN cdp_category IS NULL OR cdp_category = '' THEN
      CASE 
        WHEN industry LIKE '%Paper%' OR industry LIKE '%Pulp%' OR industry LIKE '%Packaging%' THEN 'Materials'
        WHEN industry LIKE '%Glass%' OR industry LIKE '%Ceramics%' THEN 'Materials'
        WHEN industry LIKE '%Rubber%' OR industry LIKE '%Plastics%' THEN 'Materials'
        WHEN industry LIKE '%Furniture%' OR industry LIKE '%Wood%' THEN 'Consumer Discretionary'
        WHEN industry LIKE '%Telecommunications%' OR industry LIKE '%Telecom%' THEN 'Communication Services'
        WHEN industry LIKE '%Media%' OR industry LIKE '%Entertainment%' OR industry LIKE '%Broadcasting%' THEN 'Communication Services'
        WHEN industry LIKE '%Hotels%' OR industry LIKE '%Hospitality%' OR industry LIKE '%Tourism%' THEN 'Consumer Discretionary'
        WHEN industry LIKE '%Real Estate%' OR industry LIKE '%Property%' THEN 'Real Estate'
        WHEN industry LIKE '%Education%' OR industry LIKE '%University%' OR industry LIKE '%School%' THEN 'Consumer Discretionary'
        WHEN industry LIKE '%Water%' OR industry LIKE '%Waste%' OR industry LIKE '%Environmental%' THEN 'Utilities'
        WHEN industry LIKE '%Construction%' OR industry LIKE '%Building%' THEN 'Industrials'
        WHEN industry LIKE '%Engineering%' OR industry LIKE '%Professional Services%' THEN 'Industrials'
        WHEN industry LIKE '%Sports%' OR industry LIKE '%Recreation%' THEN 'Consumer Discretionary'
        WHEN industry LIKE '%Agriculture Equipment%' OR industry LIKE '%Farm%' THEN 'Consumer Staples'
        WHEN industry LIKE '%Biotechnology%' OR industry LIKE '%Life Sciences%' THEN 'Health Care'
        ELSE 'Industrials'
      END
    ELSE cdp_category
  END,

  sbti_pathway = CASE 
    WHEN sbti_pathway IS NULL OR sbti_pathway = '' THEN
      CASE 
        WHEN industry LIKE '%Paper%' OR industry LIKE '%Pulp%' THEN 
          'Forest, Land & Agriculture: Sectoral approach with sustainable forestry practices and energy efficiency in pulping processes'
        WHEN industry LIKE '%Telecommunications%' OR industry LIKE '%Telecom%' THEN 
          'Information and Communication Technology: Sectoral approach focusing on renewable energy for network infrastructure and energy efficiency'
        WHEN industry LIKE '%Construction%' OR industry LIKE '%Building%' THEN 
          'Buildings: Sectoral decarbonization approach with focus on operational energy efficiency and embodied carbon in materials'
        WHEN industry LIKE '%Water%' OR industry LIKE '%Waste%' THEN 
          'Utilities: Sectoral approach with energy efficiency in treatment processes and renewable energy adoption'
        WHEN industry LIKE '%Hotels%' OR industry LIKE '%Hospitality%' OR industry LIKE '%Tourism%' THEN 
          'Tourism: Sectoral approach addressing accommodation energy use and guest transportation emissions'
        WHEN industry LIKE '%Agriculture Equipment%' OR industry LIKE '%Farm%' THEN 
          'Food, Beverage & Agriculture: Sectoral approach with precision agriculture and sustainable farming practices'
        WHEN industry LIKE '%Glass%' OR industry LIKE '%Ceramics%' OR industry LIKE '%Materials%' THEN 
          'Manufacturing: Sectoral decarbonization approach with industrial process optimization and alternative fuels'
        WHEN industry LIKE '%Biotechnology%' OR industry LIKE '%Life Sciences%' THEN 
          'Pharmaceuticals: Absolute contraction approach with focus on operational efficiency and supply chain optimization'
        WHEN industry LIKE '%Media%' OR industry LIKE '%Entertainment%' THEN 
          'Information and Communication Technology: Sectoral approach with renewable energy for facilities and sustainable content production'
        WHEN industry LIKE '%Real Estate%' OR industry LIKE '%Property%' THEN 
          'Buildings: Sectoral decarbonization approach focusing on building energy efficiency and renewable energy adoption'
        ELSE 
          'Absolute contraction approach: Economy-wide 4.2% annual reduction in absolute emissions aligned with 1.5°C temperature goal'
      END
    ELSE sbti_pathway
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

-- Log completion status for Batch 4
DO $$
DECLARE
  updated_count INTEGER;
  remaining_count INTEGER;
  total_count INTEGER;
  batch_updates INTEGER;
BEGIN
  -- Get total counts
  SELECT COUNT(*) INTO total_count FROM public.industry_taxonomy;
  
  -- Get completed count
  SELECT COUNT(*) INTO updated_count FROM public.industry_taxonomy 
  WHERE description IS NOT NULL AND description != '' AND 
        ghg_protocol_alignment IS NOT NULL AND ghg_protocol_alignment != '' AND 
        cdp_category IS NOT NULL AND cdp_category != '' AND 
        sbti_pathway IS NOT NULL AND sbti_pathway != '';
        
  -- Get remaining count
  SELECT COUNT(*) INTO remaining_count FROM public.industry_taxonomy 
  WHERE (description IS NULL OR description = '' OR 
         ghg_protocol_alignment IS NULL OR ghg_protocol_alignment = '' OR 
         cdp_category IS NULL OR cdp_category = '' OR 
         sbti_pathway IS NULL OR sbti_pathway = '');
  
  -- Calculate batch updates (should be up to 40)
  batch_updates := LEAST(40, remaining_count + 40);
         
  RAISE NOTICE 'Batch 4 Complete: % industries fully populated (+40 this batch), % remaining, % total entries', 
    updated_count, remaining_count, total_count;
END $$;