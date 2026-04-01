import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 1. Fetch participant details
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

// --- NEW STORAGE UPLOAD LOGIC ---
export const uploadImagesToStorage = async (files, email, round) => {
  const uploadPromises = files.map(async (file, index) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${email}_R${round}_${Date.now()}_${index}.${fileExt}`;
    const filePath = `submissions/${fileName}`;

    const { data, error } = await supabase.storage
      .from('submission-images') // Ensure this bucket exists in Supabase
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('submission-images')
      .getPublicUrl(filePath);

    return publicUrl;
  });

  return Promise.all(uploadPromises);
};

// 3. Upload submission data
export const uploadSubmission = async (submissionData) => {
  const { data, error } = await supabase
    .from('submissions')
    .insert([submissionData]);
  return { data, error };
};