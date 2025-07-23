// Script to create demo user via Supabase Auth API
// This should be run in Lovable or via Supabase dashboard

const createDemoUser = async () => {
  try {
    // This should be run in Lovable environment where supabase client is available
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'demo@gocarbontracker.com',
      password: 'DemoAccess2024',
      email_confirm: true,
      user_metadata: {
        role: 'analyst',
        is_demo: true,
        full_name: 'Demo User - Platform Access'
      }
    });

    if (error) {
      console.error('Error creating demo user:', error);
      return;
    }

    console.log('Demo user created successfully:', data);

    // Now call the function to set up profile
    const { data: profileData, error: profileError } = await supabase
      .rpc('create_demo_user_if_not_exists');

    if (profileError) {
      console.error('Error setting up demo profile:', profileError);
    } else {
      console.log('Demo profile setup:', profileData);
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

// Export for use in Lovable
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createDemoUser };
} else if (typeof window !== 'undefined') {
  window.createDemoUser = createDemoUser;
}

console.log('Demo user creation script loaded. Call createDemoUser() to execute.');