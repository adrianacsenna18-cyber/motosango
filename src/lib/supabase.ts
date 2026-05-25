import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sua-url-do-supabase.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sua-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

if (typeof window !== 'undefined' && supabaseUrl.includes('sua-url-do-supabase')) {
  console.error("⚠️ ATENÇÃO: As credenciais do Supabase não foram encontradas no arquivo .env.local!");
}
