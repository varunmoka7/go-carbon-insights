-- Lovable-Compatible Demo Account Setup
-- Created: 2025-01-23
-- This migration avoids direct auth.users manipulation and uses Supabase functions instead

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Ensure user_profiles table exists (create if missing)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    role TEXT DEFAULT 'viewer' CHECK (role IN ('viewer', 'analyst', 'admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    is_demo_account BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Ensure community_users table exists (create if missing)
CREATE TABLE IF NOT EXISTS public.community_users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    display_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
    is_gct_team BOOLEAN DEFAULT false,
    avatar_url TEXT,
    bio TEXT,
    reputation INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Ensure companies table exists for demo association
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    industry TEXT,
    is_demo BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Ensure user_companies table exists
CREATE TABLE IF NOT EXISTS public.user_companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    access_level TEXT DEFAULT 'read' CHECK (access_level IN ('read', 'write', 'admin')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, company_id)
);

-- 5. Create or update trigger for new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role, is_active, email_verified)
    VALUES (
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

    -- Also create community user profile
    INSERT INTO public.community_users (id, email, display_name, role, is_active, email_verified)
    VALUES (
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Update existing user roles (if accounts exist)
UPDATE public.user_profiles 
SET 
    role = 'super_admin',
    full_name = COALESCE(full_name, 'Varun Moka - Platform Admin'),
    is_active = true,
    updated_at = now()
WHERE email = 'varunmoka7@gmail.com';

UPDATE public.user_profiles
SET 
    role = 'super_admin', 
    full_name = COALESCE(full_name, 'Varun Moka - Secondary Admin'),
    is_active = true,
    updated_at = now()
WHERE email = 'varunmoka28@gmail.com';

-- 8. Create demo company (if not exists)
INSERT INTO public.companies (company_id, name, industry, is_demo)
VALUES ('DEMO_001', 'Demo Corporation', 'Technology', true)
ON CONFLICT (company_id) DO NOTHING;

-- 9. Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_companies ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by authenticated users" ON public.user_profiles
    FOR SELECT TO authenticated USING (true);

-- 11. Create RLS policies for companies
CREATE POLICY "Companies are viewable by authenticated users" ON public.companies
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Demo company is accessible to all" ON public.companies
    FOR SELECT TO authenticated USING (is_demo = true);

-- 12. Create RLS policies for community users
CREATE POLICY "Community users can view all profiles" ON public.community_users
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Community users can update own profile" ON public.community_users
    FOR UPDATE USING (auth.uid() = id);

-- 13. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_community_users_email ON public.community_users(email);
CREATE INDEX IF NOT EXISTS idx_companies_company_id ON public.companies(company_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON public.user_companies(user_id);

-- 14. Update trigger for profile updates
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_community_users_updated_at
    BEFORE UPDATE ON public.community_users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 15. Create function to safely create demo user (to be called after migration)
CREATE OR REPLACE FUNCTION public.create_demo_user_if_not_exists()
RETURNS TEXT AS $$
DECLARE
    demo_user_id UUID;
BEGIN
    -- Check if demo user already exists
    SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@gocarbontracker.com';
    
    IF demo_user_id IS NULL THEN
        RETURN 'Demo user needs to be created via Supabase Auth API - cannot create directly via SQL';
    ELSE
        -- Update existing demo user profile
        INSERT INTO public.user_profiles (
            id, email, username, full_name, role, is_active, email_verified, is_demo_account
        ) VALUES (
            demo_user_id,
            'demo@gocarbontracker.com',
            'demo-platform',
            'Demo User - Platform Access',
            'analyst',
            true,
            true,
            true
        ) ON CONFLICT (id) DO UPDATE SET
            role = 'analyst',
            is_demo_account = true,
            updated_at = now();

        -- Update community profile
        UPDATE public.community_users 
        SET 
            username = 'demo-platform',
            display_name = 'Demo User',
            bio = 'Professional demo account for platform exploration',
            reputation = 100,
            updated_at = now()
        WHERE id = demo_user_id;

        -- Associate with demo company
        INSERT INTO public.user_companies (user_id, company_id, access_level)
        SELECT demo_user_id, c.id, 'read'
        FROM public.companies c
        WHERE c.company_id = 'DEMO_001'
        ON CONFLICT (user_id, company_id) DO NOTHING;

        RETURN 'Demo user profile updated successfully';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comment explaining manual demo user creation requirement
COMMENT ON FUNCTION public.create_demo_user_if_not_exists() IS 
'This function sets up demo user profile after the user is created via Supabase Auth API. 
Direct auth.users insertion is not allowed in managed environments.';