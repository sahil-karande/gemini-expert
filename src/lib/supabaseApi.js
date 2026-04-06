import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 1. Fetch participant (Used for auto-fill)
export const getParticipant = async (email) => {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('email_id', email)
    .single();
  return { data, error };
};

// 2. Create/Update participant
export const createParticipant = async (participantData) => {
  const { data, error } = await supabase
    .from('participants')
    .upsert(participantData)
    .select();
  return { data, error };
};

// 3. Upload images to Storage
export const uploadImagesToStorage = async (files, email, round, onProgress) => {
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = `${email}_R${round}_${Date.now()}_${i}.${file.name.split('.').pop()}`;
    const filePath = `submissions/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('submission-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('submission-images')
      .getPublicUrl(filePath);

    urls.push(publicUrl);
    
    if (onProgress) {
      onProgress(Math.round(40 + ((i + 1) / files.length) * 50));
    }
  }
  return urls;
};

// 4. Save the submission (Crucial for Phase 2)
export const uploadSubmission = async (submissionData) => {
  const { data, error } = await supabase
    .from('submissions')
    .insert([submissionData]);
  return { data, error };
};

// 5. Fetch all submissions (Crucial for Phase 3)
export const getAllSubmissions = async () => {
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      participants (
        full_name,
        college_name,
        phone_number,
        department,
        year_of_study
      )
    `)
    .order('timestamp', { ascending: false });
    
  return { data, error };
};
// src/lib/supabaseApi.js

// ... existing code ...

// src/lib/supabaseApi.js
// Ensure this is at the top level, NOT inside another function
export const updateSubmissionRound = async (submissionId, newRound) => {
  const { data, error } = await supabase
    .from('submissions')
    .update({ round_number: newRound })
    .eq('id', submissionId)
    .select();
  return { data, error };
};