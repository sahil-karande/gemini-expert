import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- HELPER FUNCTIONS ---

// 1. Fetch participant details (Check if they exist)
export const getParticipant = async (email) => {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('email_id', email)
    .single();
  return { data, error };
};

// 2. Register or update a participant
export const createParticipant = async (participantData) => {
  const { data, error } = await supabase
    .from('participants')
    .upsert(participantData)
    .select();
  return { data, error };
};

// 3. Upload submission data
export const uploadSubmission = async (submissionData) => {
  const { data, error } = await supabase
    .from('submissions')
    .insert([submissionData]);
  return { data, error };
};