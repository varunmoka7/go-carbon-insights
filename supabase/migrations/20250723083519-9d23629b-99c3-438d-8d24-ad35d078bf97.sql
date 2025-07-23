-- Add super_admin role to the valid roles constraint
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_role_check,
DROP CONSTRAINT IF EXISTS user_profiles_valid_role;

-- Create new role constraint that includes super_admin
ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_role_check 
CHECK (role = ANY (ARRAY['user'::text, 'admin'::text, 'super_admin'::text, 'company_admin'::text, 'analyst'::text, 'moderator'::text]));

-- Now proceed with the admin account setup
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

-- Create professional demo user in auth.users (if not exists)
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

-- Create user profile for demo account
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

-- Create community user profile for demo account
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