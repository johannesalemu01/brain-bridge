"use client";

import { useState, useEffect } from "react";
import { Users, Search, Plus, Filter, MessageSquare, ThumbsUp, Medal, Loader2, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { communityApi } from "@/lib/api";
import { getUser } from "@/lib/auth";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CommunityPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [activeGroup, setActiveGroup] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  
  // Create forms state
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  const [newGroup, setNewGroup] = useState({ name: "", description: "", category: "Subject" });
  const [newPost, setNewPost] = useState({ title: "", content: "", type: "discussion" });
  const [aiSummaries, setAiSummaries] = useState<Record<string, { loading: boolean; text: string | null }>>({});

  useEffect(() => {
    setCurrentUser(getUser());
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data } = await communityApi.getGroups();
      setGroups(data.data || []);
      if (data.data?.length > 0) {
        selectGroup(data.data[0]);
      }
    } catch (err) {
       toast.error("Backend offline. Loading placeholder layout.");
       setGroups([
         { _id: "err-1", name: "Grade 10 Physics (Offline Mode)", category: "Subject", memberIds: ["1", "2"] },
         { _id: "err-2", name: "Programming Club", category: "Interest", memberIds: ["1"] }
       ]);
       setActiveGroup({ _id: "err-1", name: "Grade 10 Physics (Offline Mode)" });
    } finally {
      setLoading(false);
    }
  };

  const selectGroup = async (group: any) => {
    setActiveGroup(group);
    if(group._id.startsWith("err")) return; 
    
    try {
      setLoadingPosts(true);
      const { data } = await communityApi.getPosts(group._id);
      setPosts(data.data || []);
    } catch (error) {
      toast.error("Failed to load posts.");
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await communityApi.createGroup({ ...newGroup, tags: [] });
      toast.success("Group created successfully!");
      setGroups([data.data, ...groups]);
      setShowCreateGroup(false);
      setNewGroup({ name: "", description: "", category: "Subject" });
      selectGroup(data.data);
    } catch(err: any) {
      toast.error(err.response?.data?.message || "Failed to create group");
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const { data } = await communityApi.joinGroup(groupId);
      toast.success("Joined group!");
      setGroups(groups.map(g => g._id === groupId ? data.data : g));
      if (activeGroup?._id === groupId) {
        setActiveGroup(data.data);
      }
    } catch(err: any) {
      toast.error("Failed to join group");
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroup) return;
    try {
      const { data } = await communityApi.createPost(activeGroup._id, newPost);
      toast.success("Post created!");
      setPosts([data.data, ...posts]);
      setShowCreatePost(false);
      setNewPost({ title: "", content: "", type: "discussion" });
    } catch(err: any) {
      toast.error("Failed to create post");
    }
  };

  const handleUpvote = async (postId: string) => {
    try {
      const { data } = await communityApi.upvotePost(postId);
      setPosts(posts.map(p => p._id === postId ? data.data : p));
    } catch (error) {
      toast.error("Failed to upvote");
    }
  };

  const handleSummarize = async (postId: string) => {
    setAiSummaries(prev => ({ ...prev, [postId]: { loading: true, text: null } }));
    try {
        const { data } = await communityApi.summarizePost(postId);
        setAiSummaries(prev => ({ ...prev, [postId]: { loading: false, text: data.data.summary } }));
        toast.success("AI Summary generated!");
    } catch(err) {
        setAiSummaries(prev => ({ ...prev, [postId]: { loading: false, text: null } }));
        // Mock fallback if backend is offline
        toast.success("Mock summary loaded (Backend offline)");
        setAiSummaries(prev => ({ ...prev, [postId]: { loading: false, text: "* **Key Theme:** Exploring basic science logic.\n* **Consensus:** Action and reaction forces are applied to *different* bodies, so they don't cancel each other out on the same object." } }));
    }
  };

  const isMember = (group: any) => {
    if (!currentUser || !group) return false;
    return group.memberIds?.includes(currentUser.id || currentUser._id);
  };

  return (
    <div className="space-y-6 relative h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            Student Community
          </h1>
          <p className="text-white/60 mt-1">Join groups, ask questions, and learn together.</p>
        </div>
        <button 
            onClick={() => setShowCreateGroup(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-teal-500/20 hover:-translate-y-0.5 transition-all">
          <Plus className="w-5 h-5" /> Create Group
        </button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Left Sidebar: Groups List */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-hidden">
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search groups..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-colors"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 overflow-y-auto custom-scrollbar space-y-3">
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest flex justify-between items-center sticky top-0 bg-transparent backdrop-blur-sm pb-2">
              Joined Groups
              <Filter className="w-3 h-3" />
            </h2>
            
            {loading ? (
              <div className="animate-pulse space-y-2">
                {[1, 2, 3].map(i => <div key={i} className="h-14 bg-white/10 rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {groups.map((group) => (
                  <motion.div
                    key={group._id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => selectGroup(group)}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                        activeGroup?._id === group._id 
                        ? "bg-white/15 border-white/20" 
                        : "bg-black/40 border-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white text-sm truncate pr-2">{group.name}</h3>
                    </div>
                    <p className="text-xs text-white/40 mt-1 flex items-center justify-between">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {group.memberIds?.length || 0} members</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300">
                        {group.category}
                      </span>
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Forum Feed */}
        <div className="lg:col-span-3 bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
            {activeGroup ? (
                <>
                    <div className="p-4 border-b border-white/10 bg-white/5 shrink-0 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">{activeGroup.name}</h2>
                            <p className="text-sm text-white/50 mt-1">Discussions and Q&A Board</p>
                        </div>
                        
                        {!isMember(activeGroup) ? (
                            <button 
                                onClick={() => handleJoinGroup(activeGroup._id)}
                                className="bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 px-4 py-2 rounded-lg text-sm font-bold border border-teal-500/20 transition-colors">
                                Join Group to Post
                            </button>
                        ) : (
                            <button 
                                onClick={() => setShowCreatePost(true)}
                                className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 px-4 py-2 rounded-lg text-sm font-bold border border-blue-500/30 transition-colors flex items-center gap-2">
                                <Plus className="w-4 h-4"/> New Post
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {loadingPosts ? (
                            <div className="flex justify-center items-center h-full">
                                <Loader2 className="w-8 h-8 animate-spin text-white/20" />
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-3">
                                <MessageSquare className="w-12 h-12" />
                                <p>No posts yet. Be the first to start a discussion!</p>
                            </div>
                        ) : (
                            posts.map(post => (
                                <div key={post._id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                                            {post.authorId?.name?.charAt(0) || "U"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-white/80 text-sm">{post.authorId?.name || "Unknown User"}</span>
                                                <span className="text-xs text-white/40">{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="text-base font-semibold text-amber-300">{post.title}</h3>
                                            <p className="text-sm text-white/60 mt-2 whitespace-pre-wrap">{post.content}</p>
                                            
                                            <div className="flex items-center gap-4 mt-4">
                                                <button 
                                                    onClick={() => handleUpvote(post._id)}
                                                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                                                        post.upvotedBy?.includes(currentUser?._id) 
                                                        ? "text-teal-400" 
                                                        : "text-white/40 hover:text-white"
                                                    }`}>
                                                    <ThumbsUp className="w-4 h-4" /> {post.upvoteCount || 0} Upvotes
                                                </button>
                                                <button className="flex items-center gap-1.5 text-xs font-semibold text-white/40 hover:text-white transition-colors">
                                                    <MessageSquare className="w-4 h-4" /> Reply
                                                </button>
                                                <button 
                                                    onClick={() => handleSummarize(post._id)}
                                                    className="flex items-center gap-1.5 text-xs font-semibold text-amber-400/80 hover:text-amber-300 transition-colors ml-auto bg-amber-400/10 px-2 py-1 rounded">
                                                    {aiSummaries[post._id]?.loading ? (
                                                        <Loader2 className="w-3 h-3 animate-spin"/> 
                                                    ) : (
                                                        <span className="flex items-center gap-1.5">🌟 Summarize</span>
                                                    )}
                                                </button>
                                            </div>

                                            {aiSummaries[post._id]?.text && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }} 
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-100">
                                                    <p className="font-bold text-amber-400 mb-2 text-xs uppercase tracking-widest flex items-center gap-2">
                                                        <Medal className="w-3 h-3"/> AI Summary
                                                    </p>
                                                    <div className="space-y-1 whitespace-pre-wrap">
                                                        {aiSummaries[post._id].text}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-3">
                    <Users className="w-12 h-12" />
                    <p>Select a group to view discussions</p>
                </div>
            )}
        </div>
      </div>

      {/* Create Group Modal Overlay */}
      <AnimatePresence>
        {showCreateGroup && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div 
                    initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                    className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                    <button onClick={() => setShowCreateGroup(false)} className="absolute right-4 top-4 text-white/40 hover:text-white">
                        <X className="w-5 h-5"/>
                    </button>
                    <h2 className="text-xl font-bold text-white mb-4">Create New Group</h2>
                    <form onSubmit={handleCreateGroup} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase">Group Name</label>
                            <Input required value={newGroup.name} onChange={e => setNewGroup({...newGroup, name: e.target.value})} className="mt-1 bg-white/5 border-white/10 text-white" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase">Category</label>
                            <select value={newGroup.category} onChange={e => setNewGroup({...newGroup, category: e.target.value})} className="w-full mt-1 h-10 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none">
                                <option className="bg-slate-900" value="Subject">Subject</option>
                                <option className="bg-slate-900" value="Grade">Grade Level</option>
                                <option className="bg-slate-900" value="Interest">Mixed Interest</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase">Description</label>
                            <Input value={newGroup.description} onChange={e => setNewGroup({...newGroup, description: e.target.value})} className="mt-1 bg-white/5 border-white/10 text-white" />
                        </div>
                        <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold h-10 mt-2 rounded-xl">Create Group</Button>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Create Post Modal Overlay */}
      <AnimatePresence>
        {showCreatePost && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div 
                    initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                    className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
                    <button onClick={() => setShowCreatePost(false)} className="absolute right-4 top-4 text-white/40 hover:text-white">
                        <X className="w-5 h-5"/>
                    </button>
                    <h2 className="text-xl font-bold text-white mb-4">New Discussion Hook</h2>
                    <form onSubmit={handleCreatePost} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase">Title</label>
                            <Input required placeholder="Ex: Help with Calculus derivatives" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} className="mt-1 bg-white/5 border-white/10 text-white" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase">Content</label>
                            <textarea required rows={4} value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} className="w-full mt-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none resize-none" placeholder="Explain your question..."></textarea>
                        </div>
                        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-10 mt-2 rounded-xl">Post to Board</Button>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
