import React, { useState } from 'react';
import { Mail, Upload, Send, Loader2, Layers } from 'lucide-react';
import { toast } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';
import { 
  getParticipant, 
  createParticipant, 
  uploadSubmission, 
  uploadImagesToStorage 
} from '../lib/supabaseClient';

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
    selected_theme: 'Cyberpunk India',
    images: []
  });

  // Validation Logic
  const isRound2Invalid = round === 2 && (formData.images.length < 2 || formData.images.length > 4);
  const isRound1Invalid = round === 1 && formData.images.length !== 1;
  const isFormIncomplete = !formData.ai_prompt || !formData.email_id || !formData.full_name;
  const isDisabled = loading || isRound1Invalid || isRound2Invalid || isFormIncomplete;

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
    if (round === 1 && files.length !== 1) {
      toast.error("Round 1 requires exactly 1 image.");
      return;
    }
    if (round === 2 && (files.length < 2 || files.length > 4)) {
      toast.error("Round 2 requires between 2 and 4 images.");
      return;
    }
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(5);

    try {
      // --- PHASE 1: COMPRESSION (5% to 30%) ---
      const compressedImages = [];
      for (let i = 0; i < formData.images.length; i++) {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressed = await imageCompression(formData.images[i], options);
        compressedImages.push(compressed);
        const compressionProgress = 5 + ((i + 1) / formData.images.length) * 25;
        setUploadProgress(Math.round(compressionProgress));
      }

      // --- PHASE 2: PARTICIPANT SETUP (30% to 40%) ---
      await createParticipant({
        email_id: formData.email_id,
        full_name: formData.full_name,
        college_name: formData.college_name,
        department: formData.department,
        year_of_study: formData.year_of_study,
      });
      setUploadProgress(40);

      // --- PHASE 3: STORAGE UPLOAD (40% to 90%) ---
      const imageUrls = await uploadImagesToStorage(
        compressedImages, 
        formData.email_id, 
        round, 
        (p) => setUploadProgress(p)
      );

      // --- PHASE 4: FINAL SUBMISSION (90% to 100%) ---
      await uploadSubmission({
        participant_email: formData.email_id,
        round_number: round,
        selected_theme: formData.selected_theme,
        ai_prompt: formData.ai_prompt,
        image_urls: imageUrls,
        timestamp: new Date().toISOString()
      });

      setUploadProgress(100);
      toast.success(`Round ${round} submitted successfully!`);
      setFormData(prev => ({ ...prev, images: [], ai_prompt: "" }));

    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Submission failed. Please try again.");
      setUploadProgress(0);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#121212] text-white">
      
      {/* Round Navigation */}
      <div className="flex gap-4 mb-8 bg-[#1e1e1e] p-2 rounded-xl border border-blue-500/20 shadow-xl">
        <button 
          type="button"
          onClick={() => setRound(1)}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-300 ${
            round === 1 ? 'bg-blue-600 shadow-lg shadow-blue-500/40 text-white' : 'text-gray-400'
          }`}
        >
          <Layers size={18} /> Round 1
        </button>
        <button 
          type="button"
          onClick={() => setRound(2)}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-300 ${
            round === 2 ? 'bg-purple-600 shadow-lg shadow-purple-500/40 text-white' : 'text-gray-400'
          }`}
        >
          <Layers size={18} /> Round 2
        </button>
      </div>

      <div className={`w-full max-w-xl bg-[#1e1e1e] border rounded-2xl p-8 shadow-2xl transition-all duration-500 ${
        round === 1 ? 'border-blue-500/30' : 'border-purple-500/30'
      }`}>
        <h2 className={`text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r ${
          round === 1 ? 'from-blue-400 to-cyan-400' : 'from-purple-400 to-pink-500'
        }`}>
          {round === 1 ? "Round 1: Concept Art" : "Round 2: Visual Storytelling"}
        </h2>
        <p className="text-gray-400 text-center text-sm mb-8 italic">
          {round === 1 ? "Submit 1 master image" : "Submit a sequence of 2-4 images"}
        </p>

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
              value={formData.selected_theme}
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
            value={formData.ai_prompt}
            onChange={(e) => setFormData({...formData, ai_prompt: e.target.value})}
            required
          />

          {/* Upload Area */}
          <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer relative ${
            round === 1 ? 'border-blue-500/30 hover:border-blue-500' : 'border-purple-500/30 hover:border-purple-500'
          }`}>
            <input 
              type="file" 
              multiple={round === 2}
              accept="image/*" 
              className="hidden" 
              id="image-upload" 
              onChange={handleFileChange}
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className={`mx-auto mb-2 ${round === 1 ? 'text-blue-400' : 'text-purple-400'}`} />
              <p className="text-sm text-gray-400">
                {formData.images.length > 0 
                  ? `${formData.images.length} file(s) selected` 
                  : `Upload ${round === 1 ? "1 image" : "2 to 4 images"}`}
              </p>
            </label>
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="mb-6">
              <div className={`flex justify-between mb-2 text-xs font-mono ${round === 1 ? 'text-cyan-400' : 'text-purple-400'}`}>
                <span>{uploadProgress < 30 ? "COMPRESSING..." : uploadProgress < 90 ? "UPLOADING..." : "FINALIZING..."}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-700">
                <div 
                  className={`h-full transition-all duration-300 ease-out bg-gradient-to-r ${
                    round === 1 ? 'from-blue-500 to-cyan-400' : 'from-purple-500 to-pink-500'
                  }`}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isDisabled}
            className={`w-full font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              isDisabled 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
              : round === 1 ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20' : 'bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/20'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            {loading ? `Processing ${uploadProgress}%` : `Submit Round ${round}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;