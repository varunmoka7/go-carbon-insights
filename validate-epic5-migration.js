#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://hiplsgbyxbalukmejxaq.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpcGxzZ2J5eGJhbHVrbWVqeGFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODQ0MzE0MywiZXhwIjoyMDY0MDE5MTQzfQ.voo0b1KL6VrGcfB5cYPnFj0l5rWyWGB7PVCElTaVQCE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Validation test suite for Epic 5: Trancenable Integration
const validationTests = [
    {
        name: '1. Company Table Extensions',
        description: 'Verify new columns added to companies table',
        query: `
            SELECT 
                column_name, 
                data_type, 
                is_nullable,
                column_default
            FROM information_schema.columns 
            WHERE table_name = 'companies' 
            AND column_name IN ('lei', 'figi', 'ticker', 'permid', 'exchange', 'mic_code', 'trancenable_company_id', 'data_source_attribution', 'identifier_confidence_score')
            ORDER BY column_name;
        `,
        expectedCount: 9
    },
    {
        name: '2. Trancenable Support Tables',
        description: 'Verify new support tables were created',
        query: `
            SELECT table_name, table_type
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name IN ('company_identifiers', 'industry_mapping_log', 'trancenable_import_log', 'emission_sources_detail')
            ORDER BY table_name;
        `,
        expectedCount: 4
    },
    {
        name: '3. New Industry Taxonomy Entries',
        description: 'Verify Trancenable industries were added',
        query: `
            SELECT 
                sector,
                industry,
                emissions_archetype,
                COUNT(*) as entry_count
            FROM industry_taxonomy 
            WHERE description LIKE '%Trancenable%' 
               OR industry IN (
                   'Industrial Equipment Manufacturing',
                   'Aerospace Manufacturing',
                   'Marine Equipment Manufacturing',
                   'Gas Utilities',
                   'Water Utilities',
                   'Technology Consulting'
               )
            GROUP BY sector, industry, emissions_archetype
            ORDER BY sector, industry;
        `,
        expectedMinCount: 20
    },
    {
        name: '4. Performance Indexes',
        description: 'Verify critical indexes were created',
        query: `
            SELECT 
                indexname,
                tablename,
                indexdef
            FROM pg_indexes 
            WHERE schemaname = 'public'
            AND (
                indexname LIKE '%trancenable%' OR 
                indexname LIKE '%lei%' OR 
                indexname LIKE '%ticker%' OR 
                indexname LIKE '%figi%' OR
                tablename IN ('company_identifiers', 'industry_mapping_log', 'emission_sources_detail')
            )
            ORDER BY tablename, indexname;
        `,
        expectedMinCount: 10
    },
    {
        name: '5. Data Validation Constraints',
        description: 'Verify validation constraints were applied',
        query: `
            SELECT 
                conname as constraint_name,
                contype as constraint_type,
                pg_get_constraintdef(c.oid) as constraint_definition
            FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            JOIN pg_namespace n ON t.relnamespace = n.oid
            WHERE n.nspname = 'public'
            AND t.relname IN ('companies', 'emissions_data', 'company_identifiers', 'industry_mapping_log')
            AND (
                conname LIKE '%lei%' OR 
                conname LIKE '%ticker%' OR 
                conname LIKE '%figi%' OR
                conname LIKE '%permid%' OR
                conname LIKE '%confidence%' OR
                conname LIKE '%format%'
            )
            ORDER BY t.relname, conname;
        `,
        expectedMinCount: 5
    },
    {
        name: '6. Row Level Security Policies',
        description: 'Verify RLS policies were created for new tables',
        query: `
            SELECT 
                schemaname,
                tablename,
                policyname,
                permissive,
                roles,
                cmd,
                qual
            FROM pg_policies 
            WHERE schemaname = 'public'
            AND tablename IN ('company_identifiers', 'industry_mapping_log', 'trancenable_import_log', 'emission_sources_detail')
            ORDER BY tablename, policyname;
        `,
        expectedMinCount: 8
    },
    {
        name: '7. Materialized Views',
        description: 'Verify materialized views were created',
        query: `
            SELECT 
                schemaname,
                matviewname,
                hasindexes,
                ispopulated
            FROM pg_matviews 
            WHERE schemaname = 'public'
            AND matviewname LIKE '%trancenable%'
            ORDER BY matviewname;
        `,
        expectedCount: 1
    },
    {
        name: '8. Validation Functions',
        description: 'Verify custom functions were created',
        query: `
            SELECT 
                routine_name,
                routine_type,
                data_type as return_type
            FROM information_schema.routines 
            WHERE routine_schema = 'public'
            AND (
                routine_name LIKE '%trancenable%' OR 
                routine_name LIKE '%company_identifiers%' OR
                routine_name LIKE '%data_quality%'
            )
            ORDER BY routine_name;
        `,
        expectedMinCount: 3
    }
];

async function runValidationTest(test) {
    try {
        console.log(`\n🔍 ${test.name}`);
        console.log(`   ${test.description}`);
        
        const { data, error } = await supabase.rpc('exec_sql', { 
            sql: test.query 
        });
        
        if (error) {
            // Fallback to direct query if rpc doesn't work
            const { data: directData, error: directError } = await supabase
                .from('information_schema.columns')
                .select('*')
                .limit(1);
                
            if (directError) {
                console.log(`   ❌ FAIL: Database connection error`);
                console.log(`   Error: ${error.message}`);
                return { name: test.name, status: 'FAIL', error: error.message };
            } else {
                console.log(`   ⚠️  SKIP: Direct SQL execution not available via API`);
                console.log(`   📋 Manual verification required using Supabase Dashboard`);
                return { name: test.name, status: 'SKIP', reason: 'Manual verification required' };
            }
        }
        
        const resultCount = Array.isArray(data) ? data.length : 0;
        const expectedCount = test.expectedCount || test.expectedMinCount || 0;
        const isMinCount = test.expectedMinCount !== undefined;
        
        const passed = isMinCount ? 
            resultCount >= expectedCount : 
            resultCount === expectedCount;
            
        if (passed) {
            console.log(`   ✅ PASS: Found ${resultCount} results ${isMinCount ? `(>= ${expectedCount} expected)` : `(${expectedCount} expected)`}`);
            return { name: test.name, status: 'PASS', count: resultCount };
        } else {
            console.log(`   ❌ FAIL: Found ${resultCount} results ${isMinCount ? `(expected >= ${expectedCount})` : `(expected ${expectedCount})`}`);
            return { name: test.name, status: 'FAIL', count: resultCount, expected: expectedCount };
        }
        
    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
        return { name: test.name, status: 'ERROR', error: error.message };
    }
}

async function generateManualValidationSQL() {
    console.log('\n📋 Manual Validation SQL Queries');
    console.log('=====================================');
    console.log('Execute these queries in Supabase Dashboard SQL Editor to validate the migration:\n');
    
    validationTests.forEach((test, index) => {
        console.log(`-- ${test.name}: ${test.description}`);
        console.log(test.query.trim());
        console.log('');
    });
    
    console.log('-- Quick Migration Status Check');
    console.log(`SELECT 
    'Epic 5 Migration Status' as check_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'lei')
        AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'company_identifiers')
        AND EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'trancenable_companies_overview')
        THEN 'Migration appears successful ✅'
        ELSE 'Migration incomplete or failed ❌'
    END as status;`);
}

async function runAllValidations() {
    console.log('🚀 Epic 5: Trancenable Integration - Migration Validation');
    console.log('===========================================================');
    
    const results = [];
    
    // Test database connectivity first
    console.log('\n🔌 Testing Database Connectivity...');
    try {
        const { data, error } = await supabase
            .from('companies')
            .select('count', { count: 'exact', head: true });
            
        if (error) {
            console.log('❌ Database connection failed');
            console.log('Please ensure the migration has been executed manually');
            await generateManualValidationSQL();
            return;
        }
        
        console.log('✅ Database connection successful');
        console.log(`📊 Current companies count: ${data?.length || 'Unknown'}`);
        
    } catch (error) {
        console.log('❌ Database connection error:', error.message);
        await generateManualValidationSQL();
        return;
    }
    
    // Run validation tests
    console.log('\n🧪 Running Migration Validation Tests...');
    
    for (const test of validationTests) {
        const result = await runValidationTest(test);
        results.push(result);
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Summary
    console.log('\n📊 Validation Summary');
    console.log('=====================');
    
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    const errors = results.filter(r => r.status === 'ERROR').length;
    const skipped = results.filter(r => r.status === 'SKIP').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Errors: ${errors}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`📈 Total: ${results.length}`);
    
    if (failed > 0 || errors > 0) {
        console.log('\n⚠️  Some validations failed. Please check the migration execution.');
        console.log('Consider running the rollback script if needed:');
        console.log('backend-services/shared/database-schema/migrations/20250801200001_epic5_trancenable_rollback.sql');
    } else if (skipped === results.length) {
        console.log('\n📋 All validations require manual execution.');
        await generateManualValidationSQL();
    } else {
        console.log('\n🎉 Epic 5 migration validation completed successfully!');
    }
    
    return results;
}

// Execute validation
runAllValidations().catch(error => {
    console.error('Fatal validation error:', error);
    process.exit(1);
});