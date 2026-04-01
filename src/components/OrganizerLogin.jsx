import React, { useState } from 'react';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';

const OrganizerLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  // The master password you defined in your project requirements
  const ADMIN_PASSWORD = "gemini_expert_2024"; 

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      // Reset error after 3 seconds
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] p-4">
      {/* Glow Effect Background */}
      <div className="absolute w-64 h-64 bg-purple-600/10 rounded-full blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

      <div className="w-full max-w-md relative z-10">
        <form 
          onSubmit={handleLogin} 
          className="p-8 bg-[#161616] border border-purple-500/20 rounded-3xl shadow-2xl backdrop-blur-xl"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-purple-500/10 rounded-2xl mb-4 border border-purple-500/20">
              <ShieldCheck className="text-purple-500" size={40} />
            </div>
            <h2 className="text-3xl text-white font-black tracking-tight">Organizer Access</h2>
            <p className="text-gray-500 text-sm mt-2 font-mono">Terminal Authentication Required</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="password" 
                value={password}
                placeholder="Enter Access Key"
                className={`w-full bg-[#0f0f0f] border ${error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-gray-800 focus:border-purple-500'} text-white rounded-xl pl-12 pr-4 py-4 outline-none transition-all font-mono`}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs font-bold px-2 animate-bounce">
                <AlertCircle size={14} />
                <span>ACCESS DENIED: INCORRECT KEY</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-4 rounded-xl font-black text-white tracking-widest transition-all shadow-lg shadow-purple-900/20 active:scale-[0.98]"
            >
              INITIALIZE ARCHIVE
            </button>
          </div>

          <p className="text-center mt-8 text-[10px] text-gray-600 uppercase tracking-[0.2em]">
            Secure Encryption Enabled
          </p>
        </form>
      </div>
    </div>
  );
};

export default OrganizerLogin;