"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { motion } from "framer-motion";
import { BookOpen, MessagesSquare, Mic, ArrowRight, Activity, Clock, Flame } from "lucide-react";
import Link from "next/link";

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (!user) return <div className="skeleton w-full h-screen" />;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* ── Header ── */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-white/60 text-lg">Let's continue your learning journey.</p>
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 border-l-4 border-l-violet-500 rounded-xl flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
             <Flame className="w-6 h-6 text-violet-400" />
           </div>
           <div>
             <p className="text-white/60 text-sm font-medium">Study Streak</p>
             <p className="text-2xl font-bold text-white">4 Days</p>
           </div>
        </div>
        <div className="glass p-6 border-l-4 border-l-cyan-500 rounded-xl flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
             <Clock className="w-6 h-6 text-cyan-400" />
           </div>
           <div>
             <p className="text-white/60 text-sm font-medium">Hours Learned</p>
             <p className="text-2xl font-bold text-white">12.5 hrs</p>
           </div>
        </div>
        <div className="glass p-6 border-l-4 border-l-purple-500 rounded-xl flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
             <Activity className="w-6 h-6 text-purple-400" />
           </div>
           <div>
             <p className="text-white/60 text-sm font-medium">Tasks Completed</p>
             <p className="text-2xl font-bold text-white">28</p>
           </div>
        </div>
      </motion.div>

      {/* ── Quick Actions / Features ── */}
      <motion.div variants={item}>
        <h2 className="section-title">Jump Right In</h2>
        <p className="section-sub">Access your intelligent learning tools instantly.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/planner" className="glass-hover p-6 rounded-2xl group flex flex-col items-start text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-[40px] group-hover:bg-violet-500/20 transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Study Planner</h3>
            <p className="text-white/60 text-sm mb-6 flex-1">View your personalized schedule and track your daily subjects.</p>
            <span className="text-violet-400 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              View Plan <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link href="/dashboard/voice" className="glass-hover p-6 rounded-2xl group flex flex-col items-start text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[40px] group-hover:bg-cyan-500/20 transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Voice Learning</h3>
            <p className="text-white/60 text-sm mb-6 flex-1">Ask questions and learn using Amharic or English voice chat.</p>
            <span className="text-cyan-400 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Start Session <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link href="/dashboard/qa" className="glass-hover p-6 rounded-2xl group flex flex-col items-start text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] group-hover:bg-purple-500/20 transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessagesSquare className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Q&A Knowledge Base</h3>
            <p className="text-white/60 text-sm mb-6 flex-1">Explore teacher-verified AI answers to student questions.</p>
            <span className="text-purple-400 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Ask Question <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </motion.div>

      {/* ── Recent Activity Placeholder ── */}
      <motion.div variants={item} className="glass p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
               <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                   <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center hidden sm:flex">
                       <Activity className="w-5 h-5 text-violet-400" />
                   </div>
                   <div className="flex-1">
                       <p className="text-white font-medium">Completed task: <span className="text-white/80">Calculus Integration Practice</span></p>
                       <p className="text-white/40 text-xs mt-1">2 hours ago</p>
                   </div>
               </div>
            ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
