import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Test environment variables
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseKey);

// Check if variables exist
if (!supabaseUrl) {
  console.error("❌ VITE_SUPABASE_URL is missing!");
}

if (!supabaseKey) {
  console.error("❌ VITE_SUPABASE_ANON_KEY is missing!");
}

if (supabaseUrl && supabaseKey) {
  console.log("✅ Supabase environment variables loaded successfully!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
