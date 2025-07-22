-- Create the demo user
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_token, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_sent_at, confirmed_at)
VALUES (current_setting('app.instance_id')::uuid, uuid_generate_v4(), 'authenticated', 'authenticated', 'demo@gocarbontracker.net', crypt('demodemo', gen_salt('bf')), now(), '', now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', now(), now());

-- Create the demo role
INSERT INTO auth.roles (role) VALUES ('demo');

-- Assign the demo role to the demo user
INSERT INTO auth.user_roles (user_id, role_id) VALUES ((SELECT id FROM auth.users WHERE email = 'demo@gocarbontracker.net'), (SELECT id FROM auth.roles WHERE role = 'demo'));
