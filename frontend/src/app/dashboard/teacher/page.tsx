"use client";

import { useEffect, useState } from "react";
import { qaApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { CheckCircle, ShieldAlert, X, ShieldCheck, Clock, BrainCircuit, History } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TeacherPanel() {
  const [user, setUser] = useState<any>(null);
  const [pendingQas, setPendingQas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Verification Edit State
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [editedAnswer, setEditedAnswer] = useState("");

  const fetchPending = async () => {
    try {
      const { data } = await qaApi.getPending();
      setPendingQas(data.data.qas);
    } catch {
      toast.error("Failed to load pending questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUser(getUser());
    fetchPending();
  }, []);

  const handleVerify = async (id: string) => {
    try {
      await qaApi.verify(id, { teacherAnswer: editedAnswer });
      toast.success("Answer verified and published!");
      setVerifyingId(null);
      fetchPending();
    } catch {
      toast.error("Failed to verify");
    }
  };

  if (!user || (user.role !== "teacher" && user.role !== "admin")) {
    return <Card className="p-20 text-center text-white/50 border-white/5 bg-white/[0.02]">Access Denied. Teachers only.</Card>;
  }

  if (loading) return <div className="skeleton w-full h-screen" />;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            Teacher Panel <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </h1>
          <p className="text-white/60">Review, edit, and verify AI answers to maintain high educational quality.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-emerald-500/30 bg-emerald-500/[0.03] hover:bg-emerald-500/[0.06] transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Clock className="w-20 h-20 text-white" />
              </div>
              <p className="text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-3">Pending Verification</p>
              <h2 className="text-4xl text-white font-black tracking-tight">{pendingQas.length}</h2>
          </Card>
          <Card className="p-6 border-white/5 bg-white/5 opacity-50 relative overflow-hidden">
                <p className="text-white/40 font-black uppercase tracking-widest text-[10px] mb-3">Total Verified</p>
                <h2 className="text-4xl text-white font-black tracking-tight">128</h2>
          </Card>
          <Card className="p-6 border-white/5 bg-white/5 opacity-50 relative overflow-hidden">
                <p className="text-white/40 font-black uppercase tracking-widest text-[10px] mb-3">Recent Activity</p>
                <h2 className="text-4xl text-white font-black tracking-tight">Today</h2>
          </Card>
      </div>

      <div className="space-y-8 mt-12">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            Pending Questions <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        </h2>

        {pendingQas.length === 0 ? (
            <Card className="p-24 text-center border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <CardTitle className="text-2xl mb-2">All tasks completed!</CardTitle>
                <CardDescription className="max-w-xs mx-auto text-base">
                    Great job! All AI-generated answers are verified for the public knowledge base.
                </CardDescription>
            </Card>
        ) : (
            <div className="grid gap-8">
                {pendingQas.map((qa) => (
                    <Card key={qa._id} className={cn(
                        "p-0 border-white/5 overflow-hidden transition-all duration-300",
                        verifyingId === qa._id ? "border-violet-500/50 shadow-2xl shadow-violet-500/10" : "hover:border-amber-500/30"
                    )}>
                        <div className="p-8 md:p-10 relative">
                            <div className="absolute top-6 right-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 shadow-lg shadow-amber-500/5 ring-4 ring-[#0b1021]">
                                <ShieldAlert className="w-3.5 h-3.5" /> High Urgency
                            </div>
                            
                            <div className="flex gap-4 items-center text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">
                                <span className="bg-white/5 px-2 py-1 rounded">{qa.subject}</span>
                                <span>|</span>
                                <span className={cn(
                                    qa.language === 'am' ? 'text-cyan-400' : 'text-violet-400'
                                )}>{qa.language === 'am' ? 'አማርኛ' : 'English'}</span>
                            </div>

                            <CardHeader className="p-0 mb-8">
                                <CardTitle className="text-2xl leading-tight text-white/90">Student Question: {qa.question}</CardTitle>
                            </CardHeader>
                            
                            {verifyingId === qa._id ? (
                                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-violet-400 ml-1">Edit AI Answer for Publication</label>
                                        <textarea 
                                          className="w-full min-h-[180px] rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6 text-white text-base focus:outline-none focus:border-violet-500/50 transition-all resize-y shadow-inner custom-scrollbar leading-relaxed"
                                          value={editedAnswer}
                                          onChange={e => setEditedAnswer(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-4 pt-2">
                                        <Button onClick={() => handleVerify(qa._id)} variant="premium" className="h-12 px-8 flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20 border-0">
                                            <CheckCircle className="w-4 h-4" /> Approve & Publish Verified Answer
                                        </Button>
                                        <Button onClick={() => setVerifyingId(null)} variant="outline" className="h-12 border-white/10 text-white/50">
                                            <X className="w-4 h-4" /> Discard Edits
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 opacity-80 group/draft relative transition-all hover:bg-white/[0.08] hover:opacity-100">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-[40px] -z-10" />
                                        <div className="flex items-center gap-2 mb-4 text-violet-400/60 font-black text-[10px] uppercase tracking-widest pb-3 border-b border-white/5 flex items-center gap-2">
                                            <BrainCircuit className="w-4 h-4" /> AI Generated Draft
                                        </div>
                                        <p className="text-white/80 text-base leading-relaxed whitespace-pre-wrap">{qa.aiAnswer}</p>
                                    </div>
                                    <Button 
                                        onClick={() => {
                                            setEditedAnswer(qa.aiAnswer);
                                            setVerifyingId(qa._id);
                                        }} 
                                        variant="outline"
                                        size="lg"
                                        className="h-14 px-8 text-emerald-400 border-emerald-400/30 hover:bg-emerald-500/10 hover:border-emerald-400/50 flex items-center gap-2 group/review"
                                    >
                                        Review Answer <CheckCircle className="w-5 h-5 group-hover/review:scale-125 transition-transform" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
