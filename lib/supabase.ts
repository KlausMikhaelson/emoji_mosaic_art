import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.project_url || "";
const supabaseAnonKey = process.env.anon_key || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);