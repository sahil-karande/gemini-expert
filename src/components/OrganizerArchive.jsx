import React, { useEffect, useState } from 'react';
import { Search, Mail, Phone, School, GraduationCap, Box, Download, User, MapPin } from 'lucide-react';
import { getAllSubmissions } from '../lib/supabaseClient';

const OrganizerArchive = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await getAllSubmissions();
      if (data) setSubmissions(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredData = submissions.filter(sub => 
    sub.participants?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.participant_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            MASTER ARCHIVE: ORGANIZER VIEW
          </h1>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="Search participants..."
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl pl-10 pr-4 py-2 focus:border-purple-500 outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20 text-purple-500 animate-pulse">Decrypting secure data...</div>
        ) : (
          <div className="space-y-6">
            {filteredData.map((sub) => (
              <div key={sub.id} className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden flex flex-col lg:flex-row hover:border-purple-500/50 transition-colors shadow-2xl">
                
                {/* IMAGE VIEW - Handling the Array Format */}
                <div className="lg:w-96 h-64 lg:h-auto bg-black flex items-center justify-center p-2 group relative">
                  {sub.image_urls && sub.image_urls.length > 0 ? (
                    <>
                      <img 
                        src={sub.image_urls[0]} 
                        className="w-full h-full object-contain rounded-lg"
                        alt="AI Generation"
                      />
                      <button 
                        onClick={() => window.open(sub.image_urls[0], '_blank')}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-sm"
                      >
                        Open Original Image
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-700">No Image Data</span>
                  )}
                </div>

                {/* PARTICIPANT DETAILS */}
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{sub.participants?.full_name}</h2>
                      <p className="text-purple-400 font-mono text-sm">{sub.participant_email}</p>
                    </div>
                    <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/20">
                      Round {sub.round_number}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-gray-400 text-sm mb-6">
                    <div className="flex items-center gap-2"><School size={16} className="text-gray-600"/> {sub.participants?.college_name}</div>
                    <div className="flex items-center gap-2"><MapPin size={16} className="text-gray-600"/> Branch: {sub.participants?.department}</div>
                    <div className="flex items-center gap-2"><Box size={16} className="text-gray-600"/> Year: {sub.participants?.year_of_study}</div>
                    <div className="flex items-center gap-2"><Phone size={16} className="text-gray-600"/> {sub.participants?.phone_number}</div>
                  </div>

                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Master AI Prompt</h4>
                    <p className="text-gray-300 italic text-sm leading-relaxed">"{sub.ai_prompt}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerArchive;