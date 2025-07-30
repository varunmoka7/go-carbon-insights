-- Migration: Create Transformation Jobs Table
-- Created: 2025-07-30
-- Description: Creates table for tracking data transformation jobs
-- Epic 2, Story 2.14: Data Transformation Pipeline Implementation

-- Create transformation_jobs table
CREATE TABLE public.transformation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    import_id UUID NOT NULL REFERENCES public.data_imports(id) ON DELETE CASCADE,
    
    -- Job status and progress
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    progress DECIMAL(5,2) DEFAULT 0.00 CHECK (progress >= 0.00 AND progress <= 100.00),
    
    -- Record counts
    total_records INTEGER DEFAULT 0,
    processed_records INTEGER DEFAULT 0,
    
    -- Error tracking
    errors TEXT[] DEFAULT '{}',
    warnings TEXT[] DEFAULT '{}',
    
    -- Processing results
    companies_created INTEGER DEFAULT 0,
    companies_updated INTEGER DEFAULT 0,
    emissions_created INTEGER DEFAULT 0,
    targets_created INTEGER DEFAULT 0,
    frameworks_created INTEGER DEFAULT 0,
    metrics_created INTEGER DEFAULT 0,
    
    -- Timing
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes for performance
CREATE INDEX idx_transformation_jobs_import_id ON public.transformation_jobs(import_id);
CREATE INDEX idx_transformation_jobs_status ON public.transformation_jobs(status);
CREATE INDEX idx_transformation_jobs_created_at ON public.transformation_jobs(created_at);
CREATE INDEX idx_transformation_jobs_started_at ON public.transformation_jobs(started_at);

-- Create trigger for automatic updated_at
CREATE TRIGGER update_transformation_jobs_updated_at BEFORE UPDATE ON public.transformation_jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create audit trigger
CREATE TRIGGER audit_transformation_jobs_trigger AFTER INSERT OR UPDATE OR DELETE ON public.transformation_jobs
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Enable Row Level Security
ALTER TABLE public.transformation_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admin access only
CREATE POLICY "Admin access to transformation jobs" ON public.transformation_jobs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users u
            JOIN user_profiles up ON u.id = up.id
            WHERE u.id = auth.uid() AND up.role IN ('admin', 'super_admin')
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transformation_jobs TO authenticated;

-- Create comments
COMMENT ON TABLE public.transformation_jobs IS 'Data transformation job tracking and results';
COMMENT ON COLUMN public.transformation_jobs.import_id IS 'Reference to the data import record';
COMMENT ON COLUMN public.transformation_jobs.status IS 'Current status of the transformation job';
COMMENT ON COLUMN public.transformation_jobs.progress IS 'Progress percentage (0-100)';
COMMENT ON COLUMN public.transformation_jobs.errors IS 'Array of error messages encountered during processing';
COMMENT ON COLUMN public.transformation_jobs.warnings IS 'Array of warning messages encountered during processing';
COMMENT ON COLUMN public.transformation_jobs.companies_created IS 'Number of new companies created';
COMMENT ON COLUMN public.transformation_jobs.companies_updated IS 'Number of existing companies updated';
COMMENT ON COLUMN public.transformation_jobs.emissions_created IS 'Number of emissions records created';
COMMENT ON COLUMN public.transformation_jobs.targets_created IS 'Number of SBTi targets created';
COMMENT ON COLUMN public.transformation_jobs.frameworks_created IS 'Number of framework records created';
COMMENT ON COLUMN public.transformation_jobs.metrics_created IS 'Number of sustainability metrics created';