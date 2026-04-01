import React, { useState } from 'react';
import { Mail, Upload, Send, Loader2, Layers } from 'lucide-react';
import { toast } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';
import { getParticipant, createParticipant, uploadSubmission, uploadImagesToStorage } from '../lib/supabaseClient';

const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [round, setRound] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    email_id: '',
    full_name: '',
    college_name: '',
    year_of_study: '',
    department: '',
    ai_prompt: '',
    selected_theme: 'Cyberpunk India', // Default theme
    images: [] // Changed to array for Round 2
  });

  const handleEmailBlur = async () => {
    if (!formData.email_id) return;
    try {
      const { data } = await getParticipant(formData.email_id);
      if (data) {
        setFormData(prev => ({
          ...prev,
          full_name: data.full_name,
          college_name: data.college_name,
          year_of_study: data.year_of_study,
          department: data.department
        }));
        setIsExistingUser(true);
        toast.success("Details auto-filled!");
      }
    } catch (err) { console.error(err); }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (round === 1 && files.length > 1) {
      toast.error("Round 1 only allows 1 image.");
      return;
    }
    if (round === 2 && files.length > 4) {
      toast.error("Round 2 allows maximum 4 images.");
      return;
    }
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation for Round 2
    if (round === 2 && formData.images.length < 2) {
      toast.error("Please upload at least 2 images for Round 2");
      return;
    }

    setLoading(true);
    setUploadProgress(10); // Start progress

    try {
      // 1. Compress All Images
      const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFiles = await Promise.all(
        formData.images.map(file => imageCompression(file, options))
      );
      setUploadProgress(40);

      // 2. Register/Update Participant
      await createParticipant({
        email_id: formData.email_id,
        full_name: formData.full_name,
        college_name: formData.college_name,
        year_of_study: formData.year_of_study,
        department: formData.department
      });

      // 3. Upload to Storage & Get URLs
      const imageUrls = await uploadImagesToStorage(compressedFiles, formData.email_id, round);
      setUploadProgress(80);

      // 4. Save Submission
      await uploadSubmission({
        participant_email: formData.email_id,
        round_number: round,
        selected_theme: formData.selected_theme,
        ai_prompt: formData.ai_prompt,
        image_urls: imageUrls,
        timestamp: new Date().toISOString()
      });

      setUploadProgress(100);
      toast.success(`Round ${round} Submitted Successfully!`);
      // Reset form or redirect
    } catch (error) {
      toast.error("Submission failed.");
      console.error(error);
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#121212] text-white">
      {/* Round Toggle */}
      <div className="flex gap-4 mb-8 bg-[#1e1e1e] p-2 rounded-xl border border-blue-500/20">
        <button 
          onClick={() => setRound(1)}
          className={`px-6 py-2 rounded-lg transition-all ${round === 1 ? 'bg-blue-600 shadow-lg shadow-blue-500/40' : 'text-gray-400'}`}
        >
          Round 1
        </button>
        <button 
          onClick={() => setRound(2)}
          className={`px-6 py-2 rounded-lg transition-all ${round === 2 ? 'bg-purple-600 shadow-lg shadow-purple-500/40' : 'text-gray-400'}`}
        >
          Round 2
        </button>
      </div>

      <div className="w-full max-w-xl bg-[#1e1e1e] border border-blue-500/30 rounded-2xl p-8 shadow-2xl">
        <h2 className={`text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r ${round === 1 ? 'from-blue-400 to-cyan-400' : 'from-purple-400 to-pink-500'}`}>
          {round === 1 ? "Round 1: Single Concept" : "Round 2: Storytelling (2-4 Images)"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-blue-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email ID"
              className="w-full bg-[#121212] border border-gray-700 rounded-lg py-2 pl-12 pr-4 focus:border-blue-500 outline-none"
              value={formData.email_id}
              onBlur={handleEmailBlur}
              onChange={(e) => setFormData({...formData, email_id: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder="Full Name" 
              className="bg-[#121212] border border-gray-700 rounded-lg p-2 outline-none disabled:opacity-50"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              disabled={isExistingUser}
              required 
            />
            <select 
              className="bg-[#121212] border border-gray-700 rounded-lg p-2 outline-none"
              onChange={(e) => setFormData({...formData, selected_theme: e.target.value})}
            >
              <option>Cyberpunk India</option>
              <option>Ancient Future</option>
              <option>Surreal Nature</option>
            </select>
          </div>

          <textarea 
            placeholder="Enter your Master AI Prompt..."
            className="w-full bg-[#121212] border border-gray-700 rounded-lg p-4 h-32 outline-none focus:border-blue-500"
            onChange={(e) => setFormData({...formData, ai_prompt: e.target.value})}
            required
          />

          {/* Multi-File Upload Area */}
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              multiple={round === 2}
              accept="image/*" 
              className="hidden" 
              id="image-upload" 
              onChange={handleFileChange}
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="mx-auto text-blue-400 mb-2" />
              <p className="text-sm text-gray-400">
                {formData.images.length > 0 
                  ? `${formData.images.length} file(s) selected` 
                  : `Upload ${round === 1 ? "1 image" : "2 to 4 images"}`}
              </p>
            </label>
          </div>

          {/* Progress Bar */}
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${round === 1 ? 'bg-blue-600 hover:bg-blue-500' : 'bg-purple-600 hover:bg-purple-500'}`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            {loading ? "Uploading Massive Content..." : `Submit Round ${round}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;