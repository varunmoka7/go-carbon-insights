-- Migration: Create Core ESG Database Schema
-- Created: 2025-07-30
-- Description: Creates comprehensive ESG database schema for real corporate data
-- Epic 2, Story 2.13: Core ESG Database Schema Implementation

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create companies table for core company profiles
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic company information
    name TEXT NOT NULL UNIQUE,
    sector TEXT NOT NULL,
    industry TEXT NOT NULL,
    headquarters TEXT,
    country TEXT,
    
    -- Business metrics
    employees INTEGER,
    revenue DECIMAL(15,2), -- in millions USD
    market_cap DECIMAL(15,2), -- in millions USD
    currency TEXT DEFAULT 'USD',
    
    -- ESG ratings and commitments
    sustainability_rating TEXT CHECK (sustainability_rating IN ('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F')),
    sbti_committed BOOLEAN DEFAULT FALSE,
    net_zero_target INTEGER, -- target year
    carbon_neutral BOOLEAN DEFAULT FALSE,
    
    -- Data quality and verification
    data_quality_score DECIMAL(3,2) DEFAULT 0.00 CHECK (data_quality_score >= 0.00 AND data_quality_score <= 1.00),
    verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    last_data_update TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create emissions_data table for scope 1, 2, 3 emissions
CREATE TABLE public.emissions_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    
    -- Emission year and scope data
    year INTEGER NOT NULL CHECK (year >= 1990 AND year <= 2100),
    scope1 DECIMAL(15,2) DEFAULT 0.00 CHECK (scope1 >= 0.00),
    scope2 DECIMAL(15,2) DEFAULT 0.00 CHECK (scope2 >= 0.00),
    scope3 DECIMAL(15,2) DEFAULT 0.00 CHECK (scope3 >= 0.00),
    total_emissions DECIMAL(15,2) GENERATED ALWAYS AS (scope1 + scope2 + scope3) STORED,
    
    -- Intensity metrics
    emissions_intensity DECIMAL(10,4), -- tCO2e per million USD revenue
    emissions_per_employee DECIMAL(10,4), -- tCO2e per employee
    
    -- Data source and verification
    data_source TEXT NOT NULL,
    verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    verification_date TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id),
    
    -- Additional context
    reporting_standard TEXT, -- GHG Protocol, ISO 14064, etc.
    boundary_setting TEXT, -- operational control, financial control
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Ensure unique company-year combinations
    UNIQUE(company_id, year)
);

-- Create sbti_targets table for Science Based Targets
CREATE TABLE public.sbti_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    
    -- Target details
    near_term_target TEXT,
    long_term_target TEXT,
    baseline_year INTEGER NOT NULL CHECK (baseline_year >= 1990 AND baseline_year <= 2100),
    target_year INTEGER NOT NULL CHECK (target_year >= 1990 AND target_year <= 2100),
    
    -- Reduction percentages
    scope1_reduction DECIMAL(5,2) CHECK (scope1_reduction >= 0.00 AND scope1_reduction <= 100.00),
    scope3_reduction DECIMAL(5,2) CHECK (scope3_reduction >= 0.00 AND scope3_reduction <= 100.00),
    overall_reduction DECIMAL(5,2) CHECK (overall_reduction >= 0.00 AND overall_reduction <= 100.00),
    
    -- Validation status
    validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'approved', 'rejected', 'expired')),
    validation_date TIMESTAMPTZ,
    sbti_id TEXT, -- SBTi assigned ID
    
    -- Progress tracking
    current_progress DECIMAL(5,2) DEFAULT 0.00 CHECK (current_progress >= 0.00 AND current_progress <= 100.00),
    on_track BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Ensure baseline year is before target year
    CONSTRAINT valid_year_range CHECK (baseline_year < target_year)
);

-- Create company_frameworks table for sustainability framework compliance
CREATE TABLE public.company_frameworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    
    -- Framework information
    framework_name TEXT NOT NULL CHECK (framework_name IN (
        'GRI', 'SASB', 'TCFD', 'CDP', 'UNGC', 'ISO 14001', 'ISO 50001', 
        'B Corp', 'LEED', 'WELL', 'BREEAM', 'GRESB', 'DJSI', 'MSCI ESG'
    )),
    status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Implemented', 'In Progress', 'Planned', 'Not Started')),
    
    -- Implementation details
    implementation_date DATE,
    verification_date DATE,
    score DECIMAL(5,2) CHECK (score >= 0.00 AND score <= 100.00),
    level TEXT, -- for frameworks with levels (e.g., LEED Platinum, Gold, etc.)
    
    -- Certification details
    certification_number TEXT,
    certifying_body TEXT,
    expiry_date DATE,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Ensure unique company-framework combinations
    UNIQUE(company_id, framework_name)
);

-- Create sustainability_metrics table for various ESG metrics
CREATE TABLE public.sustainability_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    
    -- Metric details
    metric_type TEXT NOT NULL CHECK (metric_type IN (
        'renewable_energy_percentage', 'water_usage', 'waste_generated', 
        'carbon_credits', 'materiality_score', 'energy_efficiency',
        'water_intensity', 'waste_intensity', 'recycling_rate',
        'supplier_decarbonization', 'green_buildings', 'electric_vehicles'
    )),
    value DECIMAL(15,4) NOT NULL,
    unit TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1990 AND year <= 2100),
    
    -- Data quality
    data_source TEXT NOT NULL,
    verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    confidence_level DECIMAL(3,2) DEFAULT 0.50 CHECK (confidence_level >= 0.00 AND confidence_level <= 1.00),
    
    -- Context
    scope TEXT, -- company-wide, facility-specific, etc.
    methodology TEXT,
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Ensure unique company-metric-year combinations
    UNIQUE(company_id, metric_type, year)
);

-- Create audit_log table for tracking all data changes
CREATE TABLE public.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Change details
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    
    -- Data changes
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    
    -- User and context
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    ip_address INET,
    user_agent TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance optimization
CREATE INDEX idx_companies_name ON public.companies(name);
CREATE INDEX idx_companies_sector ON public.companies(sector);
CREATE INDEX idx_companies_industry ON public.companies(industry);
CREATE INDEX idx_companies_sustainability_rating ON public.companies(sustainability_rating);
CREATE INDEX idx_companies_sbti_committed ON public.companies(sbti_committed);
CREATE INDEX idx_companies_data_quality_score ON public.companies(data_quality_score);

CREATE INDEX idx_emissions_company_year ON public.emissions_data(company_id, year);
CREATE INDEX idx_emissions_year ON public.emissions_data(year);
CREATE INDEX idx_emissions_total ON public.emissions_data(total_emissions);
CREATE INDEX idx_emissions_intensity ON public.emissions_data(emissions_intensity);
CREATE INDEX idx_emissions_verification ON public.emissions_data(verification_status);

CREATE INDEX idx_sbti_company ON public.sbti_targets(company_id);
CREATE INDEX idx_sbti_validation ON public.sbti_targets(validation_status);
CREATE INDEX idx_sbti_target_year ON public.sbti_targets(target_year);

CREATE INDEX idx_frameworks_company ON public.company_frameworks(company_id);
CREATE INDEX idx_frameworks_name ON public.company_frameworks(framework_name);
CREATE INDEX idx_frameworks_status ON public.company_frameworks(status);

CREATE INDEX idx_metrics_company_type ON public.sustainability_metrics(company_id, metric_type);
CREATE INDEX idx_metrics_type_year ON public.sustainability_metrics(metric_type, year);
CREATE INDEX idx_metrics_verification ON public.sustainability_metrics(verification_status);

CREATE INDEX idx_audit_table_record ON public.audit_log(table_name, record_id);
CREATE INDEX idx_audit_user ON public.audit_log(user_id);
CREATE INDEX idx_audit_created_at ON public.audit_log(created_at);

-- Create materialized views for dashboard performance
CREATE MATERIALIZED VIEW public.company_emissions_summary AS
SELECT 
    c.id,
    c.name,
    c.sector,
    c.industry,
    c.sustainability_rating,
    c.sbti_committed,
    c.net_zero_target,
    c.data_quality_score,
    e.year,
    e.scope1,
    e.scope2,
    e.scope3,
    e.total_emissions,
    e.emissions_intensity,
    e.verification_status
FROM public.companies c
LEFT JOIN public.emissions_data e ON c.id = e.company_id
WHERE e.year = (SELECT MAX(year) FROM public.emissions_data WHERE company_id = c.id);

CREATE MATERIALIZED VIEW public.sector_benchmarks AS
SELECT 
    sector,
    COUNT(*) as company_count,
    AVG(total_emissions) as avg_emissions,
    AVG(emissions_intensity) as avg_intensity,
    AVG(data_quality_score) as avg_quality_score,
    COUNT(CASE WHEN sbti_committed THEN 1 END) as sbti_committed_count
FROM public.company_emissions_summary
GROUP BY sector;

-- Create triggers for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emissions_updated_at BEFORE UPDATE ON public.emissions_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sbti_updated_at BEFORE UPDATE ON public.sbti_targets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_frameworks_updated_at BEFORE UPDATE ON public.company_frameworks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metrics_updated_at BEFORE UPDATE ON public.sustainability_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
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
$$ language 'plpgsql';

-- Create audit triggers for all tables
CREATE TRIGGER audit_companies_trigger AFTER INSERT OR UPDATE OR DELETE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_emissions_trigger AFTER INSERT OR UPDATE OR DELETE ON public.emissions_data
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_sbti_trigger AFTER INSERT OR UPDATE OR DELETE ON public.sbti_targets
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_frameworks_trigger AFTER INSERT OR UPDATE OR DELETE ON public.company_frameworks
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_metrics_trigger AFTER INSERT OR UPDATE OR DELETE ON public.sustainability_metrics
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Create Row Level Security (RLS) policies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emissions_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sbti_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sustainability_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read access to companies and their data
CREATE POLICY "Public read access to companies" ON public.companies
    FOR SELECT USING (true);

CREATE POLICY "Public read access to emissions" ON public.emissions_data
    FOR SELECT USING (true);

CREATE POLICY "Public read access to SBTi targets" ON public.sbti_targets
    FOR SELECT USING (true);

CREATE POLICY "Public read access to frameworks" ON public.company_frameworks
    FOR SELECT USING (true);

CREATE POLICY "Public read access to metrics" ON public.sustainability_metrics
    FOR SELECT USING (true);

-- RLS Policy: Admin write access
CREATE POLICY "Admin write access to companies" ON public.companies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users u
            JOIN user_profiles up ON u.id = up.id
            WHERE u.id = auth.uid() AND up.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin write access to emissions" ON public.emissions_data
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users u
            JOIN user_profiles up ON u.id = up.id
            WHERE u.id = auth.uid() AND up.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin write access to SBTi targets" ON public.sbti_targets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users u
            JOIN user_profiles up ON u.id = up.id
            WHERE u.id = auth.uid() AND up.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin write access to frameworks" ON public.company_frameworks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users u
            JOIN user_profiles up ON u.id = up.id
            WHERE u.id = auth.uid() AND up.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin write access to metrics" ON public.sustainability_metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users u
            JOIN user_profiles up ON u.id = up.id
            WHERE u.id = auth.uid() AND up.role IN ('admin', 'super_admin')
        )
    );

-- RLS Policy: Audit log access (admin only)
CREATE POLICY "Admin access to audit log" ON public.audit_log
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users u
            JOIN user_profiles up ON u.id = up.id
            WHERE u.id = auth.uid() AND up.role IN ('admin', 'super_admin')
        )
    );

-- Create refresh function for materialized views
CREATE OR REPLACE FUNCTION refresh_esg_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW public.company_emissions_summary;
    REFRESH MATERIALIZED VIEW public.sector_benchmarks;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create comments for documentation
COMMENT ON TABLE public.companies IS 'Core company profiles with ESG ratings and commitments';
COMMENT ON TABLE public.emissions_data IS 'Scope 1, 2, 3 emissions data with verification status';
COMMENT ON TABLE public.sbti_targets IS 'Science Based Targets initiative commitments and progress';
COMMENT ON TABLE public.company_frameworks IS 'Sustainability framework compliance and certifications';
COMMENT ON TABLE public.sustainability_metrics IS 'Various ESG metrics and KPIs';
COMMENT ON TABLE public.audit_log IS 'Complete audit trail for all data changes';

COMMENT ON MATERIALIZED VIEW public.company_emissions_summary IS 'Latest emissions data for dashboard performance';
COMMENT ON MATERIALIZED VIEW public.sector_benchmarks IS 'Sector-level benchmarking data for analytics';