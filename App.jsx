import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

function App() {
  const [status, setStatus] = useState("Checking Connection...");

  useEffect(() => {
    async function testConnection() {
      // This tries to fetch from your new participants table
      const { data, error } = await supabase.from('participants').select('*').limit(1);
      
      if (error) {
        console.error("Supabase Error:", error);
        setStatus("❌ CONNECTION ERROR (Check .env or Tables)");
      } else {
        setStatus("⚡ DATABASE ONLINE: PHASE 0 COMPLETE");
      }
    }
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
      <div className={`p-10 border-2 rounded-lg ${status.includes('ONLINE') ? 'border-[#00E5FF] shadow-[0_0_20px_#00E5FF]' : 'border-red-500'}`}>
        <h1 className="text-2xl font-mono">{status}</h1>
      </div>
    </div>
  );
}

export default App;