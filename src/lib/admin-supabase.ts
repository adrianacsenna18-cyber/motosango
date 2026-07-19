import { createClient } from "@supabase/supabase-js";

export function getAdminSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jeulwmhsiftstikszoku.supabase.co";
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || "sb_publishable_QUb7JP_TwRgxJ9JlMoZMBg_yl-zBvgz";

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
