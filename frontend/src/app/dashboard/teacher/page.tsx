"use client";

import { useEffect, useState } from "react";
import { qaApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { CheckCircle, ShieldAlert, X, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

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

  if (user?.role !== "teacher" && user?.role !== "admin") {
    return <div className="p-8 text-center text-white/50">Access Denied. Teachers only.</div>;
  }

  if (loading) return <div className="skeleton w-full h-screen" />;

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            Teacher Panel <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </h1>
        <p className="text-white/60">Review AI answers and verify them for the public knowledge base.</p>
      </div>

      <div className="flex gap-4">
          <div className="glass p-6 rounded-xl flex-1 border-emerald-500/30 bg-emerald-500/5">
              <p className="text-emerald-400 font-bold mb-1">Pending Verifications</p>
              <h2 className="text-3xl text-white font-black">{pendingQas.length}</h2>
          </div>
      </div>

      {pendingQas.length === 0 ? (
        <div className="glass p-12 text-center border-dashed border-white/10 mt-8 rounded-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
            <p className="text-white/50 max-w-sm">There are no pending AI answers waiting for human verification.</p>
        </div>
      ) : (
        <div className="grid gap-6 mt-8">
            {pendingQas.map((qa) => (
                <div key={qa._id} className="glass p-6 md:p-8 rounded-2xl relative border-l-4 border-amber-500">
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
                        <ShieldAlert className="w-3 h-3" /> Requires Review
                    </div>
                    
                    <div className="text-sm text-white/50 mb-2">Subject: <span className="text-white">{qa.subject}</span> | Language: <span className="text-white">{qa.language}</span></div>
                    <h3 className="text-xl font-bold text-white mb-4">Student Asked: {qa.question}</h3>
                    
                    {verifyingId === qa._id ? (
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-white/70 block">Edit AI Answer before approval:</label>
                            <textarea 
                              className="input-field min-h-[150px] resize-y"
                              value={editedAnswer}
                              onChange={e => setEditedAnswer(e.target.value)}
                            />
                            <div className="flex gap-3">
                                <button onClick={() => handleVerify(qa._id)} className="btn-primary bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20 border-0">
                                    <CheckCircle className="w-4 h-4" /> Approve & Publish
                                </button>
                                <button onClick={() => setVerifyingId(null)} className="btn-secondary">
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4 opacity-70">
                                <p className="text-xs text-violet-400 font-bold mb-2 uppercase">AI Draft Response</p>
                                <p className="text-white/80 text-sm">{qa.aiAnswer}</p>
                            </div>
                            <button 
                                onClick={() => {
                                    setEditedAnswer(qa.aiAnswer);
                                    setVerifyingId(qa._id);
                                }} 
                                className="btn-secondary text-emerald-400 border-emerald-400/30 hover:bg-emerald-500/10 hover:border-emerald-400/50"
                            >
                                Review & Verify Answer
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
