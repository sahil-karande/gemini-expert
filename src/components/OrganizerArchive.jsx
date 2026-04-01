import React, { useEffect, useState } from 'react';
import { Search, ExternalLink, BookOpen, MessageSquare, Image as ImageIcon, X } from 'lucide-react';
import { getAllSubmissions } from '../lib/supabaseClient';

const OrganizerArchive = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRound, setFilterRound] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await getAllSubmissions();
    if (data) setSubmissions(data);
    setLoading(false);
  };

  const filteredData = submissions.filter(sub => {
    const name = sub.participants?.full_name?.toLowerCase() || '';
    const email = sub.participant_email?.toLowerCase() || '';
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    const matchesRound = filterRound === 'all' || sub.round_number.toString() === filterRound;
    return matchesSearch && matchesRound;
  });

  return (
    <div className="min-h-screen bg-[#121212] p-4 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-[#1e1e1e] p-6 rounded-2xl border border-purple-500/20 shadow-2xl">
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Manager Archive
            </h1>
            <p className="text-gray-400 mt-1">Monitoring {submissions.length} massive data entries</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
              <input 
                placeholder="Search name or email..." 
                className="bg-[#121212] border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-full md:w-64 outline-none focus:border-blue-500 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-[#121212] border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-purple-500"
              onChange={(e) => setFilterRound(e.target.value)}
            >
              <option value="all">All Rounds</option>
              <option value="1">Round 1</option>
              <option value="2">Round 2</option>
            </select>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64 text-blue-400">Scanning Database...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.map((sub) => (
              <div 
                key={sub.id} 
                onClick={() => setSelectedSubmission(sub)}
                className="bg-[#1e1e1e] border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group cursor-pointer hover:shadow-[0_0_30px_rgba(37,99,235,0.15)]"
              >
                <div className="aspect-video w-full overflow-hidden relative bg-black">
                  <img 
                    src={sub.image_urls?.[0]} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    alt="AI Content"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                    Round {sub.round_number}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-1 group-hover:text-blue-400 transition-colors">{sub.participants?.full_name}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <BookOpen size={14} />
                    <span>{sub.participants?.college_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] tracking-widest text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded uppercase">
                      {sub.selected_theme}
                    </span>
                    <ExternalLink size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Deep-Dive View (Modal) */}
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="bg-[#1e1e1e] border border-gray-700 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative">
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Left: Images */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-mono text-blue-400 uppercase tracking-tighter flex items-center gap-2">
                      <ImageIcon size={16} /> Generated Visuals
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {selectedSubmission.image_urls.map((url, i) => (
                        <img key={i} src={url} className="w-full rounded-xl border border-white/5" alt="Master Prompt Result" />
                      ))}
                    </div>
                  </div>

                  {/* Right: Info */}
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{selectedSubmission.participants?.full_name}</h2>
                      <p className="text-purple-400 font-mono">{selectedSubmission.participant_email}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 bg-[#121212] p-6 rounded-2xl border border-white/5">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase">College</p>
                        <p className="text-sm font-medium">{selectedSubmission.participants?.college_name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase">Department</p>
                        <p className="text-sm font-medium">{selectedSubmission.participants?.department}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase">Year</p>
                        <p className="text-sm font-medium">{selectedSubmission.participants?.year_of_study}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 uppercase">Phone</p>
                        <p className="text-sm font-medium">{selectedSubmission.participants?.phone_number}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-mono text-purple-400 uppercase tracking-tighter flex items-center gap-2">
                        <MessageSquare size={16} /> Master AI Prompt
                      </h4>
                      <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 text-gray-300 italic leading-relaxed">
                        "{selectedSubmission.ai_prompt}"
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerArchive;