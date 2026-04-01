import React, { useState } from 'react';
import { Mail, User, School, BookOpen, Upload, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';
import { getParticipant, createParticipant, uploadSubmission } from '../lib/supabaseClient';

const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [formData, setFormData] = useState({
    email_id: '',
    full_name: '',
    college_name: '',
    year_of_study: '',
    department: '',
    ai_prompt: '',
    image: null
  });

  // Afternoon Task: Smart Email Check
  const handleEmailBlur = async () => {
    if (!formData.email_id) return;
    
    try {
      const { data, error } = await getParticipant(formData.email_id);
      if (data) {
        setFormData(prev => ({
          ...prev,
          full_name: data.full_name,
          college_name: data.college_name,
          year_of_study: data.year_of_study,
          department: data.department
        }));
        setIsExistingUser(true);
        toast.success("Welcome back! Details auto-filled.");
      }
    } catch (err) {
      console.error("Check failed", err);
    }
  };

  // Evening Task: Image Compression & Upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Compress Image (~800KB target)
      const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(formData.image, options);

      // 2. Register/Update Participant
      await createParticipant({
        email_id: formData.email_id,
        full_name: formData.full_name,
        college_name: formData.college_name,
        year_of_study: formData.year_of_study,
        department: formData.department
      });

      // 3. Upload Submission (Round 1)
      // Note: You'll need to pass the compressed file to your uploadSubmission function
      await uploadSubmission(formData.email_id, 1, "Theme Name", formData.ai_prompt, [compressedFile]);

      toast.success("Round 1 Submitted Successfully!");
    } catch (error) {
      toast.error("Submission failed. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-xl bg-[#1e1e1e] border border-blue-500/30 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)] p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Round 1 Submission
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email field triggers the smart search on Blur (when user clicks away) */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-blue-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email ID"
              className="w-full bg-[#121212] border border-gray-700 rounded-lg py-2 pl-12 pr-4 focus:border-blue-500 outline-none transition-all"
              value={formData.email_id}
              onBlur={handleEmailBlur}
              onChange={(e) => setFormData({...formData, email_id: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder="Full Name" 
              className="bg-[#121212] border border-gray-700 rounded-lg p-2 outline-none focus:border-blue-500"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              disabled={isExistingUser}
              required 
            />
            <input 
              placeholder="College Name" 
              className="bg-[#121212] border border-gray-700 rounded-lg p-2 outline-none focus:border-blue-500"
              value={formData.college_name}
              onChange={(e) => setFormData({...formData, college_name: e.target.value})}
              disabled={isExistingUser}
              required 
            />
          </div>

          <textarea 
            placeholder="Enter your AI Prompt here..."
            className="w-full bg-[#121212] border border-gray-700 rounded-lg p-4 h-32 outline-none focus:border-blue-500"
            onChange={(e) => setFormData({...formData, ai_prompt: e.target.value})}
            required
          />

          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              id="image-upload" 
              onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="mx-auto text-blue-400 mb-2" />
              <p className="text-sm text-gray-400">
                {formData.image ? formData.image.name : "Click to upload AI Generated Image"}
              </p>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            {loading ? "Processing..." : "Submit Round 1"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;