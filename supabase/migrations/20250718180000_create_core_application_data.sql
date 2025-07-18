-- Migration: Create Core Application Data Tables
-- Created: 2025-07-18
-- Description: Creates the core application data tables for emissions tracking,
-- targets, progress, and public company data as required by Epic 1 Story 1.5

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create emission_records table
-- This table stores all emission records for both private tracking and public data
CREATE TABLE public.emission_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    
    -- Emission data
    scope_1_emissions DECIMAL(15,2) DEFAULT 0, -- Direct emissions (tCO2e)
    scope_2_emissions DECIMAL(15,2) DEFAULT 0, -- Indirect emissions from electricity (tCO2e)
    scope_3_emissions DECIMAL(15,2) DEFAULT 0, -- Other indirect emissions (tCO2e)
    total_emissions DECIMAL(15,2) GENERATED ALWAYS AS (scope_1_emissions + scope_2_emissions + scope_3_emissions) STORED,
    
    -- Context and metadata
    reporting_period_start DATE NOT NULL,
    reporting_period_end DATE NOT NULL,
    emission_factor_source TEXT,
    calculation_method TEXT,
    data_quality_score INTEGER CHECK (data_quality_score >= 1 AND data_quality_score <= 5),
    verification_status TEXT CHECK (verification_status IN ('unverified', 'self_verified', 'third_party_verified')),
    
    -- Additional tracking fields
    energy_consumption DECIMAL(15,2), -- kWh or MWh
    renewable_energy_percentage DECIMAL(5,2) CHECK (renewable_energy_percentage >= 0 AND renewable_energy_percentage <= 100),
    waste_generated DECIMAL(15,2), -- tonnes
    water_usage DECIMAL(15,2), -- cubic meters
    
    -- Metadata
    is_public BOOLEAN DEFAULT FALSE,
    data_source TEXT DEFAULT 'user_input',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create emission_targets table
-- This table stores climate targets for companies and users
CREATE TABLE public.emission_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    
    -- Target details
    target_name TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('absolute', 'intensity', 'renewable_energy', 'net_zero')),
    target_scope TEXT NOT NULL CHECK (target_scope IN ('scope_1', 'scope_2', 'scope_1_2', 'scope_1_2_3')),
    
    -- Target values
    baseline_year INTEGER NOT NULL,
    baseline_value DECIMAL(15,2) NOT NULL,
    target_year INTEGER NOT NULL,
    target_value DECIMAL(15,2) NOT NULL,
    target_unit TEXT NOT NULL DEFAULT 'tCO2e',
    
    -- Progress tracking
    current_value DECIMAL(15,2),
    progress_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN baseline_value = target_value THEN 100
            WHEN baseline_value > target_value THEN 
                LEAST(100, GREATEST(0, (baseline_value - COALESCE(current_value, baseline_value)) / (baseline_value - target_value) * 100))
            ELSE 
                LEAST(100, GREATEST(0, (COALESCE(current_value, baseline_value) - baseline_value) / (target_value - baseline_value) * 100))
        END
    ) STORED,
    
    -- Metadata
    is_public BOOLEAN DEFAULT FALSE,
    target_status TEXT DEFAULT 'active' CHECK (target_status IN ('active', 'achieved', 'revised', 'abandoned')),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create progress table
-- This table tracks detailed progress against targets over time
CREATE TABLE public.progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id UUID NOT NULL REFERENCES public.emission_targets(id) ON DELETE CASCADE,
    
    -- Progress data
    reporting_date DATE NOT NULL,
    actual_value DECIMAL(15,2) NOT NULL,
    progress_percentage DECIMAL(5,2),
    
    -- Context
    notes TEXT,
    data_source TEXT DEFAULT 'user_input',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create public_company_profiles table
-- This table stores publicly available company information for benchmarking
CREATE TABLE public.public_company_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Company identification
    company_name TEXT NOT NULL,
    ticker_symbol TEXT,
    industry TEXT NOT NULL,
    sector TEXT,
    sub_sector TEXT,
    
    -- Company details
    headquarters_location TEXT,
    market_cap_usd DECIMAL(15,2),
    employees_count INTEGER,
    revenue_usd DECIMAL(15,2),
    
    -- Sustainability info
    sustainability_reporting_framework TEXT[], -- GRI, SASB, TCFD, etc.
    has_science_based_targets BOOLEAN DEFAULT FALSE,
    net_zero_commitment_year INTEGER,
    
    -- Data source and quality
    data_source TEXT NOT NULL,
    last_updated DATE NOT NULL,
    data_quality_score INTEGER CHECK (data_quality_score >= 1 AND data_quality_score <= 5),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create public_emissions_data table
-- This table stores publicly available emissions data for companies
CREATE TABLE public.public_emissions_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_profile_id UUID NOT NULL REFERENCES public.public_company_profiles(id) ON DELETE CASCADE,
    
    -- Emission data
    reporting_year INTEGER NOT NULL,
    scope_1_emissions DECIMAL(15,2),
    scope_2_emissions DECIMAL(15,2),
    scope_3_emissions DECIMAL(15,2),
    total_emissions DECIMAL(15,2) GENERATED ALWAYS AS (
        COALESCE(scope_1_emissions, 0) + COALESCE(scope_2_emissions, 0) + COALESCE(scope_3_emissions, 0)
    ) STORED,
    
    -- Intensity metrics
    revenue_intensity DECIMAL(15,4), -- tCO2e per $ revenue
    employee_intensity DECIMAL(15,4), -- tCO2e per employee
    
    -- Additional metrics
    renewable_energy_percentage DECIMAL(5,2),
    energy_consumption DECIMAL(15,2),
    water_usage DECIMAL(15,2),
    waste_generated DECIMAL(15,2),
    
    -- Data quality and source
    data_source TEXT NOT NULL,
    verification_status TEXT CHECK (verification_status IN ('unverified', 'self_verified', 'third_party_verified')),
    reporting_standard TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create industry_benchmarks table
-- This table stores industry-level benchmark data for comparison
CREATE TABLE public.industry_benchmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Industry classification
    industry TEXT NOT NULL,
    sector TEXT,
    sub_sector TEXT,
    
    -- Benchmark metrics
    benchmark_year INTEGER NOT NULL,
    metric_name TEXT NOT NULL,
    metric_unit TEXT NOT NULL,
    
    -- Statistical values
    average_value DECIMAL(15,4),
    median_value DECIMAL(15,4),
    percentile_25 DECIMAL(15,4),
    percentile_75 DECIMAL(15,4),
    best_in_class DECIMAL(15,4),
    worst_in_class DECIMAL(15,4),
    
    -- Sample information
    sample_size INTEGER,
    data_source TEXT NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_emission_records_user_id ON public.emission_records(user_id);
CREATE INDEX idx_emission_records_company_id ON public.emission_records(company_id);
CREATE INDEX idx_emission_records_period ON public.emission_records(reporting_period_start, reporting_period_end);
CREATE INDEX idx_emission_records_public ON public.emission_records(is_public);

CREATE INDEX idx_emission_targets_user_id ON public.emission_targets(user_id);
CREATE INDEX idx_emission_targets_company_id ON public.emission_targets(company_id);
CREATE INDEX idx_emission_targets_status ON public.emission_targets(target_status);

CREATE INDEX idx_progress_target_id ON public.progress(target_id);
CREATE INDEX idx_progress_date ON public.progress(reporting_date);

CREATE INDEX idx_public_company_profiles_industry ON public.public_company_profiles(industry);
CREATE INDEX idx_public_company_profiles_sector ON public.public_company_profiles(sector);
CREATE INDEX idx_public_company_profiles_ticker ON public.public_company_profiles(ticker_symbol);

CREATE INDEX idx_public_emissions_data_company_id ON public.public_emissions_data(company_profile_id);
CREATE INDEX idx_public_emissions_data_year ON public.public_emissions_data(reporting_year);

CREATE INDEX idx_industry_benchmarks_industry ON public.industry_benchmarks(industry);
CREATE INDEX idx_industry_benchmarks_year ON public.industry_benchmarks(benchmark_year);
CREATE INDEX idx_industry_benchmarks_metric ON public.industry_benchmarks(metric_name);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.emission_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emission_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_emissions_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_benchmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for emission_records table
-- Users can view their own records and public records
CREATE POLICY "Users can view their own emission records" ON public.emission_records
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view public emission records" ON public.emission_records
    FOR SELECT USING (is_public = true);

-- Users can insert their own records
CREATE POLICY "Users can insert their own emission records" ON public.emission_records
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own records
CREATE POLICY "Users can update their own emission records" ON public.emission_records
    FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own records
CREATE POLICY "Users can delete their own emission records" ON public.emission_records
    FOR DELETE USING (user_id = auth.uid());

-- Create RLS policies for emission_targets table
-- Users can view their own targets and public targets
CREATE POLICY "Users can view their own emission targets" ON public.emission_targets
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view public emission targets" ON public.emission_targets
    FOR SELECT USING (is_public = true);

-- Users can insert their own targets
CREATE POLICY "Users can insert their own emission targets" ON public.emission_targets
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own targets
CREATE POLICY "Users can update their own emission targets" ON public.emission_targets
    FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own targets
CREATE POLICY "Users can delete their own emission targets" ON public.emission_targets
    FOR DELETE USING (user_id = auth.uid());

-- Create RLS policies for progress table
-- Users can view progress for their own targets
CREATE POLICY "Users can view progress for their targets" ON public.progress
    FOR SELECT USING (
        target_id IN (
            SELECT id FROM public.emission_targets 
            WHERE user_id = auth.uid()
        )
    );

-- Users can view progress for public targets
CREATE POLICY "Users can view progress for public targets" ON public.progress
    FOR SELECT USING (
        target_id IN (
            SELECT id FROM public.emission_targets 
            WHERE is_public = true
        )
    );

-- Users can insert progress for their own targets
CREATE POLICY "Users can insert progress for their targets" ON public.progress
    FOR INSERT WITH CHECK (
        target_id IN (
            SELECT id FROM public.emission_targets 
            WHERE user_id = auth.uid()
        )
    );

-- Users can update progress for their own targets
CREATE POLICY "Users can update progress for their targets" ON public.progress
    FOR UPDATE USING (
        target_id IN (
            SELECT id FROM public.emission_targets 
            WHERE user_id = auth.uid()
        )
    );

-- Users can delete progress for their own targets
CREATE POLICY "Users can delete progress for their targets" ON public.progress
    FOR DELETE USING (
        target_id IN (
            SELECT id FROM public.emission_targets 
            WHERE user_id = auth.uid()
        )
    );

-- Create RLS policies for public data tables
-- All users can view public company profiles and data
CREATE POLICY "Users can view public company profiles" ON public.public_company_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can view public emissions data" ON public.public_emissions_data
    FOR SELECT USING (true);

CREATE POLICY "Users can view industry benchmarks" ON public.industry_benchmarks
    FOR SELECT USING (true);

-- Only authenticated users can insert/update/delete public data (admin functionality)
CREATE POLICY "Authenticated users can manage public company profiles" ON public.public_company_profiles
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage public emissions data" ON public.public_emissions_data
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage industry benchmarks" ON public.industry_benchmarks
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Add triggers to automatically update the updated_at timestamp
CREATE TRIGGER update_emission_records_updated_at 
    BEFORE UPDATE ON public.emission_records 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emission_targets_updated_at 
    BEFORE UPDATE ON public.emission_targets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at 
    BEFORE UPDATE ON public.progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_public_company_profiles_updated_at 
    BEFORE UPDATE ON public.public_company_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_public_emissions_data_updated_at 
    BEFORE UPDATE ON public.public_emissions_data 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_industry_benchmarks_updated_at 
    BEFORE UPDATE ON public.industry_benchmarks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to automatically update target progress when current_value changes
CREATE OR REPLACE FUNCTION update_target_current_value()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the target's current_value with the latest progress entry
    UPDATE public.emission_targets 
    SET current_value = NEW.actual_value
    WHERE id = NEW.target_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_target_current_value_trigger 
    AFTER INSERT OR UPDATE ON public.progress 
    FOR EACH ROW EXECUTE FUNCTION update_target_current_value();