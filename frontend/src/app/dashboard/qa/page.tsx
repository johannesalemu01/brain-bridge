"use client";

import { useEffect, useState } from "react";
import { qaApi } from "@/lib/api";
import { MessagesSquare, Search, ThumbsUp, CheckCircle, BrainCircuit, Globe, Loader2, User, Sparkles, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Q&A Knowledge Base</h1>
          <p className="text-white/60">Search verified answers or ask AI for instant explanations.</p>
        </div>
      </div>

      {/* ── Ask Form ── */}
      <Card className="p-0 border-amber-500/20 bg-amber-500/[0.02] shadow-2xl shadow-amber-500/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -z-10" />
         <CardHeader className="p-8 pb-4">
             <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20">
                    <HelpCircle className="w-6 h-6 text-amber-400" />
                </div>
                Ask BrainBridge AI
             </CardTitle>
             <CardDescription className="text-white/40">Enter your question and select a subject for a precise AI response.</CardDescription>
         </CardHeader>
         <CardContent className="p-8 pt-0">
            <form onSubmit={handleAsk} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <Input 
                      required
                      type="text" 
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="md:w-1/3 h-12 bg-white/5 border-white/10" 
                      placeholder="Subject (e.g. History)" 
                    />
                    <select 
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                      className="md:w-1/4 h-12 rounded-xl border border-white/10 bg-card px-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-500/50 appearance-none outline-none transition-all"
                    >
                      <option value="en">English</option>
                      <option value="am">Amharic (አማርኛ)</option>
                    </select>
                </div>
                <div className="relative group">
                    <textarea 
                      required
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                      className="w-full min-h-[140px] rounded-2xl border border-white/10 bg-white/5 p-6 pb-12 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 transition-all resize-none" 
                      placeholder="What would you like to learn today?" 
                    />
                    <div className="absolute right-4 bottom-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-amber-400/40 transition-colors">
                        <Sparkles className="w-3 h-3" /> GPT-4o Powered
                    </div>
                </div>
                <Button type="submit" disabled={asking} variant="premium" className="px-10 h-14 text-base shadow-xl shadow-amber-500/20">
                    {asking ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessagesSquare className="w-5 h-5" />}
                    {asking ? "Generating Answer..." : "Get Instant Answer"}
                </Button>
            </form>
         </CardContent>
      </Card>

      {/* ── Search & Results ── */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight shrink-0">Community Knowledge</h2>
            <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <Input 
                    type="text" 
                    placeholder="Search for answers across all subjects..." 
                    className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl"
                    onChange={e => {
                        const val = e.target.value;
                        setTimeout(() => setSearch(val), 500);
                    }}
                />
            </div>
        </div>

        <div className="grid gap-8">
            {qas.length === 0 ? (
                <Card className="p-20 text-center border-dashed border-white/10 bg-white/[0.02]">
                    <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/40 font-medium">No results found for your search.</p>
                </Card>
            ) : (
                qas.map((qa, index) => (
                    <Card key={qa._id} className="p-0 border-white/5 overflow-hidden group hover:border-amber-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/5">
                        <div className="p-8 md:p-10">
                            {qa.isVerified && (
                                <div className="absolute -top-3 -right-3 z-10">
                                    <span className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg shadow-emerald-500/30 ring-4 ring-background">
                                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                                    </span>
                                </div>
                            )}
                            
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-white/10 flex items-center justify-center overflow-hidden">
                                        {qa.student?.avatar ? (
                                            <img src={qa.student.avatar} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <User className="w-5 h-5 text-white/30" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm tracking-tight">{qa.student?.name || 'Anonymous'}</p>
                                        <p className="text-white/30 text-xs font-medium">{new Date(qa.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border",
                                        qa.language === 'am' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    )}>
                                        {qa.language === 'am' ? 'አማርኛ' : 'English'}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                        {qa.subject}
                                    </span>
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-white mb-8 group-hover:text-amber-400 transition-colors leading-tight">{qa.question}</h3>
                            
                            <div className="bg-white/5 rounded-3xl p-8 border border-white/5 relative shadow-inner overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/5 rounded-full blur-[40px] -z-10" />
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                                    {qa.isVerified ? (
                                        <div className="flex items-center gap-2.5 text-emerald-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">Educational Verified Answer</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2.5 text-amber-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full">AI Explanatory Response</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-white/80 leading-relaxed text-base whitespace-pre-wrap font-medium">
                                    {qa.isVerified ? qa.teacherAnswer : qa.aiAnswer}
                                </p>
                            </div>
                            
                            <div className="mt-8 flex items-center justify-between">
                                <button 
                                    onClick={() => handleUpvote(qa._id, index)}
                                    className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-white/50 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 transition-all group/upvote"
                                >
                                    <ThumbsUp className="w-4 h-4 group-hover/upvote:scale-125 transition-transform" />
                                    <span className="text-sm font-bold">Thoughtful Explanation ({qa.upvotes})</span>
                                </button>
                                
                                {qa.isVerified && (
                                    <div className="flex items-center gap-2 text-white/30 text-xs font-semibold uppercase tracking-wider italic">
                                        Verified By {qa.teacher?.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))
            )}
        </div>
      </div>
    </div>
  );
}
