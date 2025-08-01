-- Rollback Migration: Epic 5 - Trancenable ESG Integration Schema Extensions
-- Created: 2025-08-01
-- Description: Complete rollback procedures for Trancenable integration schema changes
-- CRITICAL: This script will remove all Trancenable-related data and schema changes

-- =============================================================================
-- ROLLBACK SAFETY CHECKS AND CONFIRMATIONS
-- =============================================================================

-- Create rollback confirmation function
CREATE OR REPLACE FUNCTION confirm_trancenable_rollback()
RETURNS BOOLEAN AS $$
DECLARE
    company_count INTEGER;
    emissions_count INTEGER;
    user_confirmation TEXT;
BEGIN
    -- Count affected records
    SELECT COUNT(*) INTO company_count 
    FROM public.companies 
    WHERE trancenable_company_id IS NOT NULL;
    
    SELECT COUNT(*) INTO emissions_count 
    FROM public.emissions_data 
    WHERE trancenable_document_id IS NOT NULL;
    
    RAISE NOTICE 'ROLLBACK IMPACT ASSESSMENT:';
    RAISE NOTICE '- Companies with Trancenable data: %', company_count;
    RAISE NOTICE '- Emissions records with Trancenable data: %', emissions_count;
    RAISE NOTICE '- This rollback will remove ALL Trancenable integration data';
    RAISE NOTICE '- New industries added for Trancenable will be preserved unless explicitly removed';
    
    -- This function serves as documentation - actual confirmation should be external
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- PHASE 1: BACKUP CRITICAL DATA BEFORE ROLLBACK
-- =============================================================================

-- Create backup tables for rollback recovery
CREATE TABLE IF NOT EXISTS public.trancenable_rollback_backup_companies AS
SELECT * FROM public.companies WHERE trancenable_company_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.trancenable_rollback_backup_emissions AS
SELECT * FROM public.emissions_data WHERE trancenable_document_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.trancenable_rollback_backup_identifiers AS
SELECT * FROM public.company_identifiers;

CREATE TABLE IF NOT EXISTS public.trancenable_rollback_backup_mapping AS
SELECT * FROM public.industry_mapping_log;

-- Log rollback initiation
INSERT INTO public.trancenable_import_log (
    import_batch_id,
    import_status,
    processing_notes,
    created_by
) VALUES (
    uuid_generate_v4(),
    'cancelled',
    'Rollback initiated - backing up data before schema changes removal',
    auth.uid()
);

-- =============================================================================
-- PHASE 2: DROP TRIGGERS AND FUNCTIONS
-- =============================================================================

-- Drop audit triggers for Trancenable tables
DROP TRIGGER IF EXISTS audit_company_identifiers_trigger ON public.company_identifiers;
DROP TRIGGER IF EXISTS audit_industry_mapping_log_trigger ON public.industry_mapping_log;
DROP TRIGGER IF EXISTS audit_trancenable_import_log_trigger ON public.trancenable_import_log;

-- Drop validation triggers
DROP TRIGGER IF EXISTS trg_validate_company_identifiers ON public.companies;

-- Drop custom functions (keep generic ones that might be used elsewhere)
DROP FUNCTION IF EXISTS trancenable_audit_trigger_function() CASCADE;
DROP FUNCTION IF EXISTS validate_company_identifiers() CASCADE;
DROP FUNCTION IF EXISTS refresh_trancenable_views() CASCADE;

-- =============================================================================
-- PHASE 3: DROP MATERIALIZED VIEWS
-- =============================================================================

-- Drop materialized views and their indexes
DROP MATERIALIZED VIEW IF EXISTS public.trancenable_companies_overview;

-- =============================================================================
-- PHASE 4: REMOVE ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Drop RLS policies for Trancenable tables
DROP POLICY IF EXISTS "Public read access to company identifiers" ON public.company_identifiers;
DROP POLICY IF EXISTS "Public read access to industry mapping" ON public.industry_mapping_log;
DROP POLICY IF EXISTS "Public read access to emission sources detail" ON public.emission_sources_detail;
DROP POLICY IF EXISTS "Admin read access to import logs" ON public.trancenable_import_log;
DROP POLICY IF EXISTS "Admin write access to company identifiers" ON public.company_identifiers;
DROP POLICY IF EXISTS "Admin write access to industry mapping" ON public.industry_mapping_log;
DROP POLICY IF EXISTS "Admin write access to import logs" ON public.trancenable_import_log;
DROP POLICY IF EXISTS "Admin write access to emission sources detail" ON public.emission_sources_detail;

-- =============================================================================
-- PHASE 5: DROP INDEXES (IN REVERSE ORDER OF CREATION)
-- =============================================================================

-- Drop Trancenable-specific indexes
DROP INDEX IF EXISTS public.idx_emission_sources_detail_category;
DROP INDEX IF EXISTS public.idx_emission_sources_detail_emissions;
DROP INDEX IF EXISTS public.idx_industry_mapping_type;
DROP INDEX IF EXISTS public.idx_industry_mapping_confidence;
DROP INDEX IF EXISTS public.idx_company_identifiers_primary;
DROP INDEX IF EXISTS public.idx_company_identifiers_company;
DROP INDEX IF EXISTS public.idx_company_identifiers_type_value;
DROP INDEX IF EXISTS public.idx_emissions_calculation_method;
DROP INDEX IF EXISTS public.idx_emissions_disclosure_year;
DROP INDEX IF EXISTS public.idx_emissions_trancenable_doc;
DROP INDEX IF EXISTS public.idx_companies_data_quality;
DROP INDEX IF EXISTS public.idx_companies_country_sector;
DROP INDEX IF EXISTS public.idx_companies_sector_industry;
DROP INDEX IF EXISTS public.idx_companies_trancenable_id;
DROP INDEX IF EXISTS public.idx_companies_permid_btree;
DROP INDEX IF EXISTS public.idx_companies_figi_btree;
DROP INDEX IF EXISTS public.idx_companies_ticker_btree;
DROP INDEX IF EXISTS public.idx_companies_lei_btree;

-- Drop unique constraint indexes
DROP INDEX IF EXISTS public.idx_companies_ticker_exchange_unique;
DROP INDEX IF EXISTS public.idx_companies_lei_unique;

-- =============================================================================
-- PHASE 6: REMOVE TABLE CONSTRAINTS
-- =============================================================================

-- Remove constraints from companies table
ALTER TABLE public.companies 
DROP CONSTRAINT IF EXISTS companies_lei_format,
DROP CONSTRAINT IF EXISTS companies_ticker_format,
DROP CONSTRAINT IF EXISTS companies_permid_format,
DROP CONSTRAINT IF EXISTS companies_figi_format,
DROP CONSTRAINT IF EXISTS companies_data_source_valid;

-- =============================================================================
-- PHASE 7: DROP TRANCENABLE TABLES (IN DEPENDENCY ORDER)
-- =============================================================================

-- Drop support tables first (no foreign key dependencies)
DROP TABLE IF EXISTS public.emission_sources_detail CASCADE;
DROP TABLE IF EXISTS public.industry_mapping_log CASCADE;
DROP TABLE IF EXISTS public.company_identifiers CASCADE;
DROP TABLE IF EXISTS public.trancenable_import_log CASCADE;

-- =============================================================================
-- PHASE 8: REMOVE COLUMNS FROM EXISTING TABLES
-- =============================================================================

-- Remove Trancenable-specific columns from emissions_data table
ALTER TABLE public.emissions_data 
DROP COLUMN IF EXISTS data_lineage,
DROP COLUMN IF EXISTS disclosure_year,
DROP COLUMN IF EXISTS calculation_method,
DROP COLUMN IF EXISTS incomplete_boundaries,
DROP COLUMN IF EXISTS source_urls,
DROP COLUMN IF EXISTS emission_sources,
DROP COLUMN IF EXISTS trancenable_document_id;

-- Remove Trancenable-specific columns from companies table
ALTER TABLE public.companies 
DROP COLUMN IF EXISTS identifier_confidence_score,
DROP COLUMN IF EXISTS data_source_attribution,
DROP COLUMN IF EXISTS trancenable_company_id,
DROP COLUMN IF EXISTS mic_code,
DROP COLUMN IF EXISTS exchange,
DROP COLUMN IF EXISTS permid,
DROP COLUMN IF EXISTS ticker,
DROP COLUMN IF EXISTS figi,
DROP COLUMN IF EXISTS lei;

-- =============================================================================
-- PHASE 9: OPTIONAL - REMOVE TRANCENABLE INDUSTRIES
-- =============================================================================

-- WARNING: This will remove industries that might be used by other data
-- Uncomment only if you want to completely remove Trancenable industries

/*
-- Get list of Trancenable industries for manual review
SELECT 
    id, 
    sector, 
    industry, 
    description,
    (SELECT COUNT(*) FROM public.companies WHERE industry = it.industry) as companies_using
FROM public.industry_taxonomy it
WHERE 
    description LIKE '%Trancenable%' OR
    industry IN (
        'Industrial Equipment Manufacturing',
        'Aerospace Manufacturing',
        'Marine Equipment Manufacturing',
        'Construction Equipment Manufacturing',
        'Packaging Manufacturing',
        'Paper Manufacturing',
        'Mining & Metals',
        'Textile Manufacturing',
        'Gas Utilities',
        'Water Utilities',
        'Independent Power Generation',
        'Energy Storage & Distribution',
        'Luxury Goods',
        'Hospitality Services',
        'Food Service',
        'Personal Care Services',
        'Tobacco Products',
        'Professional Services',
        'Transportation Infrastructure',
        'Marine Transportation',
        'Forestry & Logging',
        'Specialty Retail',
        'Real Estate Services',
        'Technology Consulting'
    )
ORDER BY companies_using DESC;

-- To actually remove industries (DANGEROUS - only if no companies use them):
-- DELETE FROM public.industry_taxonomy 
-- WHERE industry IN (...list of industries...)
-- AND NOT EXISTS (SELECT 1 FROM public.companies WHERE industry = industry_taxonomy.industry);
*/

-- =============================================================================
-- PHASE 10: CLEANUP AND VERIFICATION
-- =============================================================================

-- Remove backup tables after confirmation (optional)
-- DROP TABLE IF EXISTS public.trancenable_rollback_backup_companies;
-- DROP TABLE IF EXISTS public.trancenable_rollback_backup_emissions;
-- DROP TABLE IF EXISTS public.trancenable_rollback_backup_identifiers;
-- DROP TABLE IF EXISTS public.trancenable_rollback_backup_mapping;

-- Drop rollback helper function
DROP FUNCTION IF EXISTS confirm_trancenable_rollback();

-- Refresh materialized views if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'company_emissions_summary') THEN
        REFRESH MATERIALIZED VIEW public.company_emissions_summary;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'sector_benchmarks') THEN
        REFRESH MATERIALIZED VIEW public.sector_benchmarks;
    END IF;
END $$;

-- =============================================================================
-- ROLLBACK VERIFICATION
-- =============================================================================

DO $$
DECLARE
    table_exists BOOLEAN;
    column_exists BOOLEAN;
BEGIN
    -- Check that Trancenable tables are gone
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'company_identifiers'
    ) INTO table_exists;
    
    IF table_exists THEN
        RAISE WARNING 'Rollback incomplete: company_identifiers table still exists';
    END IF;
    
    -- Check that Trancenable columns are gone
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'companies' AND column_name = 'lei'
    ) INTO column_exists;
    
    IF column_exists THEN
        RAISE WARNING 'Rollback incomplete: lei column still exists in companies table';
    END IF;
    
    -- Log successful rollback
    RAISE NOTICE 'Epic 5 Trancenable Integration rollback completed';
    RAISE NOTICE 'Backup tables preserved for recovery if needed';
    RAISE NOTICE 'Industry taxonomy entries preserved (remove manually if needed)';
END $$;

-- Final status
SELECT 
    'Epic 5: Trancenable ESG Integration rollback completed' as rollback_status,
    'Backup tables available for recovery: trancenable_rollback_backup_*' as recovery_info,
    'Review industry taxonomy for manual cleanup if needed' as manual_action_required;