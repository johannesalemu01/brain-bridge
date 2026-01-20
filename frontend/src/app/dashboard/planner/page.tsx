"use client";

import { useEffect, useState } from "react";
import { plannerApi } from "@/lib/api";
import { BookOpen, Calendar, Plus, BrainCircuit, CheckCircle2, Circle, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

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
          <h1 className="text-3xl font-bold text-white mb-2">AI Study Planner</h1>
          <p className="text-white/60">Generate and track personalized study schedules.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Sparkles className="w-5 h-5" />
          Generate New Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-white/10 mt-10">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No active study plans</h3>
          <p className="text-white/60 max-w-sm mb-6">Let AI create a custom schedule based on your weak subjects and exam date.</p>
          <button onClick={() => setShowModal(true)} className="btn-secondary">Get Started</button>
        </div>
      ) : (
        <div className="space-y-10">
          {plans.map((plan) => (
            <div key={plan._id} className="glass p-6 md:p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-[80px] -z-10" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6 mb-6">
                 <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{plan.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-white/50">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> Exam: {format(new Date(plan.examDate), 'MMM dd, yyyy')}</span>
                        <span className="badge bg-white/10 text-white border-white/20">{plan.status}</span>
                    </div>
                    <p className="text-white/70 mt-4 max-w-3xl leading-relaxed italic border-l-2 border-violet-500/30 pl-4">{plan.aiSummary}</p>
                 </div>
                 
                 <div className="w-full md:w-48">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/60">Progress</span>
                        <span className="text-violet-400 font-bold">{plan.progressPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: \`\${plan.progressPercent}%\` }}
                        />
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plan.tasks.map((task: any) => {
                  const isDone = task.status === "completed";
                  return (
                    <div 
                      key={task._id} 
                      onClick={() => toggleTask(plan._id, task._id, task.status)}
                      className={\`p-4 rounded-xl border transition-all cursor-pointer \${isDone ? "bg-white/5 border-white/5 opacity-60" : "bg-white/10 border-white/10 hover:border-violet-500/30"}\`}
                    >
                      <div className="flex justify-between items-start mb-3">
                         {isDone ? (
                           <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                         ) : (
                           <Circle className="w-6 h-6 text-white/30" />
                         )}
                         <span className={\`text-xs font-bold px-2 py-1 rounded border \${
                           task.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                           task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                           'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                         }\`}>
                           {task.priority.toUpperCase()}
                         </span>
                      </div>
                      <p className="text-sm font-medium text-violet-300 mb-1">{task.subject}</p>
                      <p className={\`text-white font-medium mb-3 \${isDone ? "line-through" : ""}\`}>{task.topic}</p>
                      <div className="flex justify-between text-xs text-white/50">
                         <span>{format(new Date(task.date), 'MMM dd')}</span>
                         <span>{task.duration} mins</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Generate Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1021] border border-white/10 p-8 rounded-2xl w-full max-w-xl shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <BrainCircuit className="w-8 h-8 text-violet-400" />
              <h2 className="text-2xl font-bold text-white">Generate Study Plan</h2>
            </div>
            
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-sm text-white/60 mb-2">Plan Title</label>
                <input required type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} placeholder="Finals Prep" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Exam Date</label>
                <input required type="date" className="input-field" value={examDate} onChange={e => setExamDate(e.target.value)} />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm text-white/60">Subjects</label>
                  <button type="button" onClick={() => setSubjects([...subjects, {name: '', weakLevel: 3}])} className="text-xs text-cyan-400 flex items-center gap-1 hover:text-cyan-300">
                    <Plus className="w-3 h-3" /> Add Subject
                  </button>
                </div>
                <div className="space-y-3">
                  {subjects.map((sub, i) => (
                    <div key={i} className="flex gap-3 items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <input 
                        className="input-field py-2" 
                        placeholder="Subject name (e.g. Physics)"
                        value={sub.name}
                        onChange={e => {
                          const newSubs = [...subjects];
                          newSubs[i].name = e.target.value;
                          setSubjects(newSubs);
                        }}
                      />
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-white/40 mb-1 w-20 text-center">Weakness (1-5)</span>
                        <input 
                          type="range" min="1" max="5" 
                          className="w-20 accent-violet-500" 
                          value={sub.weakLevel}
                          onChange={e => {
                            const newSubs = [...subjects];
                            newSubs[i].weakLevel = Number(e.target.value);
                            setSubjects(newSubs);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary w-full">Cancel</button>
                <button type="submit" disabled={generating} className="btn-primary w-full">
                  {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  {generating ? "Let AI think..." : "Generate Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
