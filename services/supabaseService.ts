import { createClient } from '@supabase/supabase-js';
import { QuizSubmission } from '../types';

// Projekt-ID und URL
const PROJECT_ID: string = 'kychyksmmrwzbuhhixpi';
const SUPABASE_URL: string = `https://${PROJECT_ID}.supabase.co`;

// Der vom Benutzer bereitgestellte gültige Anon-Key
const SUPABASE_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5Y2h5a3NtbXJ3emJ1aGhpeHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMjQ1NjcsImV4cCI6MjA4MTYwMDU2N30.CeFMydWZw6RKzufIWlCduxL_GVGPUM6UGUFsrZs_VL4';

export const isConfigured = () => {
  return PROJECT_ID !== '' && SUPABASE_KEY !== '' && SUPABASE_KEY.length > 50;
};

const supabase = isConfigured() ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

export interface SupabaseResponse<T> {
  data: T | null;
  error: string | null;
}

export const uploadSubmission = async (submission: QuizSubmission): Promise<SupabaseResponse<any>> => {
  if (!supabase) {
    return { data: null, error: "Supabase nicht konfiguriert (Key fehlt)." };
  }
  
  try {
    const { data, error } = await supabase
      .from('submissions')
      .insert([{ 
        id: submission.id, 
        data: submission,
        created_at: new Date().toISOString() 
      }]);
      
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Unbekannter Netzwerkfehler" };
  }
};

export const fetchAllSubmissions = async (): Promise<SupabaseResponse<QuizSubmission[]>> => {
  if (!supabase) return { data: [], error: "Nicht konfiguriert" };
  
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('data')
      .order('created_at', { ascending: false });
      
    if (error) {
      return { data: [], error: error.message };
    }
    
    const parsed = (data || []).map(item => item.data as QuizSubmission);
    return { data: parsed, error: null };
  } catch (err: any) {
    return { data: [], error: err.message || "Verbindungsfehler" };
  }
};

export const deleteRemoteSubmissions = async () => {
  if (!supabase) return;
  await supabase.from('submissions').delete().neq('id', '0');
};