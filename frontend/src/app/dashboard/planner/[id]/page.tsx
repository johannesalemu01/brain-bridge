"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { plannerApi } from "@/lib/api";
import { Calendar, CheckCircle2, Loader2, RefreshCw, AlertCircle, Clock, ArrowLeft, Trash2, Play, Pause, Square, Mic } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";

export default function PlannerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const planId = resolvedParams.id;
  const router = useRouter();

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Focus Mode State
  const [activeTaskForPomodoro, setActiveTaskForPomodoro] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      if (activeTaskForPomodoro) {
        toast.success("Focus block completed! Great job.");
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, activeTaskForPomodoro]);

  const toggleTimer = () => setTimerActive(!timerActive);
  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(25 * 60);
  };
  const closePomodoro = () => {
    setTimerActive(false);
    setActiveTaskForPomodoro(null);
  };


  const fetchPlan = async () => {
    try {
      const { data } = await plannerApi.getOne(planId);
      setPlan(data.data.plan);
    } catch {
      toast.error("Failed to load plan details");
      router.push("/dashboard/planner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (planId) {
      fetchPlan();
    }
  }, [planId]);

  const handleAdjust = async () => {
    setAdjusting(true);
    try {
      await plannerApi.adjust(planId);
      toast.success("AI has optimized your schedule!");
      fetchPlan();
    } catch {
      toast.error("Adjustment failed");
    } finally {
      setAdjusting(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await plannerApi.updateTask(planId, taskId, { status: newStatus });
      fetchPlan();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this study plan?")) return;
    setDeleting(true);
    try {
      await plannerApi.delete(planId);
      toast.success("Plan deleted successfully");
      router.push("/dashboard/planner");
    } catch {
      toast.error("Failed to delete plan");
      setDeleting(false);
    }
  };

  if (loading) return <div className="skeleton w-full h-[60vh] rounded-3xl" />;
  if (!plan) return <div className="text-white">Plan not found</div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header and Back Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full bg-white/5 hover:bg-white/20 text-white border border-white/10">
            <Link href="/dashboard/planner">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">{plan.title}</h1>
            <p className="text-white/60 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              Exam Date: <span className="font-semibold text-white">{format(new Date(plan.examDate), 'MMMM dd, yyyy')}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {plan.tasks.some((t: any) => t.status === 'skipped') && (
            <Button 
              variant="premium" 
              onClick={handleAdjust}
              disabled={adjusting}
              className="shadow-lg shadow-amber-500/20"
            >
              {adjusting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {adjusting ? "Adjusting..." : "Adjust Plan with AI"}
            </Button>
          )}
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 shadow-none"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <Card className="p-0 border-white/5 overflow-hidden shadow-2xl shadow-amber-500/5 bg-transparent">
        <div className="p-6 md:p-10 relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-[100px] -z-10" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-8 mb-8">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="badge badge-purple px-4 py-1.5 text-sm">{plan.status}</span>
                </div>
                <Card className="mt-4 bg-amber-500/10 border-amber-500/30 p-5 border-l-4 rounded-xl shadow-inner shadow-amber-500/5">
                  <p className="text-white/90 leading-relaxed italic text-base"><span className="font-bold text-amber-400 not-italic">AI Recommendation:</span> {plan.aiSummary}</p>
                </Card>
            </div>
            
            <div className="w-full md:w-80 space-y-5 bg-black/20 p-6 rounded-2xl border border-white/10">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-white/60 text-xs font-semibold uppercase tracking-wider block">Overall Progress</span>
                      <span className="text-amber-400 font-black text-4xl">{plan.progressPercent}%</span>
                    </div>
                </div>
                <Progress value={plan.progressPercent} className="h-3 bg-white/10" />
                <div className="flex gap-4 text-[11px] font-bold uppercase tracking-widest text-white/60 bg-black/40 p-3 rounded-xl justify-center">
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {plan.tasks.filter((t:any)=>t.status==='completed').length} Done</span>
                  <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500" /> {plan.tasks.filter((t:any)=>t.status==='skipped').length} Skipped</span>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plan.tasks.map((task: any) => {
              const isDone = task.status === "completed";
              const isSkipped = task.status === "skipped";
              return (
                <Card 
                  key={task._id} 
                  className={`group relative overflow-hidden transition-all duration-300 shadow-md ${
                    isDone 
                    ? "bg-emerald-950/30 border-emerald-500/20 opacity-70 grayscale-[0.3]" 
                    : isSkipped
                    ? "bg-red-950/30 border-red-500/30"
                    : "bg-white/10 border-white/20 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/20"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex gap-2">
                         <div className="flex gap-2">
                           <Button 
                             size="icon" 
                             variant="ghost" 
                             className={`w-9 h-9 rounded-full border transition-all ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 text-white/40'}`}
                             onClick={() => updateTaskStatus(task._id, isDone ? 'pending' : 'completed')}
                           >
                             <CheckCircle2 className="w-4 h-4" />
                           </Button>
                           {!isDone && (
                             <Button 
                               size="icon" 
                               variant="ghost" 
                               className={`w-9 h-9 rounded-full border transition-all ${isSkipped ? 'bg-red-500 border-red-500 text-white' : 'border-white/10 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 text-white/40'}`}
                               onClick={() => updateTaskStatus(task._id, isSkipped ? 'pending' : 'skipped')}
                             >
                               <Trash2 className="w-4 h-4" />
                             </Button>
                           )}
                         </div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                         <span className={`text-[10px] font-black px-2.5 py-1 rounded-md border uppercase tracking-widest ${
                           task.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 
                           task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                           'bg-teal-500/10 text-teal-400 border-teal-500/20'
                         }`}>
                           {task.priority}
                         </span>
                       </div>
                    </div>
                    <p className="text-xs font-bold text-amber-400 mb-1 uppercase tracking-wider drop-shadow-sm">{task.subject}</p>
                    <h4 className={`text-white text-lg font-bold leading-tight mb-5 ${isDone ? "line-through opacity-70" : ""}`}>{task.topic}</h4>
                    <div className="flex justify-between items-center text-xs text-white/70 font-semibold bg-black/20 p-2.5 rounded-lg mb-4">
                       <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-white/50" /> {format(new Date(task.date), 'MMM dd')}</span>
                       <span className="flex items-center gap-1 text-emerald-400"><Clock className="w-4 h-4" /> {task.duration}m</span>
                    </div>
                    
                    {!isDone && !isSkipped && (
                      <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                        <Button 
                          onClick={() => {
                            setActiveTaskForPomodoro(task);
                            resetTimer();
                          }}
                          className="flex-1 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold border-0"
                        >
                          <Play className="w-4 h-4 mr-1.5" /> Focus Mode
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => router.push(`/dashboard/voice?subject=${encodeURIComponent(task.subject)}&topic=${encodeURIComponent(task.topic)}`)}
                          className="flex-1 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 bg-transparent"
                        >
                          <Mic className="w-4 h-4 mr-1.5" /> Ask AI Tutor
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Focus Mode Pomodoro Dialog */}
      <Dialog open={!!activeTaskForPomodoro} onOpenChange={(open) => !open && closePomodoro()}>
        <DialogContent className="sm:max-w-md bg-black/95 border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="text-center text-amber-400 flex flex-col items-center gap-2">
              <Clock className="w-8 h-8" />
              Focus Mode
            </DialogTitle>
            <DialogDescription className="text-center text-white/60">
              Stay focused on <strong className="text-white">{activeTaskForPomodoro?.topic}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 relative">
             <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-[80px] -z-10" />
             <div className="text-7xl font-black text-white font-mono tracking-tighter mb-8 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
               {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
               {String(timeLeft % 60).padStart(2, '0')}
             </div>
             
             <div className="flex gap-4">
               <Button 
                variant="outline" 
                size="icon" 
                className="w-14 h-14 rounded-full border-white/20 hover:bg-white/10 text-white bg-transparent" 
                onClick={resetTimer}
               >
                 <Square className="w-5 h-5 fill-current" />
               </Button>
               <Button 
                variant="premium" 
                className="w-20 h-14 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)] border-0" 
                onClick={toggleTimer}
               >
                 {timerActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
               </Button>
             </div>
          </div>
          <DialogFooter className="sm:justify-center">
             <Button variant="ghost" onClick={closePomodoro} className="text-white/40 hover:text-white">Exit Focus Mode</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
