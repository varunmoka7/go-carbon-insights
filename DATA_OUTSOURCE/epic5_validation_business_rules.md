# Epic 5: Trancenable Integration - Data Validation & Business Rules

## Overview
This document defines comprehensive validation constraints and business rules for the Trancenable ESG data integration, ensuring data integrity, consistency, and quality across 19,902+ emissions records and 600+ companies.

## Validation Architecture

### Multi-Layer Validation Strategy
1. **Schema-Level Constraints**: Database-enforced data type and format validation
2. **Business Logic Validation**: Application-level rules for complex business requirements
3. **Data Quality Gates**: Automated quality scoring and threshold enforcement
4. **Integration Validation**: Cross-system consistency checks
5. **Real-time Monitoring**: Continuous data quality assessment

## Schema-Level Validation Constraints

### Company Identifiers Validation
```sql
-- Legal Entity Identifier (LEI) Format Validation
-- LEI: 20-character alphanumeric code (ISO 17442 standard)
ALTER TABLE public.companies 
ADD CONSTRAINT companies_lei_format 
CHECK (lei IS NULL OR lei ~ '^[A-Z0-9]{20}$');

-- Example: 52990003RXKZ9J9ERW70 (valid LEI format)
-- Validation: Ensures global standard compliance for 95% of Trancenable companies

-- Stock Ticker Format Validation
ALTER TABLE public.companies 
ADD CONSTRAINT companies_ticker_format 
CHECK (ticker IS NULL OR (LENGTH(ticker) >= 1 AND LENGTH(ticker) <= 10));

-- Example: HHFA, AAPL, MSFT (valid ticker formats)
-- Validation: Standard ticker length constraints

-- PermID Format Validation (Refinitiv Permanent Identifier)
ALTER TABLE public.companies 
ADD CONSTRAINT companies_permid_format 
CHECK (permid IS NULL OR permid ~ '^[0-9]{10,12}$');

-- Example: 4295870241 (valid PermID format)
-- Validation: 10-12 digit numeric identifier

-- FIGI Format Validation (Financial Instrument Global Identifier)
ALTER TABLE public.companies 
ADD CONSTRAINT companies_figi_format 
CHECK (figi IS NULL OR figi ~ '^[A-Z0-9]{12}$');

-- Example: BBG000FKTD80 (valid FIGI format)
-- Validation: Bloomberg Global ID standard

-- Data Quality Score Constraints
ALTER TABLE public.companies 
ADD CONSTRAINT companies_data_quality_range 
CHECK (data_quality_score >= 0.00 AND data_quality_score <= 1.00);

-- Identifier Confidence Score Constraints  
ALTER TABLE public.companies 
ADD CONSTRAINT companies_identifier_confidence_range 
CHECK (identifier_confidence_score >= 0.00 AND identifier_confidence_score <= 1.00);
```

### Emissions Data Validation
```sql
-- Emissions Value Range Validation
ALTER TABLE public.emissions_data 
ADD CONSTRAINT emissions_value_range 
CHECK (scope1 >= 0.00 AND scope1 <= 999999999.99),
ADD CONSTRAINT emissions_scope2_range 
CHECK (scope2 >= 0.00 AND scope2 <= 999999999.99),
ADD CONSTRAINT emissions_scope3_range 
CHECK (scope3 >= 0.00 AND scope3 <= 999999999.99);

-- Temporal Validation
ALTER TABLE public.emissions_data 
ADD CONSTRAINT emissions_temporal_consistency 
CHECK (disclosure_year IS NULL OR disclosure_year >= year),
ADD CONSTRAINT emissions_future_limit 
CHECK (year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1);

-- Data Source Attribution Validation
ALTER TABLE public.emissions_data 
ADD CONSTRAINT emissions_data_source_required 
CHECK (data_source IS NOT NULL AND LENGTH(data_source) > 0);

-- JSON Field Structure Validation
ALTER TABLE public.emissions_data 
ADD CONSTRAINT emissions_sources_json_format 
CHECK (emission_sources IS NULL OR jsonb_typeof(emission_sources) = 'object'),
ADD CONSTRAINT source_urls_json_format 
CHECK (source_urls IS NULL OR jsonb_typeof(source_urls) = 'array');
```

### Industry Mapping Validation
```sql
-- Confidence Score Validation
ALTER TABLE public.industry_mapping_log 
ADD CONSTRAINT mapping_confidence_range 
CHECK (confidence_score >= 0.00 AND confidence_score <= 1.00);

-- Mapping Type Validation
ALTER TABLE public.industry_mapping_log 
ADD CONSTRAINT mapping_type_valid 
CHECK (mapping_type IN ('direct', 'merge', 'extend', 'map', 'fuzzy'));

-- Industry Existence Validation
ALTER TABLE public.industry_mapping_log 
ADD CONSTRAINT mapping_industry_exists 
FOREIGN KEY (mapped_industry_id) REFERENCES public.industry_taxonomy(id);
```

## Business Logic Validation Rules

### 1. Company Data Integrity Rules

#### Rule: Unique Company Identification
```sql
-- Business Rule: Each company must have at least one reliable identifier
CREATE OR REPLACE FUNCTION validate_company_identifiers()
RETURNS TRIGGER AS $$
BEGIN
    -- Priority order: LEI > FIGI > Ticker+Exchange > Name+Country
    IF NEW.lei IS NOT NULL THEN
        -- LEI is the gold standard - no additional validation needed
        NEW.identifier_confidence_score := 1.00;
    ELSIF NEW.figi IS NOT NULL THEN
        -- FIGI is Bloomberg standard - high confidence
        NEW.identifier_confidence_score := 0.95;
    ELSIF NEW.ticker IS NOT NULL AND NEW.exchange IS NOT NULL THEN
        -- Ticker + Exchange combination - good confidence
        NEW.identifier_confidence_score := 0.85;
    ELSIF NEW.name IS NOT NULL AND NEW.country IS NOT NULL THEN
        -- Name + Country only - moderate confidence
        NEW.identifier_confidence_score := 0.70;
        RAISE WARNING 'Company % has only name+country identification', NEW.name;
    ELSE
        -- Insufficient identification
        RAISE EXCEPTION 'Company must have at least name and country for identification';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger
CREATE TRIGGER trg_validate_company_identifiers
    BEFORE INSERT OR UPDATE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION validate_company_identifiers();
```

#### Rule: Data Quality Score Calculation
```sql
CREATE OR REPLACE FUNCTION calculate_company_data_quality(company_uuid UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
    quality_score DECIMAL(3,2) := 0.00;
    weight_total DECIMAL(3,2) := 0.00;
    company_record RECORD;
BEGIN
    SELECT * INTO company_record FROM public.companies WHERE id = company_uuid;
    
    -- Weighted scoring system
    -- Critical identifiers (40% weight)
    IF company_record.lei IS NOT NULL THEN
        quality_score := quality_score + 0.25; -- LEI: 25%
    END IF;
    
    IF company_record.ticker IS NOT NULL AND company_record.exchange IS NOT NULL THEN
        quality_score := quality_score + 0.15; -- Ticker+Exchange: 15%
    END IF;
    
    -- Business data (30% weight)
    IF company_record.employees IS NOT NULL AND company_record.employees > 0 THEN
        quality_score := quality_score + 0.10; -- Employee count: 10%
    END IF;
    
    IF company_record.revenue IS NOT NULL AND company_record.revenue > 0 THEN
        quality_score := quality_score + 0.10; -- Revenue: 10%
    END IF;
    
    IF company_record.headquarters IS NOT NULL THEN
        quality_score := quality_score + 0.10; -- Headquarters: 10%
    END IF;
    
    -- Additional identifiers (20% weight)
    IF company_record.figi IS NOT NULL THEN
        quality_score := quality_score + 0.10; -- FIGI: 10%
    END IF;
    
    IF company_record.permid IS NOT NULL THEN
        quality_score := quality_score + 0.10; -- PermID: 10%
    END IF;
    
    -- ESG data completeness (10% weight)
    IF company_record.sustainability_rating IS NOT NULL THEN
        quality_score := quality_score + 0.05; -- Rating: 5%
    END IF;
    
    IF company_record.sbti_committed IS TRUE THEN
        quality_score := quality_score + 0.05; -- SBTi: 5%
    END IF;
    
    -- Ensure score doesn't exceed 1.00
    RETURN LEAST(quality_score, 1.00);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate quality score
CREATE OR REPLACE FUNCTION update_company_quality_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_quality_score := calculate_company_data_quality(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_company_quality_score
    BEFORE UPDATE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION update_company_quality_score();
```

### 2. Emissions Data Business Rules

#### Rule: Temporal Consistency Validation
```sql
CREATE OR REPLACE FUNCTION validate_emissions_temporal()
RETURNS TRIGGER AS $$
BEGIN
    -- Rule: Disclosure year must be >= reporting year
    IF NEW.disclosure_year IS NOT NULL AND NEW.disclosure_year < NEW.year THEN
        RAISE EXCEPTION 'Disclosure year (%) cannot be before reporting year (%)', 
            NEW.disclosure_year, NEW.year;
    END IF;
    
    -- Rule: Reporting year cannot be more than 2 years in the future
    IF NEW.year > EXTRACT(YEAR FROM CURRENT_DATE) + 2 THEN
        RAISE EXCEPTION 'Reporting year (%) is too far in the future', NEW.year;
    END IF;
    
    -- Rule: Historical data limit (reasonable business constraint)
    IF NEW.year < 1990 THEN
        RAISE EXCEPTION 'Reporting year (%) is before reasonable historical limit (1990)', NEW.year;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_emissions_temporal
    BEFORE INSERT OR UPDATE ON public.emissions_data
    FOR EACH ROW EXECUTE FUNCTION validate_emissions_temporal();
```

#### Rule: Emissions Value Reasonableness
```sql
CREATE OR REPLACE FUNCTION validate_emissions_reasonableness()
RETURNS TRIGGER AS $$
DECLARE
    company_employees INTEGER;
    company_revenue DECIMAL(15,2);
    max_reasonable_per_employee DECIMAL(10,2) := 1000.00; -- 1000 tCO2e per employee (high threshold)
    max_reasonable_intensity DECIMAL(10,2) := 10000.00;   -- 10000 tCO2e per $M revenue
BEGIN
    -- Get company context for reasonableness checks
    SELECT employees, revenue INTO company_employees, company_revenue
    FROM public.companies WHERE id = NEW.company_id;
    
    -- Rule: Emissions per employee reasonableness (if employee count available)
    IF company_employees IS NOT NULL AND company_employees > 0 THEN
        IF NEW.total_emissions / company_employees > max_reasonable_per_employee THEN
            RAISE WARNING 'High emissions per employee for company %: % tCO2e/employee', 
                NEW.company_id, (NEW.total_emissions / company_employees);
        END IF;
    END IF;
    
    -- Rule: Emissions intensity reasonableness (if revenue available)
    IF company_revenue IS NOT NULL AND company_revenue > 0 THEN
        IF NEW.total_emissions / company_revenue > max_reasonable_intensity THEN
            RAISE WARNING 'High emissions intensity for company %: % tCO2e/$M revenue', 
                NEW.company_id, (NEW.total_emissions / company_revenue);
        END IF;
    END IF;
    
    -- Rule: Scope consistency (Scope 3 typically largest for most industries)
    IF NEW.scope3 > 0 AND NEW.scope1 + NEW.scope2 > NEW.scope3 * 5 THEN
        RAISE NOTICE 'Unusual scope distribution for company % - Scope 1+2 significantly larger than Scope 3', 
            NEW.company_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_emissions_reasonableness
    AFTER INSERT OR UPDATE ON public.emissions_data
    FOR EACH ROW EXECUTE FUNCTION validate_emissions_reasonableness();
```

### 3. Industry Mapping Business Rules

#### Rule: Mapping Confidence Thresholds
```sql
CREATE OR REPLACE FUNCTION validate_industry_mapping()
RETURNS TRIGGER AS $$
BEGIN
    -- Rule: Low confidence mappings require manual approval
    IF NEW.confidence_score < 0.75 THEN
        NEW.approved_by := NULL; -- Reset approval for low confidence
        NEW.approved_at := NULL;
        INSERT INTO public.data_quality_alerts (
            alert_type,
            severity,
            message,
            record_id,
            created_at
        ) VALUES (
            'low_confidence_mapping',
            'warning',
            FORMAT('Industry mapping "%s → %s" has low confidence score: %s', 
                NEW.trancenable_industry, 
                (SELECT industry FROM industry_taxonomy WHERE id = NEW.mapped_industry_id),
                NEW.confidence_score),
            NEW.id,
            NOW()
        );
    END IF;
    
    -- Rule: Direct mappings must have high confidence
    IF NEW.mapping_type = 'direct' AND NEW.confidence_score < 0.90 THEN
        RAISE EXCEPTION 'Direct mapping type requires confidence score >= 0.90, got %', 
            NEW.confidence_score;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_industry_mapping
    BEFORE INSERT OR UPDATE ON public.industry_mapping_log
    FOR EACH ROW EXECUTE FUNCTION validate_industry_mapping();
```

## Data Quality Gates

### Import Quality Gates
```sql
-- Quality gate function for batch imports
CREATE OR REPLACE FUNCTION validate_import_quality_gates(import_batch UUID)
RETURNS TABLE (
    gate_name TEXT,
    status TEXT,
    threshold DECIMAL,
    actual_value DECIMAL,
    passed BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH import_stats AS (
        SELECT 
            COUNT(*) as total_records,
            COUNT(CASE WHEN lei IS NOT NULL THEN 1 END) as lei_coverage,
            COUNT(CASE WHEN ticker IS NOT NULL THEN 1 END) as ticker_coverage,
            AVG(data_quality_score) as avg_quality_score,
            COUNT(CASE WHEN data_quality_score >= 0.75 THEN 1 END) as high_quality_records
        FROM companies 
        WHERE trancenable_company_id IN (
            SELECT company_id FROM trancenable_import_log WHERE import_batch_id = import_batch
        )
    )
    SELECT * FROM (
        VALUES 
        ('LEI Coverage', 'CRITICAL', 0.80, 
         (SELECT lei_coverage::DECIMAL / NULLIF(total_records, 0) FROM import_stats), 
         (SELECT lei_coverage::DECIMAL / NULLIF(total_records, 0) >= 0.80 FROM import_stats)),
         
        ('Average Data Quality', 'HIGH', 0.70,
         (SELECT avg_quality_score FROM import_stats),
         (SELECT avg_quality_score >= 0.70 FROM import_stats)),
         
        ('High Quality Records', 'MEDIUM', 0.60,
         (SELECT high_quality_records::DECIMAL / NULLIF(total_records, 0) FROM import_stats),
         (SELECT high_quality_records::DECIMAL / NULLIF(total_records, 0) >= 0.60 FROM import_stats))
    ) AS gates(gate_name, status, threshold, actual_value, passed);
END;
$$ LANGUAGE plpgsql;
```

### Real-time Data Quality Monitoring
```sql
-- Create data quality alerts table
CREATE TABLE IF NOT EXISTS public.data_quality_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    message TEXT NOT NULL,
    record_id UUID,
    table_name TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Function to check data quality violations
CREATE OR REPLACE FUNCTION monitor_data_quality()
RETURNS void AS $$
BEGIN
    -- Check for companies with very low data quality scores
    INSERT INTO public.data_quality_alerts (alert_type, severity, message, record_id, table_name)
    SELECT 
        'low_data_quality',
        'warning',
        FORMAT('Company "%s" has very low data quality score: %s', name, data_quality_score),
        id,
        'companies'
    FROM public.companies 
    WHERE data_quality_score < 0.50 
    AND trancenable_company_id IS NOT NULL
    AND NOT EXISTS (
        SELECT 1 FROM public.data_quality_alerts 
        WHERE record_id = companies.id 
        AND alert_type = 'low_data_quality' 
        AND resolved = FALSE
    );
    
    -- Check for missing emissions data
    INSERT INTO public.data_quality_alerts (alert_type, severity, message, record_id, table_name)
    SELECT 
        'missing_emissions',
        'error',
        FORMAT('Company "%s" has no emissions data for recent years', c.name),
        c.id,
        'companies'
    FROM public.companies c
    WHERE c.trancenable_company_id IS NOT NULL
    AND NOT EXISTS (
        SELECT 1 FROM public.emissions_data e 
        WHERE e.company_id = c.id 
        AND e.year >= EXTRACT(YEAR FROM CURRENT_DATE) - 2
    )
    AND NOT EXISTS (
        SELECT 1 FROM public.data_quality_alerts 
        WHERE record_id = c.id 
        AND alert_type = 'missing_emissions' 
        AND resolved = FALSE
    );
    
    RAISE NOTICE 'Data quality monitoring completed';
END;
$$ LANGUAGE plpgsql;
```

## Integration Validation Rules

### Cross-System Consistency
```sql
-- Validate that all Trancenable companies have corresponding emissions data
CREATE OR REPLACE FUNCTION validate_trancenable_completeness()
RETURNS TABLE (
    validation_rule TEXT,
    companies_affected INTEGER,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'Companies without emissions data' as validation_rule,
        COUNT(*)::INTEGER as companies_affected,
        CASE 
            WHEN COUNT(*) = 0 THEN 'PASS'
            WHEN COUNT(*) < 10 THEN 'WARNING' 
            ELSE 'FAIL'
        END as status
    FROM public.companies c
    WHERE c.trancenable_company_id IS NOT NULL
    AND NOT EXISTS (
        SELECT 1 FROM public.emissions_data e 
        WHERE e.company_id = c.id
    )
    
    UNION ALL
    
    SELECT 
        'Emissions without company mapping' as validation_rule,
        COUNT(*)::INTEGER as companies_affected,
        CASE 
            WHEN COUNT(*) = 0 THEN 'PASS'
            ELSE 'FAIL'
        END as status
    FROM public.emissions_data e
    WHERE e.trancenable_document_id IS NOT NULL
    AND NOT EXISTS (
        SELECT 1 FROM public.companies c 
        WHERE c.id = e.company_id 
        AND c.trancenable_company_id IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql;
```

## Validation Error Handling

### Error Classification and Response
```sql
-- Enhanced error handling for validation failures
CREATE OR REPLACE FUNCTION handle_validation_error(
    error_type TEXT,
    error_severity TEXT,
    error_message TEXT,
    record_data JSONB
) RETURNS void AS $$
BEGIN
    -- Log validation error
    INSERT INTO public.import_errors (
        import_id,
        error_type,
        error_severity,
        error_message,
        error_details,
        created_at
    ) VALUES (
        COALESCE(record_data->>'import_batch_id', uuid_generate_v4()),
        error_type,
        error_severity,
        error_message,
        record_data,
        NOW()
    );
    
    -- Handle based on severity
    CASE error_severity
        WHEN 'critical' THEN
            -- Stop processing for critical errors
            RAISE EXCEPTION 'Critical validation error: %', error_message;
        WHEN 'error' THEN
            -- Skip record but continue processing
            RAISE WARNING 'Validation error (record skipped): %', error_message;
        WHEN 'warning' THEN
            -- Log but continue processing
            RAISE NOTICE 'Validation warning: %', error_message;
        ELSE
            -- Info level - just log
            NULL;
    END CASE;
END;
$$ LANGUAGE plpgsql;
```

## Performance Considerations

### Validation Performance Optimization
```sql
-- Batch validation for large imports
CREATE OR REPLACE FUNCTION batch_validate_companies(batch_size INTEGER DEFAULT 1000)
RETURNS void AS $$
DECLARE
    batch_start INTEGER := 0;
    batch_end INTEGER;
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count 
    FROM public.companies 
    WHERE trancenable_company_id IS NOT NULL;
    
    WHILE batch_start < total_count LOOP
        batch_end := batch_start + batch_size;
        
        -- Validate batch
        PERFORM validate_company_batch(batch_start, batch_end);
        
        batch_start := batch_end;
        
        -- Progress notification
        RAISE NOTICE 'Validated companies % to % of %', batch_start, LEAST(batch_end, total_count), total_count;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

This comprehensive validation framework ensures data integrity, quality, and consistency throughout the Trancenable integration process while providing detailed error handling and monitoring capabilities.