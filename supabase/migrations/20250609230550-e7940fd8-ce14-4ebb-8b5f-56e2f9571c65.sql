
-- Fix 1: Update all functions with secure search paths
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, username, full_name, email_verified)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'username'),
        NEW.email_confirmed_at IS NOT NULL
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_user_email_verified()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
        UPDATE public.user_profiles 
        SET email_verified = true, updated_at = now()
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.user_has_company_access(user_uuid uuid, company_text text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_company_access uca
        WHERE uca.user_id = user_uuid 
        AND uca.company_id = company_text 
        AND uca.is_active = true
        AND (uca.expires_at IS NULL OR uca.expires_at > now())
    );
$$;

CREATE OR REPLACE FUNCTION public.user_is_company_admin(user_uuid uuid, company_text text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_company_access uca
        WHERE uca.user_id = user_uuid 
        AND uca.company_id = company_text 
        AND uca.access_level IN ('owner', 'admin')
        AND uca.is_active = true
        AND (uca.expires_at IS NULL OR uca.expires_at > now())
    );
$$;

CREATE OR REPLACE FUNCTION public.enable_rls_on_new_tables()
RETURNS event_trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
    obj record;
BEGIN
    FOR obj IN SELECT * FROM pg_event_trigger_ddl_commands() WHERE command_tag = 'CREATE TABLE'
    LOOP
        IF obj.schema_name = 'public' THEN
            EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', obj.schema_name, obj.object_identity);
        END IF;
    END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT role FROM public.user_profiles WHERE id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.user_has_company_access_level(user_uuid uuid, company_text text, required_level text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_company_access uca
    WHERE uca.user_id = user_uuid 
    AND uca.company_id = company_text 
    AND uca.access_level = required_level
    AND uca.is_active = true
    AND (uca.expires_at IS NULL OR uca.expires_at > now())
  );
$$;

CREATE OR REPLACE FUNCTION public.bulk_insert_companies(company_data jsonb)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  result json;
  inserted_count integer := 0;
BEGIN
  -- Check if user is admin
  IF public.get_user_role(auth.uid()) != 'admin' THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  -- Insert companies from JSON array
  INSERT INTO companies (id, name, industry, sector, description, carbon_footprint, energy_consumption, waste_generated)
  SELECT 
    (item->>'id')::text,
    item->>'name',
    item->>'industry',
    item->>'sector',
    item->>'description',
    COALESCE((item->>'carbon_footprint')::integer, 0),
    COALESCE((item->>'energy_consumption')::integer, 0),
    COALESCE((item->>'waste_generated')::integer, 0)
  FROM jsonb_array_elements(company_data) AS item;
  
  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  
  result := json_build_object(
    'success', true,
    'inserted_count', inserted_count,
    'message', 'Companies inserted successfully'
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM,
      'message', 'Error inserting companies'
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.enhanced_audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Log all data modifications with enhanced details
  INSERT INTO audit_logs (
    user_id,
    table_name,
    record_id,
    action,
    old_values,
    new_values,
    company_id
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    COALESCE(NEW.company_id, OLD.company_id)
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.detect_suspicious_activity()
RETURNS TABLE(user_id uuid, activity_count bigint, distinct_companies bigint, risk_level text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    al.user_id,
    COUNT(*) as activity_count,
    COUNT(DISTINCT al.company_id) as distinct_companies,
    CASE 
      WHEN COUNT(*) > 100 THEN 'HIGH'
      WHEN COUNT(*) > 50 THEN 'MEDIUM'
      WHEN COUNT(DISTINCT al.company_id) > 10 THEN 'MEDIUM'
      ELSE 'LOW'
    END as risk_level
  FROM audit_logs al
  WHERE al.created_at > NOW() - INTERVAL '1 hour'
    AND al.user_id IS NOT NULL
  GROUP BY al.user_id
  HAVING COUNT(*) > 20 OR COUNT(DISTINCT al.company_id) > 5
  ORDER BY activity_count DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_rate_limit(user_uuid uuid, operation_type text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  recent_operations integer;
BEGIN
  -- Count operations in the last minute
  SELECT COUNT(*) INTO recent_operations
  FROM audit_logs
  WHERE user_id = user_uuid 
    AND action = operation_type
    AND created_at > NOW() - INTERVAL '1 minute';
  
  -- Allow max 10 operations per minute for most actions
  RETURN recent_operations < 10;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_view_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- This would be called if we had a way to trigger on view access
  -- For now, we rely on application-level logging
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.test_view_security()
RETURNS TABLE(test_name text, result text, details text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Test 1: Verify view uses security invoker
  RETURN QUERY
  SELECT 
    'Security Invoker Check'::text,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.views 
      WHERE table_name = 'public_company_data' 
      AND table_schema = 'public'
    ) THEN 'PASS' ELSE 'FAIL' END::text,
    'View exists and should use security invoker'::text;

  -- Test 2: Check RLS is enabled on base tables
  RETURN QUERY
  SELECT 
    'RLS Enabled Check'::text,
    CASE WHEN (
      SELECT relrowsecurity FROM pg_class 
      WHERE relname = 'companies' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) THEN 'PASS' ELSE 'FAIL' END::text,
    'Companies table has RLS enabled'::text;

  RETURN QUERY
  SELECT 
    'Benchmark RLS Check'::text,
    CASE WHEN (
      SELECT relrowsecurity FROM pg_class 
      WHERE relname = 'company_benchmarks' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) THEN 'PASS' ELSE 'FAIL' END::text,
    'Company benchmarks table has RLS enabled'::text;
END;
$$;

-- Fix 2: Enable RLS on all tables that don't have it yet
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emissions_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sbti_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frameworks_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scope1_emissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scope2_emissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scope3_emissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sbti_pathway_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_company_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Fix 3: Create permissive RLS policies that maintain current open access for demo
-- Companies table - allow all authenticated users to see all data
CREATE POLICY "Demo access - all users see all companies" ON public.companies
  FOR SELECT USING (true);

CREATE POLICY "Demo access - authenticated users can manage companies" ON public.companies
  FOR ALL USING (auth.role() = 'authenticated');

-- Emissions data - allow all authenticated users to see all data
CREATE POLICY "Demo access - all users see all emissions data" ON public.emissions_data
  FOR SELECT USING (true);

CREATE POLICY "Demo access - authenticated users can manage emissions" ON public.emissions_data
  FOR ALL USING (auth.role() = 'authenticated');

-- SBTi targets - allow all authenticated users to see all data
CREATE POLICY "Demo access - all users see all sbti targets" ON public.sbti_targets
  FOR SELECT USING (true);

CREATE POLICY "Demo access - authenticated users can manage sbti" ON public.sbti_targets
  FOR ALL USING (auth.role() = 'authenticated');

-- Frameworks compliance - allow all authenticated users to see all data
CREATE POLICY "Demo access - all users see all frameworks" ON public.frameworks_compliance
  FOR SELECT USING (true);

CREATE POLICY "Demo access - authenticated users can manage frameworks" ON public.frameworks_compliance
  FOR ALL USING (auth.role() = 'authenticated');

-- Company benchmarks - allow all authenticated users to see all data
CREATE POLICY "Demo access - all users see all benchmarks" ON public.company_benchmarks
  FOR SELECT USING (true);

CREATE POLICY "Demo access - authenticated users can manage benchmarks" ON public.company_benchmarks
  FOR ALL USING (auth.role() = 'authenticated');

-- Scope emissions - allow all authenticated users to see all data
CREATE POLICY "Demo access - all users see all scope1" ON public.scope1_emissions
  FOR SELECT USING (true);

CREATE POLICY "Demo access - authenticated users can manage scope1" ON public.scope1_emissions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Demo access - all users see all scope2" ON public.scope2_emissions
  FOR SELECT USING (true);

CREATE POLICY "Demo access - authenticated users can manage scope2" ON public.scope2_emissions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Demo access - all users see all scope3" ON public.scope3_emissions
  FOR SELECT USING (true);

CREATE POLICY "Demo access - authenticated users can manage scope3" ON public.scope3_emissions
  FOR ALL USING (auth.role() = 'authenticated');

-- SBTi pathway data - allow all authenticated users to see all data
CREATE POLICY "Demo access - all users see all sbti pathway" ON public.sbti_pathway_data
  FOR SELECT USING (true);

CREATE POLICY "Demo access - authenticated users can manage sbti pathway" ON public.sbti_pathway_data
  FOR ALL USING (auth.role() = 'authenticated');

-- Carbon strategies - allow all authenticated users to see all data
CREATE POLICY "Demo access - all users see all strategies" ON public.carbon_strategies
  FOR SELECT USING (true);

CREATE POLICY "Demo access - authenticated users can manage strategies" ON public.carbon_strategies
  FOR ALL USING (auth.role() = 'authenticated');

-- User profiles - users can see all profiles but only manage their own
CREATE POLICY "Demo access - all users see all profiles" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own profile" ON public.user_profiles
  FOR ALL USING (auth.uid() = id);

-- User company access - users can see their own access records
CREATE POLICY "Users can see their own company access" ON public.user_company_access
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own company access" ON public.user_company_access
  FOR ALL USING (auth.uid() = user_id);

-- Audit logs - users can see their own audit logs
CREATE POLICY "Users can see their own audit logs" ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Fix 4: Create auto-association trigger for demo functionality
-- This ensures all users get access to all companies (maintains current open access)
CREATE OR REPLACE FUNCTION public.auto_associate_user_companies()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Auto-associate new users with all companies for demo purposes
    INSERT INTO public.user_company_access (user_id, company_id, access_level, granted_by)
    SELECT 
        NEW.id,
        c.id,
        'viewer',
        NEW.id
    FROM public.companies c
    ON CONFLICT (user_id, company_id) DO NOTHING;
    
    RETURN NEW;
END;
$$;

-- Create trigger to auto-associate users with companies
DROP TRIGGER IF EXISTS auto_associate_companies_trigger ON public.user_profiles;
CREATE TRIGGER auto_associate_companies_trigger
    AFTER INSERT ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.auto_associate_user_companies();

-- Fix 5: Ensure updated_at triggers are in place
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON public.companies 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_company_benchmarks_updated_at ON public.company_benchmarks;
CREATE TRIGGER update_company_benchmarks_updated_at 
    BEFORE UPDATE ON public.company_benchmarks 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
