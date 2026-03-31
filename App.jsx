import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-4xl font-bold text-[#00E5FF] mb-4 shadow-[0_0_15px_#00E5FF]">
        GEMINI EXPERT
      </h1>
      <p className="text-[#7000FF] font-mono tracking-widest uppercase">
        Foundation Phase 0: System Online
      </p>
      <div className="mt-8 p-4 border border-[#00E5FF]/30 rounded-lg bg-white/5">
        <p className="text-gray-400">Database Connection: Pending...</p>
      </div>
    </div>
  );
}

export default App;