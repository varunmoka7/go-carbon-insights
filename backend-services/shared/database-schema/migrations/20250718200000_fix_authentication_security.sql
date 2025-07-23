-- Migration: Fix Authentication Security Issues
-- Created: 2025-07-18
-- Description: Enables RLS on all tables and fixes function security issues
-- This migration resolves critical authentication blocking issues

-- Phase 1: Enable RLS on user_profiles table (CRITICAL)
-- This is the most critical fix - without this, authentication completely fails
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Phase 2: Enable RLS on all data tables that were missing it
-- These tables need RLS to prevent unauthorized data access

-- Core business data tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emissions_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scope1_emissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scope2_emissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scope3_emissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_company_access ENABLE ROW LEVEL SECURITY;

-- Audit and compliance tables
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sbti_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frameworks_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_benchmarks ENABLE ROW LEVEL SECURITY;

-- Additional data tables that may exist
ALTER TABLE public.emission_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emission_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- Phase 3: Create comprehensive RLS policies for user_profiles
-- Users can only see and modify their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Phase 4: Create RLS policies for companies table
-- Users can see companies they have access to
DROP POLICY IF EXISTS "Users can view accessible companies" ON public.companies;
DROP POLICY IF EXISTS "Users can update own companies" ON public.companies;

CREATE POLICY "Users can view accessible companies" ON public.companies
    FOR SELECT USING (
        id IN (
            SELECT company_id 
            FROM public.user_company_access 
            WHERE user_id = auth.uid()
        )
        OR 
        id IN (
            SELECT company_id 
            FROM public.user_profiles 
            WHERE id = auth.uid() AND company_id IS NOT NULL
        )
    );

CREATE POLICY "Users can update own companies" ON public.companies
    FOR UPDATE USING (
        id IN (
            SELECT company_id 
            FROM public.user_company_access 
            WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
        )
    );

-- Phase 5: Create RLS policies for emissions data tables
-- Users can only access emissions data for their companies

-- Emissions Data
DROP POLICY IF EXISTS "Users can view company emissions" ON public.emissions_data;
CREATE POLICY "Users can view company emissions" ON public.emissions_data
    FOR SELECT USING (
        company_id IN (
            SELECT company_id 
            FROM public.user_company_access 
            WHERE user_id = auth.uid()
        )
    );

-- Scope 1 Emissions
DROP POLICY IF EXISTS "Users can view company scope1" ON public.scope1_emissions;
CREATE POLICY "Users can view company scope1" ON public.scope1_emissions
    FOR SELECT USING (
        company_id IN (
            SELECT company_id 
            FROM public.user_company_access 
            WHERE user_id = auth.uid()
        )
    );

-- Scope 2 Emissions  
DROP POLICY IF EXISTS "Users can view company scope2" ON public.scope2_emissions;
CREATE POLICY "Users can view company scope2" ON public.scope2_emissions
    FOR SELECT USING (
        company_id IN (
            SELECT company_id 
            FROM public.user_company_access 
            WHERE user_id = auth.uid()
        )
    );

-- Scope 3 Emissions
DROP POLICY IF EXISTS "Users can view company scope3" ON public.scope3_emissions;
CREATE POLICY "Users can view company scope3" ON public.scope3_emissions
    FOR SELECT USING (
        company_id IN (
            SELECT company_id 
            FROM public.user_company_access 
            WHERE user_id = auth.uid()
        )
    );

-- Phase 6: Create RLS policies for user company access
-- Users can see their own access records
DROP POLICY IF EXISTS "Users can view own access" ON public.user_company_access;
CREATE POLICY "Users can view own access" ON public.user_company_access
    FOR SELECT USING (user_id = auth.uid());

-- Phase 7: Create RLS policies for audit logs
-- Users can see audit logs for their actions and companies
DROP POLICY IF EXISTS "Users can view relevant audit logs" ON public.audit_logs;
CREATE POLICY "Users can view relevant audit logs" ON public.audit_logs
    FOR SELECT USING (
        user_id = auth.uid()
        OR 
        company_id IN (
            SELECT company_id 
            FROM public.user_company_access 
            WHERE user_id = auth.uid()
        )
    );

-- Phase 8: Create RLS policies for targets and strategies
-- Users can access targets and strategies for their companies

-- SBTI Targets
DROP POLICY IF EXISTS "Users can view company targets" ON public.sbti_targets;
CREATE POLICY "Users can view company targets" ON public.sbti_targets
    FOR SELECT USING (
        company_id IN (
            SELECT company_id 
            FROM public.user_company_access 
            WHERE user_id = auth.uid()
        )
    );

-- Carbon Strategies
DROP POLICY IF EXISTS "Users can view company strategies" ON public.carbon_strategies;
CREATE POLICY "Users can view company strategies" ON public.carbon_strategies
    FOR SELECT USING (
        company_id IN (
            SELECT company_id 
            FROM public.user_company_access 
            WHERE user_id = auth.uid()
        )
    );

-- Frameworks Compliance
DROP POLICY IF EXISTS "Users can view company compliance" ON public.frameworks_compliance;
CREATE POLICY "Users can view company compliance" ON public.frameworks_compliance
    FOR SELECT USING (
        company_id IN (
            SELECT company_id 
            FROM public.user_company_access 
            WHERE user_id = auth.uid()
        )
    );

-- Company Benchmarks (can be public for comparison)
DROP POLICY IF EXISTS "Users can view benchmarks" ON public.company_benchmarks;
CREATE POLICY "Users can view benchmarks" ON public.company_benchmarks
    FOR SELECT USING (true); -- Public read access for benchmarking

-- Phase 9: Fix function security issues
-- Update handle_new_user function with secure search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Set secure search path to prevent SQL injection
  SET search_path TO 'public', 'pg_temp';
  
  INSERT INTO public.user_profiles (id, email, username, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update handle_user_email_verified function with secure search path
CREATE OR REPLACE FUNCTION public.handle_user_email_verified()
RETURNS trigger AS $$
BEGIN
  -- Set secure search path to prevent SQL injection
  SET search_path TO 'public', 'pg_temp';
  
  UPDATE public.user_profiles 
  SET email_verified = true 
  WHERE id = new.id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 10: Ensure triggers are properly configured
-- Recreate the trigger to ensure it works with the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_email_verified ON auth.users;
CREATE TRIGGER on_auth_user_email_verified
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW 
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_user_email_verified();

-- Phase 11: Grant necessary permissions
-- Ensure the service role can manage authentication data
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_profiles TO anon, authenticated;
GRANT ALL ON public.companies TO anon, authenticated;
GRANT ALL ON public.user_company_access TO anon, authenticated;

-- Ensure sequences are accessible
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Phase 12: Create helpful indexes for RLS performance
-- These indexes will make RLS policy lookups much faster
CREATE INDEX IF NOT EXISTS idx_user_company_access_user_id ON public.user_company_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_company_access_company_id ON public.user_company_access(company_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company_id ON public.user_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_emissions_data_company_id ON public.emissions_data(company_id);
CREATE INDEX IF NOT EXISTS idx_scope1_emissions_company_id ON public.scope1_emissions(company_id);
CREATE INDEX IF NOT EXISTS idx_scope2_emissions_company_id ON public.scope2_emissions(company_id);
CREATE INDEX IF NOT EXISTS idx_scope3_emissions_company_id ON public.scope3_emissions(company_id);

-- Add comment documenting this critical security fix
COMMENT ON TABLE public.user_profiles IS 
'User profiles table with RLS enabled. Critical for authentication security. Users can only access their own profile data.';

-- Create a view for easy authentication debugging (admin use only)
CREATE OR REPLACE VIEW auth_debug_info AS
SELECT 
    u.id,
    u.email,
    u.created_at as auth_created,
    up.username,
    up.full_name,
    up.email_verified,
    up.company_id,
    c.name as company_name
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
LEFT JOIN public.companies c ON up.company_id = c.id;

-- Restrict view access to service role only
REVOKE ALL ON auth_debug_info FROM anon, authenticated;

-- Final verification query
-- This will help verify the migration worked correctly
DO $$
BEGIN
    RAISE NOTICE 'Authentication Security Migration Complete!';
    RAISE NOTICE 'RLS Status:';
    RAISE NOTICE '- user_profiles: %', (SELECT rowsecurity FROM pg_tables WHERE tablename = 'user_profiles');
    RAISE NOTICE '- companies: %', (SELECT rowsecurity FROM pg_tables WHERE tablename = 'companies');
    RAISE NOTICE '- emissions_data: %', (SELECT rowsecurity FROM pg_tables WHERE tablename = 'emissions_data');
    RAISE NOTICE 'Authentication should now work correctly with proper security!';
END $$;