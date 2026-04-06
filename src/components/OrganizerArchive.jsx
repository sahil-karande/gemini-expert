// src/components/OrganizerArchive.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, School, Box, Phone, MapPin, ArrowRight } from 'lucide-react'; // Added ArrowRight icon
// src/components/OrganizerArchive.jsx (around line 5-6)
import { getAllSubmissions, updateSubmissionRound } from '../lib/supabaseApi';// Import the update function

const OrganizerArchive = () => {
  const { round } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const { data } = await getAllSubmissions();
    if (data) setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler to move participant to Round 2
  const handleMoveToRound2 = async (submissionId) => {
    const confirmMove = window.confirm("Are you sure you want to promote this participant to Round 2?");
    if (!confirmMove) return;

    try {
      const { error } = await updateSubmissionRound(submissionId, 2);
      if (error) throw error;
      
      // Refresh the list to reflect changes
      fetchData(); 
      alert("Participant successfully moved to Round 2!");
    } catch (err) {
      console.error("Error moving participant:", err);
      alert("Failed to move participant.");
    }
  };

  const filteredData = submissions.filter(sub => {
    const matchesSearch = 
      sub.participants?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.participant_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRound = sub.round_number === parseInt(round);
    
    return matchesSearch && matchesRound;
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* NAVIGATION TABS */}
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

        {/* ... Header and Search code ... */}

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
                  <div className="p-6 flex-1 flex flex-col">
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

                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 mb-6">
                      <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Master AI Prompt</h4>
                      <p className="text-gray-300 italic text-sm leading-relaxed">"{sub.ai_prompt}"</p>
                    </div>

                    {/* CONDITIONAL ACTION BUTTON: Only show in Round 1 */}
                    {round === '1' && (
                      <div className="mt-auto pt-4 border-t border-gray-800 flex justify-end">
                        <button 
                          onClick={() => handleMoveToRound2(sub.id)}
                          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                        >
                          Move to Round 2 <ArrowRight size={18} />
                        </button>
                      </div>
                    )}
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