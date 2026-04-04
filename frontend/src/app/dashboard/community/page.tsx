"use client";

import { useState, useEffect } from "react";
import { Users, Search, Plus, Filter, MessageSquare, ThumbsUp, Medal } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";

export default function CommunityPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Just a placeholder mock fetch for now (MVP layout)
    setTimeout(() => {
      setGroups([
        { _id: "1", name: "Grade 10 Physics", category: "Subject", members: 120 },
        { _id: "2", name: "National Exam Prep", category: "Interest", members: 340 },
        { _id: "3", name: "Programming Club", category: "Interest", members: 85 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-teal-400 bg-clip-text text-transparent">
            Student Community
          </h1>
          <p className="text-white/60 mt-1">
            Join groups, ask questions, and learn together.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all hover:-translate-y-0.5">
          <Plus className="w-5 h-5" />
          Create Group
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Your Reputation", value: "240 XP", icon: Medal, color: "text-amber-400" },
          { title: "Active Threads", value: "12", icon: MessageSquare, color: "text-teal-400" },
          { title: "Groups Joined", value: "4", icon: Users, color: "text-blue-400" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Sidebar: Groups List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search groups..."
              className="w-full bg-black/60 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-teal-500/50 transition-colors"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest flex justify-between items-center">
              Suggested Groups
              <Filter className="w-4 h-4" />
            </h2>
            
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-white/10 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {groups.map((group) => (
                  <motion.div
                    key={group._id}
                    whileHover={{ scale: 1.02 }}
                    className="p-3 rounded-xl border border-white/10 bg-black/40 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{group.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-300">
                        {group.category}
                      </span>
                    </div>
                    <p className="text-sm text-white/40 mt-1 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {group.members} members
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Forum Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
             <h2 className="text-lg font-semibold text-white mb-4">Latest Discussions</h2>
             {/* Mocking a feed post */}
             <div className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                    A
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-white">Alemayehu</span>
                        <span className="text-xs text-white/40 ml-2">in Grade 10 Physics</span>
                      </div>
                      <span className="text-xs text-white/40">2h ago</span>
                    </div>
                    <h3 className="text-lg font-semibold text-amber-300 mt-1">Can someone explain Newton's Third Law?</h3>
                    <p className="text-sm text-white/70 mt-2 line-clamp-2">
                       I'm having trouble visualizing how action and reaction forces don't just cancel each other out all the time. If I push a wall, the wall pushes back. Why does anything ever move?
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <button className="flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-teal-400 transition-colors">
                        <ThumbsUp className="w-4 h-4" /> 12 Upvotes
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white transition-colors">
                        <MessageSquare className="w-4 h-4" /> 4 Replies
                      </button>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
