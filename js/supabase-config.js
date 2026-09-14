// Supabase Configuration
// Replace SUPABASE_URL and SUPABASE_ANON_KEY with your Supabase credentials

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://othoelbkughxozgamynr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aG9lbGJrdWdoeG96Z2FteW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzQ5MzYsImV4cCI6MjEwNDk1MDkzNn0.hRgIguQWFcIsXfkW16T3qRVuM1_zFk_esdvR9HLYdRM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
