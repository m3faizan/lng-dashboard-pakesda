import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rlngdashboard.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsbmdkYXNoYm9hcmQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwOTk3NzE3MCwiZXhwIjoyMDI1NTUzMTcwfQ.Pu9TLmWDmhIWZI6Ym9I_iqHOX3-AO_xDqcHRKQHgYQY';

export const supabase = createClient(supabaseUrl, supabaseKey);