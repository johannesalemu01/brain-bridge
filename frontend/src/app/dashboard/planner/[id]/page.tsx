"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { plannerApi } from "@/lib/api";
import { Calendar, CheckCircle2, Loader2, RefreshCw, AlertCircle, Clock, ArrowLeft, Trash2, Play, Pause, Square, Mic, Star, Flame, Award, BrainCircuit } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

export default function PlannerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const planId = resolvedParams.id;
  const router = useRouter();

  const [plan, setPlan] = useState<any>(null);
  const [gamification, setGamification] = useState({ xp: 0, level: 1, streakDays: 0 });
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Focus Mode State
  const [activeTaskForPomodoro, setActiveTaskForPomodoro] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);

  // Quiz Modal State
  const [quizState, setQuizState] = useState<{ open: boolean; taskId: string | null; loading: boolean; quiz: any; selectedAnswer: number | null }>({
    open: false,
    taskId: null,
    loading: false,
    quiz: null,
    selectedAnswer: null
  });

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
      // Normally we'd fetch Gamification from User/Auth endpoint, initializing with 0s for now until first update.
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

  const updateTaskStatus = async (taskId: string, payload: any) => {
    try {
      const { data } = await plannerApi.updateTask(planId, taskId, payload);
      // Update local gamification stats if returned
      if (data.data?.gamification) {
        setGamification({
          xp: data.data.gamification.userXp,
          level: data.data.gamification.userLevel,
          streakDays: data.data.gamification.streakDays
        });
        if (data.data.gamification.xpGained > 0) {
          toast(`+${data.data.gamification.xpGained} XP! Level ${data.data.gamification.userLevel}`, { icon: '🔥' });
        }
      }
      fetchPlan();
    } catch {
      toast.error("Failed to update task");
      fetchPlan(); // Rollback local state ideally
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

  const openQuiz = async (taskId: string) => {
    setQuizState({ open: true, taskId, loading: true, quiz: null, selectedAnswer: null });
    try {
      const { data } = await plannerApi.generateQuiz(planId, taskId);
      setQuizState(prev => ({ ...prev, loading: false, quiz: data.data.quiz }));
    } catch {
      toast.error("Failed to generate quiz. Marking task complete directly.");
      updateTaskStatus(taskId, { status: "completed" });
      setQuizState(prev => ({ ...prev, open: false }));
    }
  };

  const submitQuiz = () => {
    if (!quizState.quiz || quizState.selectedAnswer === null) return;
    const isCorrect = quizState.selectedAnswer === quizState.quiz.correctIndex;
    
    if (isCorrect) {
      toast.success("Correct! " + quizState.quiz.explanation);
      updateTaskStatus(quizState.taskId!, { status: "completed" });
      setQuizState({ open: false, taskId: null, loading: false, quiz: null, selectedAnswer: null });
    } else {
      toast.error("Incorrect. Try again or review the material.");
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      // Optimistic UI update
      const newPlan = { ...plan };
      const taskIndex = newPlan.tasks.findIndex((t: any) => t._id === draggableId);
      if (taskIndex > -1) {
        newPlan.tasks[taskIndex].date = destination.droppableId;
        setPlan(newPlan);
      }
      
      updateTaskStatus(draggableId, { date: destination.droppableId });
    }
  };

  if (loading) return <div className="skeleton w-full h-[60vh] rounded-3xl" />;
  if (!plan) return <div className="text-foreground">Plan not found</div>;

  // Group tasks by date string
  const groupedTasks: Record<string, any[]> = {};
  // Find all unique dates first to ensure empty columns show up if needed, though typically we just map what exists
  // First, sort tasks by date ascending
  const sortedTasks = [...plan.tasks].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  sortedTasks.forEach(t => {
    const dStr = format(new Date(t.date), 'yyyy-MM-dd');
    if (!groupedTasks[dStr]) groupedTasks[dStr] = [];
    groupedTasks[dStr].push(t);
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header and Back Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full bg-muted/50 hover:bg-muted text-foreground border border-border">
            <Link href="/dashboard/planner">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1 tracking-tight">{plan.title}</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              Exam Date: <span className="font-semibold text-foreground">{format(new Date(plan.examDate), 'MMMM dd, yyyy')}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {gamification.xp > 0 && (
            <div className="hidden sm:flex items-center gap-4 bg-card border border-border px-4 py-2 rounded-full mr-2">
               <span className="flex items-center gap-1 text-xs font-bold text-amber-500"><Star className="w-4 h-4" /> LVL {gamification.level}</span>
               <span className="w-px h-4 bg-border" />
               <span className="flex items-center gap-1 text-xs font-bold text-emerald-500"><Award className="w-4 h-4" /> {gamification.xp} XP</span>
               <span className="w-px h-4 bg-border" />
               <span className="flex items-center gap-1 text-xs font-bold text-orange-500"><Flame className="w-4 h-4" /> {gamification.streakDays} Day Streak</span>
            </div>
          )}
          {plan.tasks.some((t: any) => t.status === 'skipped') && (
            <Button 
              variant="premium" 
              onClick={handleAdjust}
              disabled={adjusting}
              className="shadow-lg shadow-amber-500/20"
            >
              {adjusting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {adjusting ? "Adjusting..." : "Adjust with AI"}
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

      <Card className="p-0 border-border overflow-hidden shadow-2xl shadow-amber-500/5 bg-transparent">
        <div className="p-6 md:p-10 relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-[100px] -z-10" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-border pb-8 mb-8">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="badge badge-purple px-4 py-1.5 text-sm">{plan.status}</span>
                </div>
                <Card className="mt-4 bg-amber-500/10 border-amber-500/30 p-5 border-l-4 rounded-xl shadow-inner shadow-amber-500/5">
                  <p className="text-foreground/90 leading-relaxed italic text-base"><span className="font-bold text-amber-500 dark:text-amber-400 not-italic">AI Recommendation:</span> {plan.aiSummary}</p>
                </Card>
            </div>
            
            <div className="w-full md:w-80 space-y-5 bg-card p-6 rounded-2xl border border-border">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider block">Overall Progress</span>
                      <span className="text-amber-600 dark:text-amber-400 font-black text-4xl">{plan.progressPercent}%</span>
                    </div>
                </div>
                <Progress value={plan.progressPercent} className="h-3" />
                <div className="flex gap-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground bg-muted p-3 rounded-xl justify-center">
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {plan.tasks.filter((t:any)=>t.status==='completed').length} Done</span>
                  <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500" /> {plan.tasks.filter((t:any)=>t.status==='skipped').length} Skipped</span>
                </div>
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto pb-6 -mx-6 px-6 gap-6 custom-scrollbar items-start">
              {Object.keys(groupedTasks).map((dateStr) => {
                const dayTasks = groupedTasks[dateStr];
                
                return (
                  <Droppable key={dateStr} droppableId={dateStr}>
                    {(provided: any, snapshot: any) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        className={`flex-shrink-0 w-80 md:w-96 rounded-2xl p-4 min-h-[300px] border transition-colors ${snapshot.isDraggingOver ? 'bg-amber-500/5 border-amber-500/30' : 'bg-transparent border-transparent'}`}
                      >
                        <h3 className="text-sm font-bold text-foreground mb-4 sticky top-0 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-500" /> 
                          {format(new Date(dateStr), 'EEEE, MMM do')}
                        </h3>
                        <div className="space-y-4">
                        {dayTasks.map((task: any, index: number) => {
                          const isDone = task.status === "completed";
                          const isSkipped = task.status === "skipped";
                          
                          return (
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                              {(provided: any, snapshot: any) => (
                                <Card 
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`group relative overflow-hidden transition-all duration-300 shadow-md ${
                                    snapshot.isDragging ? 'rotate-2 scale-105 z-50 ring-2 ring-amber-500/50' : ''
                                  } ${
                                    isDone 
                                    ? "bg-emerald-950/30 border-emerald-500/20 opacity-70 grayscale-[0.3]" 
                                    : isSkipped
                                    ? "bg-red-950/30 border-red-500/30"
                                    : "bg-card border-border hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/20"
                                  }`}
                                >
                                  <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                      <div className="flex gap-2">
                                        <div className="flex gap-2">
                                          <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className={`w-9 h-9 rounded-full border transition-all ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-border hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-500 text-muted-foreground'}`}
                                            onClick={() => isDone ? updateTaskStatus(task._id, {status: 'pending'}) : openQuiz(task._id)}
                                          >
                                            <CheckCircle2 className="w-4 h-4" />
                                          </Button>
                                          {!isDone && (
                                            <Button 
                                              size="icon" 
                                              variant="ghost" 
                                              className={`w-9 h-9 rounded-full border transition-all ${isSkipped ? 'bg-red-500 border-red-500 text-white' : 'border-border hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500 text-muted-foreground'}`}
                                              onClick={() => updateTaskStatus(task._id, {status: isSkipped ? 'pending' : 'skipped'})}
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-end gap-2">
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-md border uppercase tracking-widest ${
                                          task.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 
                                          task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                          'bg-teal-500/10 text-teal-500 border-teal-500/20'
                                        }`}>
                                          {task.priority}
                                        </span>
                                      </div>
                                    </div>
                                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1 uppercase tracking-wider drop-shadow-sm line-clamp-1">{task.subject}</p>
                                    <h4 className={`text-foreground text-base font-bold leading-tight mb-5 ${isDone ? "line-through opacity-70" : ""}`}>{task.topic}</h4>
                                    <div className="flex justify-between items-center text-xs text-muted-foreground font-semibold bg-muted p-2 rounded-lg mb-4">
                                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><Clock className="w-3.5 h-3.5" /> {task.duration}m</span>
                                      {isDone && <span className="flex text-amber-500"><Star className="w-3.5 h-3.5 mr-1" fill="currentColor"/> +{Math.round(task.duration*10)} XP</span>}
                                    </div>
                                    
                                    {!isDone && !isSkipped && (
                                      <div className="flex items-center gap-2 pt-3 border-t border-border">
                                        <Button 
                                          size="sm"
                                          onClick={() => {
                                            setActiveTaskForPomodoro(task);
                                            resetTimer();
                                          }}
                                          className="flex-1 h-8 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold border-0 text-xs"
                                        >
                                          <Play className="w-3.5 h-3.5 mr-1.5" /> Focus
                                        </Button>
                                        <Button 
                                          size="sm"
                                          variant="outline" 
                                          onClick={() => router.push(`/dashboard/voice?subject=${encodeURIComponent(task.subject)}&topic=${encodeURIComponent(task.topic)}`)}
                                          className="flex-1 h-8 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-300 bg-transparent text-xs"
                                        >
                                          <Mic className="w-3.5 h-3.5 mr-1.5" /> Tutor
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </DragDropContext>
        </div>
      </Card>

      {/* Focus Mode Pomodoro Dialog */}
      <Dialog open={!!activeTaskForPomodoro} onOpenChange={(open) => !open && closePomodoro()}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-center text-amber-600 dark:text-amber-400 flex flex-col items-center gap-2">
              <Clock className="w-8 h-8" />
              Focus Mode
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Stay focused on <strong className="text-foreground">{activeTaskForPomodoro?.topic}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 relative">
             <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-[80px] -z-10" />
             <div className="text-7xl font-black text-foreground font-mono tracking-tighter mb-8 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
               {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
               {String(timeLeft % 60).padStart(2, '0')}
             </div>
             
             <div className="flex gap-4">
               <Button 
                variant="outline" 
                size="icon" 
                className="w-14 h-14 rounded-full border-border hover:bg-muted text-foreground bg-transparent" 
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
             <Button variant="ghost" onClick={closePomodoro} className="text-muted-foreground hover:text-foreground">Exit Focus Mode</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Quiz Modal */}
      <Dialog open={quizState.open} onOpenChange={(open) => !open && setQuizState(prev => ({...prev, open: false}))}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-amber-500 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5" /> Mastery Check
            </DialogTitle>
            <DialogDescription>Let's make sure you mastered this topic before crossing it off!</DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            {quizState.loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <p className="text-sm text-muted-foreground">AI is preparing your challenge...</p>
              </div>
            ) : quizState.quiz ? (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-foreground">{quizState.quiz.question}</h3>
                <div className="space-y-3">
                  {quizState.quiz.options.map((opt: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setQuizState(prev => ({...prev, selectedAnswer: i}))}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        quizState.selectedAnswer === i 
                          ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium scale-[1.01]' 
                          : 'border-border bg-transparent hover:bg-muted text-foreground'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setQuizState(prev => ({...prev, open: false}))}>Cancel</Button>
            <Button 
              variant="premium" 
              onClick={submitQuiz} 
              disabled={quizState.loading || quizState.selectedAnswer === null}
            >
              Submit Answer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
