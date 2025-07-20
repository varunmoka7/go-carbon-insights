import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables with fallbacks for development
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://hiplsgbyxbalukmejxaq.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpcGxzZ2J5eGJhbHVrbWVqeGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NDMxNDMsImV4cCI6MjA2NDAxOTE0M30.q6OONa0tbs0_CS2eZG0RG-bjghtAlHa2MeOR-Qoa2m4";

// Validate required environment variables
if (!SUPABASE_URL) {
  throw new Error(
    'Missing VITE_SUPABASE_URL environment variable. Please check your environment configuration.'
  );
}

if (!SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing VITE_SUPABASE_ANON_KEY environment variable. Please check your environment configuration.'
  );
}

// Validate URL format
try {
  new URL(SUPABASE_URL);
} catch {
  throw new Error(
    `Invalid VITE_SUPABASE_URL format: ${SUPABASE_URL}. Expected a valid URL.`
  );
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});