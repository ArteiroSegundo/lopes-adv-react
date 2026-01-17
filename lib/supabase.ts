
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gemyuedjspaqjrbtttfo.supabase.co';
const supabaseAnonKey = 'sb_publishable_fYRbBJPFju4a56ewXkVtKg_qU4hNjZj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
