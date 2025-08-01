#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://hiplsgbyxbalukmejxaq.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpcGxzZ2J5eGJhbHVrbWVqeGFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODQ0MzE0MywiZXhwIjoyMDY0MDE5MTQzfQ.voo0b1KL6VrGcfB5cYPnFj0l5rWyWGB7PVCElTaVQCE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Post-migration verification checks
const postMigrationChecks = [
    {
        name: 'Database Performance Health Check',
        description: 'Monitor index usage and query performance',
        queries: [
            {
                name: 'Index Usage Statistics',
                sql: `
                    SELECT 
                        schemaname,
                        tablename,
                        indexname,
                        idx_scan as times_used,
                        idx_tup_read as tuples_read,
                        idx_tup_fetch as tuples_fetched
                    FROM pg_stat_user_indexes 
                    WHERE indexname LIKE '%trancenable%' 
                       OR indexname LIKE '%companies%'
                       OR tablename IN ('company_identifiers', 'industry_mapping_log')
                    ORDER BY idx_scan DESC;
                `
            },
            {
                name: 'Table Size Analysis',
                sql: `
                    SELECT 
                        schemaname,
                        tablename,
                        n_tup_ins + n_tup_upd + n_tup_del as total_activity,
                        n_tup_hot_upd,
                        n_dead_tup
                    FROM pg_stat_user_tables 
                    WHERE tablename IN ('companies', 'emissions_data', 'company_identifiers', 'industry_mapping_log', 'trancenable_import_log')
                    ORDER BY total_activity DESC;
                `
            }
        ]
    },
    {
        name: 'Data Quality Assessment',
        description: 'Verify data quality scores and coverage',
        queries: [
            {
                name: 'Company Identifier Coverage',
                sql: `
                    SELECT 
                        'Total Companies' as metric,
                        COUNT(*) as count
                    FROM companies
                    UNION ALL
                    SELECT 
                        'Companies with LEI' as metric,
                        COUNT(*) as count
                    FROM companies 
                    WHERE lei IS NOT NULL
                    UNION ALL
                    SELECT 
                        'Companies with Ticker' as metric,
                        COUNT(*) as count
                    FROM companies 
                    WHERE ticker IS NOT NULL
                    UNION ALL
                    SELECT 
                        'Companies with FIGI' as metric,
                        COUNT(*) as count
                    FROM companies 
                    WHERE figi IS NOT NULL;
                `
            },
            {
                name: 'Data Quality Score Distribution',
                sql: `
                    SELECT 
                        CASE 
                            WHEN data_quality_score >= 0.9 THEN 'Excellent (0.9-1.0)'
                            WHEN data_quality_score >= 0.8 THEN 'Good (0.8-0.89)'
                            WHEN data_quality_score >= 0.7 THEN 'Fair (0.7-0.79)'
                            WHEN data_quality_score >= 0.6 THEN 'Poor (0.6-0.69)'
                            ELSE 'Very Poor (<0.6)'
                        END as quality_tier,
                        COUNT(*) as company_count,
                        ROUND(AVG(data_quality_score), 3) as avg_score
                    FROM companies 
                    WHERE data_quality_score IS NOT NULL
                    GROUP BY 
                        CASE 
                            WHEN data_quality_score >= 0.9 THEN 'Excellent (0.9-1.0)'
                            WHEN data_quality_score >= 0.8 THEN 'Good (0.8-0.89)'
                            WHEN data_quality_score >= 0.7 THEN 'Fair (0.7-0.79)'
                            WHEN data_quality_score >= 0.6 THEN 'Poor (0.6-0.69)'
                            ELSE 'Very Poor (<0.6)'
                        END
                    ORDER BY avg_score DESC;
                `
            }
        ]
    },
    {
        name: 'Industry Mapping Validation',
        description: 'Verify industry taxonomy extensions',
        queries: [
            {
                name: 'New Industry Categories',
                sql: `
                    SELECT 
                        sector,
                        COUNT(*) as industry_count,
                        array_agg(DISTINCT emissions_archetype) as archetypes
                    FROM industry_taxonomy 
                    WHERE created_at >= CURRENT_DATE - INTERVAL '1 day'
                       OR description LIKE '%Trancenable%'
                    GROUP BY sector
                    ORDER BY industry_count DESC;
                `
            },
            {
                name: 'Industry Mapping Confidence',
                sql: `
                    SELECT 
                        mapping_type,
                        COUNT(*) as mapping_count,
                        ROUND(AVG(confidence_score), 3) as avg_confidence,
                        MIN(confidence_score) as min_confidence,
                        MAX(confidence_score) as max_confidence
                    FROM industry_mapping_log
                    GROUP BY mapping_type
                    ORDER BY avg_confidence DESC;
                `
            }
        ]
    },
    {
        name: 'Constraint Validation Tests',
        description: 'Test data validation constraints',
        queries: [
            {
                name: 'LEI Format Validation Test',
                sql: `
                    SELECT 
                        'Valid LEI Format' as test_name,
                        COUNT(CASE WHEN lei ~ '^[A-Z0-9]{20}$' THEN 1 END) as valid_count,
                        COUNT(CASE WHEN lei IS NOT NULL AND lei !~ '^[A-Z0-9]{20}$' THEN 1 END) as invalid_count
                    FROM companies 
                    WHERE lei IS NOT NULL;
                `
            },
            {
                name: 'Confidence Score Range Test',
                sql: `
                    SELECT 
                        'Confidence Score Range' as test_name,
                        COUNT(CASE WHEN identifier_confidence_score BETWEEN 0.0 AND 1.0 THEN 1 END) as valid_range,
                        COUNT(CASE WHEN identifier_confidence_score < 0.0 OR identifier_confidence_score > 1.0 THEN 1 END) as invalid_range
                    FROM companies 
                    WHERE identifier_confidence_score IS NOT NULL;
                `
            }
        ]
    },
    {
        name: 'System Integration Tests',
        description: 'Test system functionality with new schema',
        queries: [
            {
                name: 'Join Performance Test',
                sql: `
                    SELECT 
                        c.name,
                        c.lei,
                        c.sector,
                        c.identifier_confidence_score,
                        e.total_emissions,
                        it.emissions_archetype
                    FROM companies c
                    LEFT JOIN emissions_data e ON c.id = e.company_id 
                        AND e.year = (SELECT MAX(year) FROM emissions_data WHERE company_id = c.id)
                    LEFT JOIN industry_taxonomy it ON c.industry = it.industry
                    WHERE c.lei IS NOT NULL
                    ORDER BY c.identifier_confidence_score DESC, e.total_emissions DESC
                    LIMIT 10;
                `
            },
            {
                name: 'Materialized View Test',
                sql: `
                    SELECT 
                        primary_identifier_type,
                        COUNT(*) as company_count,
                        ROUND(AVG(data_quality_score), 3) as avg_quality,
                        ROUND(AVG(total_emissions), 2) as avg_emissions
                    FROM trancenable_companies_overview
                    GROUP BY primary_identifier_type
                    ORDER BY company_count DESC;
                `
            }
        ]
    }
];

async function executeQuery(queryInfo) {
    try {
        console.log(`\n  🔍 ${queryInfo.name}`);
        
        // For now, we can't execute complex queries via the Supabase client
        // So we'll provide the SQL for manual execution
        console.log(`  📋 Execute this query manually in Supabase Dashboard:`);
        console.log(`  ${queryInfo.sql.trim().replace(/\n/g, '\n     ')}`);
        
        return {
            name: queryInfo.name,
            status: 'MANUAL_EXECUTION_REQUIRED',
            sql: queryInfo.sql.trim()
        };
        
    } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
        return {
            name: queryInfo.name,
            status: 'ERROR',
            error: error.message
        };
    }
}

async function runPostMigrationChecks() {
    console.log('🔍 Epic 5: Post-Migration Verification Checks');
    console.log('================================================');
    
    // Test basic connectivity
    console.log('\n🔌 Testing Database Connectivity...');
    try {
        const { data, error } = await supabase
            .from('companies')
            .select('count', { count: 'exact', head: true });
            
        if (error) {
            console.log('❌ Database connection failed');
            console.log('Please ensure the migration has been executed');
            return;
        }
        
        console.log('✅ Database connection successful');
        
    } catch (error) {
        console.log('❌ Database connection error:', error.message);
        return;
    }
    
    // Run all post-migration checks
    for (const check of postMigrationChecks) {
        console.log(`\n📋 ${check.name}`);
        console.log(`   ${check.description}`);
        
        for (const query of check.queries) {
            await executeQuery(query);
        }
    }
    
    // Generate comprehensive validation report
    console.log('\n📊 Post-Migration Verification Summary');
    console.log('=====================================');
    
    console.log(`
🎯 Key Performance Indicators to Monitor:

1. **Data Quality Metrics** (Target: >80% LEI coverage)
   - LEI identifier coverage rate
   - Average data quality score >0.70
   - Confidence score distribution

2. **Query Performance** (Target: <50ms for key queries)
   - Index utilization rates
   - Query execution times
   - Join operation performance

3. **Data Integrity** (Target: 100% compliance)
   - Constraint validation success
   - Foreign key relationships
   - Data type compliance

4. **System Integration** (Target: No breaking changes)
   - API endpoint compatibility
   - Frontend data loading
   - Dashboard functionality

📋 Manual Verification Required:
Execute all the SQL queries provided above in Supabase Dashboard to verify:
- Schema changes applied correctly
- Data quality meets requirements
- Performance indexes are effective
- Validation constraints are working

🚀 Next Steps After Validation:
1. Run the ETL transformation pipeline (DATA_OUTSOURCE/trancenable-transformation-pipeline.js)
2. Import test data to validate data quality gates
3. Update API endpoints to support new identifiers
4. Test frontend integration with new data fields
5. Monitor system performance for 24-48 hours

⚠️  If any issues are detected:
1. Review the specific failing query
2. Check migration logs for errors
3. Consider running the rollback script if needed:
   backend-services/shared/database-schema/migrations/20250801200001_epic5_trancenable_rollback.sql
`);
    
    console.log('\n✅ Post-migration verification checks prepared');
    console.log('Execute the SQL queries above to complete validation');
}

// Execute post-migration checks
runPostMigrationChecks().catch(error => {
    console.error('Fatal post-migration check error:', error);
    process.exit(1);
});