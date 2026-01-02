"use client";

import { useEffect, useState } from "react";
import { plannerApi } from "@/lib/api";
import { BookOpen, Calendar, Plus, BrainCircuit, CheckCircle2, Circle, Loader2, Sparkles, X } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

export default function PlannerPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("Final Exams Prep");
  const [examDate, setExamDate] = useState("");
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

  const toggleTask = async (planId: string, taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "completed" ? "pending" : "completed";
      await plannerApi.updateTask(planId, taskId, { status: newStatus });
      fetchPlans();
    } catch {
      toast.error("Failed to update task");
    }
  };

  if (loading) return <div className="skeleton w-full h-screen" />;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">AI Study Planner</h1>
          <p className="text-white/60">Generate and track personalized study schedules with GPT-4o.</p>
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
                <label className="text-xs font-semibold uppercase tracking-wider text-white/40 ml-1">Plan Title</label>
                <Input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Finals Prep" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/40 ml-1">Exam Date</label>
                <Input required type="date" value={examDate} onChange={e => setExamDate(e.target.value)} />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/40 ml-1">Subjects to focus on</label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setSubjects([...subjects, {name: '', weakLevel: 3}])} className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10">
                    <Plus className="w-3.5 h-3.5" /> Add Subject
                  </Button>
                </div>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {subjects.map((sub, i) => (
                    <div key={i} className="flex gap-3 items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <Input 
                        className="bg-transparent border-0 h-9" 
                        placeholder="Subject (e.g. Physics)"
                        value={sub.name}
                        onChange={e => {
                          const newSubs = [...subjects];
                          newSubs[i].name = e.target.value;
                          setSubjects(newSubs);
                        }}
                      />
                      <div className="flex flex-col items-center min-w-[100px]">
                        <span className="text-[10px] text-white/40 mb-1 w-20 text-center">Weakness ({sub.weakLevel})</span>
                        <input 
                          type="range" min="1" max="5" 
                          className="w-20 h-1.5 accent-amber-500 bg-white/10 rounded-full appearance-none cursor-pointer" 
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

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="border-white/10 text-white/60">Cancel</Button>
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
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 border-white/10 mt-10 bg-white/[0.02]">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
            <BookOpen className="w-10 h-10 text-amber-400" />
          </div>
          <CardTitle className="text-2xl mb-3">No active study plans</CardTitle>
          <CardDescription className="max-w-md text-lg mb-8">
            Harness the power of AI to create a hyper-personalized roadmap for your academic success.
          </CardDescription>
          <Button variant="premium" size="lg" onClick={() => setShowModal(true)}>
             <Sparkles className="w-5 h-5" /> Start AI Generation
          </Button>
        </Card>
      ) : (
        <div className="space-y-12 mt-10">
          {plans.map((plan) => (
            <Card key={plan._id} className="p-0 border-white/5 overflow-hidden shadow-2xl shadow-amber-500/5">
              <div className="p-6 md:p-10 relative">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-[100px] -z-10" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-8 mb-8">
                  <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-3xl font-bold text-white tracking-tight">{plan.title}</h2>
                        <span className="badge badge-purple px-3 py-1 text-xs">{plan.status}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-6 text-sm text-white/50">
                          <span className="flex items-center gap-2 font-medium bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                            <Calendar className="w-4 h-4 text-amber-400"/> Exam Date: <span className="text-white">{format(new Date(plan.examDate), 'MMMM dd, yyyy')}</span>
                          </span>
                      </div>
                      <Card className="mt-6 bg-white/5 border-amber-500/20 p-4 border-l-4 rounded-xl">
                        <p className="text-white/70 leading-relaxed italic text-sm">AI Recommendation: {plan.aiSummary}</p>
                      </Card>
                  </div>
                  
                  <div className="w-full md:w-64 space-y-4">
                      <div className="flex justify-between items-end">
                          <span className="text-white/40 text-sm font-semibold uppercase tracking-wider">Overall Progress</span>
                          <span className="text-amber-400 font-black text-2xl">{plan.progressPercent}%</span>
                      </div>
                      <Progress value={plan.progressPercent} className="h-3" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plan.tasks.map((task: any) => {
                    const isDone = task.status === "completed";
                    return (
                      <Card 
                        key={task._id} 
                        onClick={() => toggleTask(plan._id, task._id, task.status)}
                        className={`group relative overflow-hidden transition-all duration-300 cursor-pointer hover:border-amber-500/30 ${
                          isDone 
                          ? "bg-white/5 border-white/5 opacity-50 grayscale select-none" 
                          : "bg-white/[0.03] border-white/10 hover:shadow-xl hover:shadow-amber-500/10 active:scale-95"
                        }`}
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                             {isDone ? (
                               <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                 <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                               </div>
                             ) : (
                               <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-amber-500/50 transition-colors">
                                 <Circle className="w-5 h-5 text-white/20 group-hover:text-amber-400" />
                               </div>
                             )}
                             <span className={`text-[10px] font-black px-2.5 py-1 rounded-md border uppercase tracking-widest ${
                               task.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 
                               task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                               'bg-teal-500/10 text-teal-400 border-teal-500/20'
                             }`}>
                               {task.priority}
                             </span>
                          </div>
                          <p className="text-xs font-bold text-amber-400 mb-1 uppercase tracking-wider">{task.subject}</p>
                          <h4 className={`text-white font-bold leading-tight mb-4 ${isDone ? "line-through opacity-50" : ""}`}>{task.topic}</h4>
                          <div className="flex justify-between items-center text-xs text-white/40 font-medium">
                             <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {format(new Date(task.date), 'MMM dd')}</span>
                             <span className="bg-white/5 px-2 py-1 rounded">{task.duration}m</span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
