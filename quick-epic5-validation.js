#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Supabase configuration from .env
const SUPABASE_URL = 'https://hiplsgbyxbalukmejxaq.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpcGxzZ2J5eGJhbHVrbWVqeGFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODQ0MzE0MywiZXhwIjoyMDY0MDE5MTQzfQ.voo0b1KL6VrGcfB5cYPnFj0l5rWyWGB7PVCElTaVQCE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function quickValidation() {
    console.log('🚀 Quick Epic 5 Migration Validation');
    console.log('=====================================\n');
    
    const checks = [];
    
    // Check 1: Companies table exists and accessible
    try {
        const { data, error, count } = await supabase
            .from('companies')
            .select('*', { count: 'exact', head: true });
            
        if (error) {
            checks.push({ name: 'Companies table access', status: '❌', details: error.message });
        } else {
            checks.push({ name: 'Companies table access', status: '✅', details: `${count} companies` });
        }
    } catch (e) {
        checks.push({ name: 'Companies table access', status: '❌', details: e.message });
    }
    
    // Check 2: New Epic 5 tables exist
    const newTables = ['company_identifiers', 'industry_mapping_log', 'trancenable_import_log', 'emission_sources_detail'];
    
    for (const table of newTables) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });
                
            if (error) {
                checks.push({ name: `Table: ${table}`, status: '❌', details: error.message });
            } else {
                checks.push({ name: `Table: ${table}`, status: '✅', details: 'Accessible' });
            }
        } catch (e) {
            checks.push({ name: `Table: ${table}`, status: '❌', details: e.message });
        }
    }
    
    // Check 3: Test a company insert with new fields
    try {
        const testCompany = {
            name: 'Test Company Epic5',
            lei: 'TEST123456789012345678',
            ticker: 'TEST',
            figi: 'BBG000000000',
            permid: '1234567890',
            exchange: 'NASDAQ',
            mic_code: 'XNAS',
            trancenable_company_id: 'test-123',
            data_source_attribution: 'Epic5ValidationTest',
            identifier_confidence_score: 0.95
        };
        
        const { data, error } = await supabase
            .from('companies')
            .insert(testCompany)
            .select();
            
        if (error) {
            checks.push({ name: 'New columns validation', status: '❌', details: error.message });
        } else {
            checks.push({ name: 'New columns validation', status: '✅', details: 'Insert successful' });
            
            // Clean up test data
            await supabase
                .from('companies')
                .delete()
                .eq('name', 'Test Company Epic5');
        }
    } catch (e) {
        checks.push({ name: 'New columns validation', status: '❌', details: e.message });
    }
    
    // Display results
    console.log('🧪 Validation Results:');
    console.log('----------------------');
    checks.forEach(check => {
        console.log(`${check.status} ${check.name}: ${check.details}`);
    });
    
    const passed = checks.filter(c => c.status === '✅').length;
    const failed = checks.filter(c => c.status === '❌').length;
    
    console.log(`\n📊 Summary: ${passed} passed, ${failed} failed`);
    
    if (failed === 0) {
        console.log('\n🎉 Epic 5 migration appears to be working correctly!');
        return true;
    } else {
        console.log('\n⚠️  Some issues detected. Check migration status.');
        return false;
    }
}

quickValidation().catch(console.error);