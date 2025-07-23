-- Setup Admin Accounts and Professional Demo Account (DEPRECATED)
-- Created: 2025-01-23
-- NOTE: This migration is deprecated. Use 20250723000001_lovable_compatible_demo_setup.sql instead

-- 1. Upgrade existing user accounts to admin roles (safe operations only)
UPDATE public.user_profiles 
SET 
  role = 'super_admin',
  full_name = COALESCE(full_name, 'Varun Moka - Platform Admin'),
  is_active = true,
  updated_at = now()
WHERE email = 'varunmoka7@gmail.com' 
AND EXISTS (SELECT 1 FROM public.user_profiles WHERE email = 'varunmoka7@gmail.com');

UPDATE public.user_profiles
SET 
  role = 'super_admin', 
  full_name = COALESCE(full_name, 'Varun Moka - Secondary Admin'),
  is_active = true,
  updated_at = now()
WHERE email = 'varunmoka28@gmail.com'
AND EXISTS (SELECT 1 FROM public.user_profiles WHERE email = 'varunmoka28@gmail.com');

-- 2. DEPRECATED: Demo user creation moved to separate approach
-- Direct auth.users manipulation not allowed in managed environments like Lovable
-- Use the create-demo-user.js script or Supabase Auth API instead

-- Placeholder comment: Demo user creation requires Supabase Auth API
SELECT 'Demo user creation requires Supabase Auth API or admin functions' as notice;

-- 3. Create user profile for demo account
INSERT INTO user_profiles (
  id,
  email,
  username,
  full_name,
  role,
  is_active,
  email_verified,
  is_demo_account,
  created_at,
  updated_at
)
SELECT 
  u.id,
  'demo@gocarbontracker.com',
  'demo-platform',
  'Demo User - Platform Access',
  'analyst',
  true,
  true,
  true,
  now(),
  now()
FROM auth.users u
WHERE u.email = 'demo@gocarbontracker.com'
AND NOT EXISTS (
  SELECT 1 FROM user_profiles WHERE email = 'demo@gocarbontracker.com'
);

-- 4. Create community user profile for demo account (for forum access)
INSERT INTO community_users (
  id,
  email,
  username,
  display_name,
  role,
  is_gct_team,
  avatar_url,
  bio,
  reputation,
  is_active,
  email_verified,
  created_at,
  updated_at
)
SELECT 
  u.id,
  'demo@gocarbontracker.com',
  'demo-platform',
  'Demo User',
  'user',
  false,
  null,
  'Professional demo account for platform exploration',
  100,
  true,
  true,
  now(),
  now()
FROM auth.users u
WHERE u.email = 'demo@gocarbontracker.com'
AND NOT EXISTS (
  SELECT 1 FROM community_users WHERE email = 'demo@gocarbontracker.com'
);

-- 5. Associate demo user with demo company (if demo company exists)
INSERT INTO user_companies (user_id, company_id, access_level, created_at)
SELECT 
  up.id,
  c.id,
  'read',
  now()
FROM user_profiles up
CROSS JOIN companies c
WHERE up.email = 'demo@gocarbontracker.com'
AND c.company_id = 'DEMO_001'
AND NOT EXISTS (
  SELECT 1 FROM user_companies 
  WHERE user_id = up.id AND company_id = c.id
);

-- 6. Create RLS policy for demo account access
CREATE POLICY IF NOT EXISTS "Demo account can access demo data"
ON companies
FOR SELECT
TO authenticated
USING (
  company_id = 'DEMO_001' 
  OR EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.email = 'demo@gocarbontracker.com'
  )
);

-- 7. Grant demo account access to public data
CREATE POLICY IF NOT EXISTS "Demo account can access all public data"
ON companies
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.is_demo_account = true
  )
);

-- Log the migration completion
INSERT INTO migration_log (migration_name, executed_at, description)
VALUES (
  '20250723000000_setup_admin_and_demo_accounts',
  now(),
  'Setup admin accounts for varunmoka7@gmail.com and varunmoka28@gmail.com, created professional demo account at demo@gocarbontracker.com'
)
ON CONFLICT (migration_name) DO NOTHING;