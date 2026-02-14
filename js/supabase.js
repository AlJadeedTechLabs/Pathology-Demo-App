import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://ldvuajeyrectfcwzxetj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_fkeUCPJdbKgf_QFuzvT3PQ_3yLC-lX5";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
