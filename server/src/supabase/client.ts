// Trusted backend operations, admin tasks, and authentication flows.


import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ; // Use service role key for admin privileges
console.log('Supabase URL:', SUPABASE_URL); // Debug log
console.log('Supabase Key:', SUPABASE_KEY);

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase env vars (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
}

// ???
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    flowType: 'pkce'
  }
});