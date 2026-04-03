"use client";

import { useEffect, useState } from "react";
import { plannerApi } from "@/lib/api";
import { BookOpen, Calendar, Plus, BrainCircuit, CheckCircle2, Loader2, Sparkles, X, Clock, ArrowRight, TrendingUp, Target, Award } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";

export default function PlannerPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("Final Exams Prep");
  const [examDate, setExamDate] = useState("");
  const [availableHoursPerDay, setAvailableHoursPerDay] = useState(2);

  const [subjects, setSubjects] = useState([{ name: "", weakLevel: 3 }]);

  const fetchPlans = async () => {
    try {
      const { data } = await plannerApi.getAll();
      setPlans(data.data.plans);
    } catch {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const payload = {
        title,
        examDate,
        availableHoursPerDay,
        subjects: subjects.filter((s) => s.name.trim() !== ""),
      };
      await plannerApi.generate(payload);
      toast.success("AI generated your study plan!");
      setShowModal(false);
      fetchPlans();
    } catch {
      toast.error("Generation failed");
    } finally {
      setGenerating(false);
    }
  };




  if (loading) return <div className="skeleton w-full h-screen" />;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">AI Study Planner</h1>
          <p className="text-white/80 font-medium">Generate and track personalized study schedules with GPT-4o.</p>
        </div>
        
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>
            <Button variant="premium" size="lg" className="shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
              Generate New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-amber-500/20">
                    <BrainCircuit className="w-6 h-6 text-amber-400" />
                </div>
                <DialogTitle>Generate Study Plan</DialogTitle>
              </div>
              <DialogDescription>
                Let AI create a custom schedule based on your weak subjects and exam date.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleGenerate} className="space-y-5 mt-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/70 ml-1">Plan Title</label>
                <Input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Finals Prep" className="bg-black/20 text-white placeholder:text-white/40 border-white/20 focus:border-amber-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/70 ml-1">Exam Date</label>
                  <Input required type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="bg-black/20 text-white border-white/20 focus:border-amber-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/70 ml-1">Study Hours/Day</label>
                  <div className="relative">
                    <Input required type="number" min="0.5" max="12" step="0.5" value={availableHoursPerDay} onChange={e => setAvailableHoursPerDay(Number(e.target.value))} className="pr-10 bg-black/20 text-white border-white/20 focus:border-amber-500" />
                    <Clock className="absolute right-3 top-2.5 w-4 h-4 text-white/40" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/70 ml-1">Subjects to focus on</label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setSubjects([...subjects, {name: '', weakLevel: 3}])} className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/20">
                    <Plus className="w-3.5 h-3.5" /> Add Subject
                  </Button>
                </div>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {subjects.map((sub, i) => (
                    <div key={i} className="flex gap-3 items-center bg-black/20 p-3 rounded-xl border border-white/20">
                      <Input 
                        className="bg-transparent border-0 h-9 text-white placeholder:text-white/40" 
                        placeholder="Subject (e.g. Physics)"
                        value={sub.name}
                        onChange={e => {
                          const newSubs = [...subjects];
                          newSubs[i].name = e.target.value;
                          setSubjects(newSubs);
                        }}
                      />
                      <div className="flex flex-col items-center min-w-[100px]">
                        <span className="text-[10px] text-white/70 font-semibold mb-1 w-20 text-center">Weakness ({sub.weakLevel})</span>
                        <input 
                          type="range" min="1" max="5" 
                          className="w-20 h-1.5 accent-amber-500 bg-white/20 rounded-full appearance-none cursor-pointer" 
                          value={sub.weakLevel}
                          onChange={e => {
                            const newSubs = [...subjects];
                            newSubs[i].weakLevel = Number(e.target.value);
                            setSubjects(newSubs);
                          }}
                        />
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-white/20 hover:text-red-400" onClick={() => setSubjects(subjects.filter((_, idx) => idx !== i))}>
                          <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="pt-4 border-t border-white/10">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white">Cancel</Button>
                <Button type="submit" disabled={generating} variant="premium">
                  {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  {generating ? "AI is generating..." : "Create Schedule"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {plans.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 border-white/20 mt-10 bg-black/20">
          <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mb-6">
            <BookOpen className="w-10 h-10 text-amber-400" />
          </div>
          <CardTitle className="text-2xl mb-3 text-white">No active study plans</CardTitle>
          <CardDescription className="max-w-md text-lg mb-8 text-white/70">
            Harness the power of AI to create a hyper-personalized roadmap for your academic success.
          </CardDescription>
          <Button variant="premium" size="lg" onClick={() => setShowModal(true)}>
             <Sparkles className="w-5 h-5" /> Start AI Generation
          </Button>
        </Card>
      ) : (
        <div className="space-y-10 mt-10">
          
          {/* Global Analytics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/20 border-white/5 p-6 flex items-center gap-5 overflow-hidden relative">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
               <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Target className="w-7 h-7 text-amber-500" />
               </div>
               <div>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Active Plans</p>
                  <p className="text-3xl font-black text-white">{plans.length}</p>
               </div>
            </Card>
            <Card className="bg-black/20 border-white/5 p-6 flex items-center gap-5 overflow-hidden relative">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
               <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-7 h-7 text-emerald-500" />
               </div>
               <div className="w-full">
                  <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Avg Completion</p>
                  <div className="flex items-end justify-between mb-2">
                     <p className="text-3xl font-black text-white">{Math.round(plans.reduce((acc, p) => acc + (p.progressPercent || 0), 0) / Math.max(plans.length, 1))}%</p>
                  </div>
                  <Progress value={Math.round(plans.reduce((acc, p) => acc + (p.progressPercent || 0), 0) / Math.max(plans.length, 1))} className="h-1.5 bg-white/10" />
               </div>
            </Card>
            <Card className="bg-black/20 border-white/5 p-6 flex items-center gap-5 overflow-hidden relative">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
               <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Award className="w-7 h-7 text-purple-500" />
               </div>
               <div>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Fully Mastered</p>
                  <p className="text-3xl font-black text-white">{plans.filter(p => p.progressPercent === 100).length}</p>
               </div>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-amber-500" /> Your Active Roadmaps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Link key={plan._id} href={`/dashboard/planner/${plan._id}`}>
                  <Card className="p-6 border-white/5 bg-white/5 hover:bg-white/10 hover:border-amber-500/30 transition-all cursor-pointer h-full flex flex-col hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 group">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-white tracking-tight">{plan.title}</h2>
                      <span className="badge badge-purple px-2 py-0.5 text-[10px]">{plan.status}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs font-semibold text-white/50 mb-6 bg-black/20 w-fit px-3 py-1.5 rounded-md border border-white/10">
                      <Calendar className="w-3.5 h-3.5 text-amber-400"/> {format(new Date(plan.examDate), 'MMM dd, yyyy')}
                    </div>
                    
                    <div className="mt-auto space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between items-end">
                          <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Progress</span>
                          <span className="text-amber-400 font-bold text-sm">{plan.progressPercent}%</span>
                        </div>
                        <Progress value={plan.progressPercent} className="h-1.5 bg-white/10" />
                      </div>
                      
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-white/40 group-hover:text-amber-400 transition-colors">
                        <span className="text-xs font-semibold">View Details</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
