
-- Fix infinite recursion in RLS policies - handle existing policies properly

-- Drop all existing policies on user_company_access (using CASCADE to handle dependencies)
DROP POLICY IF EXISTS "Users can see their own company access" ON public.user_company_access;
DROP POLICY IF EXISTS "Users can manage their own company access" ON public.user_company_access;
DROP POLICY IF EXISTS "Company owners can manage access" ON public.user_company_access;
DROP POLICY IF EXISTS "Users can view their own company access" ON public.user_company_access;
DROP POLICY IF EXISTS "Users can view their own access" ON public.user_company_access;
DROP POLICY IF EXISTS "Users can create their own access" ON public.user_company_access;
DROP POLICY IF EXISTS "Users can update their own access" ON public.user_company_access;
DROP POLICY IF EXISTS "Users can delete their own access" ON public.user_company_access;
DROP POLICY IF EXISTS "Admins can manage all access" ON public.user_company_access;

-- Now create clean, simple policies
CREATE POLICY "view_own_access" ON public.user_company_access
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "insert_own_access" ON public.user_company_access
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_access" ON public.user_company_access
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "delete_own_access" ON public.user_company_access
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Admin policy using security definer function
CREATE POLICY "admin_manage_all" ON public.user_company_access
  FOR ALL 
  USING (public.get_user_role(auth.uid()) = 'admin');

-- Fix audit logs policies
DROP POLICY IF EXISTS "Users can see their own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;

CREATE POLICY "view_own_audit_logs" ON public.audit_logs
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Update the get_user_role function to be more robust
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT COALESCE(role, 'user') FROM public.user_profiles WHERE id = user_uuid LIMIT 1;
$$;
