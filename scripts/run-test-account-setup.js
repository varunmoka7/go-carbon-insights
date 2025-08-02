#!/usr/bin/env node

/**
 * Runner script to create test account
 * Usage: node scripts/run-test-account-setup.js
 */

const { createTestAccount } = require('./create-test-account.js');

console.log('🎯 GoCarbonTracker - Test Account Setup');
console.log('=======================================\n');

// Check if we're in the right environment
if (typeof supabase === 'undefined') {
  console.log('❌ Error: Supabase client not available');
  console.log('💡 This script should be run in the Lovable environment or Supabase dashboard');
  console.log('💡 Alternatively, you can run the createInvestorTestAccount() function directly');
  process.exit(1);
}

// Run the account creation
createTestAccount()
  .then((result) => {
    if (result.success) {
      console.log('\n✅ Test account setup completed successfully!');
      console.log('\n📋 Credentials Summary:');
      console.log('   Email: test@gocarbontracker.net');
      console.log('   Password: GoCarbon2024!');
      console.log('   Username: test_demo');
      console.log('\n🔗 Platform URL: https://gocarbontracker.net');
      console.log('\n💡 Share these credentials for platform access');
    } else {
      console.log('\n❌ Failed to create test account:', result.error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  }); 