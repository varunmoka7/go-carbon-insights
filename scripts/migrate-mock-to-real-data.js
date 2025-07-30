#!/usr/bin/env node

/**
 * Data Migration Script: Mock Data to Real ESG Schema
 * Epic 2, Story 2.13: Core ESG Database Schema Implementation
 * 
 * This script migrates the existing mock data from TypeScript files
 * to the new PostgreSQL schema for real ESG data.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load mock data
const mockDataPath = path.join(__dirname, '../src/data/enhancedMockData.ts');
const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

// Extract the enhancedCompanies array from the TypeScript file
const companiesMatch = mockDataContent.match(/export const enhancedCompanies: EnhancedCompany\[\] = (\[[\s\S]*?\]);/);
if (!companiesMatch) {
  console.error('Could not find enhancedCompanies array in mock data file');
  process.exit(1);
}

// Parse the companies data (simplified parsing for demo)
const companiesData = eval(companiesMatch[1]);

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Transform mock company data to new schema format
 */
function transformCompanyData(mockCompany) {
  return {
    id: mockCompany.id || generateUUID(),
    name: mockCompany.name,
    sector: mockCompany.sector,
    industry: mockCompany.industry,
    headquarters: mockCompany.headquarters,
    country: extractCountry(mockCompany.headquarters),
    employees: mockCompany.employees,
    revenue: mockCompany.revenue,
    market_cap: mockCompany.marketCap,
    currency: 'USD',
    sustainability_rating: mockCompany.sustainabilityRating,
    sbti_committed: mockCompany.sbtiCommitted,
    net_zero_target: mockCompany.netZeroTarget,
    carbon_neutral: false, // Default value
    data_quality_score: 0.85, // Default quality score for migrated data
    verification_status: 'unverified',
    last_data_update: mockCompany.lastUpdated,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * Transform emissions data
 */
function transformEmissionsData(mockCompany, companyId) {
  if (!mockCompany.emissionsData || !Array.isArray(mockCompany.emissionsData)) {
    return [];
  }

  return mockCompany.emissionsData.map(emission => ({
    id: generateUUID(),
    company_id: companyId,
    year: emission.year,
    scope1: emission.scope1 || 0,
    scope2: emission.scope2 || 0,
    scope3: emission.scope3 || 0,
    emissions_intensity: mockCompany.emissionsIntensity,
    emissions_per_employee: mockCompany.employees ? 
      (emission.scope1 + emission.scope2 + emission.scope3) / mockCompany.employees : null,
    data_source: 'Migrated from mock data',
    verification_status: 'unverified',
    reporting_standard: 'GHG Protocol',
    boundary_setting: 'Operational control',
    notes: 'Migrated from mock data - requires verification',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
}

/**
 * Transform SBTi targets data
 */
function transformSBTiData(mockCompany, companyId) {
  if (!mockCompany.sbtiTargets) {
    return [];
  }

  return [{
    id: generateUUID(),
    company_id: companyId,
    near_term_target: mockCompany.sbtiTargets.nearTermTarget,
    long_term_target: mockCompany.sbtiTargets.longTermTarget,
    baseline_year: mockCompany.sbtiTargets.baselineYear,
    target_year: mockCompany.sbtiTargets.targetYear,
    scope1_reduction: mockCompany.sbtiTargets.scope1Reduction,
    scope3_reduction: mockCompany.sbtiTargets.scope3Reduction,
    overall_reduction: (mockCompany.sbtiTargets.scope1Reduction + mockCompany.sbtiTargets.scope3Reduction) / 2,
    validation_status: mockCompany.sbtiTargets.validationStatus === 'Validated' ? 'approved' : 'pending',
    current_progress: mockCompany.sbtiProgress || 0,
    on_track: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }];
}

/**
 * Transform frameworks data
 */
function transformFrameworksData(mockCompany, companyId) {
  if (!mockCompany.frameworks || !Array.isArray(mockCompany.frameworks)) {
    return [];
  }

  return mockCompany.frameworks.map(framework => ({
    id: generateUUID(),
    company_id: companyId,
    framework_name: framework.name,
    status: framework.status,
    score: framework.score ? parseFloat(framework.score) : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
}

/**
 * Transform sustainability metrics data
 */
function transformMetricsData(mockCompany, companyId) {
  const metrics = [];

  // Add renewable energy percentage
  if (mockCompany.renewableEnergyPercentage) {
    metrics.push({
      id: generateUUID(),
      company_id: companyId,
      metric_type: 'renewable_energy_percentage',
      value: mockCompany.renewableEnergyPercentage,
      unit: 'percent',
      year: new Date().getFullYear(),
      data_source: 'Migrated from mock data',
      verification_status: 'unverified',
      confidence_level: 0.50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  // Add water usage
  if (mockCompany.waterUsage) {
    metrics.push({
      id: generateUUID(),
      company_id: companyId,
      metric_type: 'water_usage',
      value: mockCompany.waterUsage,
      unit: 'million gallons',
      year: new Date().getFullYear(),
      data_source: 'Migrated from mock data',
      verification_status: 'unverified',
      confidence_level: 0.50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  // Add waste generated
  if (mockCompany.wasteGenerated) {
    metrics.push({
      id: generateUUID(),
      company_id: companyId,
      metric_type: 'waste_generated',
      value: mockCompany.wasteGenerated,
      unit: 'tons',
      year: new Date().getFullYear(),
      data_source: 'Migrated from mock data',
      verification_status: 'unverified',
      confidence_level: 0.50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  return metrics;
}

/**
 * Helper functions
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function extractCountry(headquarters) {
  if (!headquarters) return null;
  
  // Simple country extraction from headquarters
  const countryMap = {
    'Saudi Arabia': 'Saudi Arabia',
    'United States': 'United States',
    'China': 'China',
    'Netherlands': 'Netherlands',
    'United Kingdom': 'United Kingdom',
    'France': 'France',
    'Germany': 'Germany',
    'Japan': 'Japan',
    'South Korea': 'South Korea',
    'India': 'India',
    'Brazil': 'Brazil',
    'Canada': 'Canada',
    'Australia': 'Australia'
  };

  for (const [country, code] of Object.entries(countryMap)) {
    if (headquarters.includes(country)) {
      return code;
    }
  }

  return null;
}

/**
 * Main migration function
 */
async function migrateData() {
  console.log('🚀 Starting migration from mock data to real ESG schema...');
  console.log(`📊 Found ${companiesData.length} companies to migrate`);

  let successCount = 0;
  let errorCount = 0;

  for (const mockCompany of companiesData) {
    try {
      console.log(`\n📝 Migrating company: ${mockCompany.name}`);

      // Transform company data
      const companyData = transformCompanyData(mockCompany);
      
      // Insert company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert(companyData)
        .select()
        .single();

      if (companyError) {
        console.error(`❌ Error inserting company ${mockCompany.name}:`, companyError);
        errorCount++;
        continue;
      }

      console.log(`✅ Company inserted: ${company.name} (ID: ${company.id})`);

      // Insert emissions data
      const emissionsData = transformEmissionsData(mockCompany, company.id);
      if (emissionsData.length > 0) {
        const { error: emissionsError } = await supabase
          .from('emissions_data')
          .insert(emissionsData);

        if (emissionsError) {
          console.error(`⚠️ Error inserting emissions for ${company.name}:`, emissionsError);
        } else {
          console.log(`✅ Emissions data inserted: ${emissionsData.length} records`);
        }
      }

      // Insert SBTi targets
      const sbtiData = transformSBTiData(mockCompany, company.id);
      if (sbtiData.length > 0) {
        const { error: sbtiError } = await supabase
          .from('sbti_targets')
          .insert(sbtiData);

        if (sbtiError) {
          console.error(`⚠️ Error inserting SBTi targets for ${company.name}:`, sbtiError);
        } else {
          console.log(`✅ SBTi targets inserted: ${sbtiData.length} records`);
        }
      }

      // Insert frameworks
      const frameworksData = transformFrameworksData(mockCompany, company.id);
      if (frameworksData.length > 0) {
        const { error: frameworksError } = await supabase
          .from('company_frameworks')
          .insert(frameworksData);

        if (frameworksError) {
          console.error(`⚠️ Error inserting frameworks for ${company.name}:`, frameworksError);
        } else {
          console.log(`✅ Frameworks inserted: ${frameworksData.length} records`);
        }
      }

      // Insert sustainability metrics
      const metricsData = transformMetricsData(mockCompany, company.id);
      if (metricsData.length > 0) {
        const { error: metricsError } = await supabase
          .from('sustainability_metrics')
          .insert(metricsData);

        if (metricsError) {
          console.error(`⚠️ Error inserting metrics for ${company.name}:`, metricsError);
        } else {
          console.log(`✅ Sustainability metrics inserted: ${metricsData.length} records`);
        }
      }

      successCount++;

    } catch (error) {
      console.error(`❌ Error migrating company ${mockCompany.name}:`, error);
      errorCount++;
    }
  }

  console.log('\n🎉 Migration completed!');
  console.log(`✅ Successfully migrated: ${successCount} companies`);
  console.log(`❌ Errors: ${errorCount} companies`);
  console.log(`📊 Total processed: ${companiesData.length} companies`);

  // Refresh materialized views
  console.log('\n🔄 Refreshing materialized views...');
  try {
    const { error: refreshError } = await supabase.rpc('refresh_esg_materialized_views');
    if (refreshError) {
      console.error('⚠️ Error refreshing materialized views:', refreshError);
    } else {
      console.log('✅ Materialized views refreshed successfully');
    }
  } catch (error) {
    console.error('❌ Error refreshing materialized views:', error);
  }

  console.log('\n🏁 Migration script completed!');
}

/**
 * Run migration if this script is executed directly
 */
if (require.main === module) {
  // Check environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables:');
    console.error('   - SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  migrateData()
    .then(() => {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateData };