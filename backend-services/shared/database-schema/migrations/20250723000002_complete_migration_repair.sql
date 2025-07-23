-- Complete Migration Repair for Lovable Environment
-- Created: 2025-01-23
-- Addresses all issues identified in Lovable diagnosis report

-- ============================================================================
-- 1. CORE TABLE CREATION WITH PROPER CONSTRAINTS
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create user_profiles table with proper constraints
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    role TEXT DEFAULT 'viewer' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    email_verified BOOLEAN DEFAULT false NOT NULL,
    is_demo_account BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    -- CRITICAL: Proper role constraint including super_admin
    CONSTRAINT valid_role CHECK (role IN ('viewer', 'analyst', 'admin', 'super_admin', 'moderator'))
);

-- Create community_users table
CREATE TABLE IF NOT EXISTS public.community_users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    display_name TEXT,
    role TEXT DEFAULT 'user' NOT NULL,
    is_gct_team BOOLEAN DEFAULT false NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    reputation INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    email_verified BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT valid_community_role CHECK (role IN ('user', 'moderator', 'admin'))
);

-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    industry TEXT,
    is_demo BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create user_companies table
CREATE TABLE IF NOT EXISTS public.user_companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    access_level TEXT DEFAULT 'read' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT valid_access_level CHECK (access_level IN ('read', 'write', 'admin')),
    UNIQUE(user_id, company_id)
);

-- ============================================================================
-- 2. FIX EXISTING CONSTRAINT ISSUES
-- ============================================================================

-- Drop and recreate role constraint if it exists with wrong values
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS valid_role;

-- Add the correct constraint
ALTER TABLE public.user_profiles 
ADD CONSTRAINT valid_role CHECK (role IN ('viewer', 'analyst', 'admin', 'super_admin', 'moderator'));

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY (CRITICAL SECURITY FIX)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_companies ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. CREATE COMPREHENSIVE RLS POLICIES
-- ============================================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.user_profiles;
DROP POLICY IF EXISTS "Companies are viewable by authenticated users" ON public.companies;
DROP POLICY IF EXISTS "Demo company is accessible to all" ON public.companies;
DROP POLICY IF EXISTS "Community users can view all profiles" ON public.community_users;
DROP POLICY IF EXISTS "Community users can update own profile" ON public.community_users;

-- User Profiles Policies
CREATE POLICY "user_profiles_select_own" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "user_profiles_update_own" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "user_profiles_select_authenticated" ON public.user_profiles
    FOR SELECT TO authenticated USING (true);

-- Companies Policies
CREATE POLICY "companies_select_authenticated" ON public.companies
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "companies_select_demo" ON public.companies
    FOR SELECT TO authenticated USING (is_demo = true);

-- Admin access to companies
CREATE POLICY "companies_admin_access" ON public.companies
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role IN ('admin', 'super_admin')
        )
    );

-- Community Users Policies
CREATE POLICY "community_users_select_all" ON public.community_users
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "community_users_update_own" ON public.community_users
    FOR UPDATE USING (auth.uid() = id);

-- User Companies Policies
CREATE POLICY "user_companies_select_own" ON public.user_companies
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_companies_admin_access" ON public.user_companies
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role IN ('admin', 'super_admin')
        )
    );

-- ============================================================================
-- 5. CREATE SECURE FUNCTIONS WITH PROPER SEARCH PATH
-- ============================================================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert into user_profiles
    INSERT INTO public.user_profiles (
        id, 
        email, 
        full_name, 
        role, 
        is_active, 
        email_verified
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'viewer'),
        true,
        NEW.email_confirmed_at IS NOT NULL
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        email_verified = EXCLUDED.email_verified,
        updated_at = now();

    -- Insert into community_users
    INSERT INTO public.community_users (
        id, 
        email, 
        display_name, 
        role, 
        is_active, 
        email_verified
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'user',
        true,
        NEW.email_confirmed_at IS NOT NULL
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        email_verified = EXCLUDED.email_verified,
        updated_at = now();

    RETURN NEW;
END;
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- ============================================================================
-- 6. CREATE TRIGGERS
-- ============================================================================

-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_community_users_updated_at ON public.community_users;

-- Create new user trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create update triggers
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_community_users_updated_at
    BEFORE UPDATE ON public.community_users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- 7. CREATE ESSENTIAL INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_demo ON public.user_profiles(is_demo_account);
CREATE INDEX IF NOT EXISTS idx_community_users_email ON public.community_users(email);
CREATE INDEX IF NOT EXISTS idx_community_users_username ON public.community_users(username);
CREATE INDEX IF NOT EXISTS idx_companies_company_id ON public.companies(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_is_demo ON public.companies(is_demo);
CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON public.user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON public.user_companies(company_id);

-- ============================================================================
-- 8. CREATE DEMO COMPANY DATA
-- ============================================================================

-- Insert demo company
INSERT INTO public.companies (company_id, name, industry, is_demo)
VALUES ('DEMO_001', 'Demo Corporation', 'Technology', true)
ON CONFLICT (company_id) DO UPDATE SET
    name = EXCLUDED.name,
    industry = EXCLUDED.industry,
    is_demo = EXCLUDED.is_demo,
    updated_at = now();

-- ============================================================================
-- 9. FIX ADMIN ACCOUNTS (SAFE OPERATIONS)
-- ============================================================================

-- Function to safely update admin roles
CREATE OR REPLACE FUNCTION public.setup_admin_accounts()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result_text TEXT := '';
    admin1_exists BOOLEAN := false;
    admin2_exists BOOLEAN := false;
BEGIN
    -- Check if admin accounts exist in auth.users first
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'varunmoka7@gmail.com') INTO admin1_exists;
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'varunmoka28@gmail.com') INTO admin2_exists;
    
    -- Update varunmoka7@gmail.com if exists
    IF admin1_exists THEN
        INSERT INTO public.user_profiles (
            id, email, full_name, role, is_active, email_verified
        ) 
        SELECT 
            id, 
            email, 
            'Varun Moka - Platform Admin', 
            'super_admin', 
            true, 
            email_confirmed_at IS NOT NULL
        FROM auth.users 
        WHERE email = 'varunmoka7@gmail.com'
        ON CONFLICT (id) DO UPDATE SET
            role = 'super_admin',
            full_name = 'Varun Moka - Platform Admin',
            is_active = true,
            updated_at = now();
        
        result_text := result_text || 'varunmoka7@gmail.com updated to super_admin; ';
    ELSE
        result_text := result_text || 'varunmoka7@gmail.com not found in auth.users; ';
    END IF;
    
    -- Update varunmoka28@gmail.com if exists
    IF admin2_exists THEN
        INSERT INTO public.user_profiles (
            id, email, full_name, role, is_active, email_verified
        ) 
        SELECT 
            id, 
            email, 
            'Varun Moka - Secondary Admin', 
            'super_admin', 
            true, 
            email_confirmed_at IS NOT NULL
        FROM auth.users 
        WHERE email = 'varunmoka28@gmail.com'
        ON CONFLICT (id) DO UPDATE SET
            role = 'super_admin',
            full_name = 'Varun Moka - Secondary Admin',
            is_active = true,
            updated_at = now();
        
        result_text := result_text || 'varunmoka28@gmail.com updated to super_admin; ';
    ELSE
        result_text := result_text || 'varunmoka28@gmail.com not found in auth.users; ';
    END IF;
    
    RETURN result_text;
END;
$$;

-- Execute admin setup
SELECT public.setup_admin_accounts();

-- ============================================================================
-- 10. CREATE DEMO USER SETUP FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.setup_demo_user(demo_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    demo_company_id UUID;
BEGIN
    -- Insert/update demo user profile
    INSERT INTO public.user_profiles (
        id, 
        email, 
        username, 
        full_name, 
        role, 
        is_active, 
        email_verified, 
        is_demo_account
    ) VALUES (
        demo_user_id,
        'demo@gocarbontracker.com',
        'demo-platform',
        'Demo User - Platform Access',
        'analyst',
        true,
        true,
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'analyst',
        is_demo_account = true,
        username = 'demo-platform',
        full_name = 'Demo User - Platform Access',
        updated_at = now();

    -- Insert/update community user profile
    INSERT INTO public.community_users (
        id, 
        email, 
        username, 
        display_name, 
        bio, 
        reputation, 
        is_active, 
        email_verified
    ) VALUES (
        demo_user_id,
        'demo@gocarbontracker.com',
        'demo-platform',
        'Demo User',
        'Professional demo account for platform exploration',
        100,
        true,
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        username = 'demo-platform',
        display_name = 'Demo User',
        bio = 'Professional demo account for platform exploration',
        reputation = 100,
        updated_at = now();

    -- Associate with demo company
    SELECT id INTO demo_company_id FROM public.companies WHERE company_id = 'DEMO_001';
    
    IF demo_company_id IS NOT NULL THEN
        INSERT INTO public.user_companies (user_id, company_id, access_level)
        VALUES (demo_user_id, demo_company_id, 'read')
        ON CONFLICT (user_id, company_id) DO NOTHING;
    END IF;

    RETURN 'Demo user profile setup completed successfully';
END;
$$;

-- ============================================================================
-- 11. GRANT NECESSARY PERMISSIONS
-- ============================================================================

-- Grant usage on sequences if they exist
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.setup_demo_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.setup_admin_accounts() TO authenticated;

-- ============================================================================
-- 12. FINAL STATUS CHECK
-- ============================================================================

-- Create a view to check migration status
CREATE OR REPLACE VIEW public.migration_status AS
SELECT 
    'Tables Created' as component,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public') 
         THEN 'OK' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'RLS Enabled',
    CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'user_profiles' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'))
         THEN 'OK' ELSE 'DISABLED' END
UNION ALL
SELECT 
    'Role Constraint',
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'valid_role')
         THEN 'OK' ELSE 'MISSING' END
UNION ALL
SELECT 
    'Demo Company',
    CASE WHEN EXISTS(SELECT 1 FROM public.companies WHERE company_id = 'DEMO_001')
         THEN 'OK' ELSE 'MISSING' END;

-- Final success message
SELECT 'Complete migration repair executed successfully - ready for demo user creation' as migration_result;