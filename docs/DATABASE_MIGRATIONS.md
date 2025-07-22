# Database Migration Documentation - GoCarbonTracker

**Version**: 1.0  
**Date**: January 22, 2025  
**Owner**: Technical Team  

## 📋 Overview

This document outlines the database migration strategy, procedures, and best practices for GoCarbonTracker. It covers schema versioning, migration execution, rollback procedures, and data integrity maintenance across development, staging, and production environments.

## 🎯 Migration Strategy

### Migration Philosophy
- **Forward-only migrations**: Prefer additive changes
- **Zero-downtime deployments**: Design migrations for live systems
- **Data integrity**: Maintain consistency throughout changes
- **Rollback capability**: Always plan for safe rollbacks
- **Testing first**: Validate on staging before production

### Migration Types
1. **Schema Migrations**: Table/column structure changes
2. **Data Migrations**: Data transformation and seeding
3. **Index Migrations**: Performance optimization
4. **Constraint Migrations**: Business rule enforcement
5. **Cleanup Migrations**: Removing deprecated elements

## 🏗️ Migration Infrastructure

### Technology Stack

#### Supabase Migrations
```bash
# Primary migration system for main database
supabase migration new create_companies_table
supabase migration up
supabase migration down
```

#### Custom Migration System
```typescript
// Migration interface for complex operations
interface Migration {
  id: string;
  description: string;
  up(): Promise<void>;
  down(): Promise<void>;
  dependencies?: string[];
}
```

### Directory Structure
```
supabase/
├── migrations/
│   ├── 20250101000000_initial_schema.sql
│   ├── 20250115120000_add_emissions_table.sql
│   ├── 20250120140000_create_user_profiles.sql
│   └── 20250122100000_add_indexing_optimization.sql
├── seeds/
│   ├── 01_companies.sql
│   ├── 02_industries.sql
│   └── 03_sample_emissions.sql
├── functions/
│   ├── get_company_emissions.sql
│   └── calculate_intensity.sql
└── schema/
    ├── current_schema.sql
    └── rollback_schema.sql
```

## 📝 Migration File Standards

### Naming Convention
```
YYYYMMDDHHMMSS_descriptive_name.sql
```

**Examples**:
- `20250122100000_create_companies_table.sql`
- `20250122110000_add_emissions_scope3_column.sql`
- `20250122120000_create_user_profiles_index.sql`

### Migration Template
```sql
-- Migration: 20250122100000_create_companies_table.sql
-- Description: Create companies table with basic company information
-- Author: Technical Team
-- Date: 2025-01-22

-- Ensure we're in the correct schema
SET search_path = public;

-- Migration start marker
BEGIN;

-- === UP MIGRATION ===

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    industry VARCHAR(100),
    country VARCHAR(2),
    employee_count INTEGER,
    revenue DECIMAL(15,2),
    founded_year INTEGER,
    website_url VARCHAR(500),
    description TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Soft delete
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    
    -- Constraints
    CONSTRAINT companies_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT companies_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT companies_employee_count_positive CHECK (employee_count >= 0),
    CONSTRAINT companies_revenue_positive CHECK (revenue >= 0),
    CONSTRAINT companies_founded_year_valid CHECK (founded_year BETWEEN 1800 AND EXTRACT(YEAR FROM NOW()))
);

-- Create indexes
CREATE INDEX idx_companies_industry ON companies(industry) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_country ON companies(country) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_created_at ON companies(created_at);
CREATE UNIQUE INDEX idx_companies_slug_unique ON companies(slug) WHERE deleted_at IS NULL;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER companies_update_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_companies_updated_at();

-- Add RLS policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all non-deleted companies
CREATE POLICY "Companies are publicly readable" ON companies
    FOR SELECT USING (deleted_at IS NULL);

-- Policy: Authenticated users can insert companies
CREATE POLICY "Authenticated users can insert companies" ON companies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Users can update their own company data
CREATE POLICY "Users can update own companies" ON companies
    FOR UPDATE USING (created_by = auth.uid());

-- Record migration
INSERT INTO schema_migrations (version, description, applied_at) 
VALUES ('20250122100000', 'Create companies table with basic company information', NOW())
ON CONFLICT (version) DO NOTHING;

-- Migration end marker
COMMIT;

-- === DOWN MIGRATION (for rollback reference) ===
-- 
-- BEGIN;
-- DROP TRIGGER IF EXISTS companies_update_updated_at ON companies;
-- DROP FUNCTION IF EXISTS update_companies_updated_at();
-- DROP TABLE IF EXISTS companies;
-- DELETE FROM schema_migrations WHERE version = '20250122100000';
-- COMMIT;
```

## 🔄 Migration Execution

### Development Environment

#### Running Migrations
```bash
# Apply all pending migrations
supabase migration up

# Apply specific migration
supabase migration up --to 20250122100000

# Check migration status
supabase migration list

# Create new migration
supabase migration new add_emissions_table
```

#### Local Development Workflow
```bash
#!/bin/bash
# scripts/migrate-dev.sh

echo "🗄️ Running development migrations..."

# Ensure Supabase is running
supabase start

# Apply migrations
supabase migration up

# Run seeds if needed
if [ "$1" = "--seed" ]; then
    echo "🌱 Seeding database..."
    supabase seed reset
fi

# Verify migration
echo "📊 Migration status:"
supabase migration list

echo "✅ Development migrations complete!"
```

### Staging Environment

#### Pre-production Testing
```bash
#!/bin/bash
# scripts/migrate-staging.sh

set -e

echo "🎭 Running staging migrations..."

# Set staging environment
export SUPABASE_URL="${STAGING_SUPABASE_URL}"
export SUPABASE_ANON_KEY="${STAGING_SUPABASE_ANON_KEY}"

# Backup staging database
echo "💾 Creating staging backup..."
timestamp=$(date +%Y%m%d_%H%M%S)
pg_dump "${STAGING_DATABASE_URL}" > "backups/staging_${timestamp}.sql"

# Test migrations
echo "🧪 Testing migrations..."
supabase migration up --dry-run

# Apply migrations
echo "🚀 Applying migrations..."
supabase migration up

# Verify data integrity
echo "🔍 Verifying data integrity..."
./scripts/verify-migration.sh

echo "✅ Staging migrations complete!"
```

### Production Environment

#### Production Migration Process
```bash
#!/bin/bash
# scripts/migrate-production.sh

set -e

echo "🏭 Production migration starting..."

# Pre-flight checks
./scripts/pre-migration-checks.sh

# Create backup
echo "💾 Creating production backup..."
timestamp=$(date +%Y%m%d_%H%M%S)
pg_dump "${PRODUCTION_DATABASE_URL}" > "backups/production_${timestamp}.sql"

# Test migration on backup
echo "🧪 Testing migration on backup..."
./scripts/test-migration-on-backup.sh "backups/production_${timestamp}.sql"

# Apply migration with monitoring
echo "🚀 Applying production migration..."
./scripts/apply-migration-with-monitoring.sh

# Verify success
echo "🔍 Verifying migration success..."
./scripts/verify-production-migration.sh

echo "✅ Production migration complete!"

# Notify team
./scripts/notify-migration-complete.sh "$timestamp"
```

## 📊 Complex Migration Examples

### Adding New Column (Safe)
```sql
-- 20250122110000_add_emission_verification_status.sql
BEGIN;

-- Add new column with default value
ALTER TABLE emissions 
ADD COLUMN verification_status VARCHAR(20) DEFAULT 'pending' NOT NULL;

-- Add constraint
ALTER TABLE emissions 
ADD CONSTRAINT emissions_verification_status_valid 
CHECK (verification_status IN ('pending', 'verified', 'rejected'));

-- Create index
CREATE INDEX idx_emissions_verification_status 
ON emissions(verification_status) 
WHERE deleted_at IS NULL;

-- Update existing records (optional)
UPDATE emissions 
SET verification_status = 'verified' 
WHERE created_at < '2025-01-01' AND scope1 IS NOT NULL;

COMMIT;
```

### Renaming Column (Zero-downtime)
```sql
-- Step 1: 20250122120000_add_new_column_for_rename.sql
BEGIN;

-- Add new column
ALTER TABLE companies 
ADD COLUMN employee_count_new INTEGER;

-- Copy data
UPDATE companies 
SET employee_count_new = employee_count;

-- Add constraint
ALTER TABLE companies 
ADD CONSTRAINT companies_employee_count_new_positive 
CHECK (employee_count_new >= 0);

COMMIT;

-- Step 2: Application deployment (use both columns)

-- Step 3: 20250122130000_complete_column_rename.sql
BEGIN;

-- Ensure all data is copied
UPDATE companies 
SET employee_count_new = employee_count 
WHERE employee_count_new IS NULL;

-- Make new column NOT NULL
ALTER TABLE companies 
ALTER COLUMN employee_count_new SET NOT NULL;

-- Drop old constraint
ALTER TABLE companies 
DROP CONSTRAINT IF EXISTS companies_employee_count_positive;

-- Drop old column
ALTER TABLE companies 
DROP COLUMN employee_count;

-- Rename new column
ALTER TABLE companies 
RENAME COLUMN employee_count_new TO employee_count;

COMMIT;
```

### Data Migration with Transformation
```sql
-- 20250122140000_migrate_legacy_emission_data.sql
BEGIN;

-- Create temporary function for data transformation
CREATE OR REPLACE FUNCTION migrate_legacy_emissions() 
RETURNS INTEGER AS $$
DECLARE
    row_count INTEGER := 0;
    legacy_record RECORD;
BEGIN
    -- Process legacy emissions data
    FOR legacy_record IN 
        SELECT * FROM legacy_emissions 
        WHERE migrated_at IS NULL
    LOOP
        -- Transform and insert into new structure
        INSERT INTO emissions (
            company_id,
            year,
            scope1,
            scope2,
            scope3,
            data_source,
            created_at
        ) VALUES (
            legacy_record.company_uuid,
            legacy_record.reporting_year,
            legacy_record.direct_emissions,
            legacy_record.indirect_emissions,
            legacy_record.value_chain_emissions,
            'legacy_migration',
            legacy_record.original_created_at
        );
        
        -- Mark as migrated
        UPDATE legacy_emissions 
        SET migrated_at = NOW() 
        WHERE id = legacy_record.id;
        
        row_count := row_count + 1;
        
        -- Log progress every 1000 records
        IF row_count % 1000 = 0 THEN
            RAISE NOTICE 'Migrated % records', row_count;
        END IF;
    END LOOP;
    
    RETURN row_count;
END;
$$ LANGUAGE plpgsql;

-- Execute migration
SELECT migrate_legacy_emissions();

-- Verify migration
DO $$
DECLARE
    legacy_count INTEGER;
    new_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO legacy_count FROM legacy_emissions WHERE migrated_at IS NOT NULL;
    SELECT COUNT(*) INTO new_count FROM emissions WHERE data_source = 'legacy_migration';
    
    IF legacy_count != new_count THEN
        RAISE EXCEPTION 'Migration verification failed: % legacy records, % new records', 
            legacy_count, new_count;
    END IF;
    
    RAISE NOTICE 'Migration verified: % records successfully migrated', legacy_count;
END;
$$;

-- Clean up
DROP FUNCTION migrate_legacy_emissions();

COMMIT;
```

## 🔄 Rollback Procedures

### Rollback Strategy

#### Safe Rollback Principles
1. **Never delete data**: Use soft deletes
2. **Preserve old columns**: Until cleanup migration
3. **Test rollbacks**: On staging first
4. **Document rollback steps**: For each migration

#### Rollback Script Template
```bash
#!/bin/bash
# scripts/rollback-migration.sh

MIGRATION_VERSION=$1
BACKUP_FILE=$2

if [ -z "$MIGRATION_VERSION" ] || [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <migration_version> <backup_file>"
    echo "Example: $0 20250122100000 backups/production_20250122_090000.sql"
    exit 1
fi

echo "🔄 Rolling back migration $MIGRATION_VERSION..."

# Verify backup exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Create rollback backup
echo "💾 Creating rollback backup..."
timestamp=$(date +%Y%m%d_%H%M%S)
pg_dump "${DATABASE_URL}" > "backups/pre_rollback_${timestamp}.sql"

# Execute rollback
echo "🔄 Executing rollback..."
supabase migration down --to "$MIGRATION_VERSION"

# Verify rollback
echo "🔍 Verifying rollback..."
./scripts/verify-rollback.sh "$MIGRATION_VERSION"

echo "✅ Rollback complete!"
```

### Emergency Rollback
```sql
-- Emergency rollback template
-- Always keep this updated for the latest migration

BEGIN;

-- Step 1: Remove new constraints
ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_new_constraint;

-- Step 2: Drop new indexes
DROP INDEX IF EXISTS idx_companies_new_field;

-- Step 3: Drop new columns (if safe)
ALTER TABLE companies DROP COLUMN IF EXISTS new_field;

-- Step 4: Restore old structure (if needed)
-- ALTER TABLE companies ADD COLUMN old_field TEXT;

-- Step 5: Update migration tracking
DELETE FROM schema_migrations 
WHERE version = '20250122100000';

-- Step 6: Verify rollback
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'companies'
ORDER BY ordinal_position;

COMMIT;
```

## 🧪 Testing & Validation

### Migration Testing Framework

#### Pre-migration Tests
```sql
-- tests/pre_migration_tests.sql
-- Run before applying migration

-- Test 1: Verify current schema state
DO $$
BEGIN
    -- Check table exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies') THEN
        RAISE EXCEPTION 'Table companies does not exist';
    END IF;
    
    -- Check required columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'companies' AND column_name = 'id') THEN
        RAISE EXCEPTION 'Column companies.id does not exist';
    END IF;
    
    RAISE NOTICE 'Pre-migration tests passed';
END;
$$;

-- Test 2: Verify data integrity
SELECT 
    COUNT(*) as total_companies,
    COUNT(DISTINCT id) as unique_ids,
    COUNT(*) FILTER (WHERE name IS NULL OR TRIM(name) = '') as invalid_names
FROM companies;
```

#### Post-migration Tests
```sql
-- tests/post_migration_tests.sql
-- Run after applying migration

-- Test 1: Verify new schema
DO $$
BEGIN
    -- Check new column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'companies' AND column_name = 'verification_status') THEN
        RAISE EXCEPTION 'New column verification_status was not created';
    END IF;
    
    -- Check constraint exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints 
                   WHERE constraint_name = 'companies_verification_status_valid') THEN
        RAISE EXCEPTION 'Constraint companies_verification_status_valid was not created';
    END IF;
    
    RAISE NOTICE 'Post-migration schema tests passed';
END;
$$;

-- Test 2: Verify data migration
SELECT 
    verification_status,
    COUNT(*) as count
FROM companies 
GROUP BY verification_status;

-- Test 3: Performance test
EXPLAIN ANALYZE 
SELECT * FROM companies 
WHERE verification_status = 'verified' 
AND deleted_at IS NULL;
```

### Automated Testing Pipeline
```bash
#!/bin/bash
# scripts/test-migration.sh

MIGRATION_FILE=$1

if [ -z "$MIGRATION_FILE" ]; then
    echo "Usage: $0 <migration_file>"
    exit 1
fi

echo "🧪 Testing migration: $MIGRATION_FILE"

# Create test database
echo "📦 Setting up test database..."
createdb "test_migration_$(date +%s)"
TEST_DB="test_migration_$(date +%s)"

# Apply current schema
echo "📄 Applying current schema..."
pg_dump --schema-only "$STAGING_DATABASE_URL" | psql "$TEST_DB"

# Run pre-migration tests
echo "🔍 Running pre-migration tests..."
psql "$TEST_DB" -f "tests/pre_migration_tests.sql"

# Apply migration
echo "🚀 Applying migration..."
psql "$TEST_DB" -f "$MIGRATION_FILE"

# Run post-migration tests
echo "🔍 Running post-migration tests..."
psql "$TEST_DB" -f "tests/post_migration_tests.sql"

# Performance tests
echo "📊 Running performance tests..."
psql "$TEST_DB" -f "tests/performance_tests.sql"

# Cleanup
echo "🧹 Cleaning up..."
dropdb "$TEST_DB"

echo "✅ Migration tests completed successfully!"
```

## 📊 Migration Monitoring

### Migration Metrics
```sql
-- Create migration tracking table
CREATE TABLE IF NOT EXISTS migration_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    migration_version VARCHAR(20) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    records_affected INTEGER,
    status VARCHAR(20) DEFAULT 'running',
    error_message TEXT,
    rollback_plan TEXT
);

-- Migration monitoring function
CREATE OR REPLACE FUNCTION track_migration_start(version TEXT)
RETURNS UUID AS $$
DECLARE
    tracking_id UUID;
BEGIN
    INSERT INTO migration_metrics (migration_version, rollback_plan)
    VALUES (version, 'See migration file comments')
    RETURNING id INTO tracking_id;
    
    RETURN tracking_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION track_migration_end(
    tracking_id UUID, 
    affected_records INTEGER DEFAULT NULL,
    error_msg TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    UPDATE migration_metrics
    SET 
        completed_at = NOW(),
        duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at)),
        records_affected = affected_records,
        status = CASE WHEN error_msg IS NULL THEN 'completed' ELSE 'failed' END,
        error_message = error_msg
    WHERE id = tracking_id;
END;
$$ LANGUAGE plpgsql;
```

### Migration Dashboard Query
```sql
-- Migration history and performance
SELECT 
    migration_version,
    started_at,
    completed_at,
    duration_seconds,
    records_affected,
    status,
    CASE 
        WHEN duration_seconds < 60 THEN 'Fast'
        WHEN duration_seconds < 300 THEN 'Medium'
        ELSE 'Slow'
    END as performance_category
FROM migration_metrics
ORDER BY started_at DESC
LIMIT 20;

-- Recent migration activity
SELECT 
    DATE(started_at) as migration_date,
    COUNT(*) as migrations_count,
    SUM(duration_seconds) as total_duration,
    AVG(duration_seconds) as avg_duration
FROM migration_metrics
WHERE started_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(started_at)
ORDER BY migration_date DESC;
```

## 🔒 Security & Compliance

### Security Considerations

#### Access Control
```sql
-- Limit migration permissions
REVOKE ALL ON schema_migrations FROM PUBLIC;
GRANT SELECT ON schema_migrations TO application_role;
GRANT ALL ON schema_migrations TO migration_role;

-- Audit trail for migrations
CREATE TABLE migration_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    migration_version VARCHAR(20) NOT NULL,
    executed_by VARCHAR(100) NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    execution_method VARCHAR(50), -- 'manual', 'automated', 'rollback'
    ip_address INET,
    additional_context JSONB
);
```

#### Data Protection
```sql
-- Ensure sensitive data is handled properly during migrations
CREATE OR REPLACE FUNCTION anonymize_sensitive_data()
RETURNS VOID AS $$
BEGIN
    -- Example: Anonymize email addresses in non-production
    IF current_setting('server_version_num')::int < 140000 OR 
       current_database() != 'production_db' THEN
        UPDATE users 
        SET email = 'user_' || id || '@example.com'
        WHERE email NOT LIKE '%@example.com';
    END IF;
END;
$$ LANGUAGE plpgsql;
```

### Compliance Tracking
```sql
-- GDPR compliance tracking for data migrations
CREATE TABLE data_migration_compliance (
    migration_version VARCHAR(20) PRIMARY KEY,
    gdpr_assessment_completed BOOLEAN DEFAULT FALSE,
    data_retention_impact TEXT,
    privacy_impact_notes TEXT,
    approved_by VARCHAR(100),
    approved_at TIMESTAMP WITH TIME ZONE
);
```

## 📚 Best Practices

### Development Best Practices
1. **Test thoroughly**: Always test on staging first
2. **Keep migrations small**: One logical change per migration
3. **Document decisions**: Explain why, not just what
4. **Plan for rollback**: Every migration should be reversible
5. **Monitor performance**: Track migration execution time

### Production Guidelines
1. **Schedule appropriately**: Migrate during low traffic
2. **Communicate changes**: Notify stakeholders
3. **Monitor closely**: Watch for performance impact
4. **Have rollback ready**: Be prepared to revert
5. **Verify success**: Confirm migration completed correctly

### Emergency Procedures
1. **Stop migration**: If issues detected
2. **Assess impact**: Understand what went wrong
3. **Execute rollback**: If necessary
4. **Investigate**: Root cause analysis
5. **Improve process**: Update procedures

---

**Last Updated**: January 22, 2025  
**Version**: 1.0  
**Maintained by**: Technical Team

Database migrations are critical operations. Always follow the established procedures and never rush migration processes in production environments.