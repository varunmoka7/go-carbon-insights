-- Complete Industry Taxonomy Schema and Sample Data
-- This migration adds sample industries, validates relationships, and creates helper functions

-- Step 1: Add comprehensive sample industry data
INSERT INTO public.industry_taxonomy (sector, industry, emissions_archetype, description, ghg_protocol_alignment, cdp_category, sbti_pathway) VALUES

-- Technology Sector
('Technology', 'Software Development', 'Scope 2-heavy', 'Companies primarily developing software products and services', 'Scope 2 dominant with data center operations', 'Technology Hardware & Equipment', 'Absolute emissions reduction'),
('Technology', 'Cloud Computing', 'Scope 2-heavy', 'Infrastructure and platform as a service providers', 'High electricity consumption for data centers', 'Technology Hardware & Equipment', 'Absolute emissions reduction'),
('Technology', 'Semiconductor Manufacturing', 'Operational Emitter', 'Chip and microprocessor manufacturing', 'High energy intensity with significant process emissions', 'Technology Hardware & Equipment', 'Sectoral decarbonization approach'),
('Technology', 'Telecommunications', 'Scope 2-heavy', 'Network infrastructure and communication services', 'Energy-intensive network operations', 'Telecommunications Services', 'Absolute emissions reduction'),

-- Manufacturing Sector  
('Manufacturing', 'Automotive Manufacturing', 'Upstream-heavy', 'Vehicle production and assembly', 'Complex supply chain with significant upstream emissions', 'Automobiles & Components', 'Sectoral decarbonization approach'),
('Manufacturing', 'Steel Production', 'Operational Emitter', 'Primary steel manufacturing and processing', 'High direct emissions from coking and smelting', 'Materials', 'Sectoral decarbonization approach'),
('Manufacturing', 'Chemical Manufacturing', 'Operational Emitter', 'Basic chemicals and specialty chemicals production', 'Process emissions and high energy intensity', 'Materials', 'Sectoral decarbonization approach'),
('Manufacturing', 'Electronics Manufacturing', 'Upstream-heavy', 'Consumer electronics assembly and production', 'Supply chain dominant emissions profile', 'Technology Hardware & Equipment', 'Absolute emissions reduction'),

-- Energy Sector
('Energy', 'Oil & Gas Extraction', 'Operational Emitter', 'Upstream oil and gas operations', 'Direct emissions from extraction and processing', 'Energy', 'Absolute emissions reduction'),
('Energy', 'Renewable Energy', 'Lifecycle-dependent', 'Solar, wind, and other renewable energy generation', 'Low operational emissions, manufacturing-heavy lifecycle', 'Utilities', 'Already aligned with net-zero'),
('Energy', 'Electric Utilities', 'Operational Emitter', 'Electricity generation and distribution', 'Direct emissions from fossil fuel generation', 'Utilities', 'Sectoral decarbonization approach'),
('Energy', 'Coal Mining', 'Operational Emitter', 'Coal extraction and preparation', 'High direct emissions and methane leakage', 'Energy', 'Absolute emissions reduction'),

-- Financial Services
('Financial Services', 'Commercial Banking', 'Financed Emissions', 'Traditional banking and lending services', 'Emissions primarily from financed activities', 'Banks', 'Portfolio-based targets'),
('Financial Services', 'Investment Management', 'Financed Emissions', 'Asset management and investment services', 'Portfolio emissions dominate footprint', 'Diversified Financials', 'Portfolio-based targets'),
('Financial Services', 'Insurance', 'Financed Emissions', 'Insurance products and risk management', 'Underwriting and investment portfolio emissions', 'Insurance', 'Portfolio-based targets'),

-- Consumer Goods
('Consumer Goods', 'Food & Beverage', 'Use-phase Dominant', 'Food processing and beverage production', 'Agriculture upstream and consumption downstream', 'Food, Beverage & Tobacco', 'Absolute emissions reduction'),
('Consumer Goods', 'Apparel & Textiles', 'Upstream-heavy', 'Clothing and textile manufacturing', 'Supply chain intensive with global sourcing', 'Textiles, Apparel & Luxury Goods', 'Absolute emissions reduction'),
('Consumer Goods', 'Consumer Electronics', 'Use-phase Dominant', 'Electronic devices for consumer markets', 'Manufacturing upstream, usage phase dominant', 'Technology Hardware & Equipment', 'Absolute emissions reduction'),
('Consumer Goods', 'Fast Moving Consumer Goods', 'Lifecycle-dependent', 'Packaged consumer products', 'Full lifecycle emissions with packaging', 'Household & Personal Products', 'Absolute emissions reduction'),

-- Transportation
('Transportation', 'Airlines', 'Operational Emitter', 'Passenger and freight air transportation', 'High direct emissions from fuel combustion', 'Transportation', 'Sectoral decarbonization approach'),
('Transportation', 'Shipping & Logistics', 'Operational Emitter', 'Maritime and ground freight transportation', 'Direct emissions from fuel use', 'Transportation', 'Sectoral decarbonization approach'),
('Transportation', 'Public Transportation', 'Scope 2-heavy', 'Urban and regional transit services', 'Electricity-dependent operations', 'Transportation', 'Absolute emissions reduction'),

-- Real Estate
('Real Estate', 'Commercial Real Estate', 'Scope 2-heavy', 'Office and retail property management', 'Building energy consumption dominant', 'Real Estate', 'Absolute emissions reduction'),
('Real Estate', 'Residential Development', 'Lifecycle-dependent', 'Housing development and construction', 'Construction materials and building lifecycle', 'Real Estate', 'Absolute emissions reduction'),

-- Healthcare
('Healthcare', 'Pharmaceuticals', 'Upstream-heavy', 'Drug development and manufacturing', 'Research-intensive with complex supply chains', 'Pharmaceuticals, Biotechnology & Life Sciences', 'Absolute emissions reduction'),
('Healthcare', 'Medical Devices', 'Upstream-heavy', 'Healthcare equipment and device manufacturing', 'Manufacturing and supply chain intensive', 'Health Care Equipment & Services', 'Absolute emissions reduction'),
('Healthcare', 'Healthcare Services', 'Scope 2-heavy', 'Hospitals and healthcare delivery', 'Energy-intensive facility operations', 'Health Care Equipment & Services', 'Absolute emissions reduction'),

-- Retail
('Retail', 'E-commerce', 'Scope 3-heavy', 'Online retail and marketplace operations', 'Distribution and packaging dominant', 'Retailing', 'Absolute emissions reduction'),
('Retail', 'Traditional Retail', 'Scope 2-heavy', 'Physical store operations and retail chains', 'Store energy use and supply chain', 'Retailing', 'Absolute emissions reduction'),

-- Agriculture  
('Agriculture', 'Crop Production', 'Operational Emitter', 'Agricultural crop farming and production', 'Direct emissions from soil and fertilizer use', 'Food, Beverage & Tobacco', 'Sectoral decarbonization approach'),
('Agriculture', 'Livestock', 'Operational Emitter', 'Animal agriculture and dairy operations', 'High methane and direct emissions', 'Food, Beverage & Tobacco', 'Sectoral decarbonization approach');

-- Step 2: Create industry-tag relationships based on characteristics
WITH tag_mapping AS (
  SELECT 
    it.id as industry_id,
    tag.id as tag_id
  FROM public.industry_taxonomy it
  CROSS JOIN public.industry_tags tag
  WHERE 
    -- High Scope 3 industries
    (tag.tag_name = 'High Scope 3' AND it.emissions_archetype IN ('Upstream-heavy', 'Use-phase Dominant', 'Financed Emissions'))
    OR
    -- Energy Intensive industries  
    (tag.tag_name = 'Energy Intensive' AND it.emissions_archetype IN ('Operational Emitter', 'Scope 2-heavy'))
    OR
    -- Supply Chain Complex
    (tag.tag_name = 'Supply Chain Complex' AND it.emissions_archetype = 'Upstream-heavy')
    OR
    -- Consumer Facing
    (tag.tag_name = 'Consumer Facing' AND it.sector IN ('Consumer Goods', 'Retail', 'Healthcare'))
    OR
    -- B2B Focus
    (tag.tag_name = 'B2B Focus' AND it.sector IN ('Technology', 'Manufacturing', 'Financial Services'))
    OR
    -- Regulated Reporting
    (tag.tag_name = 'Regulated Reporting' AND it.sector IN ('Energy', 'Financial Services', 'Airlines'))
    OR
    -- Physical Risk Exposed
    (tag.tag_name = 'Physical Risk Exposed' AND it.sector IN ('Agriculture', 'Real Estate', 'Energy'))
    OR
    -- Transition Risk Exposed  
    (tag.tag_name = 'Transition Risk Exposed' AND it.sector IN ('Energy', 'Manufacturing', 'Transportation'))
    OR
    -- SBTi Prevalent
    (tag.tag_name = 'SBTi Prevalent' AND it.sector IN ('Technology', 'Consumer Goods', 'Financial Services'))
    OR
    -- CDP Active
    (tag.tag_name = 'CDP Active' AND it.sector IN ('Manufacturing', 'Energy', 'Financial Services'))
)
INSERT INTO public.industry_tag_assignments (industry_id, tag_id)
SELECT DISTINCT industry_id, tag_id FROM tag_mapping;

-- Step 3: Add sample company-industry relationships for existing companies
WITH sample_assignments AS (
  SELECT 
    c.id as company_id,
    it.id as industry_id,
    'primary' as relationship_type,
    100 as percentage_allocation
  FROM public.companies c
  CROSS JOIN LATERAL (
    SELECT id FROM public.industry_taxonomy it 
    WHERE 
      -- Simple industry matching based on company sector
      (c.sector = 'Technology' AND it.sector = 'Technology' AND it.industry = 'Software Development')
      OR (c.sector = 'Manufacturing' AND it.sector = 'Manufacturing' AND it.industry = 'Electronics Manufacturing')  
      OR (c.sector = 'Energy' AND it.sector = 'Energy' AND it.industry = 'Renewable Energy')
      OR (c.sector = 'Healthcare' AND it.sector = 'Healthcare' AND it.industry = 'Healthcare Services')
      OR (c.sector = 'Financial Services' AND it.sector = 'Financial Services' AND it.industry = 'Commercial Banking')
      OR (c.industry = 'Automotive' AND it.industry = 'Automotive Manufacturing')
      OR (c.industry = 'Retail' AND it.sector = 'Retail' AND it.industry = 'Traditional Retail')
    LIMIT 1
  ) it
  LIMIT 20 -- Limit to avoid too many assignments
)
INSERT INTO public.company_industries (company_id, industry_id, relationship_type, percentage_allocation)
SELECT company_id, industry_id, relationship_type, percentage_allocation 
FROM sample_assignments
ON CONFLICT (company_id, industry_id, relationship_type) DO NOTHING;

-- Step 4: Create helper functions for common queries
CREATE OR REPLACE FUNCTION public.get_industry_archetype_info(p_industry_id UUID)
RETURNS TABLE (
    industry_name TEXT,
    sector_name TEXT,
    archetype public.emissions_archetype,
    scope1_priority INTEGER,
    scope2_priority INTEGER,
    scope3_priority INTEGER,
    reporting_complexity TEXT,
    key_scope3_categories TEXT[],
    typical_hotspots TEXT[]
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        it.industry,
        it.sector,
        it.emissions_archetype,
        ac.scope1_priority,
        ac.scope2_priority,
        ac.scope3_priority,
        ac.reporting_complexity,
        ac.key_scope3_categories,
        ac.typical_hotspots
    FROM public.industry_taxonomy it
    JOIN public.archetype_configurations ac ON it.emissions_archetype = ac.archetype_name
    WHERE it.id = p_industry_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_industries_by_tag(p_tag_name TEXT)
RETURNS TABLE (
    industry_id UUID,
    industry_name TEXT,
    sector_name TEXT,
    emissions_archetype public.emissions_archetype
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        it.id,
        it.industry,
        it.sector,
        it.emissions_archetype
    FROM public.industry_taxonomy it
    JOIN public.industry_tag_assignments ita ON it.id = ita.industry_id
    JOIN public.industry_tags tag ON ita.tag_id = tag.id
    WHERE tag.tag_name = p_tag_name
    ORDER BY it.sector, it.industry;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_companies_by_archetype_detailed(p_archetype public.emissions_archetype)
RETURNS TABLE (
    company_id TEXT,
    company_name TEXT,
    industry_name TEXT,
    sector_name TEXT,
    relationship_type TEXT,
    percentage_allocation INTEGER,
    archetype_priority_scope1 INTEGER,
    archetype_priority_scope2 INTEGER,
    archetype_priority_scope3 INTEGER
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ci.company_id,
        c.name,
        it.industry,
        it.sector,
        ci.relationship_type,
        ci.percentage_allocation,
        ac.scope1_priority,
        ac.scope2_priority,
        ac.scope3_priority
    FROM public.company_industries ci
    JOIN public.industry_taxonomy it ON ci.industry_id = it.id
    JOIN public.companies c ON ci.company_id = c.id
    JOIN public.archetype_configurations ac ON it.emissions_archetype = ac.archetype_name
    WHERE it.emissions_archetype = p_archetype
    ORDER BY it.sector, it.industry, c.name;
END;
$$;

-- Step 5: Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_industry_taxonomy_sector_archetype ON public.industry_taxonomy(sector, emissions_archetype);
CREATE INDEX IF NOT EXISTS idx_company_industries_compound ON public.company_industries(company_id, industry_id, relationship_type);
CREATE INDEX IF NOT EXISTS idx_industry_tag_assignments_compound ON public.industry_tag_assignments(industry_id, tag_id);

-- Step 6: Create a view for common industry analytics
CREATE OR REPLACE VIEW public.industry_analytics AS
SELECT 
    it.id as industry_id,
    it.industry,
    it.sector,
    it.emissions_archetype,
    ac.scope1_priority,
    ac.scope2_priority, 
    ac.scope3_priority,
    ac.reporting_complexity,
    COUNT(DISTINCT ci.company_id) as company_count,
    COUNT(DISTINCT ita.tag_id) as tag_count,
    array_agg(DISTINCT tag.tag_name) FILTER (WHERE tag.tag_name IS NOT NULL) as assigned_tags
FROM public.industry_taxonomy it
LEFT JOIN public.archetype_configurations ac ON it.emissions_archetype = ac.archetype_name
LEFT JOIN public.company_industries ci ON it.id = ci.industry_id
LEFT JOIN public.industry_tag_assignments ita ON it.id = ita.industry_id
LEFT JOIN public.industry_tags tag ON ita.tag_id = tag.id
GROUP BY it.id, it.industry, it.sector, it.emissions_archetype, 
         ac.scope1_priority, ac.scope2_priority, ac.scope3_priority, ac.reporting_complexity;