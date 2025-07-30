-- Migration: Create Data Quality & Monitoring System
-- Created: 2025-07-30
-- Description: Creates tables for real-time data quality monitoring and alerting
-- Epic 2, Story 2.10: Real-time Data Quality & Monitoring Dashboard

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create data_quality_metrics table for tracking quality scores and metrics
CREATE TABLE public.data_quality_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Entity being measured
    entity_type TEXT NOT NULL CHECK (entity_type IN ('import', 'dataset', 'company', 'global')),
    entity_id UUID, -- References import_id, company_id, etc.
    
    -- Quality dimensions
    completeness_score DECIMAL(5,2) CHECK (completeness_score >= 0 AND completeness_score <= 100),
    accuracy_score DECIMAL(5,2) CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
    consistency_score DECIMAL(5,2) CHECK (consistency_score >= 0 AND consistency_score <= 100),
    timeliness_score DECIMAL(5,2) CHECK (timeliness_score >= 0 AND timeliness_score <= 100),
    validity_score DECIMAL(5,2) CHECK (validity_score >= 0 AND validity_score <= 100),
    overall_quality_score DECIMAL(5,2) GENERATED ALWAYS AS (
        (COALESCE(completeness_score, 0) + COALESCE(accuracy_score, 0) + 
         COALESCE(consistency_score, 0) + COALESCE(timeliness_score, 0) + 
         COALESCE(validity_score, 0)) / 5
    ) STORED,
    
    -- Quality details
    total_records INTEGER DEFAULT 0,
    valid_records INTEGER DEFAULT 0,
    invalid_records INTEGER DEFAULT 0,
    missing_records INTEGER DEFAULT 0,
    duplicate_records INTEGER DEFAULT 0,
    
    -- Metadata
    measurement_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_source TEXT,
    quality_rules_applied JSONB, -- Rules used for this measurement
    measurement_context JSONB, -- Additional context data
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create quality_alerts table for automated alert management
CREATE TABLE public.quality_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Alert details
    alert_type TEXT NOT NULL CHECK (alert_type IN ('quality_drop', 'anomaly_detected', 'threshold_breach', 'system_error', 'data_missing')),
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'suppressed')),
    
    -- Alert content
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    details JSONB, -- Detailed alert information
    
    -- Triggering data
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metric_id UUID REFERENCES public.data_quality_metrics(id) ON DELETE SET NULL,
    threshold_value DECIMAL(15,4),
    actual_value DECIMAL(15,4),
    
    -- Alert management
    acknowledged_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    
    -- Notification tracking
    notification_channels TEXT[], -- email, slack, webhook, etc.
    notification_sent_at TIMESTAMPTZ,
    notification_status TEXT DEFAULT 'pending' CHECK (notification_status IN ('pending', 'sent', 'failed')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create quality_rules table for configurable quality assessment rules
CREATE TABLE public.quality_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Rule identification
    rule_name TEXT NOT NULL UNIQUE,
    rule_description TEXT,
    rule_category TEXT NOT NULL CHECK (rule_category IN ('completeness', 'accuracy', 'consistency', 'timeliness', 'validity', 'anomaly')),
    
    -- Rule configuration
    rule_definition JSONB NOT NULL, -- Rule logic and parameters
    threshold_config JSONB, -- Threshold settings for alerts
    severity_mapping JSONB, -- How to map rule violations to severity levels
    
    -- Scope and applicability
    applies_to_entity_types TEXT[] DEFAULT ARRAY['import', 'dataset', 'company'],
    applies_to_data_categories TEXT[], -- emissions, financial, etc.
    
    -- Rule status
    is_active BOOLEAN DEFAULT TRUE,
    is_system_rule BOOLEAN DEFAULT FALSE, -- Cannot be deleted by users
    
    -- Metadata
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    last_modified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create anomaly_detections table for tracking unusual patterns
CREATE TABLE public.anomaly_detections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Anomaly details
    anomaly_type TEXT NOT NULL CHECK (anomaly_type IN ('statistical_outlier', 'trend_deviation', 'pattern_break', 'volume_spike', 'quality_drop')),
    confidence_score DECIMAL(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Detection context
    entity_type TEXT NOT NULL,
    entity_id UUID,
    field_name TEXT, -- Specific field if applicable
    
    -- Anomaly data
    expected_value DECIMAL(15,4),
    actual_value DECIMAL(15,4),
    deviation_percentage DECIMAL(8,2),
    
    -- Detection algorithm info
    detection_method TEXT NOT NULL, -- z_score, isolation_forest, etc.
    algorithm_parameters JSONB,
    baseline_period_start TIMESTAMPTZ,
    baseline_period_end TIMESTAMPTZ,
    
    -- Status and resolution
    status TEXT NOT NULL DEFAULT 'detected' CHECK (status IN ('detected', 'investigating', 'confirmed', 'false_positive', 'resolved')),
    investigation_notes TEXT,
    resolution_action TEXT,
    
    -- Metadata
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create quality_trends table for historical quality tracking
CREATE TABLE public.quality_trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Trend period
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    period_type TEXT NOT NULL CHECK (period_type IN ('hour', 'day', 'week', 'month')),
    
    -- Entity and scope
    entity_type TEXT NOT NULL,
    entity_id UUID,
    data_category TEXT,
    
    -- Aggregated quality metrics
    avg_quality_score DECIMAL(5,2),
    min_quality_score DECIMAL(5,2),
    max_quality_score DECIMAL(5,2),
    quality_score_std_dev DECIMAL(8,4),
    
    -- Volume metrics
    total_records_processed INTEGER DEFAULT 0,
    total_imports_processed INTEGER DEFAULT 0,
    
    -- Issue counts
    total_alerts_generated INTEGER DEFAULT 0,
    critical_alerts_count INTEGER DEFAULT 0,
    anomalies_detected INTEGER DEFAULT 0,
    
    -- Performance metrics
    avg_processing_time INTERVAL,
    successful_imports_percentage DECIMAL(5,2),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create real_time_metrics table for live dashboard updates
CREATE TABLE public.real_time_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Metric identification
    metric_name TEXT NOT NULL,
    metric_category TEXT NOT NULL CHECK (metric_category IN ('quality', 'performance', 'volume', 'errors', 'alerts')),
    
    -- Metric value
    metric_value DECIMAL(15,4) NOT NULL,
    metric_unit TEXT,
    
    -- Context
    entity_type TEXT,
    entity_id UUID,
    dimensions JSONB, -- Additional dimensions for grouping/filtering
    
    -- Temporal data
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ, -- For automatic cleanup of old metrics
    
    -- Metadata
    source_system TEXT DEFAULT 'quality_monitor',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for optimal performance
CREATE INDEX idx_data_quality_metrics_entity ON public.data_quality_metrics(entity_type, entity_id);
CREATE INDEX idx_data_quality_metrics_timestamp ON public.data_quality_metrics(measurement_timestamp);
CREATE INDEX idx_data_quality_metrics_score ON public.data_quality_metrics(overall_quality_score);

CREATE INDEX idx_quality_alerts_status ON public.quality_alerts(status);
CREATE INDEX idx_quality_alerts_severity ON public.quality_alerts(severity);
CREATE INDEX idx_quality_alerts_entity ON public.quality_alerts(entity_type, entity_id);
CREATE INDEX idx_quality_alerts_created_at ON public.quality_alerts(created_at);

CREATE INDEX idx_quality_rules_active ON public.quality_rules(is_active);
CREATE INDEX idx_quality_rules_category ON public.quality_rules(rule_category);

CREATE INDEX idx_anomaly_detections_entity ON public.anomaly_detections(entity_type, entity_id);
CREATE INDEX idx_anomaly_detections_status ON public.anomaly_detections(status);
CREATE INDEX idx_anomaly_detections_detected_at ON public.anomaly_detections(detected_at);
CREATE INDEX idx_anomaly_detections_severity ON public.anomaly_detections(severity);

CREATE INDEX idx_quality_trends_period ON public.quality_trends(period_start, period_end);
CREATE INDEX idx_quality_trends_entity ON public.quality_trends(entity_type, entity_id);
CREATE INDEX idx_quality_trends_category ON public.quality_trends(data_category);

CREATE INDEX idx_real_time_metrics_name ON public.real_time_metrics(metric_name);
CREATE INDEX idx_real_time_metrics_timestamp ON public.real_time_metrics(timestamp);
CREATE INDEX idx_real_time_metrics_expires_at ON public.real_time_metrics(expires_at);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.data_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomaly_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin users can view quality metrics" ON public.data_quality_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin users can manage quality alerts" ON public.quality_alerts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin users can manage quality rules" ON public.quality_rules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin users can view anomalies" ON public.anomaly_detections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin users can view quality trends" ON public.quality_trends
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admin users can view real-time metrics" ON public.real_time_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- System can insert metrics and alerts
CREATE POLICY "System can insert quality metrics" ON public.data_quality_metrics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can insert alerts" ON public.quality_alerts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can insert anomalies" ON public.anomaly_detections
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can insert trends" ON public.quality_trends
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can insert real-time metrics" ON public.real_time_metrics
    FOR INSERT WITH CHECK (true);

-- Add triggers to automatically update the updated_at timestamp
CREATE TRIGGER update_quality_alerts_updated_at 
    BEFORE UPDATE ON public.quality_alerts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quality_rules_updated_at 
    BEFORE UPDATE ON public.quality_rules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate quality scores
CREATE OR REPLACE FUNCTION calculate_quality_score(
    p_entity_type TEXT,
    p_entity_id UUID,
    p_total_records INTEGER,
    p_valid_records INTEGER,
    p_invalid_records INTEGER,
    p_missing_records INTEGER,
    p_duplicate_records INTEGER
)
RETURNS RECORD AS $$
DECLARE
    result RECORD;
    completeness DECIMAL(5,2);
    accuracy DECIMAL(5,2);
    consistency DECIMAL(5,2);
    validity DECIMAL(5,2);
BEGIN
    -- Calculate completeness (% of non-missing records)
    IF p_total_records > 0 THEN
        completeness = ((p_total_records - p_missing_records) * 100.0) / p_total_records;
    ELSE
        completeness = 100;
    END IF;
    
    -- Calculate accuracy (% of valid records)
    IF p_total_records > 0 THEN
        accuracy = (p_valid_records * 100.0) / p_total_records;
    ELSE
        accuracy = 100;
    END IF;
    
    -- Calculate consistency (% of non-duplicate records)
    IF p_total_records > 0 THEN
        consistency = ((p_total_records - p_duplicate_records) * 100.0) / p_total_records;
    ELSE
        consistency = 100;
    END IF;
    
    -- Calculate validity (% of records passing validation)
    IF p_total_records > 0 THEN
        validity = ((p_total_records - p_invalid_records) * 100.0) / p_total_records;
    ELSE
        validity = 100;
    END IF;
    
    -- For timeliness, we'll use a default score of 95 (this would be calculated based on data freshness)
    SELECT completeness, accuracy, consistency, validity, 95.0 AS timeliness_score
    INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to detect statistical anomalies using Z-score
CREATE OR REPLACE FUNCTION detect_statistical_anomalies(
    p_entity_type TEXT,
    p_field_name TEXT,
    p_current_value DECIMAL,
    p_threshold DECIMAL DEFAULT 2.5
)
RETURNS TABLE(
    is_anomaly BOOLEAN,
    confidence_score DECIMAL,
    expected_value DECIMAL,
    deviation_percentage DECIMAL
) AS $$
DECLARE
    historical_avg DECIMAL;
    historical_stddev DECIMAL;
    z_score DECIMAL;
    record_count INTEGER;
BEGIN
    -- Get historical statistics (last 90 days)
    SELECT 
        AVG(metric_value), 
        STDDEV(metric_value),
        COUNT(*)
    INTO historical_avg, historical_stddev, record_count
    FROM public.real_time_metrics 
    WHERE metric_name = p_field_name
    AND entity_type = p_entity_type
    AND timestamp >= NOW() - INTERVAL '90 days';
    
    -- Need at least 10 historical points for meaningful statistics
    IF record_count < 10 OR historical_stddev IS NULL OR historical_stddev = 0 THEN
        RETURN QUERY SELECT FALSE, 0.0::DECIMAL, p_current_value, 0.0::DECIMAL;
        RETURN;
    END IF;
    
    -- Calculate Z-score
    z_score = ABS(p_current_value - historical_avg) / historical_stddev;
    
    -- Determine if it's an anomaly
    IF z_score > p_threshold THEN
        RETURN QUERY SELECT 
            TRUE,
            LEAST(95.0, (z_score - p_threshold) * 20)::DECIMAL, -- Confidence score
            historical_avg,
            (ABS(p_current_value - historical_avg) / historical_avg * 100)::DECIMAL;
    ELSE
        RETURN QUERY SELECT FALSE, 0.0::DECIMAL, historical_avg, 0.0::DECIMAL;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to generate quality alerts
CREATE OR REPLACE FUNCTION generate_quality_alert(
    p_alert_type TEXT,
    p_severity TEXT,
    p_title TEXT,
    p_message TEXT,
    p_entity_type TEXT,
    p_entity_id UUID,
    p_metric_id UUID DEFAULT NULL,
    p_threshold_value DECIMAL DEFAULT NULL,
    p_actual_value DECIMAL DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    alert_id UUID;
BEGIN
    INSERT INTO public.quality_alerts (
        alert_type,
        severity,
        title,
        message,
        entity_type,
        entity_id,
        metric_id,
        threshold_value,
        actual_value,
        details
    ) VALUES (
        p_alert_type,
        p_severity,
        p_title,
        p_message,
        p_entity_type,
        p_entity_id,
        p_metric_id,
        p_threshold_value,
        p_actual_value,
        p_details
    ) RETURNING id INTO alert_id;
    
    RETURN alert_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to cleanup old real-time metrics
CREATE OR REPLACE FUNCTION cleanup_real_time_metrics()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete expired metrics
    DELETE FROM public.real_time_metrics 
    WHERE expires_at IS NOT NULL 
    AND expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Delete metrics older than 7 days that don't have explicit expiry
    DELETE FROM public.real_time_metrics 
    WHERE expires_at IS NULL 
    AND created_at < NOW() - INTERVAL '7 days';
    
    GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create materialized view for quality dashboard summary
CREATE MATERIALIZED VIEW public.quality_dashboard_summary AS
SELECT 
    'global' as scope,
    COUNT(DISTINCT dqm.entity_id) as total_entities_monitored,
    AVG(dqm.overall_quality_score) as avg_quality_score,
    COUNT(qa.id) FILTER (WHERE qa.status = 'active') as active_alerts,
    COUNT(qa.id) FILTER (WHERE qa.severity = 'critical' AND qa.status = 'active') as critical_alerts,
    COUNT(ad.id) FILTER (WHERE ad.status = 'detected') as unresolved_anomalies,
    DATE_TRUNC('hour', NOW()) as last_updated
FROM public.data_quality_metrics dqm
LEFT JOIN public.quality_alerts qa ON qa.created_at >= NOW() - INTERVAL '24 hours'
LEFT JOIN public.anomaly_detections ad ON ad.detected_at >= NOW() - INTERVAL '24 hours'
WHERE dqm.measurement_timestamp >= NOW() - INTERVAL '24 hours';

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_quality_dashboard_summary_scope ON public.quality_dashboard_summary (scope);

-- Insert default quality rules
INSERT INTO public.quality_rules (rule_name, rule_description, rule_category, rule_definition, threshold_config, is_system_rule) VALUES
('completeness_threshold', 'Alert when data completeness falls below threshold', 'completeness', 
 '{"metric": "completeness_score", "operator": "less_than", "threshold": 90}',
 '{"warning": 85, "error": 75, "critical": 50}', true),

('accuracy_threshold', 'Alert when data accuracy falls below threshold', 'accuracy',
 '{"metric": "accuracy_score", "operator": "less_than", "threshold": 95}',
 '{"warning": 90, "error": 80, "critical": 70}', true),

('volume_anomaly', 'Detect unusual changes in data volume', 'anomaly',
 '{"metric": "total_records", "method": "z_score", "threshold": 2.5}',
 '{"warning": 2.0, "error": 3.0, "critical": 4.0}', true),

('processing_time_threshold', 'Alert when processing time exceeds normal range', 'timeliness',
 '{"metric": "processing_time", "operator": "greater_than", "threshold": 3600}',
 '{"warning": 1800, "error": 3600, "critical": 7200}', true);

-- Grant appropriate permissions
GRANT SELECT ON public.quality_dashboard_summary TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_quality_score(TEXT, UUID, INTEGER, INTEGER, INTEGER, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION detect_statistical_anomalies(TEXT, TEXT, DECIMAL, DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_quality_alert(TEXT, TEXT, TEXT, TEXT, TEXT, UUID, UUID, DECIMAL, DECIMAL, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_real_time_metrics() TO authenticated;