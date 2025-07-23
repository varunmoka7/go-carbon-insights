# 🔧 Demo Login Fix - Immediate Solutions

## 🚨 Root Cause Analysis

**Why demo login is failing:**
1. **Email mismatch:** Code expects `demo@gocarbontracker.com` but database may have `demo@gocarbontracker.net`
2. **User doesn't exist:** Demo user was never successfully created in Supabase auth
3. **Direct SQL restrictions:** Lovable doesn't allow direct `auth.users` table manipulation

## 🎯 Immediate Fix Options

### **Option 1: Quick Fix - Update Code to Match Existing User**

If demo user exists with `demo@gocarbontracker.net`:

```typescript
// In src/pages/Auth.tsx, change line 287:
const { error } = await signIn('demo@gocarbontracker.net', 'demodemo');
```

### **Option 2: Create Demo User Properly (Recommended)**

Run this in Lovable console to create the demo user correctly:

```javascript
// Step 1: Create demo user via Supabase Auth Admin API
const createDemoUser = async () => {
  try {
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
      if (error.message.includes('already registered')) {
        console.log('✅ Demo user already exists');
        return { success: true, message: 'User exists' };
      }
      throw error;
    }

    console.log('✅ Demo user created:', data);
    return { success: true, data };
  } catch (err) {
    console.error('❌ Error:', err.message);
    return { success: false, error: err.message };
  }
};

// Run it
await createDemoUser();
```

### **Option 3: Check What Actually Exists**

First, let's check what demo users exist in your database:

```javascript
// Check for existing demo users
const checkDemoUsers = async () => {
  try {
    // Check auth.users (admin access required)
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) throw error;
    
    const demoUsers = users.users.filter(u => 
      u.email.includes('demo') || u.email.includes('gocarbontracker')
    );
    
    console.log('Demo users found:', demoUsers.map(u => ({
      email: u.email,
      confirmed: u.email_confirmed_at !== null,
      created: u.created_at
    })));
    
    return demoUsers;
  } catch (err) {
    console.error('Error checking users:', err.message);
    
    // Fallback: check user_profiles table
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .or('email.ilike.%demo%,email.ilike.%gocarbontracker%');
    
    if (!profileError) {
      console.log('Demo profiles found:', profiles);
    }
    
    return [];
  }
};

// Run the check
await checkDemoUsers();
```

## 🎯 Most Likely Solution

**Run this step-by-step in Lovable:**

### **Step 1: Check what exists**
```javascript
// Quick check for existing demo account
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'demo@gocarbontracker.net',
  password: 'demodemo'
});

if (!error) {
  console.log('✅ Old demo account works with .net email');
  await supabase.auth.signOut();
} else {
  console.log('❌ Old demo account failed:', error.message);
  
  // Try new credentials
  const { data: data2, error: error2 } = await supabase.auth.signInWithPassword({
    email: 'demo@gocarbontracker.com',
    password: 'DemoAccess2024'
  });
  
  if (!error2) {
    console.log('✅ New demo account works with .com email');
    await supabase.auth.signOut();
  } else {
    console.log('❌ New demo account failed:', error2.message);
    console.log('🔧 Need to create demo user');
  }
}
```

### **Step 2: Create demo user if none exists**
```javascript
// Only run if Step 1 shows no working demo account
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

console.log(error ? `❌ ${error.message}` : '✅ Demo user created successfully');
```

### **Step 3: Test demo login**
```javascript
// Test the demo login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'demo@gocarbontracker.com',
  password: 'DemoAccess2024'
});

if (error) {
  console.log('❌ Demo login failed:', error.message);
} else {
  console.log('✅ Demo login successful!');
  console.log('User:', data.user.email, 'Role:', data.user.user_metadata?.role);
  await supabase.auth.signOut();
}
```

## 🚀 Quick Test Commands

**Run these one by one in Lovable console:**

1. **Check existing:** `await supabase.auth.signInWithPassword({email: 'demo@gocarbontracker.net', password: 'demodemo'})`

2. **If fails, check new:** `await supabase.auth.signInWithPassword({email: 'demo@gocarbontracker.com', password: 'DemoAccess2024'})`

3. **If both fail, create user:** `await supabase.auth.admin.createUser({email: 'demo@gocarbontracker.com', password: 'DemoAccess2024', email_confirm: true})`

Let me know which step works, and I'll provide the appropriate fix!