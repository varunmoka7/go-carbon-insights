-- Migration: Epic 5 - Trancenable ESG Integration Schema Extensions
-- Created: 2025-08-01
-- Description: Comprehensive schema extensions for Trancenable dataset integration
-- Epic 5: Trancenable ESG Integration - Database Foundation

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For composite indexes

-- =============================================================================
-- PHASE 1: COMPANY IDENTIFIERS SCHEMA EXTENSION
-- =============================================================================

-- Add financial identifiers to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS lei TEXT,
ADD COLUMN IF NOT EXISTS figi TEXT,
ADD COLUMN IF NOT EXISTS ticker TEXT,
ADD COLUMN IF NOT EXISTS permid TEXT,
ADD COLUMN IF NOT EXISTS exchange TEXT,
ADD COLUMN IF NOT EXISTS mic_code TEXT,
ADD COLUMN IF NOT EXISTS trancenable_company_id UUID,
ADD COLUMN IF NOT EXISTS data_source_attribution JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS identifier_confidence_score DECIMAL(3,2) DEFAULT 1.00 CHECK (identifier_confidence_score >= 0.00 AND identifier_confidence_score <= 1.00);

-- Add constraints for financial identifiers
ALTER TABLE public.companies 
ADD CONSTRAINT companies_lei_format CHECK (lei IS NULL OR lei ~ '^[A-Z0-9]{20}$'),
ADD CONSTRAINT companies_ticker_format CHECK (ticker IS NULL OR (LENGTH(ticker) >= 1 AND LENGTH(ticker) <= 10)),
ADD CONSTRAINT companies_permid_format CHECK (permid IS NULL OR permid ~ '^[0-9]{10,12}$'),
ADD CONSTRAINT companies_figi_format CHECK (figi IS NULL OR figi ~ '^[A-Z0-9]{12}$');

-- Create unique constraints for identifiers (allowing NULL)
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_lei_unique 
ON public.companies(lei) WHERE lei IS NOT NULL;

CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_ticker_exchange_unique 
ON public.companies(ticker, exchange) WHERE ticker IS NOT NULL AND exchange IS NOT NULL;

-- =============================================================================
-- PHASE 2: INDUSTRY TAXONOMY EXTENSIONS
-- =============================================================================

-- Insert new Trancenable industries into industry taxonomy
INSERT INTO public.industry_taxonomy (sector, industry, emissions_archetype, description, ghg_protocol_alignment, cdp_category, sbti_pathway) VALUES

-- Manufacturing Sector Extensions
('Manufacturing', 'Industrial Equipment Manufacturing', 'Operational Emitter', 'Heavy machinery and industrial equipment manufacturing with high energy intensity', 'Scope 1 and 2 dominant with process emissions', 'Capital Goods', 'Sectoral decarbonization approach'),
('Manufacturing', 'Aerospace Manufacturing', 'Upstream-heavy', 'Aircraft and aerospace component manufacturing with complex supply chains', 'Supply chain intensive with high-tech materials', 'Capital Goods', 'Absolute emissions reduction'),
('Manufacturing', 'Marine Equipment Manufacturing', 'Operational Emitter', 'Ship building and marine equipment with steel-intensive processes', 'High direct emissions from steel and welding', 'Capital Goods', 'Sectoral decarbonization approach'),
('Manufacturing', 'Construction Equipment Manufacturing', 'Operational Emitter', 'Heavy construction machinery and equipment', 'Manufacturing process emissions dominant', 'Capital Goods', 'Sectoral decarbonization approach'),
('Manufacturing', 'Packaging Manufacturing', 'Lifecycle-dependent', 'Packaging materials and container production', 'Lifecycle emissions from materials to disposal', 'Materials', 'Absolute emissions reduction'),
('Manufacturing', 'Paper Manufacturing', 'Lifecycle-dependent', 'Paper and pulp production with forestry upstream', 'Forest management and production process mix', 'Materials', 'Sectoral decarbonization approach'),
('Manufacturing', 'Mining & Metals', 'Operational Emitter', 'Metal extraction and primary processing', 'High direct emissions from extraction and smelting', 'Materials', 'Sectoral decarbonization approach'),
('Manufacturing', 'Textile Manufacturing', 'Upstream-heavy', 'Textile and fabric production with global supply chains', 'Supply chain dominant with water intensity', 'Consumer Discretionary', 'Absolute emissions reduction'),

-- Energy Sector Extensions  
('Energy', 'Gas Utilities', 'Operational Emitter', 'Natural gas distribution and utility services', 'Direct emissions from gas distribution and leakage', 'Utilities', 'Sectoral decarbonization approach'),
('Energy', 'Water Utilities', 'Scope 2-heavy', 'Water treatment and distribution services', 'Electricity intensive operations', 'Utilities', 'Absolute emissions reduction'),
('Energy', 'Independent Power Generation', 'Operational Emitter', 'Independent power producers and energy generation', 'Direct emissions from power generation', 'Utilities', 'Sectoral decarbonization approach'),
('Energy', 'Energy Storage & Distribution', 'Scope 2-heavy', 'Energy storage systems and grid distribution', 'Electricity dependent operations', 'Utilities', 'Absolute emissions reduction'),

-- Consumer Goods Extensions
('Consumer Goods', 'Luxury Goods', 'Use-phase Dominant', 'High-end consumer products and luxury items', 'Product usage and supply chain mix', 'Consumer Discretionary', 'Absolute emissions reduction'),
('Consumer Goods', 'Hospitality Services', 'Scope 2-heavy', 'Hotels, resorts, and hospitality operations', 'Building energy consumption dominant', 'Consumer Discretionary', 'Absolute emissions reduction'),
('Consumer Goods', 'Food Service', 'Scope 2-heavy', 'Restaurant and food service operations', 'Energy intensive operations with supply chain', 'Consumer Discretionary', 'Absolute emissions reduction'),  
('Consumer Goods', 'Personal Care Services', 'Scope 2-heavy', 'Personal care and service operations', 'Facility operations and equipment', 'Consumer Discretionary', 'Absolute emissions reduction'),
('Consumer Goods', 'Tobacco Products', 'Use-phase Dominant', 'Tobacco production and distribution', 'Agricultural upstream and product use', 'Consumer Staples', 'Absolute emissions reduction'),

-- Financial Services Extensions
('Financial Services', 'Professional Services', 'Scope 2-heavy', 'Consulting, legal, and professional services', 'Office operations and business travel', 'Commercial & Professional Services', 'Absolute emissions reduction'),

-- Transportation Extensions
('Transportation', 'Transportation Infrastructure', 'Scope 2-heavy', 'Transportation infrastructure and support systems', 'Infrastructure operations and maintenance', 'Transportation', 'Absolute emissions reduction'),
('Transportation', 'Marine Transportation', 'Operational Emitter', 'Maritime shipping and transport services', 'Direct fuel combustion emissions', 'Transportation', 'Sectoral decarbonization approach'),

-- Agriculture Extensions  
('Agriculture', 'Forestry & Logging', 'Operational Emitter', 'Forest management and logging operations', 'Direct emissions from operations and land use', 'Materials', 'Nature-based solutions'),

-- Retail Extensions
('Retail', 'Specialty Retail', 'Scope 2-heavy', 'Specialized retail operations and stores', 'Store operations and supply chain', 'Retailing', 'Absolute emissions reduction'),

-- Real Estate Extensions
('Real Estate', 'Real Estate Services', 'Scope 2-heavy', 'Real estate services and property management', 'Building operations and management', 'Real Estate', 'Absolute emissions reduction'),

-- Technology Extensions
('Technology', 'Technology Consulting', 'Scope 2-heavy', 'Technology consulting and services', 'Office operations and data center usage', 'Software & Services', 'Absolute emissions reduction')

ON CONFLICT (industry) DO UPDATE SET
    sector = EXCLUDED.sector,
    emissions_archetype = EXCLUDED.emissions_archetype,
    description = EXCLUDED.description,
    ghg_protocol_alignment = EXCLUDED.ghg_protocol_alignment,
    cdp_category = EXCLUDED.cdp_category,
    sbti_pathway = EXCLUDED.sbti_pathway,
    updated_at = NOW();

-- =============================================================================
-- PHASE 3: TRANCENABLE INTEGRATION TABLES
-- =============================================================================

-- Create trancenable_import_log table for tracking imports
CREATE TABLE IF NOT EXISTS public.trancenable_import_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Import metadata
    import_batch_id UUID NOT NULL,
    import_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    import_completed_at TIMESTAMPTZ,
    
    -- Processing statistics
    total_records_processed INTEGER DEFAULT 0,
    companies_created INTEGER DEFAULT 0,
    companies_updated INTEGER DEFAULT 0,
    emissions_records_created INTEGER DEFAULT 0,
    validation_errors INTEGER DEFAULT 0,
    
    -- Data quality metrics
    lei_match_rate DECIMAL(5,2),
    industry_mapping_confidence DECIMAL(5,2),
    data_completeness_score DECIMAL(5,2),
    
    -- Status and notes
    import_status TEXT NOT NULL DEFAULT 'in_progress' CHECK (import_status IN ('in_progress', 'completed', 'failed', 'cancelled')),
    error_details JSONB DEFAULT '{}',
    processing_notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create company identifiers mapping table for tracking all identifier sources
CREATE TABLE IF NOT EXISTS public.company_identifiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    
    -- Identifier details
    identifier_type TEXT NOT NULL CHECK (identifier_type IN ('lei', 'figi', 'ticker', 'permid', 'isin', 'cusip', 'other')),
    identifier_value TEXT NOT NULL,
    identifier_source TEXT NOT NULL DEFAULT 'trancenable',
    
    -- Validation and quality
    is_primary BOOLEAN DEFAULT FALSE,
    confidence_score DECIMAL(3,2) DEFAULT 1.00 CHECK (confidence_score >= 0.00 AND confidence_score <= 1.00),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id),
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(company_id, identifier_type, identifier_value)
);

-- Create industry mapping confidence tracking
CREATE TABLE IF NOT EXISTS public.industry_mapping_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Mapping details
    trancenable_industry TEXT NOT NULL,
    trancenable_sector TEXT NOT NULL,
    mapped_industry_id UUID NOT NULL REFERENCES public.industry_taxonomy(id),
    mapping_type TEXT NOT NULL CHECK (mapping_type IN ('direct', 'merge', 'extend', 'map', 'fuzzy')),
    confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0.00 AND confidence_score <= 1.00),
    
    -- Usage statistics
    companies_using_mapping INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    
    -- Validation
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    mapping_notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(trancenable_industry, trancenable_sector)
);

-- =============================================================================
-- PHASE 4: ENHANCED EMISSIONS DATA STRUCTURE
-- =============================================================================

-- Add Trancenable-specific fields to emissions_data table
ALTER TABLE public.emissions_data 
ADD COLUMN IF NOT EXISTS trancenable_document_id UUID,
ADD COLUMN IF NOT EXISTS emission_sources JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS source_urls JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS incomplete_boundaries TEXT,
ADD COLUMN IF NOT EXISTS calculation_method TEXT,
ADD COLUMN IF NOT EXISTS disclosure_year INTEGER CHECK (disclosure_year >= 1990 AND disclosure_year <= 2100),
ADD COLUMN IF NOT EXISTS data_lineage JSONB DEFAULT '{}';

-- Create detailed emission sources tracking table
CREATE TABLE IF NOT EXISTS public.emission_sources_detail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emissions_data_id UUID NOT NULL REFERENCES public.emissions_data(id) ON DELETE CASCADE,
    
    -- Source categorization
    source_category TEXT NOT NULL,
    source_subcategory TEXT,
    ghg_protocol_category TEXT,
    
    -- Emission values
    emission_value DECIMAL(15,2) NOT NULL CHECK (emission_value >= 0.00),
    emission_unit TEXT NOT NULL DEFAULT 'mtCO2e',
    emission_scope INTEGER NOT NULL CHECK (emission_scope IN (1, 2, 3)),
    
    -- Methodology
    calculation_approach TEXT,
    emission_factor TEXT,
    activity_data TEXT,
    
    -- Quality and verification
    uncertainty_range DECIMAL(5,2),
    data_quality_rating INTEGER CHECK (data_quality_rating >= 1 AND data_quality_rating <= 5),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- PHASE 5: PERFORMANCE OPTIMIZATION INDEXES
-- =============================================================================

-- Company identifiers indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_lei_btree ON public.companies(lei) WHERE lei IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_ticker_btree ON public.companies(ticker) WHERE ticker IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_figi_btree ON public.companies(figi) WHERE figi IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_permid_btree ON public.companies(permid) WHERE permid IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_trancenable_id ON public.companies(trancenable_company_id) WHERE trancenable_company_id IS NOT NULL;

-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_sector_industry ON public.companies(sector, industry);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_country_sector ON public.companies(country, sector);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_data_quality ON public.companies(data_quality_score DESC) WHERE data_quality_score > 0.7;

-- Emissions data indexes for Trancenable fields
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_emissions_trancenable_doc ON public.emissions_data(trancenable_document_id) WHERE trancenable_document_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_emissions_disclosure_year ON public.emissions_data(disclosure_year) WHERE disclosure_year IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_emissions_calculation_method ON public.emissions_data(calculation_method) WHERE calculation_method IS NOT NULL;

-- Support table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_company_identifiers_type_value ON public.company_identifiers(identifier_type, identifier_value);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_company_identifiers_company ON public.company_identifiers(company_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_company_identifiers_primary ON public.company_identifiers(company_id) WHERE is_primary = TRUE;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_industry_mapping_confidence ON public.industry_mapping_log(confidence_score DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_industry_mapping_type ON public.industry_mapping_log(mapping_type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_emission_sources_detail_emissions ON public.emission_sources_detail(emissions_data_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_emission_sources_detail_category ON public.emission_sources_detail(source_category, emission_scope);

-- =============================================================================
-- PHASE 6: DATA VALIDATION CONSTRAINTS AND BUSINESS RULES
-- =============================================================================

-- Add validation constraints
ALTER TABLE public.companies 
ADD CONSTRAINT companies_data_source_valid CHECK (
    data_source_attribution IS NULL OR 
    jsonb_typeof(data_source_attribution) = 'object'
);

-- Create validation functions
CREATE OR REPLACE FUNCTION validate_company_identifiers()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure LEI format if provided
    IF NEW.lei IS NOT NULL AND NEW.lei !~ '^[A-Z0-9]{20}$' THEN
        RAISE EXCEPTION 'Invalid LEI format: %', NEW.lei;
    END IF;
    
    -- Ensure at least one identifier is provided
    IF NEW.lei IS NULL AND NEW.ticker IS NULL AND NEW.figi IS NULL AND NEW.permid IS NULL THEN
        RAISE WARNING 'Company % has no financial identifiers', NEW.name;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for company identifier validation
CREATE TRIGGER trg_validate_company_identifiers
    BEFORE INSERT OR UPDATE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION validate_company_identifiers();

-- Create function to calculate data quality scores
CREATE OR REPLACE FUNCTION calculate_company_data_quality(company_uuid UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
    quality_score DECIMAL(3,2) := 0.00;
    field_count INTEGER := 0;
    populated_fields INTEGER := 0;
BEGIN
    SELECT 
        -- Count total possible fields
        11 as total_fields,
        -- Count populated fields
        (CASE WHEN lei IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ticker IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN figi IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN permid IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN exchange IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN mic_code IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN employees IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN revenue IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN headquarters IS NOT NULL THEN 1 ELSE 0 END) +
        1 + -- name is always required
        1   -- country is always required
    INTO field_count, populated_fields
    FROM public.companies 
    WHERE id = company_uuid;
    
    quality_score := ROUND((populated_fields::DECIMAL / field_count::DECIMAL), 2);
    
    RETURN LEAST(quality_score, 1.00);
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- PHASE 7: ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on new tables
ALTER TABLE public.company_identifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_mapping_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trancenable_import_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emission_sources_detail ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public read access to company identifiers" ON public.company_identifiers
    FOR SELECT USING (true);

CREATE POLICY "Public read access to industry mapping" ON public.industry_mapping_log
    FOR SELECT USING (true);

CREATE POLICY "Public read access to emission sources detail" ON public.emission_sources_detail
    FOR SELECT USING (true);

-- Admin-only access for import logs
CREATE POLICY "Admin read access to import logs" ON public.trancenable_import_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users u
            JOIN user_profiles up ON u.id = up.id
            WHERE u.id = auth.uid() AND up.role IN ('admin', 'super_admin')
        )
    );

-- Admin write access for all tables
CREATE POLICY "Admin write access to company identifiers" ON public.company_identifiers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users u
            JOIN user_profiles up ON u.id = up.id
            WHERE u.id = auth.uid() AND up.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin write access to industry mapping" ON public.industry_mapping_log
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users u
            JOIN user_profiles up ON u.id = up.id
            WHERE u.id = auth.uid() AND up.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin write access to import logs" ON public.trancenable_import_log
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users u
            JOIN user_profiles up ON u.id = up.id
            WHERE u.id = auth.uid() AND up.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin write access to emission sources detail" ON public.emission_sources_detail
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users u
            JOIN user_profiles up ON u.id = up.id
            WHERE u.id = auth.uid() AND up.role IN ('admin', 'super_admin')
        )
    );

-- =============================================================================
-- PHASE 8: MATERIALIZED VIEWS FOR PERFORMANCE
-- =============================================================================

-- Create materialized view for Trancenable company overview
CREATE MATERIALIZED VIEW IF NOT EXISTS public.trancenable_companies_overview AS
SELECT 
    c.id,
    c.name,
    c.lei,
    c.ticker,
    c.exchange,
    c.sector,
    c.industry,
    c.country,
    c.employees,
    c.data_quality_score,
    c.identifier_confidence_score,
    
    -- Latest emissions data
    e.year as latest_emissions_year,
    e.scope1,
    e.scope2,
    e.scope3,
    e.total_emissions,
    e.verification_status,
    
    -- Industry taxonomy info
    it.emissions_archetype,
    it.ghg_protocol_alignment,
    it.sbti_pathway,
    
    -- Identifier completeness
    CASE 
        WHEN c.lei IS NOT NULL THEN 'LEI'
        WHEN c.ticker IS NOT NULL AND c.exchange IS NOT NULL THEN 'TICKER'
        WHEN c.figi IS NOT NULL THEN 'FIGI'
        ELSE 'NAME_ONLY'
    END as primary_identifier_type,
    
    c.created_at,
    c.updated_at
    
FROM public.companies c
LEFT JOIN public.emissions_data e ON c.id = e.company_id 
    AND e.year = (SELECT MAX(year) FROM public.emissions_data WHERE company_id = c.id)
LEFT JOIN public.industry_taxonomy it ON c.industry = it.industry
WHERE c.trancenable_company_id IS NOT NULL;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_trancenable_overview_lei ON public.trancenable_companies_overview(lei);
CREATE INDEX IF NOT EXISTS idx_trancenable_overview_sector ON public.trancenable_companies_overview(sector, industry);
CREATE INDEX IF NOT EXISTS idx_trancenable_overview_quality ON public.trancenable_companies_overview(data_quality_score DESC);

-- =============================================================================
-- PHASE 9: AUDIT LOGGING ENHANCEMENTS
-- =============================================================================

-- Create enhanced audit triggers for Trancenable tables
CREATE OR REPLACE FUNCTION trancenable_audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    old_data JSONB;
    new_data JSONB;
    changed_fields TEXT[];
BEGIN
    IF TG_OP = 'INSERT' THEN
        new_data = to_jsonb(NEW);
        INSERT INTO public.audit_log (table_name, record_id, operation, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', new_data, auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        old_data = to_jsonb(OLD);
        new_data = to_jsonb(NEW);
        
        -- Get changed fields
        SELECT array_agg(key) INTO changed_fields
        FROM jsonb_object_keys(new_data) AS key
        WHERE new_data->key IS DISTINCT FROM old_data->key;
        
        INSERT INTO public.audit_log (table_name, record_id, operation, old_values, new_values, changed_fields, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', old_data, new_data, changed_fields, auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        old_data = to_jsonb(OLD);
        INSERT INTO public.audit_log (table_name, record_id, operation, old_values, user_id)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', old_data, auth.uid());
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers for new tables
CREATE TRIGGER audit_company_identifiers_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.company_identifiers
    FOR EACH ROW EXECUTE FUNCTION trancenable_audit_trigger_function();

CREATE TRIGGER audit_industry_mapping_log_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.industry_mapping_log
    FOR EACH ROW EXECUTE FUNCTION trancenable_audit_trigger_function();

CREATE TRIGGER audit_trancenable_import_log_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.trancenable_import_log
    FOR EACH ROW EXECUTE FUNCTION trancenable_audit_trigger_function();

-- =============================================================================
-- PHASE 10: GRANT PERMISSIONS
-- =============================================================================

-- Grant necessary permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant specific permissions for materialized views
GRANT SELECT ON public.trancenable_companies_overview TO authenticated;

-- =============================================================================
-- MIGRATION VERIFICATION QUERIES
-- =============================================================================

-- Verify schema extensions
DO $$
BEGIN
    -- Check if all new columns exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'lei') THEN
        RAISE EXCEPTION 'Migration failed: lei column not created';
    END IF;
    
    -- Check if new tables exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'company_identifiers') THEN
        RAISE EXCEPTION 'Migration failed: company_identifiers table not created';
    END IF;
    
    -- Check if new industries were added
    IF (SELECT COUNT(*) FROM public.industry_taxonomy WHERE description LIKE '%Trancenable%' OR sector IN ('Manufacturing', 'Energy') AND created_at >= CURRENT_DATE) < 20 THEN
        RAISE WARNING 'Migration warning: Expected more industry taxonomy entries';
    END IF;
    
    RAISE NOTICE 'Epic 5 Trancenable Integration migration completed successfully';
END
$$;

-- Create function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_trancenable_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.trancenable_companies_overview;
    RAISE NOTICE 'Trancenable materialized views refreshed';
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE public.company_identifiers IS 'Financial identifiers for companies from multiple data sources including Trancenable';
COMMENT ON TABLE public.industry_mapping_log IS 'Tracking industry mappings from Trancenable taxonomy to internal framework';
COMMENT ON TABLE public.trancenable_import_log IS 'Audit log for Trancenable data import operations and statistics';
COMMENT ON TABLE public.emission_sources_detail IS 'Detailed breakdown of emission sources and categories';
COMMENT ON MATERIALIZED VIEW public.trancenable_companies_overview IS 'Optimized view of companies with Trancenable data integration';

COMMENT ON COLUMN public.companies.lei IS 'Legal Entity Identifier - 20 character ISO standard';
COMMENT ON COLUMN public.companies.figi IS 'Financial Instrument Global Identifier - 12 character Bloomberg standard';
COMMENT ON COLUMN public.companies.ticker IS 'Stock ticker symbol';
COMMENT ON COLUMN public.companies.permid IS 'Refinitiv Permanent Identifier';
COMMENT ON COLUMN public.companies.trancenable_company_id IS 'Original Trancenable company UUID for data lineage';
COMMENT ON COLUMN public.companies.identifier_confidence_score IS 'Confidence score for company identifier matching (0.0-1.0)';

-- Final success message
SELECT 'Epic 5: Trancenable ESG Integration schema migration completed successfully' as migration_status;