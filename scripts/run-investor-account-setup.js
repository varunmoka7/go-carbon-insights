#!/usr/bin/env node

/**
 * Runner script to create investor test account
 * Usage: node scripts/run-investor-account-setup.js
 */

const { createInvestorTestAccount } = require('./create-investor-test-account.js');

console.log('🎯 GoCarbonTracker - Investor Test Account Setup');
console.log('================================================\n');

// Check if we're in the right environment
if (typeof supabase === 'undefined') {
  console.log('❌ Error: Supabase client not available');
  console.log('💡 This script should be run in the Lovable environment or Supabase dashboard');
  console.log('💡 Alternatively, you can run the createInvestorTestAccount() function directly');
  process.exit(1);
}

// Run the account creation
createInvestorTestAccount()
  .then((result) => {
    if (result.success) {
      console.log('\n✅ Investor test account setup completed successfully!');
      console.log('\n📋 Credentials Summary:');
      console.log('   Email: investor@gocarbontracker.net');
      console.log('   Password: GoCarbon2024!');
      console.log('   Username: investor_demo');
      console.log('\n🔗 Platform URL: https://gocarbontracker.net');
      console.log('\n💡 Share these credentials with your investors for platform access');
    } else {
      console.log('\n❌ Failed to create investor test account:', result.error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  }); 