-- Batch 5: Complete metadata generation for ALL remaining incomplete industry_taxonomy records
-- Fill missing description, ghg_protocol_alignment, cdp_category, and sbti_pathway fields
-- This should achieve 100% metadata coverage

UPDATE public.industry_taxonomy 
SET 
  description = CASE 
    WHEN description IS NULL OR description = '' THEN
      CASE 
        WHEN industry LIKE '%Semiconductor%' OR industry LIKE '%Electronics%' OR industry LIKE '%Chip%' THEN 
          'Design and manufacturing of semiconductors and electronic components with high energy consumption from fabrication processes and complex global supply chains.'
        WHEN industry LIKE '%Tobacco%' OR industry LIKE '%Cigarette%' THEN 
          'Manufacturing and distribution of tobacco products with emissions from agricultural sourcing, processing operations, and global distribution networks.'
        WHEN industry LIKE '%Jewelry%' OR industry LIKE '%Luxury%' OR industry LIKE '%Watches%' THEN 
          'Design and manufacturing of luxury goods and jewelry with emissions from precious metal extraction, craftsmanship processes, and global retail operations.'
        WHEN industry LIKE '%Gaming%' OR industry LIKE '%Gambling%' OR industry LIKE '%Casino%' THEN 
          'Gaming and entertainment services with emissions from facility operations, data center infrastructure, and customer transportation services.'
        WHEN industry LIKE '%Publishing%' OR industry LIKE '%Printing%' OR industry LIKE '%Books%' THEN 
          'Publishing and printing services with emissions from paper production, printing processes, and distribution logistics across global markets.'
        WHEN industry LIKE '%Security%' OR industry LIKE '%Defense%' OR industry LIKE '%Military%' THEN 
          'Security and defense services with emissions from facility operations, vehicle fleets, and specialized equipment manufacturing and maintenance.'
        WHEN industry LIKE '%Renewable%' OR industry LIKE '%Solar%' OR industry LIKE '%Wind%' THEN 
          'Renewable energy technology development and deployment with minimal operational emissions but significant supply chain emissions from equipment manufacturing.'
        WHEN industry LIKE '%Consulting%' OR industry LIKE '%Advisory%' THEN 
          'Business consulting and advisory services with minimal direct emissions but significant influence on client sustainability strategies and carbon management.'
        WHEN industry LIKE '%Legal%' OR industry LIKE '%Law%' THEN 
          'Legal services and law firms with minimal direct emissions primarily from office operations and business travel for client services.'
        WHEN industry LIKE '%Accounting%' OR industry LIKE '%Audit%' THEN 
          'Accounting and auditing services with minimal direct emissions from office operations but growing influence on client ESG reporting and sustainability assurance.'
        WHEN industry LIKE '%Advertising%' OR industry LIKE '%Marketing%' THEN 
          'Advertising and marketing services with emissions from office operations, digital infrastructure, and campaign production and distribution activities.'
        WHEN industry LIKE '%Research%' OR industry LIKE '%Development%' THEN 
          'Research and development services with emissions from laboratory operations, specialized equipment, and intellectual property development processes.'
        WHEN industry LIKE '%Logistics%' OR industry LIKE '%Supply Chain%' THEN 
          'Logistics and supply chain management services with significant emissions from transportation coordination, warehousing operations, and fleet management.'
        WHEN industry LIKE '%Maintenance%' OR industry LIKE '%Repair%' THEN 
          'Maintenance and repair services with emissions from facility operations, vehicle fleets, and specialized equipment used in service delivery.'
        WHEN industry LIKE '%Training%' OR industry LIKE '%Learning%' THEN 
          'Training and education services with emissions from facility operations, digital learning infrastructure, and participant transportation.'
        ELSE 
          'Specialized industry operations with unique emissions profiles requiring customized sustainability approaches based on operational characteristics and value chain structure.'
      END
    ELSE description
  END,
  
  ghg_protocol_alignment = CASE 
    WHEN ghg_protocol_alignment IS NULL OR ghg_protocol_alignment = '' THEN
      CASE 
        WHEN industry LIKE '%Semiconductor%' OR industry LIKE '%Electronics%' THEN 
          'Scope 1: Manufacturing process gases and facility emissions; Scope 2: Extremely high electricity consumption for fabrication; Scope 3: Raw material extraction and product use'
        WHEN industry LIKE '%Tobacco%' THEN 
          'Scope 1: Manufacturing process emissions; Scope 2: Processing facility energy; Scope 3: Agricultural sourcing and product lifecycle emissions'
        WHEN industry LIKE '%Jewelry%' OR industry LIKE '%Luxury%' THEN 
          'Scope 1: Minimal manufacturing emissions; Scope 2: Workshop and retail energy; Scope 3: Precious metal mining and supply chain transport'
        WHEN industry LIKE '%Gaming%' OR industry LIKE '%Gambling%' THEN 
          'Scope 1: Backup generator emissions; Scope 2: Facility and gaming infrastructure energy; Scope 3: Customer transportation and equipment manufacturing'
        WHEN industry LIKE '%Publishing%' OR industry LIKE '%Printing%' THEN 
          'Scope 1: Printing process emissions; Scope 2: Facility energy consumption; Scope 3: Paper production and distribution logistics'
        WHEN industry LIKE '%Security%' OR industry LIKE '%Defense%' THEN 
          'Scope 1: Vehicle fleet and equipment emissions; Scope 2: Facility energy consumption; Scope 3: Equipment manufacturing and client transportation'
        WHEN industry LIKE '%Renewable%' OR industry LIKE '%Solar%' OR industry LIKE '%Wind%' THEN 
          'Scope 1: Minimal operational emissions; Scope 2: Facility energy for maintenance; Scope 3: Equipment manufacturing and installation logistics'
        WHEN industry LIKE '%Consulting%' OR industry LIKE '%Advisory%' OR industry LIKE '%Legal%' OR industry LIKE '%Accounting%' THEN 
          'Scope 1: Minimal direct emissions; Scope 2: Office building energy consumption; Scope 3: Business travel and client engagement activities'
        WHEN industry LIKE '%Advertising%' OR industry LIKE '%Marketing%' THEN 
          'Scope 1: Minimal direct emissions; Scope 2: Office and digital infrastructure energy; Scope 3: Campaign production and media distribution'
        WHEN industry LIKE '%Research%' OR industry LIKE '%Development%' THEN 
          'Scope 1: Laboratory process emissions; Scope 2: Specialized equipment energy consumption; Scope 3: Research material sourcing and knowledge transfer'
        WHEN industry LIKE '%Logistics%' OR industry LIKE '%Supply Chain%' THEN 
          'Scope 1: Fleet fuel consumption; Scope 2: Warehouse and facility energy; Scope 3: Supply chain coordination and customer transportation'
        WHEN industry LIKE '%Maintenance%' OR industry LIKE '%Repair%' THEN 
          'Scope 1: Service vehicle emissions and equipment operation; Scope 2: Facility energy consumption; Scope 3: Parts sourcing and customer travel'
        ELSE 
          'Scope 1: Direct operational emissions; Scope 2: Facility energy consumption; Scope 3: Supply chain and customer-related emissions with industry-specific variations'
      END
    ELSE ghg_protocol_alignment
  END,

  cdp_category = CASE 
    WHEN cdp_category IS NULL OR cdp_category = '' THEN
      CASE 
        WHEN industry LIKE '%Semiconductor%' OR industry LIKE '%Electronics%' THEN 'Information Technology'
        WHEN industry LIKE '%Tobacco%' THEN 'Consumer Staples'
        WHEN industry LIKE '%Jewelry%' OR industry LIKE '%Luxury%' OR industry LIKE '%Watches%' THEN 'Consumer Discretionary'
        WHEN industry LIKE '%Gaming%' OR industry LIKE '%Gambling%' OR industry LIKE '%Casino%' THEN 'Consumer Discretionary'
        WHEN industry LIKE '%Publishing%' OR industry LIKE '%Printing%' OR industry LIKE '%Books%' THEN 'Communication Services'
        WHEN industry LIKE '%Security%' OR industry LIKE '%Defense%' OR industry LIKE '%Military%' THEN 'Industrials'
        WHEN industry LIKE '%Renewable%' OR industry LIKE '%Solar%' OR industry LIKE '%Wind%' THEN 'Utilities'
        WHEN industry LIKE '%Consulting%' OR industry LIKE '%Advisory%' OR industry LIKE '%Legal%' OR industry LIKE '%Accounting%' THEN 'Industrials'
        WHEN industry LIKE '%Advertising%' OR industry LIKE '%Marketing%' THEN 'Communication Services'
        WHEN industry LIKE '%Research%' OR industry LIKE '%Development%' THEN 'Industrials'
        WHEN industry LIKE '%Logistics%' OR industry LIKE '%Supply Chain%' THEN 'Industrials'
        WHEN industry LIKE '%Maintenance%' OR industry LIKE '%Repair%' THEN 'Industrials'
        WHEN industry LIKE '%Training%' OR industry LIKE '%Learning%' THEN 'Consumer Discretionary'
        ELSE 'Industrials'
      END
    ELSE cdp_category
  END,

  sbti_pathway = CASE 
    WHEN sbti_pathway IS NULL OR sbti_pathway = '' THEN
      CASE 
        WHEN industry LIKE '%Semiconductor%' OR industry LIKE '%Electronics%' THEN 
          'Information and Communication Technology: Sectoral approach with renewable energy adoption for fabrication and supply chain optimization'
        WHEN industry LIKE '%Tobacco%' THEN 
          'Food, Beverage & Agriculture: Sectoral approach addressing agricultural sourcing and manufacturing process optimization'
        WHEN industry LIKE '%Renewable%' OR industry LIKE '%Solar%' OR industry LIKE '%Wind%' THEN 
          'Power Generation: Sectoral decarbonization approach focused on manufacturing efficiency and supply chain sustainability'
        WHEN industry LIKE '%Publishing%' OR industry LIKE '%Printing%' THEN 
          'Forest, Land & Agriculture: Sectoral approach with sustainable paper sourcing and printing process efficiency'
        WHEN industry LIKE '%Security%' OR industry LIKE '%Defense%' THEN 
          'Transport: Sectoral approach for fleet electrification and operational efficiency improvements'
        WHEN industry LIKE '%Jewelry%' OR industry LIKE '%Luxury%' THEN 
          'Manufacturing: Sectoral approach with sustainable sourcing and supply chain transparency'
        WHEN industry LIKE '%Gaming%' OR industry LIKE '%Gambling%' THEN 
          'Buildings: Sectoral approach focusing on facility energy efficiency and renewable energy adoption'
        WHEN industry LIKE '%Consulting%' OR industry LIKE '%Advisory%' OR industry LIKE '%Legal%' OR industry LIKE '%Accounting%' THEN 
          'Service Sector: Absolute contraction approach with focus on operational efficiency and business travel reduction'
        WHEN industry LIKE '%Advertising%' OR industry LIKE '%Marketing%' THEN 
          'Information and Communication Technology: Sectoral approach with digital infrastructure efficiency and sustainable production'
        WHEN industry LIKE '%Research%' OR industry LIKE '%Development%' THEN 
          'Service Sector: Absolute contraction approach with laboratory efficiency and sustainable research practices'
        WHEN industry LIKE '%Logistics%' OR industry LIKE '%Supply Chain%' THEN 
          'Transport: Sectoral decarbonization approach with fleet electrification and operational optimization'
        WHEN industry LIKE '%Maintenance%' OR industry LIKE '%Repair%' THEN 
          'Service Sector: Absolute contraction approach with fleet efficiency and circular economy principles'
        ELSE 
          'Absolute contraction approach: Economy-wide 4.2% annual reduction in absolute emissions aligned with 1.5°C temperature goal'
      END
    ELSE sbti_pathway
  END,

  updated_at = now()

WHERE (description IS NULL OR description = '' OR 
       ghg_protocol_alignment IS NULL OR ghg_protocol_alignment = '' OR 
       cdp_category IS NULL OR cdp_category = '' OR 
       sbti_pathway IS NULL OR sbti_pathway = '');

-- Final completion status and 100% coverage confirmation
DO $$
DECLARE
  total_count INTEGER;
  completed_count INTEGER;
  remaining_count INTEGER;
  completion_percentage NUMERIC;
BEGIN
  -- Get total record count
  SELECT COUNT(*) INTO total_count FROM public.industry_taxonomy;
  
  -- Get completed records count (all 4 fields populated)
  SELECT COUNT(*) INTO completed_count FROM public.industry_taxonomy 
  WHERE description IS NOT NULL AND description != '' AND 
        ghg_protocol_alignment IS NOT NULL AND ghg_protocol_alignment != '' AND 
        cdp_category IS NOT NULL AND cdp_category != '' AND 
        sbti_pathway IS NOT NULL AND sbti_pathway != '';
        
  -- Get remaining incomplete records
  SELECT COUNT(*) INTO remaining_count FROM public.industry_taxonomy 
  WHERE (description IS NULL OR description = '' OR 
         ghg_protocol_alignment IS NULL OR ghg_protocol_alignment = '' OR 
         cdp_category IS NULL OR cdp_category = '' OR 
         sbti_pathway IS NULL OR sbti_pathway = '');
  
  -- Calculate completion percentage
  completion_percentage := ROUND((completed_count::NUMERIC / total_count::NUMERIC) * 100, 1);
         
  RAISE NOTICE '✅ Batch 5 Complete – Metadata % Coverage: % of % industries fully populated, % remaining incomplete', 
    completion_percentage, completed_count, total_count, remaining_count;
    
  IF remaining_count = 0 THEN
    RAISE NOTICE '🎉 MILESTONE ACHIEVED: 100% Industry Taxonomy Metadata Coverage Complete!';
  END IF;
END $$;