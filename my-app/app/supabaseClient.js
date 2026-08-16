import { createClient } from '@supabase/supabase-js';

// Šiuos duomenis rasite savo Supabase projekto nustatymuose (Settings -> API)
const supabaseUrl = 'https://fvrndsdybnzbpreywclj.supabase.co';
const supabaseAnonKey = 'sb_publishable_Do_KfhXIaQMe3LqqkGMCPw_rwUovgqR';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
