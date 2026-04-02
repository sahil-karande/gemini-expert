import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams and Link
import { Search, School, Box, Phone, MapPin } from 'lucide-react';
import { getAllSubmissions } from '../lib/supabaseApi';

const OrganizerArchive = () => {
  const { round } = useParams(); // Get the current round from the URL (e.g., "1" or "2")
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await getAllSubmissions(); // Fetches data from Supabase
      if (data) setSubmissions(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter logic: Matches search term AND the current URL round
  const filteredData = submissions.filter(sub => {
    const matchesSearch = 
      sub.participants?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.participant_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Convert URL round string to number for comparison
    const matchesRound = sub.round_number === parseInt(round); 
    
    return matchesSearch && matchesRound;
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* NAVIGATION TABS: To switch between pages easily */}
        <div className="flex gap-4 mb-8">
          <Link 
            to="/admin/archive/1" 
            className={`px-6 py-2 rounded-xl font-bold transition-all ${round === '1' ? 'bg-purple-600 text-white' : 'bg-[#1a1a1a] text-gray-500 border border-gray-800'}`}
          >
            Round 1
          </Link>
          <Link 
            to="/admin/archive/2" 
            className={`px-6 py-2 rounded-xl font-bold transition-all ${round === '2' ? 'bg-blue-600 text-white' : 'bg-[#1a1a1a] text-gray-500 border border-gray-800'}`}
          >
            Round 2
          </Link>
        </div>

        <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            MASTER ARCHIVE: ROUND {round}
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
            {filteredData.length > 0 ? (
              filteredData.map((sub) => (
                <div key={sub.id} className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden flex flex-col lg:flex-row hover:border-purple-500/50 transition-colors shadow-2xl">
                  {/* IMAGE VIEW */}
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
                      <div className="flex items-center gap-2"><MapPin size={16} className="text-gray-600"/> {sub.participants?.department}</div>
                      <div className="flex items-center gap-2"><Box size={16} className="text-gray-600"/> Year: {sub.participants?.year_of_study}</div>
                      <div className="flex items-center gap-2"><Phone size={16} className="text-gray-600"/> {sub.participants?.phone_number}</div>
                    </div>

                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                      <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Master AI Prompt</h4>
                      <p className="text-gray-300 italic text-sm leading-relaxed">"{sub.ai_prompt}"</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-gray-600 border-2 border-dashed border-gray-800 rounded-3xl">
                No submissions found for Round {round}.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerArchive;