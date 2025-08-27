import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pmbzxzpkzniarmxfkwgj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYnp4enBrem5pYXJteGZrd2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjgyMDAsImV4cCI6MjA2OTcwNDIwMH0.KxuRMno8PKRjkU1lZnVkNO1CW2uLMGVcSkVYrMLjLuQ';


export const supabase = createClient(supabaseUrl, supabaseKey);
