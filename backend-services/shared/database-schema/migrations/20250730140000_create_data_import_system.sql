-- Migration: Create Data Import Management System
-- Created: 2025-07-30
-- Description: Creates tables for enterprise-scale ESG data import management
-- Epic 2, Story 2.9: Enterprise Data Import Management System

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create data_imports table for tracking import operations
CREATE TABLE public.data_imports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Import metadata
    import_name TEXT NOT NULL,
    import_type TEXT NOT NULL CHECK (import_type IN ('csv', 'api', 'manual', 'scheduled')),
    import_category TEXT NOT NULL CHECK (import_category IN ('emissions', 'financial', 'operational', 'compliance', 'company_profiles')),
    
    -- Import status and progress
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'validating', 'completed', 'failed', 'cancelled')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- File information
    file_name TEXT,
    file_size BIGINT, -- in bytes
    file_mime_type TEXT,
    file_path TEXT, -- encrypted storage path
    
    -- Processing metrics
    total_records INTEGER DEFAULT 0,
    processed_records INTEGER DEFAULT 0,
    valid_records INTEGER DEFAULT 0,
    invalid_records INTEGER DEFAULT 0,
    duplicate_records INTEGER DEFAULT 0,
    
    -- Timing information
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    processing_duration INTERVAL GENERATED ALWAYS AS (completed_at - started_at) STORED,
    
    -- User and security
    initiated_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    admin_notes TEXT,
    
    -- Configuration and validation
    validation_rules JSONB, -- schema validation rules
    transformation_config JSONB, -- data transformation settings
    import_schedule JSONB, -- for recurring imports
    
    -- Audit and tracking
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create import_errors table for detailed error logging
CREATE TABLE public.import_errors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    import_id UUID NOT NULL REFERENCES public.data_imports(id) ON DELETE CASCADE,
    
    -- Error details
    error_type TEXT NOT NULL CHECK (error_type IN ('validation', 'transformation', 'database', 'security', 'system')),
    error_severity TEXT NOT NULL CHECK (error_severity IN ('info', 'warning', 'error', 'critical')),
    error_code TEXT,
    error_message TEXT NOT NULL,
    error_details JSONB, -- detailed error context
    
    -- Location information
    row_number INTEGER, -- CSV row number if applicable
    column_name TEXT, -- column causing error if applicable
    field_value TEXT, -- problematic field value
    
    -- Context
    suggested_fix TEXT,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolution_notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create import_configurations table for reusable import templates
CREATE TABLE public.import_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Configuration details
    config_name TEXT NOT NULL UNIQUE,
    config_description TEXT,
    import_type TEXT NOT NULL CHECK (import_type IN ('csv', api', 'manual', 'scheduled')),
    import_category TEXT NOT NULL CHECK (import_category IN ('emissions', 'financial', 'operational', 'compliance', 'company_profiles')),
    
    -- Schema and validation
    schema_definition JSONB NOT NULL, -- JSON schema for validation
    field_mappings JSONB, -- mapping from source to target fields
    validation_rules JSONB, -- business rule validations
    transformation_rules JSONB, -- data transformation logic
    
    -- Default settings
    default_settings JSONB, -- default import configuration
    is_active BOOLEAN DEFAULT TRUE,
    is_template BOOLEAN DEFAULT FALSE, -- whether this is a reusable template
    
    -- Access control
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    allowed_users UUID[], -- users who can use this configuration
    
    -- Metadata
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create import_queue table for managing background processing
CREATE TABLE public.import_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    import_id UUID NOT NULL REFERENCES public.data_imports(id) ON DELETE CASCADE,
    
    -- Queue management
    queue_name TEXT NOT NULL DEFAULT 'default',
    priority INTEGER NOT NULL DEFAULT 50 CHECK (priority >= 1 AND priority <= 100),
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    
    -- Scheduling
    scheduled_for TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processing_timeout INTERVAL DEFAULT '1 hour',
    
    -- Worker information
    worker_id TEXT, -- identifier of processing worker
    started_processing_at TIMESTAMPTZ,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create import_audit_log table for comprehensive audit trails
CREATE TABLE public.import_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    import_id UUID REFERENCES public.data_imports(id) ON DELETE CASCADE,
    
    -- Audit details
    action_type TEXT NOT NULL CHECK (action_type IN ('create', 'start', 'pause', 'resume', 'cancel', 'retry', 'complete', 'delete')),
    action_description TEXT NOT NULL,
    
    -- Context
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_agent TEXT,
    ip_address INET,
    
    -- Data changes
    old_values JSONB,
    new_values JSONB,
    affected_records INTEGER,
    
    -- System information
    system_context JSONB, -- system state, memory usage, etc.
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for optimal performance
CREATE INDEX idx_data_imports_status ON public.data_imports(status);
CREATE INDEX idx_data_imports_type ON public.data_imports(import_type);
CREATE INDEX idx_data_imports_category ON public.data_imports(import_category);
CREATE INDEX idx_data_imports_user ON public.data_imports(initiated_by);
CREATE INDEX idx_data_imports_created_at ON public.data_imports(created_at);
CREATE INDEX idx_data_imports_completed_at ON public.data_imports(completed_at);

CREATE INDEX idx_import_errors_import_id ON public.import_errors(import_id);
CREATE INDEX idx_import_errors_type ON public.import_errors(error_type);
CREATE INDEX idx_import_errors_severity ON public.import_errors(error_severity);
CREATE INDEX idx_import_errors_resolved ON public.import_errors(is_resolved);

CREATE INDEX idx_import_configurations_active ON public.import_configurations(is_active);
CREATE INDEX idx_import_configurations_template ON public.import_configurations(is_template);
CREATE INDEX idx_import_configurations_type ON public.import_configurations(import_type);
CREATE INDEX idx_import_configurations_category ON public.import_configurations(import_category);

CREATE INDEX idx_import_queue_status ON public.import_queue(status);
CREATE INDEX idx_import_queue_priority ON public.import_queue(priority);
CREATE INDEX idx_import_queue_scheduled ON public.import_queue(scheduled_for);
CREATE INDEX idx_import_queue_processing ON public.import_queue(started_processing_at);

CREATE INDEX idx_import_audit_log_import_id ON public.import_audit_log(import_id);
CREATE INDEX idx_import_audit_log_action ON public.import_audit_log(action_type);
CREATE INDEX idx_import_audit_log_user ON public.import_audit_log(performed_by);
CREATE INDEX idx_import_audit_log_created_at ON public.import_audit_log(created_at);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.data_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for data_imports table
-- Only admin users can view and manage imports
CREATE POLICY "Admin users can view all imports" ON public.data_imports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin users can insert imports" ON public.data_imports
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin users can update imports" ON public.data_imports
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin users can delete imports" ON public.data_imports
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create RLS policies for import_errors table
CREATE POLICY "Admin users can view import errors" ON public.import_errors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin users can manage import errors" ON public.import_errors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create RLS policies for import_configurations table
CREATE POLICY "Admin users can view configurations" ON public.import_configurations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin users can manage configurations" ON public.import_configurations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create RLS policies for import_queue table
CREATE POLICY "Admin users can view queue" ON public.import_queue
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin users can manage queue" ON public.import_queue
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create RLS policies for import_audit_log table
CREATE POLICY "Admin users can view audit log" ON public.import_audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "System can insert audit log entries" ON public.import_audit_log
    FOR INSERT WITH CHECK (true); -- Allow system to log, but enforce admin view access

-- Add triggers to automatically update the updated_at timestamp
CREATE TRIGGER update_data_imports_updated_at 
    BEFORE UPDATE ON public.data_imports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_import_configurations_updated_at 
    BEFORE UPDATE ON public.import_configurations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_import_queue_updated_at 
    BEFORE UPDATE ON public.import_queue 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically log import actions
CREATE OR REPLACE FUNCTION log_import_action()
RETURNS TRIGGER AS $$
BEGIN
    -- Log the action based on trigger operation
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.import_audit_log (
            import_id, action_type, action_description, 
            performed_by, new_values
        ) VALUES (
            NEW.id, 'create', 'Import created: ' || NEW.import_name,
            NEW.initiated_by, to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Log status changes
        IF OLD.status != NEW.status THEN
            INSERT INTO public.import_audit_log (
                import_id, action_type, action_description,
                performed_by, old_values, new_values
            ) VALUES (
                NEW.id, 
                CASE NEW.status
                    WHEN 'processing' THEN 'start'
                    WHEN 'completed' THEN 'complete'
                    WHEN 'failed' THEN 'fail'
                    WHEN 'cancelled' THEN 'cancel'
                    ELSE 'update'
                END,
                'Status changed from ' || OLD.status || ' to ' || NEW.status,
                auth.uid(),
                jsonb_build_object('status', OLD.status),
                jsonb_build_object('status', NEW.status)
            );
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.import_audit_log (
            import_id, action_type, action_description,
            performed_by, old_values
        ) VALUES (
            OLD.id, 'delete', 'Import deleted: ' || OLD.import_name,
            auth.uid(), to_jsonb(OLD)
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit trigger for data_imports table
CREATE TRIGGER audit_data_imports_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.data_imports
    FOR EACH ROW EXECUTE FUNCTION log_import_action();

-- Create function to clean up old completed imports (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_imports()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete completed imports older than 1 year
    DELETE FROM public.data_imports 
    WHERE status = 'completed' 
    AND completed_at < NOW() - INTERVAL '1 year';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Delete failed imports older than 6 months
    DELETE FROM public.data_imports 
    WHERE status = 'failed' 
    AND created_at < NOW() - INTERVAL '6 months';
    
    GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;
    
    -- Delete audit log entries older than 2 years
    DELETE FROM public.import_audit_log 
    WHERE created_at < NOW() - INTERVAL '2 years';
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update import progress and metrics
CREATE OR REPLACE FUNCTION update_import_progress(
    p_import_id UUID,
    p_processed INTEGER DEFAULT NULL,
    p_valid INTEGER DEFAULT NULL,
    p_invalid INTEGER DEFAULT NULL,
    p_duplicates INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.data_imports 
    SET 
        processed_records = COALESCE(p_processed, processed_records),
        valid_records = COALESCE(p_valid, valid_records),
        invalid_records = COALESCE(p_invalid, invalid_records),
        duplicate_records = COALESCE(p_duplicates, duplicate_records),
        progress_percentage = CASE 
            WHEN total_records > 0 THEN 
                LEAST(100, (COALESCE(p_processed, processed_records) * 100) / total_records)
            ELSE 0
        END,
        updated_at = NOW()
    WHERE id = p_import_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create materialized view for import statistics
CREATE MATERIALIZED VIEW public.import_statistics AS
SELECT 
    import_type,
    import_category,
    COUNT(*) as total_imports,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_imports,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_imports,
    AVG(processing_duration) as avg_processing_time,
    SUM(total_records) as total_records_processed,
    SUM(valid_records) as total_valid_records,
    DATE_TRUNC('month', created_at) as month,
    MAX(created_at) as last_import_date
FROM public.data_imports
WHERE created_at >= NOW() - INTERVAL '2 years'
GROUP BY import_type, import_category, DATE_TRUNC('month', created_at)
ORDER BY month DESC, import_type, import_category;

-- Create unique index on materialized view
CREATE UNIQUE INDEX idx_import_statistics_unique 
ON public.import_statistics (import_type, import_category, month);

-- Create function to refresh import statistics
CREATE OR REPLACE FUNCTION refresh_import_statistics()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.import_statistics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant appropriate permissions
GRANT SELECT ON public.import_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_import_statistics() TO authenticated;
GRANT EXECUTE ON FUNCTION update_import_progress(UUID, INTEGER, INTEGER, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_imports() TO authenticated;