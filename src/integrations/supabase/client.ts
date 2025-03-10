import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hvfcfxpqdmlndvlzetyq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2ZmNmeHBxZG1sbmR2bHpldHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5NTM5ODUsImV4cCI6MjA1MzUyOTk4NX0.EhN5i6mIU23zZrSqP8p4dxWWWW4r-wviEM15Ssh9owI";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);