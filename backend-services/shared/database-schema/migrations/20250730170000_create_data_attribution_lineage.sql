-- Migration: Create Data Attribution & Lineage System
-- Created: 2025-07-30
-- Description: Creates tables for comprehensive data attribution and lineage tracking
-- Epic 2, Story 2.12: Comprehensive Data Attribution & Lineage System

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create data_attributions table for tracking data sources and attribution
CREATE TABLE public.data_attributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Entity identification
    entity_type TEXT NOT NULL CHECK (entity_type IN ('data_point', 'dataset', 'company', 'report', 'metric', 'calculation')),
    entity_id TEXT NOT NULL, -- Flexible identifier for various entity types
    
    -- Source attribution
    source_id UUID REFERENCES public.data_sources(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL,
    source_type TEXT NOT NULL,
    source_credibility INTEGER DEFAULT 0 CHECK (source_credibility >= 0 AND source_credibility <= 100),
    
    -- Data collection details
    data_collection_method TEXT NOT NULL,
    collection_timestamp TIMESTAMPTZ,
    verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('verified', 'provisional', 'unverified', 'disputed')),
    verification_method TEXT,
    last_verified TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Methodology and quality
    methodology TEXT, -- Description of how data was collected/calculated
    uncertainty_level TEXT CHECK (uncertainty_level IN ('low', 'medium', 'high', 'unknown')),
    confidence_level DECIMAL(5,2) CHECK (confidence_level >= 0 AND confidence_level <= 100),
    accuracy_assessment TEXT,
    
    -- Contextual information
    temporal_scope JSONB, -- Time period the data covers
    geographical_scope TEXT, -- Geographic coverage
    industry_scope TEXT[], -- Industry sectors covered
    data_granularity TEXT, -- Level of detail (company, facility, process, etc.)
    
    -- Regulatory and compliance
    regulatory_framework TEXT[], -- Applicable regulations (GRI, TCFD, etc.)
    compliance_status TEXT CHECK (compliance_status IN ('compliant', 'non_compliant', 'partial', 'unknown')),
    audit_trail JSONB, -- Detailed audit information
    
    -- Metadata
    notes TEXT,
    tags TEXT[], -- Searchable tags for categorization
    is_public BOOLEAN DEFAULT TRUE, -- Whether attribution is publicly visible
    
    -- Access control
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    last_updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create data_lineage table for tracking data transformation and flow
CREATE TABLE public.data_lineage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Entity identification
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    
    -- Lineage graph structure
    lineage_graph JSONB NOT NULL, -- Complete graph of data flow (nodes and edges)
    lineage_depth INTEGER DEFAULT 1 CHECK (lineage_depth >= 1 AND lineage_depth <= 20),
    
    -- Transformation history
    transformation_history JSONB DEFAULT '[]'::jsonb, -- Array of transformation steps
    
    -- Lineage metadata
    lineage_type TEXT DEFAULT 'manual' CHECK (lineage_type IN ('manual', 'automated', 'inferred')),
    lineage_status TEXT DEFAULT 'active' CHECK (lineage_status IN ('active', 'archived', 'deprecated')),
    
    -- Quality and completeness
    completeness_score INTEGER DEFAULT 0 CHECK (completeness_score >= 0 AND completeness_score <= 100),
    is_complete BOOLEAN DEFAULT FALSE,
    missing_links TEXT[], -- Description of missing lineage information
    
    -- Performance tracking
    calculation_time_ms INTEGER, -- Time taken to calculate lineage
    last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Version control
    version INTEGER DEFAULT 1,
    parent_lineage_id UUID REFERENCES public.data_lineage(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create source_credibility table for managing source reliability scores
CREATE TABLE public.source_credibility (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES public.data_sources(id) ON DELETE CASCADE,
    
    -- Credibility scores
    credibility_score INTEGER NOT NULL DEFAULT 0 CHECK (credibility_score >= 0 AND credibility_score <= 100),
    reliability_index DECIMAL(5,2) DEFAULT 0 CHECK (reliability_index >= 0 AND reliability_index <= 100),
    
    -- Historical accuracy tracking
    accuracy_history JSONB DEFAULT '[]'::jsonb, -- Array of historical accuracy measurements
    
    -- Certifications and recognition
    certifications TEXT[], -- Industry certifications
    industry_recognition TEXT[], -- Awards, recognitions, etc.
    
    -- Peer reviews and ratings
    peer_reviews JSONB DEFAULT '[]'::jsonb, -- Array of peer review objects
    expert_ratings JSONB DEFAULT '[]'::jsonb, -- Expert evaluations
    
    -- Methodology assessment
    methodology_score INTEGER DEFAULT 0 CHECK (methodology_score >= 0 AND methodology_score <= 100),
    transparency_score INTEGER DEFAULT 0 CHECK (transparency_score >= 0 AND transparency_score <= 100),
    documentation_quality INTEGER DEFAULT 0 CHECK (documentation_quality >= 0 AND documentation_quality <= 100),
    
    -- Update tracking
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    update_reason TEXT,
    validation_method TEXT,
    
    -- Manual override capability
    is_manually_set BOOLEAN DEFAULT FALSE,
    manual_override_reason TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create data_access_logs table for audit trail
CREATE TABLE public.data_access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Accessed entity
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    
    -- Access details
    access_type TEXT NOT NULL CHECK (access_type IN ('view', 'export', 'citation', 'analysis', 'modification')),
    access_purpose TEXT, -- Business purpose for accessing the data
    
    -- User and session information
    accessed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    
    -- Geographic and temporal context
    access_location TEXT, -- Geographic location if available
    access_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Access context
    referrer_url TEXT,
    application_context JSONB, -- Application state or context
    
    -- Compliance and privacy
    legal_basis TEXT, -- Legal basis for data access (GDPR, etc.)
    consent_given BOOLEAN DEFAULT FALSE,
    data_subject_notification BOOLEAN DEFAULT FALSE,
    
    -- Technical details
    response_time_ms INTEGER,
    data_volume_bytes BIGINT,
    operation_success BOOLEAN DEFAULT TRUE,
    error_message TEXT
);

-- Create provenance_reports table for generating compliance documentation
CREATE TABLE public.provenance_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Report scope
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    report_type TEXT DEFAULT 'standard' CHECK (report_type IN ('standard', 'regulatory', 'audit', 'research')),
    
    -- Report content
    full_lineage JSONB NOT NULL, -- Complete lineage information
    attributions JSONB NOT NULL, -- All attribution records
    credibility_assessment JSONB NOT NULL, -- Source credibility analysis
    compliance_status JSONB NOT NULL, -- Regulatory compliance assessment
    citations JSONB DEFAULT '[]'::jsonb, -- Generated citations in various formats
    
    -- Report metadata
    report_format TEXT DEFAULT 'json' CHECK (report_format IN ('json', 'pdf', 'html', 'xml')),
    report_language TEXT DEFAULT 'en',
    
    -- Generation details
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    generated_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    generation_time_ms INTEGER,
    
    -- Validity and expiration
    valid_until TIMESTAMPTZ,
    is_expired BOOLEAN GENERATED ALWAYS AS (valid_until < NOW()) STORED,
    
    -- Access control
    is_confidential BOOLEAN DEFAULT FALSE,
    access_level TEXT DEFAULT 'internal' CHECK (access_level IN ('public', 'internal', 'restricted', 'confidential')),
    
    -- Version control
    version INTEGER DEFAULT 1,
    superseded_by UUID REFERENCES public.provenance_reports(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create data_citations table for managing generated citations
CREATE TABLE public.data_citations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Cited entity
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    
    -- Citation details
    citation_format TEXT NOT NULL CHECK (citation_format IN ('apa', 'ieee', 'chicago', 'harvard', 'mla', 'custom')),
    citation_text TEXT NOT NULL,
    
    -- Bibliographic information
    title TEXT,
    authors TEXT[],
    publication_date DATE,
    publisher TEXT,
    doi TEXT,
    url TEXT,
    access_date DATE,
    
    -- Citation metadata
    is_primary_source BOOLEAN DEFAULT TRUE,
    citation_quality_score INTEGER DEFAULT 0 CHECK (citation_quality_score >= 0 AND citation_quality_score <= 100),
    
    -- Usage tracking
    citation_count INTEGER DEFAULT 0,
    last_cited_at TIMESTAMPTZ,
    
    -- Generation details
    generated_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    auto_generated BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create data_conflicts table for managing conflicting data sources
CREATE TABLE public.data_conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Conflicting entity
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    
    -- Conflict details
    conflict_type TEXT NOT NULL CHECK (conflict_type IN ('value_mismatch', 'methodology_difference', 'temporal_discrepancy', 'scope_overlap', 'credibility_dispute')),
    conflict_severity TEXT DEFAULT 'medium' CHECK (conflict_severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Involved sources
    source_1_id UUID NOT NULL REFERENCES public.data_sources(id) ON DELETE CASCADE,
    source_2_id UUID NOT NULL REFERENCES public.data_sources(id) ON DELETE CASCADE,
    
    -- Conflict data
    conflicting_values JSONB, -- The actual conflicting data
    variance_percentage DECIMAL(10,4), -- Percentage difference between values
    
    -- Resolution
    resolution_status TEXT DEFAULT 'unresolved' CHECK (resolution_status IN ('unresolved', 'investigating', 'resolved', 'accepted')),
    resolution_method TEXT,
    resolution_notes TEXT,
    resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    
    -- Impact assessment
    impact_assessment TEXT,
    affected_entities TEXT[], -- Other entities that might be affected
    
    -- Detection
    detected_by TEXT DEFAULT 'system' CHECK (detected_by IN ('system', 'user', 'audit', 'external')),
    detection_method TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for optimal performance
CREATE INDEX idx_data_attributions_entity ON public.data_attributions(entity_type, entity_id);
CREATE INDEX idx_data_attributions_source ON public.data_attributions(source_id);
CREATE INDEX idx_data_attributions_verification ON public.data_attributions(verification_status);
CREATE INDEX idx_data_attributions_created_by ON public.data_attributions(created_by);
CREATE INDEX idx_data_attributions_tags ON public.data_attributions USING GIN(tags);
CREATE INDEX idx_data_attributions_temporal_scope ON public.data_attributions USING GIN(temporal_scope);

CREATE INDEX idx_data_lineage_entity ON public.data_lineage(entity_type, entity_id);
CREATE INDEX idx_data_lineage_type ON public.data_lineage(lineage_type);
CREATE INDEX idx_data_lineage_status ON public.data_lineage(lineage_status);
CREATE INDEX idx_data_lineage_completeness ON public.data_lineage(completeness_score);
CREATE INDEX idx_data_lineage_updated_at ON public.data_lineage(updated_at);

CREATE INDEX idx_source_credibility_source_id ON public.source_credibility(source_id);
CREATE INDEX idx_source_credibility_score ON public.source_credibility(credibility_score);
CREATE INDEX idx_source_credibility_updated ON public.source_credibility(last_updated);

CREATE INDEX idx_data_access_logs_entity ON public.data_access_logs(entity_type, entity_id);
CREATE INDEX idx_data_access_logs_user ON public.data_access_logs(accessed_by);
CREATE INDEX idx_data_access_logs_timestamp ON public.data_access_logs(access_timestamp);
CREATE INDEX idx_data_access_logs_ip ON public.data_access_logs(ip_address);

CREATE INDEX idx_provenance_reports_entity ON public.provenance_reports(entity_type, entity_id);
CREATE INDEX idx_provenance_reports_generated_by ON public.provenance_reports(generated_by);
CREATE INDEX idx_provenance_reports_expired ON public.provenance_reports(is_expired);

CREATE INDEX idx_data_citations_entity ON public.data_citations(entity_type, entity_id);
CREATE INDEX idx_data_citations_format ON public.data_citations(citation_format);
CREATE INDEX idx_data_citations_count ON public.data_citations(citation_count);

CREATE INDEX idx_data_conflicts_entity ON public.data_conflicts(entity_type, entity_id);
CREATE INDEX idx_data_conflicts_status ON public.data_conflicts(resolution_status);
CREATE INDEX idx_data_conflicts_severity ON public.data_conflicts(conflict_severity);
CREATE INDEX idx_data_conflicts_sources ON public.data_conflicts(source_1_id, source_2_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.data_attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_lineage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_credibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provenance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_conflicts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for data_attributions table
-- Public data is visible to all authenticated users, private data only to creators/admins
CREATE POLICY "Public attributions are visible to all" ON public.data_attributions
    FOR SELECT USING (
        is_public = TRUE OR
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Users can create attributions" ON public.data_attributions
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
    );

CREATE POLICY "Users can update their own attributions or admins can update any" ON public.data_attributions
    FOR UPDATE USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create RLS policies for data_lineage table
CREATE POLICY "All authenticated users can view lineage" ON public.data_lineage
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage lineage" ON public.data_lineage
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create RLS policies for source_credibility table
CREATE POLICY "All authenticated users can view credibility" ON public.source_credibility
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage credibility" ON public.source_credibility
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create RLS policies for data_access_logs table
CREATE POLICY "Users can view their own access logs" ON public.data_access_logs
    FOR SELECT USING (
        accessed_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "System can insert access logs" ON public.data_access_logs
    FOR INSERT WITH CHECK (true); -- Allow system to log, but enforce view restrictions

-- Create RLS policies for provenance_reports table
CREATE POLICY "Users can view non-confidential reports or their own" ON public.provenance_reports
    FOR SELECT USING (
        (is_confidential = FALSE AND access_level IN ('public', 'internal')) OR
        generated_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Authenticated users can create reports" ON public.provenance_reports
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for data_citations and data_conflicts
CREATE POLICY "All authenticated users can view citations" ON public.data_citations
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create citations" ON public.data_citations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "All authenticated users can view conflicts" ON public.data_conflicts
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage conflicts" ON public.data_conflicts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Add triggers to automatically update the updated_at timestamp
CREATE TRIGGER update_data_attributions_updated_at 
    BEFORE UPDATE ON public.data_attributions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_lineage_updated_at 
    BEFORE UPDATE ON public.data_lineage 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_citations_updated_at 
    BEFORE UPDATE ON public.data_citations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_conflicts_updated_at 
    BEFORE UPDATE ON public.data_conflicts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically log data access
CREATE OR REPLACE FUNCTION log_data_access(
    p_entity_type TEXT,
    p_entity_id TEXT,
    p_access_type TEXT,
    p_purpose TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    access_log_id UUID;
BEGIN
    INSERT INTO public.data_access_logs (
        entity_type,
        entity_id,
        access_type,
        access_purpose,
        accessed_by,
        access_timestamp
    ) VALUES (
        p_entity_type,
        p_entity_id,
        p_access_type,
        p_purpose,
        auth.uid(),
        NOW()
    ) RETURNING id INTO access_log_id;
    
    RETURN access_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate attribution completeness
CREATE OR REPLACE FUNCTION calculate_attribution_completeness(
    p_entity_type TEXT,
    p_entity_id TEXT
)
RETURNS INTEGER AS $$
DECLARE
    completeness_score INTEGER := 0;
    attribution_count INTEGER;
    verified_count INTEGER;
    methodology_count INTEGER;
BEGIN
    -- Count total attributions
    SELECT COUNT(*) INTO attribution_count
    FROM public.data_attributions
    WHERE entity_type = p_entity_type AND entity_id = p_entity_id;
    
    IF attribution_count = 0 THEN
        RETURN 0;
    END IF;
    
    -- Count verified attributions (40% of score)
    SELECT COUNT(*) INTO verified_count
    FROM public.data_attributions
    WHERE entity_type = p_entity_type 
    AND entity_id = p_entity_id 
    AND verification_status = 'verified';
    
    completeness_score := completeness_score + (verified_count * 40 / attribution_count);
    
    -- Count attributions with methodology (30% of score)
    SELECT COUNT(*) INTO methodology_count
    FROM public.data_attributions
    WHERE entity_type = p_entity_type 
    AND entity_id = p_entity_id 
    AND methodology IS NOT NULL AND methodology != '';
    
    completeness_score := completeness_score + (methodology_count * 30 / attribution_count);
    
    -- Base score for having any attributions (30% of score)
    completeness_score := completeness_score + 30;
    
    RETURN LEAST(100, completeness_score);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to detect data conflicts
CREATE OR REPLACE FUNCTION detect_data_conflicts(
    p_entity_type TEXT,
    p_entity_id TEXT
)
RETURNS INTEGER AS $$
DECLARE
    conflict_count INTEGER := 0;
    attr_record RECORD;
    compare_record RECORD;
BEGIN
    -- Compare all attributions for the same entity
    FOR attr_record IN
        SELECT * FROM public.data_attributions
        WHERE entity_type = p_entity_type AND entity_id = p_entity_id
    LOOP
        FOR compare_record IN
            SELECT * FROM public.data_attributions
            WHERE entity_type = p_entity_type 
            AND entity_id = p_entity_id 
            AND source_id != attr_record.source_id
            AND id > attr_record.id -- Avoid duplicate comparisons
        LOOP
            -- Check if sources have significantly different credibility scores
            IF ABS(attr_record.source_credibility - compare_record.source_credibility) > 20 THEN
                INSERT INTO public.data_conflicts (
                    entity_type,
                    entity_id,
                    conflict_type,
                    conflict_severity,
                    source_1_id,
                    source_2_id,
                    variance_percentage,
                    detected_by,
                    detection_method
                ) VALUES (
                    p_entity_type,
                    p_entity_id,
                    'credibility_dispute',
                    CASE WHEN ABS(attr_record.source_credibility - compare_record.source_credibility) > 50 THEN 'high' ELSE 'medium' END,
                    attr_record.source_id,
                    compare_record.source_id,
                    ABS(attr_record.source_credibility - compare_record.source_credibility),
                    'system',
                    'automated_credibility_check'
                ) ON CONFLICT DO NOTHING; -- Avoid duplicate conflicts
                
                conflict_count := conflict_count + 1;
            END IF;
        END LOOP;
    END LOOP;
    
    RETURN conflict_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to generate automatic citations
CREATE OR REPLACE FUNCTION generate_citation(
    p_entity_type TEXT,
    p_entity_id TEXT,
    p_format TEXT DEFAULT 'apa'
)
RETURNS TEXT AS $$
DECLARE
    citation_text TEXT := '';
    attr_record RECORD;
    source_record RECORD;
    current_year INTEGER := EXTRACT(YEAR FROM NOW());
    access_date TEXT := TO_CHAR(NOW(), 'Month DD, YYYY');
BEGIN
    -- Get primary attribution
    SELECT * INTO attr_record
    FROM public.data_attributions
    WHERE entity_type = p_entity_type AND entity_id = p_entity_id
    ORDER BY source_credibility DESC, created_at ASC
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN 'No attribution found for citation generation.';
    END IF;
    
    -- Get source details
    SELECT * INTO source_record
    FROM public.data_sources
    WHERE id = attr_record.source_id;
    
    -- Generate citation based on format
    CASE p_format
        WHEN 'apa' THEN
            citation_text := source_record.source_name || '. (' || current_year || '). ' || 
                           attr_record.entity_type || ' data [Dataset]. Retrieved ' || access_date || 
                           ' from ' || source_record.source_type || ' source.';
        
        WHEN 'ieee' THEN
            citation_text := '"' || source_record.source_name || '," ' || attr_record.entity_type || 
                           ' data, ' || source_record.source_type || ', ' || current_year || 
                           '. [Online]. Available: [Accessed: ' || access_date || ']';
        
        WHEN 'chicago' THEN
            citation_text := source_record.source_name || '. "' || attr_record.entity_type || 
                           ' Data." ' || source_record.source_type || '. Accessed ' || access_date || '.';
        
        ELSE
            citation_text := source_record.source_name || ' - ' || attr_record.entity_type || 
                           ' data (' || current_year || ')';
    END CASE;
    
    -- Store generated citation
    INSERT INTO public.data_citations (
        entity_type,
        entity_id,
        citation_format,
        citation_text,
        generated_by
    ) VALUES (
        p_entity_type,
        p_entity_id,
        p_format,
        citation_text,
        auth.uid()
    ) ON CONFLICT DO NOTHING;
    
    RETURN citation_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean up old access logs
CREATE OR REPLACE FUNCTION cleanup_attribution_data()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Delete access logs older than 2 years
    DELETE FROM public.data_access_logs 
    WHERE access_timestamp < NOW() - INTERVAL '2 years';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Delete expired provenance reports
    DELETE FROM public.provenance_reports 
    WHERE is_expired = TRUE 
    AND created_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;
    
    -- Archive old resolved conflicts
    DELETE FROM public.data_conflicts 
    WHERE resolution_status = 'resolved' 
    AND resolved_at < NOW() - INTERVAL '1 year';
    
    GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create materialized view for attribution statistics
CREATE MATERIALIZED VIEW public.attribution_statistics AS
SELECT 
    entity_type,
    COUNT(*) as total_attributions,
    COUNT(*) FILTER (WHERE verification_status = 'verified') as verified_attributions,
    AVG(source_credibility) as avg_credibility,
    COUNT(DISTINCT source_id) as unique_sources,
    DATE_TRUNC('month', created_at) as month
FROM public.data_attributions
WHERE created_at >= NOW() - INTERVAL '2 years'
GROUP BY entity_type, DATE_TRUNC('month', created_at)
ORDER BY month DESC, entity_type;

-- Create unique index on materialized view
CREATE UNIQUE INDEX idx_attribution_statistics_unique 
ON public.attribution_statistics (entity_type, month);

-- Create function to refresh attribution statistics
CREATE OR REPLACE FUNCTION refresh_attribution_statistics()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.attribution_statistics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant appropriate permissions
GRANT SELECT ON public.attribution_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_attribution_statistics() TO authenticated;
GRANT EXECUTE ON FUNCTION log_data_access(TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_attribution_completeness(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION detect_data_conflicts(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_citation(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_attribution_data() TO authenticated;