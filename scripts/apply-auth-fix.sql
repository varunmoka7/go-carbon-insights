-- Quick SQL script to apply authentication fixes
-- Run this directly in Supabase SQL Editor or via psql

-- First, check current system status
SELECT 'Current System Status' as section;

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('profiles', 'companies') 
AND schemaname = 'public';

-- Check existing triggers
SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    tgenabled as enabled
FROM pg_trigger 
WHERE tgname IN ('on_auth_user_created', 'on_auth_user_email_verified');

-- Now apply the fixes
SELECT 'Applying Authentication Fixes' as section;

-- Drop existing functions and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_email_verified ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_email_verified();

-- Create improved user profile creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    default_username TEXT;
BEGIN
    -- Set secure search path
    SET search_path TO 'public', 'pg_temp';
    
    -- Generate default username
    default_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'display_name', 
        split_part(NEW.email, '@', 1)
    );
    
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
        default_username,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            default_username
        ),
        CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN TRUE ELSE FALSE END,
        TRUE,
        'user'
    );
    
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Handle username conflicts
        INSERT INTO public.profiles (
            id, email, username, full_name, email_verified, is_active, role
        ) VALUES (
            NEW.id, NEW.email, 
            default_username || '_' || substring(NEW.id::text, 1, 8),
            COALESCE(NEW.raw_user_meta_data->>'full_name', default_username),
            CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN TRUE ELSE FALSE END,
            TRUE, 'user'
        );
        RETURN NEW;
    WHEN OTHERS THEN
        RAISE LOG 'Error creating user profile for %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create email verification function
CREATE OR REPLACE FUNCTION public.handle_user_email_verified()
RETURNS trigger AS $$
BEGIN
    SET search_path TO 'public', 'pg_temp';
    
    UPDATE public.profiles 
    SET email_verified = TRUE, updated_at = NOW()
    WHERE id = NEW.id;
    
    RAISE LOG 'Email verified for user %', NEW.id;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error updating email verification for %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_email_verified
    AFTER UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW 
    WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
    EXECUTE FUNCTION public.handle_user_email_verified();

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.companies TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create missing profiles for existing users
WITH existing_users AS (
    SELECT u.id, u.email, u.raw_user_meta_data, u.email_confirmed_at
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE p.id IS NULL
)
INSERT INTO public.profiles (id, email, username, full_name, email_verified, is_active, role)
SELECT 
    id,
    email,
    COALESCE(
        raw_user_meta_data->>'username',
        raw_user_meta_data->>'display_name',
        split_part(email, '@', 1)
    ) || CASE 
        WHEN EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE username = COALESCE(
                existing_users.raw_user_meta_data->>'username',
                split_part(existing_users.email, '@', 1)
            )
        ) THEN '_' || substring(id::text, 1, 8)
        ELSE ''
    END,
    COALESCE(
        raw_user_meta_data->>'full_name',
        raw_user_meta_data->>'name',
        split_part(email, '@', 1)
    ),
    CASE WHEN email_confirmed_at IS NOT NULL THEN TRUE ELSE FALSE END,
    TRUE,
    'user'
FROM existing_users;

-- Final verification
SELECT 'Authentication Fix Applied Successfully!' as result;

SELECT 
    'Trigger Status' as check_type,
    tgname as name,
    tgrelid::regclass as table_name,
    CASE WHEN tgenabled = 'O' THEN 'Enabled' ELSE 'Disabled' END as status
FROM pg_trigger 
WHERE tgname IN ('on_auth_user_created', 'on_auth_user_email_verified')

UNION ALL

SELECT 
    'RLS Policy Status' as check_type,
    policyname as name,
    tablename as table_name,
    'Active' as status
FROM pg_policies 
WHERE tablename = 'profiles' 
AND policyname LIKE '%own profile%'

UNION ALL

SELECT 
    'User Count' as check_type,
    'Auth Users' as name,
    COUNT(*)::text as table_name,
    'Total' as status
FROM auth.users

UNION ALL

SELECT 
    'User Count' as check_type,
    'Profile Records' as name,
    COUNT(*)::text as table_name,
    'Total' as status
FROM public.profiles;

SELECT 'Email verification system is now fully operational!' as final_message;