-- Setup Admin Accounts and Professional Demo Account
-- Created: 2025-01-23

-- 1. Upgrade existing user accounts to admin roles
UPDATE user_profiles 
SET 
  role = 'super_admin',
  full_name = COALESCE(full_name, 'Varun Moka - Platform Admin'),
  is_active = true,
  updated_at = now()
WHERE email = 'varunmoka7@gmail.com';

UPDATE user_profiles
SET 
  role = 'super_admin', 
  full_name = COALESCE(full_name, 'Varun Moka - Secondary Admin'),
  is_active = true,
  updated_at = now()
WHERE email = 'varunmoka28@gmail.com';

-- 2. Create professional demo user in auth.users (if not exists)
INSERT INTO auth.users (
  instance_id, 
  id, 
  aud, 
  role, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  recovery_token, 
  recovery_sent_at, 
  last_sign_in_at, 
  raw_app_meta_data, 
  raw_user_meta_data, 
  created_at, 
  updated_at, 
  confirmation_token, 
  email_change, 
  email_change_sent_at, 
  confirmed_at
)
SELECT 
  COALESCE(current_setting('app.instance_id', true)::uuid, '00000000-0000-0000-0000-000000000000'::uuid),
  gen_random_uuid(),
  'authenticated',
  'authenticated', 
  'demo@gocarbontracker.com',
  crypt('DemoAccess2024', gen_salt('bf')),
  now(),
  '',
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"analyst","is_demo":true}',
  now(),
  now(),
  '',
  '',
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'demo@gocarbontracker.com'
);

-- 3. Create user profile for demo account
INSERT INTO user_profiles (
  id,
  email,
  username,
  full_name,
  role,
  is_active,
  email_verified,
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
  now(),
  now()
FROM auth.users u
WHERE u.email = 'demo@gocarbontracker.com'
AND NOT EXISTS (
  SELECT 1 FROM community_users WHERE email = 'demo@gocarbontracker.com'
);

-- 5. Drop existing policies if they exist and create new ones
DROP POLICY IF EXISTS "Demo account can access demo data" ON companies;
DROP POLICY IF EXISTS "Demo account can access all public data" ON companies;

-- 6. Create RLS policy for demo account access
CREATE POLICY "Demo account can access demo data"
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
CREATE POLICY "Demo account can access all public data"
ON companies
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'analyst'
    AND user_profiles.email = 'demo@gocarbontracker.com'
  )
);