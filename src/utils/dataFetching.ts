
import { supabase } from '@/integrations/supabase/client';

/**
 * Get dashboard overview data for a specific company with RLS security
 */
export async function getDashboardData(companyId: string, year = 2023) {
  try {
    // Get company basic info (accessible through RLS)
    const { data: company } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    // Get emissions data for the year (private data - requires company access)
    const { data: emissions } = await supabase
      .from('emissions_data')
      .select('*')
      .eq('company_id', companyId)
      .eq('year', year)
      .single();

    // Get SBTi targets (semi-public data)
    const { data: sbti } = await supabase
      .from('sbti_targets')
      .select('*')
      .eq('company_id', companyId)
      .single();

    // Get compliance status (semi-public data)
    const { data: compliance } = await supabase
      .from('frameworks_compliance')
      .select('*')
      .eq('company_id', companyId);

    // Get top 3 carbon footprint sources (private data)
    const { data: scope3Breakdown } = await supabase
      .from('scope3_emissions')
      .select('category, emissions_by_category')
      .eq('company_id', companyId)
      .eq('year', year)
      .order('emissions_by_category', { ascending: false })
      .limit(3);

    // Get public benchmark data (accessible to all authenticated users)
    const { data: benchmarks } = await supabase
      .from('company_benchmarks')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_public_data', true);

    return {
      company,
      emissions,
      sbti,
      compliance,
      topCarbonSources: scope3Breakdown,
      benchmarks,
      success: true
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { success: false, error };
  }
}

/**
 * Get emissions trends for multiple years (private data)
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
 * Get all companies with their public benchmark data (accessible to all users)
 */
export async function getCompaniesOverview(year = 2023) {
  try {
    const { data, error } = await supabase
      .from('company_benchmarks')
      .select(`
        *,
        companies:company_id (
          id,
          name,
          industry,
          sector,
          description
        )
      `)
      .eq('benchmark_year', year)
      .eq('is_public_data', true)
      .order('total_emissions', { ascending: false });

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
 * Get detailed Scope 3 analysis for a company (private data)
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
 * Get industry benchmarks for comparison (public data)
 */
export async function getIndustryBenchmarks(industry: string, year = 2023) {
  try {
    const { data, error } = await supabase
      .from('company_benchmarks')
      .select(`
        *,
        companies:company_id (
          name
        )
      `)
      .eq('industry', industry)
      .eq('benchmark_year', year)
      .eq('is_public_data', true)
      .order('total_emissions', { ascending: false });

    if (error) throw error;

    return {
      benchmarks: data,
      success: true
    };
  } catch (error) {
    console.error('Error fetching industry benchmarks:', error);
    return { success: false, error };
  }
}
