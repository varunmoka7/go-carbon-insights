-- Complete Authentication System Setup (Fixed for existing companies table)
-- This handles the case where companies table exists with text id

-- Step 1: Create the profiles table without the foreign key constraint first
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    username TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('viewer', 'analyst', 'admin', 'super_admin', 'user')),
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    company_id TEXT, -- Using TEXT to match existing companies table
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON public.profiles(company_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 2: Check what type the companies.id column is and add appropriate foreign key
DO $$
DECLARE
    companies_id_type TEXT;
BEGIN
    -- Get the data type of companies.id
    SELECT data_type INTO companies_id_type
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'companies' 
    AND column_name = 'id';
    
    -- Add foreign key constraint based on the actual type
    IF companies_id_type = 'text' THEN
        -- Companies table uses TEXT id, so our profiles.company_id should be TEXT
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'profiles_company_id_fkey'
        ) THEN
            ALTER TABLE public.profiles 
            ADD CONSTRAINT profiles_company_id_fkey 
            FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;
        END IF;
        RAISE NOTICE 'Foreign key created with TEXT type to match existing companies table';
    ELSIF companies_id_type = 'uuid' THEN
        -- If companies table uses UUID, we need to change our column type
        ALTER TABLE public.profiles ALTER COLUMN company_id TYPE UUID USING company_id::UUID;
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'profiles_company_id_fkey'
        ) THEN
            ALTER TABLE public.profiles 
            ADD CONSTRAINT profiles_company_id_fkey 
            FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;
        END IF;
        RAISE NOTICE 'Foreign key created with UUID type to match existing companies table';
    ELSE
        RAISE NOTICE 'Companies table not found or has unexpected id type: %', companies_id_type;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not create foreign key constraint: %', SQLERRM;
END $$;

-- Step 3: Drop existing functions and triggers (if any)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_email_verified ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_email_verified();

-- Step 4: Create improved user profile creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    default_username TEXT;
    final_username TEXT;
    username_suffix INTEGER := 0;
BEGIN
    -- Set secure search path
    SET search_path TO 'public', 'pg_temp';
    
    -- Generate default username from metadata or email
    default_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'display_name', 
        split_part(NEW.email, '@', 1)
    );
    
    -- Clean username (remove special characters, make lowercase)
    default_username := lower(regexp_replace(default_username, '[^a-zA-Z0-9_]', '', 'g'));
    
    -- Ensure username is not empty
    IF default_username = '' OR default_username IS NULL THEN
        default_username := 'user_' || substring(NEW.id::text, 1, 8);
    END IF;
    
    final_username := default_username;
    
    -- Handle username conflicts with loop
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
        username_suffix := username_suffix + 1;
        final_username := default_username || '_' || username_suffix;
    END LOOP;
    
    -- Insert profile record
    INSERT INTO public.profiles (
        id,
        email,
        username,
        full_name,
        email_verified,
        is_active,
        role
    ) VALUES (
        NEW.id,
        NEW.email,
        final_username,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            final_username
        ),
        CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN TRUE ELSE FALSE END,
        TRUE,
        'user'
    );
    
    RAISE LOG 'Created profile for user % with username %', NEW.email, final_username;
    RETURN NEW;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error creating user profile for %: %', NEW.id, SQLERRM;
        RETURN NEW; -- Don't block user creation if profile fails
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create email verification function
CREATE OR REPLACE FUNCTION public.handle_user_email_verified()
RETURNS trigger AS $$
BEGIN
    SET search_path TO 'public', 'pg_temp';
    
    -- Update profile to mark email as verified
    UPDATE public.profiles 
    SET 
        email_verified = TRUE,
        updated_at = NOW()
    WHERE id = NEW.id;
    
    RAISE LOG 'Email verified for user %', NEW.id;
    RETURN NEW;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error updating email verification for %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_email_verified
    AFTER UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW 
    WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
    EXECUTE FUNCTION public.handle_user_email_verified();

-- Step 7: Create RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 8: Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.companies TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Step 9: Create profiles for any existing auth users
INSERT INTO public.profiles (id, email, username, full_name, email_verified, is_active, role)
SELECT 
    u.id,
    u.email,
    COALESCE(
        u.raw_user_meta_data->>'username',
        split_part(u.email, '@', 1)
    ) || CASE 
        WHEN EXISTS (
            SELECT 1 FROM public.profiles p2 
            WHERE p2.username = COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1))
        ) THEN '_' || substring(u.id::text, 1, 8)
        ELSE ''
    END,
    COALESCE(
        u.raw_user_meta_data->>'full_name',
        u.raw_user_meta_data->>'name',
        split_part(u.email, '@', 1)
    ),
    CASE WHEN u.email_confirmed_at IS NOT NULL THEN TRUE ELSE FALSE END,
    TRUE,
    'user'
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (username) DO NOTHING; -- Handle any remaining conflicts gracefully

-- Step 10: Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 11: Final verification and status check
SELECT 'AUTHENTICATION SYSTEM SETUP COMPLETE!' as status;

-- Detailed system check
SELECT 
    'Table Status' as check_type,
    tablename as name,
    CASE WHEN rowsecurity THEN 'RLS Enabled' ELSE 'RLS Disabled' END as status
FROM pg_tables 
WHERE tablename IN ('profiles', 'companies') 
AND schemaname = 'public'

UNION ALL

-- Check triggers exist and are enabled
SELECT 
    'Trigger Status' as check_type,
    tgname as name,
    CASE WHEN tgenabled = 'O' THEN 'Enabled' ELSE 'Disabled' END as status
FROM pg_trigger 
WHERE tgname IN ('on_auth_user_created', 'on_auth_user_email_verified')

UNION ALL

-- Check policies exist
SELECT 
    'Policy Status' as check_type,
    policyname as name,
    'Active' as status
FROM pg_policies 
WHERE tablename = 'profiles' 
AND policyname LIKE '%own profile%'
LIMIT 3

UNION ALL

-- Check user counts
SELECT 
    'User Count' as check_type,
    'Auth Users' as name,
    COUNT(*)::text as status
FROM auth.users

UNION ALL

SELECT 
    'User Count' as check_type,
    'Profile Records' as name,
    COUNT(*)::text as status
FROM public.profiles;

-- Final success message
SELECT 'SUCCESS: Users can now register with email verification!' as final_message;
SELECT 'Next step: Test the signup flow on your website' as next_step;