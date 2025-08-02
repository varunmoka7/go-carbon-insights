/**
 * Investor Test Account Creation Script
 * Creates a professional test account for investor demonstrations
 * Run this in Lovable environment or Supabase dashboard
 */

const createTestAccount = async () => {
  console.log('🚀 Creating test account...');
  
  try {
    // Step 1: Create test user via Supabase Auth Admin API
    console.log('Step 1: Creating test user account...');
    
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'test@gocarbontracker.net',
      password: 'GoCarbon2024!',
      email_confirm: true,
      user_metadata: {
        role: 'test',
        is_test_account: true,
        full_name: 'Test Account',
        account_type: 'test_demo'
      }
    });

    if (userError) {
      // Check if user already exists
      if (userError.message?.includes('already registered')) {
        console.log('✅ Test user already exists, proceeding with profile setup...');
        
        // Get existing user
        const { data: existingUsers, error: fetchError } = await supabase.auth.admin.listUsers();
        
        if (fetchError) {
          throw new Error(`Failed to fetch existing users: ${fetchError.message}`);
        }
        
        const testUser = existingUsers.users.find(u => u.email === 'test@gocarbontracker.net');
        
        if (!testUser) {
          throw new Error('Test user not found after creation attempt');
        }
        
        userData = { user: testUser };
      } else {
        throw new Error(`Failed to create test user: ${userError.message}`);
      }
    } else {
      console.log('✅ Test user created successfully');
    }

    // Step 2: Setup test user profile
    console.log('Step 2: Setting up test user profile...');
    
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userData.user.id,
        email: 'test@gocarbontracker.net',
        username: 'test_demo',
        full_name: 'Test Account',
        role: 'test',
        is_test_account: true,
        account_type: 'test_demo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (profileError) {
      throw new Error(`Failed to setup test profile: ${profileError.message}`);
    }

    console.log('✅ Test user profile setup completed:', profileData);

    // Step 3: Verify test user can be retrieved
    console.log('Step 3: Verifying test user setup...');
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'test@gocarbontracker.net')
      .single();

    if (verifyError) {
      throw new Error(`Failed to verify test user: ${verifyError.message}`);
    }

    console.log('✅ Test user verification successful:', {
      email: verifyData.email,
      role: verifyData.role,
      is_test_account: verifyData.is_test_account,
      username: verifyData.username
    });

    // Step 4: Test login
    console.log('Step 4: Testing login...');
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'test@gocarbontracker.net',
      password: 'GoCarbon2024!'
    });

    if (loginError) {
      throw new Error(`Test login failed: ${loginError.message}`);
    }

    console.log('✅ Test login successful');

    // Sign out after test
    await supabase.auth.signOut();

    // Step 5: Print test credentials
    console.log('\n🎉 Test Account Created Successfully!');
    console.log('==============================================');
    console.log('📧 Email: test@gocarbontracker.net');
    console.log('🔑 Password: GoCarbon2024!');
    console.log('👤 Username: test_demo');
    console.log('🎯 Role: test');
    console.log('==============================================');
    console.log('\n💡 Share these credentials for platform access');
    console.log('⚠️  This is a test account - recommend changing password after first login');

    return {
      success: true,
      credentials: {
        email: 'test@gocarbontracker.net',
        password: 'GoCarbon2024!',
        username: 'test_demo'
      },
      user: userData.user,
      profile: profileData
    };

  } catch (error) {
    console.error('❌ Error creating test account:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createTestAccount };
} else if (typeof window !== 'undefined') {
  window.createTestAccount = createTestAccount;
}

console.log('Test account creation script loaded. Call createTestAccount() to execute.'); 