import { createClient } from '@supabase/supabase-js';

// Access Supabase keys from environment variables securely
// If keys are missing (local testing without .env), use empty strings to prevent build crashes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client instance for interacting with the database
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
