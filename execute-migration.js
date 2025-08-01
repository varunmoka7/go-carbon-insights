#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase connection configuration
const SUPABASE_URL = 'https://hiplsgbyxbalukmejxaq.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpcGxzZ2J5eGJhbHVrbWVqeGFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODQ0MzE0MywiZXhwIjoyMDY0MDE5MTQzfQ.voo0b1KL6VrGcfB5cYPnFj0l5rWyWGB7PVCElTaVQCE';

// PostgreSQL connection string for Supabase
const connectionString = `postgresql://postgres:[YOUR-PASSWORD]@db.hiplsgbyxbalukmejxaq.supabase.co:5432/postgres`;

async function executeMigration() {
    try {
        console.log('🚀 Starting Epic 5: Trancenable Integration Migration...');
        
        // Read the migration file
        const migrationPath = path.join(__dirname, 'backend-services/shared/database-schema/migrations/20250801200000_epic5_trancenable_schema_extensions.sql');
        const migrationSQL = await fs.readFile(migrationPath, 'utf8');
        
        console.log('📂 Migration file loaded successfully');
        console.log(`📊 Migration SQL size: ${migrationSQL.length} characters`);
        
        // Use fetch to execute the migration via Supabase REST API
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'apikey': SUPABASE_SERVICE_KEY
            },
            body: JSON.stringify({
                sql: migrationSQL
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Migration failed:', errorText);
            console.log('');
            console.log('🔧 Alternative approach: Manual SQL execution');
            console.log('Please execute the migration manually using Supabase Dashboard SQL Editor:');
            console.log('1. Go to https://supabase.com/dashboard/project/hiplsgbyxbalukmejxaq/sql');
            console.log('2. Copy and paste the migration SQL');
            console.log('3. Execute the migration');
            console.log('');
            console.log('Migration file location:', migrationPath);
            return false;
        }
        
        const result = await response.json();
        console.log('✅ Migration executed successfully!');
        console.log('📋 Result:', result);
        return true;
        
    } catch (error) {
        console.error('❌ Migration execution failed:', error.message);
        
        // Provide alternative manual execution instructions
        console.log('');
        console.log('🔧 Manual Execution Required');
        console.log('Please execute the migration manually using one of these methods:');
        console.log('');
        console.log('Method 1: Supabase Dashboard');
        console.log('1. Go to https://supabase.com/dashboard/project/hiplsgbyxbalukmejxaq/sql');
        console.log('2. Copy the SQL from: backend-services/shared/database-schema/migrations/20250801200000_epic5_trancenable_schema_extensions.sql');
        console.log('3. Paste and execute in the SQL Editor');
        console.log('');
        console.log('Method 2: psql (if available)');
        console.log('psql "postgresql://postgres:[YOUR-PASSWORD]@db.hiplsgbyxbalukmejxaq.supabase.co:5432/postgres" -f "backend-services/shared/database-schema/migrations/20250801200000_epic5_trancenable_schema_extensions.sql"');
        console.log('');
        
        return false;
    }
}

// Execute the migration
executeMigration().then(success => {
    if (success) {
        console.log('🎉 Epic 5 database migration completed successfully!');
        console.log('');
        console.log('Next steps:');
        console.log('1. Validate schema changes');
        console.log('2. Test data quality validation constraints');
        console.log('3. Verify performance indexes');
        console.log('4. Run post-migration verification checks');
        process.exit(0);
    } else {
        console.log('⚠️  Migration requires manual execution');
        process.exit(1);
    }
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});