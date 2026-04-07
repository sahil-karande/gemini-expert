import React, { useState } from 'react';
import { Mail, Upload, Send, Loader2, Layers, User, Phone, BookOpen, GraduationCap, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import imageCompression from 'browser-image-compression';
import { 
  getParticipant, 
  createParticipant, 
  uploadSubmission, 
  uploadImagesToStorage 
} from '../lib/supabaseApi'; // <-- CHANGED THIS LINEnp 

const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [round, setRound] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filesSelected, setFilesSelected] = useState(false); 
  
  const [formData, setFormData] = useState({
    email_id: '',
    full_name: '',
    phone_number: '',    
    college_name: '',
    department: '',      
    year_of_study: '',   
    ai_prompt: '',
    selected_theme: 'Future Classroom in 2050', 
    images: []
  });

  // 1. Updated Validation Logic: Both rounds now require exactly 1 image
  const isRound2Invalid = round === 2 && formData.images.length !== 1;
  const isRound1Invalid = round === 1 && formData.images.length !== 1;
  const isFormIncomplete = !formData.ai_prompt || !formData.email_id || !formData.full_name || !formData.phone_number || !formData.college_name || !formData.department || !formData.year_of_study;
  
  const isDisabled = loading || isRound1Invalid || isRound2Invalid || isFormIncomplete;

  const handleEmailBlur = async () => {
    if (!formData.email_id) return;
    try {
      const { data } = await getParticipant(formData.email_id);
      if (data) {
        setFormData(prev => ({
          ...prev,
          full_name: data.full_name,
          phone_number: data.phone_number || '',
          college_name: data.college_name,
          year_of_study: data.year_of_study,
          department: data.department
        }));
        setIsExistingUser(true);
        toast.success("Details auto-filled!");
      }
    } catch (err) { console.error(err); }
  };

  // 2. Updated File Change Logic: Enforce single file selection for all rounds
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length !== 1) {
      toast.error("Please select exactly 1 image.");
      e.target.value = ""; 
      setFilesSelected(false);
      setFormData(prev => ({ ...prev, images: [] }));
      return;
    }

    setFormData({ ...formData, images: files });
    setFilesSelected(true);
    toast.success("Image attached successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(5);

    try {
      const compressedImages = [];
      for (let i = 0; i < formData.images.length; i++) {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressed = await imageCompression(formData.images[i], options);
        compressedImages.push(compressed);
        setUploadProgress(Math.round(5 + ((i + 1) / formData.images.length) * 25));
      }

      await createParticipant({
        email_id: formData.email_id,
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        college_name: formData.college_name,
        department: formData.department,
        year_of_study: formData.year_of_study,
      });
      setUploadProgress(40);

      const imageUrls = await uploadImagesToStorage(
        compressedImages, 
        formData.email_id, 
        round, 
        (p) => setUploadProgress(p)
      );

      await uploadSubmission({
        participant_email: formData.email_id,
        round_number: round,
        selected_theme: formData.selected_theme,
        ai_prompt: formData.ai_prompt,
        image_urls: imageUrls,
        timestamp: new Date().toISOString()
      });

      setUploadProgress(100);
      toast.success(`Round ${round} Submission Saved!`);
      setFormData(prev => ({ ...prev, images: [], ai_prompt: "" }));
      setFilesSelected(false);

    } catch (error) {
      console.error("Database error:", error);
      toast.error("Could not save to database. Check connection.");
      setUploadProgress(0);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setUploadProgress(0);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#121212] text-white">
      <div className="flex gap-4 mb-8 bg-[#1e1e1e] p-2 rounded-xl border border-blue-500/20 shadow-xl">
        <button type="button" onClick={() => { setRound(1); setFormData({...formData, images: []}); setFilesSelected(false); }}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${round === 1 ? 'bg-blue-600 text-white shadow-blue-500/40' : 'text-gray-400'}`}>
          <Layers size={18} /> Round 1
        </button>
        <button type="button" onClick={() => { setRound(2); setFormData({...formData, images: []}); setFilesSelected(false); }}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${round === 2 ? 'bg-purple-600 text-white shadow-purple-500/40' : 'text-gray-400'}`}>
          <Layers size={18} /> Round 2
        </button>
      </div>

      <div className={`w-full max-w-xl bg-[#1e1e1e] border rounded-2xl p-8 shadow-2xl transition-all duration-500 ${round === 1 ? 'border-blue-500/30' : 'border-purple-500/30'}`}>
        <h2 className={`text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r ${round === 1 ? 'from-blue-400 to-cyan-400' : 'from-purple-400 to-pink-500'}`}>
          {round === 1 ? "Round 1: Concept Art" : "Round 2: Visual Storytelling"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {/* Form Fields ... (Keep these the same) */}
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-blue-400 w-5 h-5" />
              <input type="email" placeholder="Email ID" className="w-full bg-[#121212] border border-gray-700 rounded-lg py-2 pl-12 pr-4 focus:border-blue-500 outline-none"
                value={formData.email_id} onBlur={handleEmailBlur} onChange={(e) => setFormData({...formData, email_id: e.target.value})} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-3 text-blue-400 w-5 h-5" />
                <input placeholder="Full Name" className="w-full bg-[#121212] border border-gray-700 rounded-lg py-2 pl-12 pr-4 outline-none disabled:opacity-50"
                  value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} disabled={isExistingUser} required />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-blue-400 w-5 h-5" />
                <input placeholder="Phone Number" className="w-full bg-[#121212] border border-gray-700 rounded-lg py-2 pl-12 pr-4 outline-none"
                  value={formData.phone_number} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 text-blue-400 w-5 h-5" />
                <input placeholder="College Name" className="w-full bg-[#121212] border border-gray-700 rounded-lg py-2 pl-12 pr-4 outline-none"
                  value={formData.college_name} onChange={(e) => setFormData({...formData, college_name: e.target.value})} required />
              </div>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 text-blue-400 w-5 h-5" />
                <input placeholder="Department" className="w-full bg-[#121212] border border-gray-700 rounded-lg py-2 pl-12 pr-4 outline-none"
                  value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="bg-[#121212] border border-gray-700 rounded-lg p-2 outline-none text-gray-400"
                value={formData.year_of_study} onChange={(e) => setFormData({...formData, year_of_study: e.target.value})} required>
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
              <select className="bg-[#121212] border border-gray-700 rounded-lg p-2 outline-none text-gray-400"
                value={formData.selected_theme} onChange={(e) => setFormData({...formData, selected_theme: e.target.value})}>
                <option value="Future Classroom in 2050">Future Classroom in 2050</option>
                <option value="Smart City of India">Smart City of India</option>
                <option value="Nature vs Technology">Nature vs Technology</option>
                <option value="AI Assistant in Daily Life">AI Assistant in Daily Life</option>
                <option value="Dream Startup Office">Dream Startup Office</option>
                <option value="A World Without Pollution">A World Without Pollution</option>
                <option value="Human + Machine Collaboration">Human + Machine Collaboration</option>
                <option value="Harmony in Family">Harmony in Family</option>
              </select>
            </div>
          </div>

          <textarea placeholder="Enter your Master AI Prompt..." className="w-full bg-[#121212] border border-gray-700 rounded-lg p-4 h-32 outline-none focus:border-blue-500"
            value={formData.ai_prompt} onChange={(e) => setFormData({...formData, ai_prompt: e.target.value})} required />

          {/* 3. Updated Upload Area: removed 'multiple' and updated helper text */}
          <div className={`group border-2 border-dashed rounded-lg p-6 text-center transition-all ${filesSelected ? 'border-green-500 bg-green-500/5' : 'border-gray-700 hover:border-blue-500'}`}>
            <input 
              key={`upload-round-${round}`} 
              type="file" 
              multiple={false} // Force single file selection
              accept="image/*" 
              className="hidden" 
              id="image-upload" 
              onChange={handleFileChange} 
            />
            <label htmlFor="image-upload" className="cursor-pointer block w-full h-full">
              {filesSelected ? (
                <div className="flex flex-col items-center text-green-400">
                  <CheckCircle size={32} className="mb-2" />
                  <p className="font-bold">Image Ready</p>
                  <p className="text-xs text-gray-500">Click to change selection</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className={`mx-auto mb-2 group-hover:scale-110 transition-transform ${round === 1 ? 'text-blue-400' : 'text-purple-400'}`} />
                  <p className="text-sm text-gray-400">
                    Upload 1 Image
                  </p>
                </div>
              )}
            </label>
          </div>

          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-blue-400">
                <span>SYSTEM UPLOAD</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <button type="submit" disabled={isDisabled} className={`w-full font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all ${isDisabled ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'}`}>
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            {isDisabled ? "Complete All Fields" : `Submit Round ${round}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;