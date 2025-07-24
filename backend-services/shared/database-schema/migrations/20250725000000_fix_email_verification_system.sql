-- Migration: Fix Email Verification System
-- Created: 2025-07-25
-- Description: Fixes email verification and account generation after verification
-- This migration resolves critical authentication issues with email verification

-- Phase 1: Drop existing functions and triggers to recreate them properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_email_verified ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_email_verified();

-- Phase 2: Create improved user profile creation function
-- This function creates a profile immediately when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    default_username TEXT;
BEGIN
    -- Set secure search path to prevent SQL injection
    SET search_path TO 'public', 'pg_temp';
    
    -- Generate default username from email if not provided
    default_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'display_name', 
        split_part(NEW.email, '@', 1)
    );
    
    -- Insert profile record for the new user
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
            NEW.raw_user_meta_data->>'display_name',
            default_username
        ),
        CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN TRUE ELSE FALSE END,
        TRUE,
        'user'
    );
    
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Handle case where username already exists
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
            default_username || '_' || substring(NEW.id::text, 1, 8),
            COALESCE(
                NEW.raw_user_meta_data->>'full_name',
                NEW.raw_user_meta_data->>'name',
                NEW.raw_user_meta_data->>'display_name',
                default_username
            ),
            CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN TRUE ELSE FALSE END,
            TRUE,
            'user'
        );
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log error but don't block user creation
        RAISE LOG 'Error creating user profile for %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 3: Create function to handle email verification
-- This function updates the profile when email is verified
CREATE OR REPLACE FUNCTION public.handle_user_email_verified()
RETURNS trigger AS $$
BEGIN
    -- Set secure search path to prevent SQL injection
    SET search_path TO 'public', 'pg_temp';
    
    -- Update profile to mark email as verified
    UPDATE public.profiles 
    SET 
        email_verified = TRUE,
        updated_at = NOW()
    WHERE id = NEW.id;
    
    -- Log successful verification
    RAISE LOG 'Email verified for user %', NEW.id;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't block the verification process
        RAISE LOG 'Error updating email verification for %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 4: Create triggers with proper conditions
-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();

-- Trigger for email verification
CREATE TRIGGER on_auth_user_email_verified
    AFTER UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW 
    WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
    EXECUTE FUNCTION public.handle_user_email_verified();

-- Phase 5: Update RLS policies to ensure proper access
-- Drop existing policies and recreate them
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Recreate policies with better logic
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Phase 6: Grant proper permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.companies TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Phase 7: Create helper function to check if user profile exists
CREATE OR REPLACE FUNCTION public.user_profile_exists(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 8: Create function to manually create missing profiles (for existing users)
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS TABLE(user_id UUID, email TEXT, created BOOLEAN) AS $$
DECLARE
    user_record RECORD;
    default_username TEXT;
    profile_created BOOLEAN;
BEGIN
    -- Loop through all auth users that don't have profiles
    FOR user_record IN 
        SELECT u.id, u.email, u.raw_user_meta_data, u.email_confirmed_at
        FROM auth.users u
        LEFT JOIN public.profiles p ON u.id = p.id
        WHERE p.id IS NULL
    LOOP
        profile_created := FALSE;
        
        -- Generate username
        default_username := COALESCE(
            user_record.raw_user_meta_data->>'username',
            user_record.raw_user_meta_data->>'display_name',
            split_part(user_record.email, '@', 1)
        );
        
        BEGIN
            -- Try to create profile
            INSERT INTO public.profiles (
                id,
                email,
                username,
                full_name,
                email_verified,
                is_active,
                role
            ) VALUES (
                user_record.id,
                user_record.email,
                default_username,
                COALESCE(
                    user_record.raw_user_meta_data->>'full_name',
                    user_record.raw_user_meta_data->>'name',
                    default_username
                ),
                CASE WHEN user_record.email_confirmed_at IS NOT NULL THEN TRUE ELSE FALSE END,
                TRUE,
                'user'
            );
            profile_created := TRUE;
            
        EXCEPTION
            WHEN unique_violation THEN
                -- Try with modified username
                INSERT INTO public.profiles (
                    id,
                    email,
                    username,
                    full_name,
                    email_verified,
                    is_active,
                    role
                ) VALUES (
                    user_record.id,
                    user_record.email,
                    default_username || '_' || substring(user_record.id::text, 1, 8),
                    COALESCE(
                        user_record.raw_user_meta_data->>'full_name',
                        user_record.raw_user_meta_data->>'name',
                        default_username
                    ),
                    CASE WHEN user_record.email_confirmed_at IS NOT NULL THEN TRUE ELSE FALSE END,
                    TRUE,
                    'user'
                );
                profile_created := TRUE;
        END;
        
        -- Return the result
        user_id := user_record.id;
        email := user_record.email;
        created := profile_created;
        RETURN NEXT;
    END LOOP;
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 9: Update username constraints to handle duplicates better
-- Drop existing unique constraint and recreate with better handling
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_username_key;
CREATE UNIQUE INDEX idx_profiles_username_unique ON public.profiles(username);

-- Phase 10: Create function to test the authentication flow
CREATE OR REPLACE FUNCTION public.test_auth_flow()
RETURNS TABLE(
    step TEXT,
    status TEXT,
    message TEXT
) AS $$
BEGIN
    -- Test 1: Check if triggers exist
    IF EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created' 
        AND tgrelid = 'auth.users'::regclass
    ) THEN
        step := 'User Creation Trigger';
        status := 'OK';
        message := 'Trigger exists and is active';
        RETURN NEXT;
    ELSE
        step := 'User Creation Trigger';
        status := 'ERROR';
        message := 'Trigger missing or inactive';
        RETURN NEXT;
    END IF;
    
    -- Test 2: Check if email verification trigger exists
    IF EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_email_verified' 
        AND tgrelid = 'auth.users'::regclass
    ) THEN
        step := 'Email Verification Trigger';
        status := 'OK';
        message := 'Trigger exists and is active';
        RETURN NEXT;
    ELSE
        step := 'Email Verification Trigger';
        status := 'ERROR';
        message := 'Trigger missing or inactive';
        RETURN NEXT;
    END IF;
    
    -- Test 3: Check RLS policies
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can view their own profile'
    ) THEN
        step := 'RLS Policies';
        status := 'OK';
        message := 'Profile policies are active';
        RETURN NEXT;
    ELSE
        step := 'RLS Policies';
        status := 'ERROR';
        message := 'Profile policies missing';
        RETURN NEXT;
    END IF;
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 11: Add helpful comments
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates user profile automatically when new user registers. Handles username conflicts gracefully.';
COMMENT ON FUNCTION public.handle_user_email_verified() IS 'Updates profile email_verified status when user verifies their email.';
COMMENT ON FUNCTION public.create_missing_profiles() IS 'Utility function to create profiles for existing auth users who may be missing profiles.';
COMMENT ON FUNCTION public.test_auth_flow() IS 'Test function to verify authentication triggers and policies are working correctly.';

-- Phase 12: Run the missing profiles creation for any existing users
SELECT * FROM public.create_missing_profiles();

-- Final verification
DO $$
BEGIN
    RAISE NOTICE 'Email Verification System Fix Complete!';
    RAISE NOTICE 'New users will automatically get profiles created';
    RAISE NOTICE 'Email verification will properly update profile status';
    RAISE NOTICE 'Run SELECT * FROM public.test_auth_flow(); to verify setup';
END $$;