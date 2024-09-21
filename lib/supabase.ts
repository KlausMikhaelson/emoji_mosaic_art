import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.project_url || "";
const supabaseAnonKey = process.env.anon_key || "";

export const supabase = createClient("https://hfecpbfntuxaswbitevl.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZWNwYmZudHV4YXN3Yml0ZXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4ODk0NzMsImV4cCI6MjA0MjQ2NTQ3M30.tZXzcR-EjymMWsYCNPP3le8Lc0cbWCAysD8MBTDMLkE");