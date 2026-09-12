// Supabase Configuration
// Replace SUPABASE_URL and SUPABASE_ANON_KEY with your Supabase credentials

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://your-project-ref.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key-here";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
