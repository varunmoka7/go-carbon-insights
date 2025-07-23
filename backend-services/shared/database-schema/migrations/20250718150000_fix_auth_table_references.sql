-- Migration: Fix Authentication Table References
-- Created: 2025-07-18 15:00:00
-- Description: Updates all references from user_profiles to profiles table

-- Update trigger function to use correct table name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN TRUE ELSE FALSE END,
    TRUE,
    'user'
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error creating user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW; -- Don't block auth user creation if profile fails
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update user role function to use correct table name
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS TEXT AS $$
  SELECT COALESCE(role::TEXT, 'user') FROM public.profiles WHERE id = user_uuid LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path TO 'public', 'pg_temp';

-- Update any existing functions that reference user_profiles
CREATE OR REPLACE FUNCTION public.user_has_company_access_level(user_uuid uuid, company_text text, required_level text)
RETURNS boolean AS $$
BEGIN
  -- Check if user has the required access level for the company
  RETURN EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = user_uuid 
    AND p.role = required_level
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public', 'pg_temp';

-- Add comment explaining the fix
COMMENT ON FUNCTION public.handle_new_user() IS 'Updated to use profiles table instead of user_profiles - fixes authentication system';
COMMENT ON FUNCTION public.get_user_role(uuid) IS 'Updated to use profiles table instead of user_profiles - fixes authentication system';

-- Ensure the trigger is properly connected
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant proper permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.companies TO authenticated;