-- Migration: Create Data Source Management System
-- Created: 2025-07-30
-- Description: Creates tables for unified data source management and orchestration
-- Epic 2, Story 2.11: Unified Data Source Management Interface

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create data_sources table for centralized source registry
CREATE TABLE public.data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Source identification
    source_name TEXT NOT NULL UNIQUE,
    source_description TEXT,
    source_type TEXT NOT NULL CHECK (source_type IN ('csv', 'api', 'webhook', 'ftp', 'database', 'manual')),
    source_category TEXT NOT NULL CHECK (source_category IN ('emissions', 'financial', 'operational', 'compliance', 'company_profiles')),
    
    -- Source status and health
    status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error', 'maintenance')),
    health_score INTEGER DEFAULT 0 CHECK (health_score >= 0 AND health_score <= 100),
    
    -- Connection configuration
    connection_config JSONB NOT NULL, -- Connection parameters (endpoint, paths, etc.)
    auth_config JSONB, -- Authentication configuration (encrypted)
    schedule_config JSONB, -- Scheduling configuration for automated syncs
    transformation_rules JSONB, -- Data transformation and mapping rules
    
    -- Performance and reliability metrics
    last_sync_at TIMESTAMPTZ,
    last_success_at TIMESTAMPTZ,
    last_error_at TIMESTAMPTZ,
    error_message TEXT,
    sync_frequency INTERVAL DEFAULT '1 hour',
    
    -- Connection testing
    last_test_at TIMESTAMPTZ,
    last_test_result JSONB, -- Results from last connection test
    
    -- Access control and security
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    allowed_users UUID[], -- Users who can access this source
    security_level TEXT DEFAULT 'standard' CHECK (security_level IN ('public', 'standard', 'restricted', 'confidential')),
    
    -- Metadata and tracking
    usage_count INTEGER DEFAULT 0,
    data_volume_bytes BIGINT DEFAULT 0,
    tags TEXT[], -- Searchable tags for organization
    
    -- Audit and versioning
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create source_health_metrics table for monitoring source performance
CREATE TABLE public.source_health_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES public.data_sources(id) ON DELETE CASCADE,
    
    -- Health indicators
    is_healthy BOOLEAN NOT NULL DEFAULT FALSE,
    health_score INTEGER NOT NULL DEFAULT 0 CHECK (health_score >= 0 AND health_score <= 100),
    uptime_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Performance metrics
    response_time_ms INTEGER, -- Average response time in milliseconds
    throughput_records_per_hour INTEGER DEFAULT 0,
    error_rate_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Error tracking
    error_count INTEGER DEFAULT 0,
    warning_count INTEGER DEFAULT 0,
    critical_error_count INTEGER DEFAULT 0,
    
    -- Check details
    last_check_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    next_check_at TIMESTAMPTZ,
    check_interval INTERVAL DEFAULT '5 minutes',
    
    -- Health status details
    status_details JSONB, -- Detailed health check results
    availability_status TEXT DEFAULT 'unknown' CHECK (availability_status IN ('available', 'degraded', 'unavailable', 'unknown')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create data_flow_mappings table for tracking data lineage and dependencies
CREATE TABLE public.data_flow_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Flow definition
    flow_name TEXT NOT NULL,
    flow_description TEXT,
    
    -- Source and destination
    source_id UUID NOT NULL REFERENCES public.data_sources(id) ON DELETE CASCADE,
    destination_type TEXT NOT NULL CHECK (destination_type IN ('database', 'table', 'view', 'file', 'api', 'queue')),
    destination_identifier TEXT NOT NULL, -- Table name, file path, etc.
    
    -- Flow configuration
    mapping_rules JSONB NOT NULL, -- Field mapping and transformation rules
    filter_conditions JSONB, -- Data filtering conditions
    validation_rules JSONB, -- Data validation rules
    
    -- Flow control
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 50 CHECK (priority >= 1 AND priority <= 100),
    retry_config JSONB, -- Retry configuration for failed flows
    
    -- Performance tracking
    last_execution_at TIMESTAMPTZ,
    last_success_at TIMESTAMPTZ,
    last_failure_at TIMESTAMPTZ,
    execution_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    
    -- Scheduling
    schedule_config JSONB, -- When and how often to run this flow
    next_execution_at TIMESTAMPTZ,
    
    -- Metadata
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tags TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create source_connections table for managing external API connections
CREATE TABLE public.source_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES public.data_sources(id) ON DELETE CASCADE,
    
    -- Connection details
    connection_name TEXT NOT NULL,
    endpoint_url TEXT,
    connection_type TEXT NOT NULL CHECK (connection_type IN ('rest_api', 'graphql', 'websocket', 'ftp', 'sftp', 'database')),
    
    -- Authentication
    auth_method TEXT CHECK (auth_method IN ('none', 'api_key', 'bearer_token', 'basic', 'oauth2', 'custom')),
    auth_credentials JSONB, -- Encrypted authentication credentials
    
    -- Connection pooling and limits
    max_connections INTEGER DEFAULT 5,
    connection_timeout INTERVAL DEFAULT '30 seconds',
    read_timeout INTERVAL DEFAULT '60 seconds',
    rate_limit_requests_per_hour INTEGER,
    
    -- SSL/TLS configuration
    ssl_enabled BOOLEAN DEFAULT TRUE,
    ssl_verify BOOLEAN DEFAULT TRUE,
    ssl_cert_path TEXT,
    
    -- Connection health
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMPTZ,
    connection_errors INTEGER DEFAULT 0,
    
    -- Monitoring
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create source_sync_logs table for tracking sync operations
CREATE TABLE public.source_sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES public.data_sources(id) ON DELETE CASCADE,
    
    -- Sync operation details
    sync_type TEXT NOT NULL CHECK (sync_type IN ('manual', 'scheduled', 'triggered', 'retry')),
    sync_mode TEXT NOT NULL CHECK (sync_mode IN ('full', 'incremental', 'delta')),
    
    -- Sync progress and results
    status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled', 'partially_failed')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Data metrics
    records_fetched INTEGER DEFAULT 0,
    records_processed INTEGER DEFAULT 0,
    records_imported INTEGER DEFAULT 0,
    records_skipped INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    data_size_bytes BIGINT DEFAULT 0,
    
    -- Timing information
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration INTERVAL GENERATED ALWAYS AS (completed_at - started_at) STORED,
    
    -- Error tracking
    error_message TEXT,
    error_details JSONB,
    retry_count INTEGER DEFAULT 0,
    
    -- Context and metadata
    triggered_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    sync_parameters JSONB, -- Parameters used for this sync
    batch_id TEXT, -- For grouping related sync operations
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create source_credentials table for secure credential management
CREATE TABLE public.source_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES public.data_sources(id) ON DELETE CASCADE,
    
    -- Credential details
    credential_name TEXT NOT NULL,
    credential_type TEXT NOT NULL CHECK (credential_type IN ('api_key', 'username_password', 'token', 'certificate', 'oauth_token', 'custom')),
    
    -- Encrypted credential data
    encrypted_credentials BYTEA NOT NULL, -- Encrypted using application-level encryption
    encryption_key_id TEXT NOT NULL, -- Reference to encryption key
    
    -- Credential lifecycle
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    last_rotated_at TIMESTAMPTZ,
    rotation_frequency INTERVAL,
    
    -- Access control
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    last_used_at TIMESTAMPTZ,
    usage_count INTEGER DEFAULT 0,
    
    -- Security
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMPTZ,
    revoked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    revocation_reason TEXT
);

-- Create indexes for optimal performance
CREATE INDEX idx_data_sources_type ON public.data_sources(source_type);
CREATE INDEX idx_data_sources_category ON public.data_sources(source_category);
CREATE INDEX idx_data_sources_status ON public.data_sources(status);
CREATE INDEX idx_data_sources_created_by ON public.data_sources(created_by);
CREATE INDEX idx_data_sources_tags ON public.data_sources USING GIN(tags);
CREATE INDEX idx_data_sources_created_at ON public.data_sources(created_at);

CREATE INDEX idx_source_health_metrics_source_id ON public.source_health_metrics(source_id);
CREATE INDEX idx_source_health_metrics_health_score ON public.source_health_metrics(health_score);
CREATE INDEX idx_source_health_metrics_last_check ON public.source_health_metrics(last_check_at);

CREATE INDEX idx_data_flow_mappings_source_id ON public.data_flow_mappings(source_id);
CREATE INDEX idx_data_flow_mappings_active ON public.data_flow_mappings(is_active);
CREATE INDEX idx_data_flow_mappings_priority ON public.data_flow_mappings(priority);
CREATE INDEX idx_data_flow_mappings_execution ON public.data_flow_mappings(next_execution_at);

CREATE INDEX idx_source_connections_source_id ON public.source_connections(source_id);
CREATE INDEX idx_source_connections_active ON public.source_connections(is_active);
CREATE INDEX idx_source_connections_type ON public.source_connections(connection_type);

CREATE INDEX idx_source_sync_logs_source_id ON public.source_sync_logs(source_id);
CREATE INDEX idx_source_sync_logs_status ON public.source_sync_logs(status);
CREATE INDEX idx_source_sync_logs_started_at ON public.source_sync_logs(started_at);
CREATE INDEX idx_source_sync_logs_batch_id ON public.source_sync_logs(batch_id);

CREATE INDEX idx_source_credentials_source_id ON public.source_credentials(source_id);
CREATE INDEX idx_source_credentials_active ON public.source_credentials(is_active);
CREATE INDEX idx_source_credentials_expires_at ON public.source_credentials(expires_at);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_flow_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_credentials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for data_sources table
-- Only admin users can view and manage data sources
CREATE POLICY "Admin users can view all data sources" ON public.data_sources
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin users can manage data sources" ON public.data_sources
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create RLS policies for source_health_metrics table
CREATE POLICY "Admin users can view health metrics" ON public.source_health_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin and system can manage health metrics" ON public.source_health_metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create RLS policies for other tables
CREATE POLICY "Admin users can manage flow mappings" ON public.data_flow_mappings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin users can manage connections" ON public.source_connections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin users can view sync logs" ON public.source_sync_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin and system can manage sync logs" ON public.source_sync_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin users can manage credentials" ON public.source_credentials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Add triggers to automatically update the updated_at timestamp
CREATE TRIGGER update_data_sources_updated_at 
    BEFORE UPDATE ON public.data_sources 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_flow_mappings_updated_at 
    BEFORE UPDATE ON public.data_flow_mappings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_source_connections_updated_at 
    BEFORE UPDATE ON public.source_connections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically update source usage statistics
CREATE OR REPLACE FUNCTION update_source_usage_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update usage count and last sync time when a sync is completed
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status = 'completed') THEN
        UPDATE public.data_sources 
        SET 
            usage_count = usage_count + 1,
            last_sync_at = NEW.completed_at,
            last_success_at = CASE WHEN NEW.status = 'completed' THEN NEW.completed_at ELSE last_success_at END,
            last_error_at = CASE WHEN NEW.status = 'failed' THEN NEW.completed_at ELSE last_error_at END,
            error_message = CASE WHEN NEW.status = 'failed' THEN NEW.error_message ELSE NULL END,
            data_volume_bytes = data_volume_bytes + COALESCE(NEW.data_size_bytes, 0)
        WHERE id = NEW.source_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for source usage statistics
CREATE TRIGGER update_source_usage_stats_trigger
    AFTER INSERT OR UPDATE ON public.source_sync_logs
    FOR EACH ROW EXECUTE FUNCTION update_source_usage_stats();

-- Create function to automatically calculate source health scores
CREATE OR REPLACE FUNCTION calculate_source_health_score(
    p_source_id UUID,
    p_days_to_analyze INTEGER DEFAULT 7
)
RETURNS INTEGER AS $$
DECLARE
    health_score INTEGER := 0;
    uptime_score INTEGER := 0;
    error_score INTEGER := 0;
    performance_score INTEGER := 0;
    
    total_checks INTEGER;
    successful_checks INTEGER;
    avg_response_time DECIMAL;
    error_rate DECIMAL;
BEGIN
    -- Calculate uptime score (40% of total score)
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE is_healthy = TRUE)
    INTO total_checks, successful_checks
    FROM public.source_health_metrics 
    WHERE source_id = p_source_id 
    AND created_at >= NOW() - (p_days_to_analyze || ' days')::INTERVAL;
    
    IF total_checks > 0 THEN
        uptime_score := LEAST(100, (successful_checks * 100 / total_checks) * 0.4);
    END IF;
    
    -- Calculate error rate score (30% of total score)
    SELECT AVG(error_rate_percentage)
    INTO error_rate
    FROM public.source_health_metrics 
    WHERE source_id = p_source_id 
    AND created_at >= NOW() - (p_days_to_analyze || ' days')::INTERVAL;
    
    error_score := LEAST(100, (100 - COALESCE(error_rate, 0)) * 0.3);
    
    -- Calculate performance score (30% of total score)
    SELECT AVG(response_time_ms)
    INTO avg_response_time
    FROM public.source_health_metrics 
    WHERE source_id = p_source_id 
    AND response_time_ms IS NOT NULL
    AND created_at >= NOW() - (p_days_to_analyze || ' days')::INTERVAL;
    
    -- Score based on response time (lower is better)
    IF avg_response_time IS NOT NULL THEN
        performance_score := LEAST(100, GREATEST(0, (5000 - avg_response_time) / 50) * 0.3);
    ELSE
        performance_score := 30; -- Default score if no performance data
    END IF;
    
    health_score := uptime_score + error_score + performance_score;
    
    -- Update the data source with the calculated health score
    UPDATE public.data_sources 
    SET health_score = health_score
    WHERE id = p_source_id;
    
    RETURN health_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean up old health metrics and sync logs
CREATE OR REPLACE FUNCTION cleanup_source_monitoring_data()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Delete health metrics older than 90 days
    DELETE FROM public.source_health_metrics 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Delete sync logs older than 1 year
    DELETE FROM public.source_sync_logs 
    WHERE created_at < NOW() - INTERVAL '1 year';
    
    GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create materialized view for source dashboard statistics
CREATE MATERIALIZED VIEW public.source_dashboard_stats AS
SELECT 
    COUNT(*) as total_sources,
    COUNT(*) FILTER (WHERE status = 'active') as active_sources,
    COUNT(*) FILTER (WHERE status = 'error') as error_sources,
    COUNT(*) FILTER (WHERE health_score >= 80) as healthy_sources,
    AVG(health_score) as avg_health_score,
    source_type,
    source_category,
    DATE_TRUNC('day', created_at) as date_created
FROM public.data_sources
WHERE created_at >= NOW() - INTERVAL '1 year'
GROUP BY source_type, source_category, DATE_TRUNC('day', created_at)
ORDER BY date_created DESC, source_type, source_category;

-- Create unique index on materialized view
CREATE UNIQUE INDEX idx_source_dashboard_stats_unique 
ON public.source_dashboard_stats (source_type, source_category, date_created);

-- Create function to refresh dashboard statistics
CREATE OR REPLACE FUNCTION refresh_source_dashboard_stats()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.source_dashboard_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant appropriate permissions
GRANT SELECT ON public.source_dashboard_stats TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_source_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_source_health_score(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_source_monitoring_data() TO authenticated;