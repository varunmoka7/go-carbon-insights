/**
 * Investor Test Account Creation Script
 * Creates a professional test account for investor demonstrations
 * Run this in Lovable environment or Supabase dashboard
 */

const createInvestorTestAccount = async () => {
  console.log('🚀 Creating investor test account...');
  
  try {
    // Step 1: Create investor test user via Supabase Auth Admin API
    console.log('Step 1: Creating investor test user account...');
    
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'investor@gocarbontracker.net',
      password: 'GoCarbon2024!',
      email_confirm: true,
      user_metadata: {
        role: 'investor',
        is_test_account: true,
        full_name: 'Investor Test Account',
        account_type: 'investor_demo'
      }
    });

    if (userError) {
      // Check if user already exists
      if (userError.message?.includes('already registered')) {
        console.log('✅ Investor test user already exists, proceeding with profile setup...');
        
        // Get existing user
        const { data: existingUsers, error: fetchError } = await supabase.auth.admin.listUsers();
        
        if (fetchError) {
          throw new Error(`Failed to fetch existing users: ${fetchError.message}`);
        }
        
        const investorUser = existingUsers.users.find(u => u.email === 'investor@gocarbontracker.net');
        
        if (!investorUser) {
          throw new Error('Investor test user not found after creation attempt');
        }
        
        userData = { user: investorUser };
      } else {
        throw new Error(`Failed to create investor test user: ${userError.message}`);
      }
    } else {
      console.log('✅ Investor test user created successfully');
    }

    // Step 2: Setup investor test user profile
    console.log('Step 2: Setting up investor test user profile...');
    
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userData.user.id,
        email: 'investor@gocarbontracker.net',
        username: 'investor_demo',
        full_name: 'Investor Test Account',
        role: 'investor',
        is_test_account: true,
        account_type: 'investor_demo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (profileError) {
      throw new Error(`Failed to setup investor profile: ${profileError.message}`);
    }

    console.log('✅ Investor test user profile setup completed:', profileData);

    // Step 3: Verify investor test user can be retrieved
    console.log('Step 3: Verifying investor test user setup...');
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'investor@gocarbontracker.net')
      .single();

    if (verifyError) {
      throw new Error(`Failed to verify investor test user: ${verifyError.message}`);
    }

    console.log('✅ Investor test user verification successful:', {
      email: verifyData.email,
      role: verifyData.role,
      is_test_account: verifyData.is_test_account,
      username: verifyData.username
    });

    // Step 4: Test investor login
    console.log('Step 4: Testing investor login...');
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'investor@gocarbontracker.net',
      password: 'GoCarbon2024!'
    });

    if (loginError) {
      throw new Error(`Investor login test failed: ${loginError.message}`);
    }

    console.log('✅ Investor login test successful');

    // Sign out after test
    await supabase.auth.signOut();

    // Step 5: Print investor credentials
    console.log('\n🎉 Investor Test Account Created Successfully!');
    console.log('==============================================');
    console.log('📧 Email: investor@gocarbontracker.net');
    console.log('🔑 Password: GoCarbon2024!');
    console.log('👤 Username: investor_demo');
    console.log('🎯 Role: investor');
    console.log('==============================================');
    console.log('\n💡 Share these credentials with your investors for platform access');
    console.log('⚠️  This is a test account - recommend changing password after first login');

    return {
      success: true,
      credentials: {
        email: 'investor@gocarbontracker.net',
        password: 'GoCarbon2024!',
        username: 'investor_demo'
      },
      user: userData.user,
      profile: profileData
    };

  } catch (error) {
    console.error('❌ Error creating investor test account:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createInvestorTestAccount };
} else if (typeof window !== 'undefined') {
  window.createInvestorTestAccount = createInvestorTestAccount;
}

console.log('Investor test account creation script loaded. Call createInvestorTestAccount() to execute.'); 