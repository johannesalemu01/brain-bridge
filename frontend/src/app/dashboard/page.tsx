"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { dashboardApi } from "@/lib/api";
import { motion } from "framer-motion";
import {
  BookOpen,
  MessagesSquare,
  Mic,
  ArrowRight,
  Activity,
  Clock,
  Flame,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    studyStreakDays: 0,
    hoursLearned: 0,
    tasksCompleted: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    setUser(getUser());

    const fetchSummary = async () => {
      try {
        const { data } = await dashboardApi.getSummary();
        setStats(data.data.stats);
        setActivities(data.data.activities || []);
      } catch {
        // Keep graceful fallback values in UI
      }
    };

    fetchSummary();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  if (!user) return <div className="skeleton w-full h-screen" />;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* ── Header ── */}
      <motion.div
        variants={item}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Welcome back,{" "}
            <span className="gradient-text">{user.name.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-white/60 text-lg">
            Let's continue your learning journey.
          </p>
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="p-6 border-l-4 border-l-amber-500 bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Study Streak</p>
              <p className="text-2xl font-bold text-white">
                {stats.studyStreakDays} Days
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-teal-500 bg-teal-500/5 hover:bg-teal-500/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Hours Learned</p>
              <p className="text-2xl font-bold text-white">
                {stats.hoursLearned} hrs
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-purple-500 bg-purple-500/5 hover:bg-purple-500/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">
                Tasks Completed
              </p>
              <p className="text-2xl font-bold text-white">
                {stats.tasksCompleted}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ── Quick Actions / Features ── */}
      <motion.div variants={item}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Jump Right In
          </h2>
          <p className="text-white/60 text-sm">
            Access your intelligent learning tools instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/planner">
            <Card className="h-full hover:bg-white/10 transition-all group relative overflow-hidden border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-amber-400" />
                </div>
                <CardTitle className="text-xl">AI Study Planner</CardTitle>
                <CardDescription>
                  View your personalized schedule and track your daily subjects.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <span className="text-amber-400 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Plan <ArrowRight className="w-4 h-4" />
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/voice">
            <Card className="h-full hover:bg-white/10 transition-all group relative overflow-hidden border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mic className="w-6 h-6 text-teal-400" />
                </div>
                <CardTitle className="text-xl">Voice Learning</CardTitle>
                <CardDescription>
                  Ask questions and learn using Amharic or English voice chat.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <span className="text-teal-400 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Start Session <ArrowRight className="w-4 h-4" />
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/qa">
            <Card className="h-full hover:bg-white/10 transition-all group relative overflow-hidden border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessagesSquare className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-xl">Q&A Knowledge Base</CardTitle>
                <CardDescription>
                  Explore teacher-verified AI answers to student questions.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <span className="text-purple-400 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Ask Question <ArrowRight className="w-4 h-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </motion.div>

      {/* ── Recent Activity ── */}
      <motion.div variants={item}>
        <Card className="border-white/5 bg-white/5">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.length === 0 ? (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex-1">
                  <p className="text-white/70 font-medium">
                    No recent activity yet.
                  </p>
                </div>
              </div>
            ) : (
              activities.slice(0, 5).map((activity, i) => (
                <div
                  key={`${activity.type}-${i}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 items-center justify-center hidden sm:flex">
                    <Activity className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.title}</p>
                    <p className="text-white/40 text-xs mt-1">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
