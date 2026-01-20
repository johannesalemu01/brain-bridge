"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrainCircuit, Mail, Lock, User, UserPlus, Loader2, GraduationCap, Users } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    language: "en",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.register(formData);
      saveAuth(data.data.token, data.data.user);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden py-12">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-xl glass p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">BrainBridge<span className="text-cyan-400">AI</span></span>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">Create an Account</h2>
          <p className="text-white/60 text-sm">Join the smartest learning platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "student" })}
              className={cn(
                "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                formData.role === "student"
                  ? "bg-violet-500/20 border-violet-500/50 text-white"
                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
              )}
            >
              <GraduationCap className="w-6 h-6" />
              <span className="font-medium text-sm">I'm a Student</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "teacher" })}
              className={cn(
                "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                formData.role === "teacher"
                  ? "bg-cyan-500/20 border-cyan-500/50 text-white"
                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
              )}
            >
              <Users className="w-6 h-6" />
              <span className="font-medium text-sm">I'm a Teacher</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                required
                className="input-field pl-10"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                required
                className="input-field pl-10"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="password"
                required
                minLength={6}
                className="input-field pl-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Preferred Language</label>
            <select
              className="input-field appearance-none"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value as "en" | "am" })}
            >
              <option value="en" className="bg-slate-900">English</option>
              <option value="am" className="bg-slate-900">Amharic (አማርኛ)</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-white/60 text-sm mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
