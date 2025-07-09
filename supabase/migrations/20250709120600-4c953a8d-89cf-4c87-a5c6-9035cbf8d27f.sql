-- Create industry taxonomy core schema (Fixed RLS Trigger)
-- Phase 1: Core Schema Creation

-- First disable the automatic RLS trigger temporarily
DROP EVENT TRIGGER IF EXISTS enable_rls_on_new_tables;

-- Create emissions archetype enum
CREATE TYPE public.emissions_archetype AS ENUM (
    'Operational Emitter',
    'Upstream-heavy', 
    'Use-phase Dominant',
    'Scope 2-heavy',
    'Financed Emissions',
    'Lifecycle-dependent',
    'Offset-focused'
);

-- Create industry taxonomy main table
CREATE TABLE public.industry_taxonomy (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    sector TEXT NOT NULL,
    industry TEXT NOT NULL UNIQUE,
    emissions_archetype public.emissions_archetype NOT NULL,
    description TEXT,
    ghg_protocol_alignment TEXT,
    cdp_category TEXT,
    sbti_pathway TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company-industry relationship table (many-to-many)
CREATE TABLE public.company_industries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id TEXT NOT NULL,
    industry_id UUID NOT NULL REFERENCES public.industry_taxonomy(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL DEFAULT 'primary',
    percentage_allocation INTEGER CHECK (percentage_allocation >= 0 AND percentage_allocation <= 100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(company_id, industry_id, relationship_type)
);

-- Create industry tags table for flexible grouping
CREATE TABLE public.industry_tags (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tag_name TEXT NOT NULL UNIQUE,
    tag_category TEXT NOT NULL DEFAULT 'general',
    description TEXT,
    color_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create industry-tag relationship table
CREATE TABLE public.industry_tag_assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    industry_id UUID NOT NULL REFERENCES public.industry_taxonomy(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.industry_tags(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(industry_id, tag_id)
);

-- Create archetype configurations table
CREATE TABLE public.archetype_configurations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    archetype_name public.emissions_archetype NOT NULL UNIQUE,
    scope1_priority INTEGER NOT NULL DEFAULT 1 CHECK (scope1_priority >= 1 AND scope1_priority <= 5),
    scope2_priority INTEGER NOT NULL DEFAULT 1 CHECK (scope2_priority >= 1 AND scope2_priority <= 5),
    scope3_priority INTEGER NOT NULL DEFAULT 1 CHECK (scope3_priority >= 1 AND scope3_priority <= 5),
    key_scope3_categories TEXT[],
    reporting_complexity TEXT NOT NULL DEFAULT 'medium' CHECK (reporting_complexity IN ('low', 'medium', 'high')),
    typical_hotspots TEXT[],
    benchmarking_considerations TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create taxonomy audit log table
CREATE TABLE public.taxonomy_audit_log (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES public.user_profiles(id),
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_industry_taxonomy_sector ON public.industry_taxonomy(sector);
CREATE INDEX idx_industry_taxonomy_archetype ON public.industry_taxonomy(emissions_archetype);
CREATE INDEX idx_company_industries_company ON public.company_industries(company_id);
CREATE INDEX idx_company_industries_industry ON public.company_industries(industry_id);
CREATE INDEX idx_company_industries_type ON public.company_industries(relationship_type);
CREATE INDEX idx_industry_tags_category ON public.industry_tags(tag_category);
CREATE INDEX idx_taxonomy_audit_table_record ON public.taxonomy_audit_log(table_name, record_id);

-- Enable RLS on all tables manually
ALTER TABLE public.industry_taxonomy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archetype_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxonomy_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public can view industry taxonomy" ON public.industry_taxonomy
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage industry taxonomy" ON public.industry_taxonomy
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can view company industries" ON public.company_industries
    FOR SELECT USING (
        user_has_company_access(auth.uid(), company_id) OR 
        get_user_role(auth.uid()) = 'admin'
    );

CREATE POLICY "Admins can manage company industries" ON public.company_industries
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Company admins can manage their industries" ON public.company_industries
    FOR ALL USING (user_is_company_admin(auth.uid(), company_id));

CREATE POLICY "Public can view industry tags" ON public.industry_tags
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage industry tags" ON public.industry_tags
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public can view tag assignments" ON public.industry_tag_assignments
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage tag assignments" ON public.industry_tag_assignments
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public can view archetype configs" ON public.archetype_configurations
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage archetype configs" ON public.archetype_configurations
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admin can view taxonomy audit log" ON public.taxonomy_audit_log
    FOR SELECT USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "System can insert taxonomy audit log" ON public.taxonomy_audit_log
    FOR INSERT WITH CHECK (true);

-- Create database functions
CREATE OR REPLACE FUNCTION public.get_company_industries(p_company_id TEXT)
RETURNS TABLE (
    industry_name TEXT,
    sector_name TEXT,
    archetype public.emissions_archetype,
    relationship_type TEXT,
    percentage_allocation INTEGER
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
        ci.relationship_type,
        ci.percentage_allocation
    FROM public.company_industries ci
    JOIN public.industry_taxonomy it ON ci.industry_id = it.id
    WHERE ci.company_id = p_company_id
    ORDER BY 
        CASE ci.relationship_type 
            WHEN 'primary' THEN 1 
            WHEN 'secondary' THEN 2 
            ELSE 3 
        END,
        ci.percentage_allocation DESC NULLS LAST;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_companies_by_archetype(p_archetype public.emissions_archetype)
RETURNS TABLE (
    company_id TEXT,
    industry_name TEXT,
    sector_name TEXT,
    relationship_type TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ci.company_id,
        it.industry,
        it.sector,
        ci.relationship_type
    FROM public.company_industries ci
    JOIN public.industry_taxonomy it ON ci.industry_id = it.id
    WHERE it.emissions_archetype = p_archetype
    ORDER BY it.sector, it.industry, ci.company_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_company_industry_allocations(p_company_id TEXT)
RETURNS TABLE (
    is_valid BOOLEAN,
    total_allocation INTEGER,
    validation_message TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
    total_primary_allocation INTEGER;
    primary_count INTEGER;
BEGIN
    SELECT COALESCE(SUM(percentage_allocation), 0), COUNT(*)
    INTO total_primary_allocation, primary_count
    FROM public.company_industries
    WHERE company_id = p_company_id 
    AND relationship_type = 'primary'
    AND percentage_allocation IS NOT NULL;
    
    IF primary_count = 0 THEN
        RETURN QUERY SELECT false, 0, 'Company must have at least one primary industry assignment';
    ELSIF total_primary_allocation > 100 THEN
        RETURN QUERY SELECT false, total_primary_allocation, 'Primary industry allocations exceed 100%';
    ELSIF total_primary_allocation < 100 AND primary_count > 1 THEN
        RETURN QUERY SELECT false, total_primary_allocation, 'Primary industry allocations must sum to 100% when multiple industries assigned';
    ELSE
        RETURN QUERY SELECT true, total_primary_allocation, 'Industry allocations are valid';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.taxonomy_audit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.taxonomy_audit_log (
        table_name,
        record_id,
        action,
        old_values,
        new_values,
        changed_by
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        auth.uid()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers
CREATE TRIGGER taxonomy_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.industry_taxonomy
    FOR EACH ROW EXECUTE FUNCTION public.taxonomy_audit_trigger();

CREATE TRIGGER company_industries_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.company_industries
    FOR EACH ROW EXECUTE FUNCTION public.taxonomy_audit_trigger();

CREATE TRIGGER update_industry_taxonomy_updated_at
    BEFORE UPDATE ON public.industry_taxonomy
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_industries_updated_at
    BEFORE UPDATE ON public.company_industries
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_archetype_configurations_updated_at
    BEFORE UPDATE ON public.archetype_configurations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default archetype configurations
INSERT INTO public.archetype_configurations (
    archetype_name, scope1_priority, scope2_priority, scope3_priority, 
    key_scope3_categories, reporting_complexity, typical_hotspots, benchmarking_considerations
) VALUES 
(
    'Operational Emitter', 5, 4, 2,
    ARRAY['Category 3: Fuel and energy-related activities', 'Category 4: Upstream transportation'],
    'medium',
    ARRAY['Direct fuel combustion', 'Industrial processes', 'Fugitive emissions'],
    'Focus on operational efficiency metrics and direct emission intensity ratios'
),
(
    'Upstream-heavy', 2, 3, 5,
    ARRAY['Category 1: Purchased goods and services', 'Category 2: Capital goods', 'Category 4: Upstream transportation'],
    'high',
    ARRAY['Supply chain emissions', 'Raw material extraction', 'Manufacturing processes'],
    'Emphasis on supply chain engagement and Scope 3 category materiality assessment'
),
(
    'Use-phase Dominant', 2, 2, 5,
    ARRAY['Category 11: Use of sold products', 'Category 12: End-of-life treatment'],
    'high',
    ARRAY['Product lifecycle emissions', 'Customer usage patterns', 'Product efficiency'],
    'Product carbon footprint and lifetime emission analysis critical for benchmarking'
),
(
    'Scope 2-heavy', 3, 5, 3,
    ARRAY['Category 3: Fuel and energy-related activities'],
    'medium',
    ARRAY['Electricity consumption', 'Grid emission factors', 'Renewable energy procurement'],
    'Location vs market-based accounting differences significant for peer comparison'
),
(
    'Financed Emissions', 1, 2, 5,
    ARRAY['Category 15: Investments'],
    'high',
    ARRAY['Portfolio carbon footprint', 'Financed emissions calculation', 'Climate risk assessment'],
    'PCAF methodology adherence and portfolio emission intensity metrics essential'
),
(
    'Lifecycle-dependent', 3, 3, 4,
    ARRAY['Category 1: Purchased goods and services', 'Category 11: Use of sold products', 'Category 12: End-of-life treatment'],
    'high',
    ARRAY['Cradle-to-grave analysis', 'Material selection impact', 'Circular economy practices'],
    'Full lifecycle assessment approach needed for meaningful peer comparison'
),
(
    'Offset-focused', 2, 3, 3,
    ARRAY['Category 14: Franchises', 'Category 15: Investments'],
    'medium',
    ARRAY['Carbon offset portfolio', 'Additionality verification', 'Offset quality standards'],
    'Offset methodology and permanence considerations critical for benchmarking'
);

-- Insert default industry tags
INSERT INTO public.industry_tags (tag_name, tag_category, description, color_code) VALUES
('High Scope 3', 'scope3', 'Industries with significant upstream or downstream emissions', '#ef4444'),
('Energy Intensive', 'reporting', 'Industries with high direct energy consumption', '#f97316'),
('Supply Chain Complex', 'scope3', 'Industries with complex multi-tier supply chains', '#eab308'),
('Consumer Facing', 'general', 'Industries with direct consumer products or services', '#22c55e'),
('B2B Focus', 'general', 'Industries primarily serving business customers', '#3b82f6'),
('Regulated Reporting', 'regulation', 'Industries subject to mandatory climate reporting', '#8b5cf6'),
('Physical Risk Exposed', 'general', 'Industries with high exposure to physical climate risks', '#ec4899'),
('Transition Risk Exposed', 'general', 'Industries with high exposure to transition climate risks', '#14b8a6'),
('SBTi Prevalent', 'reporting', 'Industries with high Science Based Targets adoption', '#06b6d4'),
('CDP Active', 'reporting', 'Industries with high CDP disclosure participation', '#84cc16');

-- Recreate the RLS trigger with corrected logic - simplified to avoid conflicts
CREATE OR REPLACE FUNCTION public.enable_rls_on_new_tables()
RETURNS event_trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
    obj record;
BEGIN
    FOR obj IN SELECT * FROM pg_event_trigger_ddl_commands() WHERE command_tag = 'CREATE TABLE'
    LOOP
        IF obj.schema_name = 'public' THEN
            EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', obj.schema_name, obj.object_identity);
        END IF;
    END LOOP;
END;
$$;

CREATE EVENT TRIGGER enable_rls_on_new_tables
    ON ddl_command_end
    WHEN TAG IN ('CREATE TABLE')
    EXECUTE FUNCTION public.enable_rls_on_new_tables();