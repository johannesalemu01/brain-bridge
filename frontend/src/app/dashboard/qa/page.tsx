"use client";

import { useEffect, useState } from "react";
import { qaApi } from "@/lib/api";
import { MessagesSquare, Search, ThumbsUp, CheckCircle, BrainCircuit, Globe, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";

export default function QAPage() {
  const [qas, setQas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("");
  const [language, setLanguage] = useState("en");
  const [asking, setAsking] = useState(false);

  const fetchQAs = async () => {
    try {
      const { data } = await qaApi.getAll({ search });
      setQas(data.data.qas);
    } catch {
      toast.error("Failed to load knowledge base");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQAs();
  }, [search]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setAsking(true);
    try {
      await qaApi.ask({ question, subject, language });
      toast.success("AI answered your question!");
      setQuestion("");
      setSubject("");
      fetchQAs();
    } catch {
      toast.error("Failed to ask question");
    } finally {
      setAsking(false);
    }
  };

  const handleUpvote = async (id: string, index: number) => {
    try {
      const { data } = await qaApi.upvote(id);
      const newQas = [...qas];
      newQas[index].upvotes = data.data.upvotes;
      setQas(newQas);
    } catch {
      toast.error("Failed to upvote");
    }
  };

  if (loading) return <div className="skeleton w-full h-screen" />;

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Q&A Knowledge Base</h1>
        <p className="text-white/60">Ask AI, get instant answers, and explore verified questions.</p>
      </div>

      {/* ── Ask Form ── */}
      <div className="glass p-6 md:p-8 rounded-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -z-10" />
         <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            Ask a New Question <BrainCircuit className="w-5 h-5 text-purple-400" />
         </h2>
         <form onSubmit={handleAsk} className="space-y-4">
             <div className="flex flex-col md:flex-row gap-4">
                 <input 
                   required
                   type="text" 
                   value={subject}
                   onChange={e => setSubject(e.target.value)}
                   className="input-field md:w-1/3" 
                   placeholder="Subject (e.g. History)" 
                 />
                 <select 
                   value={language}
                   onChange={e => setLanguage(e.target.value)}
                   className="input-field md:w-1/4 appearance-none"
                 >
                   <option value="en" className="bg-slate-900">English</option>
                   <option value="am" className="bg-slate-900">Amharic</option>
                 </select>
             </div>
             <div className="relative">
                 <textarea 
                   required
                   value={question}
                   onChange={e => setQuestion(e.target.value)}
                   className="input-field min-h-[100px] resize-none pr-32" 
                   placeholder="Type your question here..." 
                 />
                 <div className="absolute right-3 bottom-4 text-xs text-white/30 hidden md:block">
                     Press Enter to submit
                 </div>
             </div>
             <button type="submit" disabled={asking} className="btn-primary">
                 {asking ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessagesSquare className="w-5 h-5" />}
                 {asking ? "AI is thinking..." : "Ask Question"}
             </button>
         </form>
      </div>

      {/* ── Search & Filters ── */}
      <div className="flex items-center gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input 
                type="text" 
                placeholder="Search knowledge base..." 
                className="input-field pl-12"
                onChange={e => {
                    const val = e.target.value;
                    // Debounce simple
                    setTimeout(() => setSearch(val), 500);
                }}
              />
          </div>
      </div>

      {/* ── Q&A Feed ── */}
      <div className="grid gap-6">
          {qas.length === 0 ? (
              <p className="text-white/40 text-center py-10">No questions found.</p>
          ) : (
              qas.map((qa, index) => (
                  <div key={qa._id} className="glass p-6 md:p-8 rounded-2xl relative">
                      {qa.isVerified && (
                          <div className="absolute -top-3 -right-3">
                              <span className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/20">
                                  <CheckCircle className="w-3.5 h-3.5" /> Teacher Verified
                              </span>
                          </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                  {qa.student?.avatar ? <img src={qa.student.avatar} className="w-full h-full rounded-full object-cover" alt="" /> : <User className="w-5 h-5 text-white/50" />}
                              </div>
                              <div>
                                  <p className="text-white font-medium text-sm">{qa.student?.name || 'Anonymous'}</p>
                                  <p className="text-white/40 text-xs">{new Date(qa.createdAt).toLocaleDateString()}</p>
                              </div>
                          </div>
                          <div className="flex gap-2">
                              <span className={\`badge \${qa.language === 'am' ? 'badge-cyan' : 'badge-purple'}\`}>
                                  {qa.language === 'am' ? 'Amharic' : 'English'}
                              </span>
                              <span className="badge badge-amber">{qa.subject}</span>
                          </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-4">{qa.question}</h3>
                      
                      <div className="bg-white/5 rounded-xl p-5 border border-white/5 relative">
                          <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-3">
                              {qa.isVerified ? (
                                  <div className="flex items-center gap-2 text-emerald-400">
                                      <CheckCircle className="w-4 h-4" />
                                      <span className="text-sm font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-300">Answer by {qa.teacher?.name}</span>
                                  </div>
                              ) : (
                                  <div className="flex items-center gap-2 text-violet-400">
                                      <BrainCircuit className="w-4 h-4" />
                                      <span className="text-sm font-bold bg-violet-500/10 px-2 py-0.5 rounded text-violet-300">AI Generated Answer</span>
                                  </div>
                              )}
                          </div>
                          <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-sm">
                              {qa.isVerified ? qa.teacherAnswer : qa.aiAnswer}
                          </p>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between">
                          <button 
                            onClick={() => handleUpvote(qa._id, index)}
                            className="flex items-center gap-2 text-white/50 hover:text-cyan-400 transition-colors bg-white/5 hover:bg-cyan-500/10 px-3 py-1.5 rounded-lg text-sm font-medium"
                          >
                              <ThumbsUp className="w-4 h-4" /> Helpful ({qa.upvotes})
                          </button>
                      </div>
                  </div>
              ))
          )}
      </div>
    </div>
  );
}
