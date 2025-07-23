/**
 * Lovable Demo User Setup Script
 * Run this in Lovable environment after migration is complete
 */

const setupDemoUser = async () => {
  console.log('🚀 Starting demo user setup...');
  
  try {
    // Step 1: Create demo user via Supabase Auth Admin API
    console.log('Step 1: Creating demo user account...');
    
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'demo@gocarbontracker.com',
      password: 'DemoAccess2024',
      email_confirm: true,
      user_metadata: {
        role: 'analyst',
        is_demo: true,
        full_name: 'Demo User - Platform Access'
      }
    });

    if (userError) {
      // Check if user already exists
      if (userError.message?.includes('already registered')) {
        console.log('✅ Demo user already exists, proceeding with profile setup...');
        
        // Get existing user
        const { data: existingUsers, error: fetchError } = await supabase.auth.admin.listUsers();
        
        if (fetchError) {
          throw new Error(`Failed to fetch existing users: ${fetchError.message}`);
        }
        
        const demoUser = existingUsers.users.find(u => u.email === 'demo@gocarbontracker.com');
        
        if (!demoUser) {
          throw new Error('Demo user not found after creation attempt');
        }
        
        userData = { user: demoUser };
      } else {
        throw new Error(`Failed to create demo user: ${userError.message}`);
      }
    } else {
      console.log('✅ Demo user created successfully');
    }

    // Step 2: Setup demo user profile via database function
    console.log('Step 2: Setting up demo user profile...');
    
    const { data: profileData, error: profileError } = await supabase
      .rpc('setup_demo_user', { 
        demo_user_id: userData.user.id 
      });

    if (profileError) {
      throw new Error(`Failed to setup demo profile: ${profileError.message}`);
    }

    console.log('✅ Demo user profile setup completed:', profileData);

    // Step 3: Verify demo user can be retrieved
    console.log('Step 3: Verifying demo user setup...');
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'demo@gocarbontracker.com')
      .single();

    if (verifyError) {
      throw new Error(`Failed to verify demo user: ${verifyError.message}`);
    }

    console.log('✅ Demo user verification successful:', {
      email: verifyData.email,
      role: verifyData.role,
      is_demo: verifyData.is_demo_account,
      username: verifyData.username
    });

    // Step 4: Test demo login
    console.log('Step 4: Testing demo login...');
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'demo@gocarbontracker.com',
      password: 'DemoAccess2024'
    });

    if (loginError) {
      throw new Error(`Demo login test failed: ${loginError.message}`);
    }

    console.log('✅ Demo login test successful');

    // Sign out after test
    await supabase.auth.signOut();

    return {
      success: true,
      message: 'Demo user setup completed successfully',
      credentials: {
        email: 'demo@gocarbontracker.com',
        password: 'DemoAccess2024',
        role: 'analyst'
      }
    };

  } catch (error) {
    console.error('❌ Demo user setup failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Check migration status function
const checkMigrationStatus = async () => {
  console.log('🔍 Checking migration status...');
  
  try {
    const { data, error } = await supabase
      .from('migration_status')
      .select('*');

    if (error) {
      throw new Error(`Migration status check failed: ${error.message}`);
    }

    console.log('📊 Migration Status:');
    data.forEach(item => {
      console.log(`  ${item.component}: ${item.status}`);
    });

    const allOk = data.every(item => item.status === 'OK');
    return {
      success: allOk,
      status: data,
      message: allOk ? 'All migrations completed successfully' : 'Some migration issues detected'
    };

  } catch (error) {
    console.error('❌ Migration status check failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Export functions for use in Lovable
if (typeof window !== 'undefined') {
  window.setupDemoUser = setupDemoUser;
  window.checkMigrationStatus = checkMigrationStatus;
}

// Auto-run if in browser environment
if (typeof window !== 'undefined') {
  console.log(`
🎯 Demo User Setup Script Loaded

Available functions:
- setupDemoUser(): Creates and configures demo account
- checkMigrationStatus(): Checks if migrations completed successfully

Usage:
1. First run: await checkMigrationStatus()
2. Then run: await setupDemoUser()
  `);
}

export { setupDemoUser, checkMigrationStatus };