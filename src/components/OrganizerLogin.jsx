import React, { useState } from 'react';

const OrganizerLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const ADMIN_PASSWORD = "gemini_expert_2024"; // Hardcoded for now as per prompt

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      alert("Incorrect Password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212]">
      <form onSubmit={handleLogin} className="p-8 bg-[#1e1e1e] border border-purple-500/30 rounded-xl">
        <h2 className="text-2xl text-white mb-4 font-bold">Organizer Access</h2>
        <input 
          type="password" 
          placeholder="Enter Admin Password"
          className="w-full p-2 mb-4 bg-[#121212] border border-gray-700 text-white rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-purple-600 py-2 rounded font-bold text-white">Login</button>
      </form>
    </div>
  );
};

export default OrganizerLogin;