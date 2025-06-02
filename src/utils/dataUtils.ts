
// Data Utilities and Helper Functions for Carbon Tracker
// These functions help you interact with and analyze the generated mock data

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// DATA FETCHING UTILITIES
// ============================================================================

/**
 * Get dashboard overview data for a specific company
 */
export async function getDashboardData(companyId: string, year = 2023) {
  try {
    // Get company basic info
    const { data: company } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    // Get emissions data for the year
    const { data: emissions } = await supabase
      .from('emissions_data')
      .select('*')
      .eq('company_id', companyId)
      .eq('year', year)
      .single();

    // Get SBTi targets
    const { data: sbti } = await supabase
      .from('sbti_targets')
      .select('*')
      .eq('company_id', companyId)
      .single();

    // Get compliance status
    const { data: compliance } = await supabase
      .from('frameworks_compliance')
      .select('*')
      .eq('company_id', companyId);

    // Get top 3 carbon footprint sources (Scope 3 breakdown)
    const { data: scope3Breakdown } = await supabase
      .from('scope3_emissions')
      .select('category, emissions_by_category')
      .eq('company_id', companyId)
      .eq('year', year)
      .order('emissions_by_category', { ascending: false })
      .limit(3);

    return {
      company,
      emissions,
      sbti,
      compliance,
      topCarbonSources: scope3Breakdown,
      success: true
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { success: false, error };
  }
}

/**
 * Get emissions trends for multiple years
 */
export async function getEmissionsTrends(companyId: string, startYear = 2019, endYear = 2023) {
  try {
    const { data, error } = await supabase
      .from('emissions_data')
      .select('year, scope1, scope2, scope3')
      .eq('company_id', companyId)
      .gte('year', startYear)
      .lte('year', endYear)
      .order('year', { ascending: true });

    if (error) throw error;

    return {
      trends: data,
      success: true
    };
  } catch (error) {
    console.error('Error fetching emissions trends:', error);
    return { success: false, error };
  }
}

/**
 * Get all companies with their latest emissions data
 */
export async function getCompaniesOverview(year = 2023) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select(`
        *,
        emissions_data!inner(
          scope1,
          scope2, 
          scope3
        )
      `)
      .eq('emissions_data.year', year)
      .order('name');

    if (error) throw error;

    return {
      companies: data,
      success: true
    };
  } catch (error) {
    console.error('Error fetching companies overview:', error);
    return { success: false, error };
  }
}

/**
 * Get detailed Scope 3 analysis for a company
 */
export async function getScope3Analysis(companyId: string, year = 2023) {
  try {
    const { data, error } = await supabase
      .from('scope3_emissions')
      .select('*')
      .eq('company_id', companyId)
      .eq('year', year)
      .order('emissions_by_category', { ascending: false });

    if (error) throw error;

    // Calculate total and percentages
    const totalScope3 = data?.reduce((sum, category) => sum + category.emissions_by_category, 0) || 0;
    const categoriesWithPercentages = data?.map(category => ({
      ...category,
      percentage: ((category.emissions_by_category / totalScope3) * 100).toFixed(1)
    })) || [];

    return {
      categories: categoriesWithPercentages,
      totalEmissions: totalScope3,
      success: true
    };
  } catch (error) {
    console.error('Error fetching Scope 3 analysis:', error);
    return { success: false, error };
  }
}

/**
 * Add new emission entry
 */
export async function addEmissionEntry(entryData: {
  company_id: string;
  date: string;
  category: string;
  amount: number;
  unit: string;
  description?: string;
}) {
  try {
    // For now, we'll add to a tracking table - you may want to create this table
    // This is a simplified version that adds to emissions_data
    const year = new Date(entryData.date).getFullYear();
    
    // Check if entry for this year exists
    const { data: existingEntry } = await supabase
      .from('emissions_data')
      .select('*')
      .eq('company_id', entryData.company_id)
      .eq('year', year)
      .single();

    if (existingEntry) {
      // Update existing entry (simplified logic)
      const updateData: any = {};
      if (entryData.category === 'electricity') {
        updateData.scope2 = existingEntry.scope2 + entryData.amount;
      } else if (entryData.category === 'fuel') {
        updateData.scope1 = existingEntry.scope1 + entryData.amount;
      } else {
        updateData.scope3 = existingEntry.scope3 + entryData.amount;
      }

      const { error } = await supabase
        .from('emissions_data')
        .update(updateData)
        .eq('id', existingEntry.id);

      if (error) throw error;
    } else {
      // Create new entry
      const newEntry = {
        company_id: entryData.company_id,
        year: year,
        scope1: entryData.category === 'fuel' ? entryData.amount : 0,
        scope2: entryData.category === 'electricity' ? entryData.amount : 0,
        scope3: !['fuel', 'electricity'].includes(entryData.category) ? entryData.amount : 0
      };

      const { error } = await supabase
        .from('emissions_data')
        .insert([newEntry]);

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding emission entry:', error);
    return { success: false, error };
  }
}

// ============================================================================
// DATA ANALYSIS UTILITIES
// ============================================================================

/**
 * Calculate emissions intensity metrics
 */
export function calculateEmissionsIntensity(emissions: any, company: any) {
  const totalEmissions = emissions.scope1 + emissions.scope2 + emissions.scope3;
  
  return {
    emissionsPerEmployee: company.employees ? 
      (totalEmissions / company.employees).toFixed(2) : null,
    emissionsPerRevenue: company.revenue ? 
      (totalEmissions / company.revenue).toFixed(2) : null,
    scope1Percentage: ((emissions.scope1 / totalEmissions) * 100).toFixed(1),
    scope2Percentage: ((emissions.scope2 / totalEmissions) * 100).toFixed(1),
    scope3Percentage: ((emissions.scope3 / totalEmissions) * 100).toFixed(1)
  };
}

/**
 * Calculate year-over-year changes
 */
export function calculateYearOverYearChange(trendsData: any[]) {
  const changes = [];
  
  for (let i = 1; i < trendsData.length; i++) {
    const current = trendsData[i];
    const previous = trendsData[i - 1];
    const currentTotal = current.scope1 + current.scope2 + current.scope3;
    const previousTotal = previous.scope1 + previous.scope2 + previous.scope3;
    
    changes.push({
      year: current.year,
      totalEmissionsChange: ((currentTotal - previousTotal) / previousTotal * 100).toFixed(1),
      scope1Change: ((current.scope1 - previous.scope1) / previous.scope1 * 100).toFixed(1),
      scope2Change: ((current.scope2 - previous.scope2) / previous.scope2 * 100).toFixed(1),
      scope3Change: ((current.scope3 - previous.scope3) / previous.scope3 * 100).toFixed(1)
    });
  }
  
  return changes;
}

/**
 * Search companies by name or industry
 */
export async function searchCompanies(searchTerm: string, filters: any = {}) {
  try {
    let query = supabase
      .from('companies')
      .select('*');

    // Apply search term
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,industry.ilike.%${searchTerm}%`);
    }

    // Apply filters
    if (filters.industry) {
      query = query.eq('industry', filters.industry);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;

    return {
      companies: data,
      success: true
    };
  } catch (error) {
    console.error('Error searching companies:', error);
    return { success: false, error };
  }
}

export {
  getDashboardData,
  getEmissionsTrends,
  getCompaniesOverview,
  getScope3Analysis,
  addEmissionEntry,
  calculateEmissionsIntensity,
  calculateYearOverYearChange,
  searchCompanies
};
