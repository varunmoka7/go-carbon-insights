-- Create a script to set up the demo account properly
-- This creates a user that can actually authenticate

DO $$
DECLARE
  demo_user_email TEXT := 'test@gocarbontracker.net';
  demo_password TEXT := 'GoCarbon2024!';
  demo_user_id UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO demo_user_id FROM auth.users WHERE email = demo_user_email;
  
  IF demo_user_id IS NULL THEN
    -- Create demo user in auth.users via direct insert
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_sent_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      demo_user_email,
      crypt(demo_password, gen_salt('bf')),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"username":"test_demo","full_name":"Test Demo Account","is_test_account":true}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO demo_user_id;
    
    RAISE NOTICE 'Demo user created with ID: %', demo_user_id;
  ELSE
    RAISE NOTICE 'Demo user already exists with ID: %', demo_user_id;
  END IF;
  
  -- Ensure user_profiles record exists  
  INSERT INTO public.user_profiles (
    id,
    email,
    username,
    full_name,
    role,
    is_active,
    email_verified,
    created_at,
    updated_at
  ) VALUES (
    demo_user_id,
    demo_user_email,
    'test_demo',
    'Test Demo Account',
    'user',
    true,
    true,
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    username = 'test_demo',
    full_name = 'Test Demo Account',
    role = 'user',
    is_active = true,
    email_verified = true,
    updated_at = NOW();
    
  RAISE NOTICE 'Demo user profile created/updated for user: %', demo_user_id;
  
END $$;