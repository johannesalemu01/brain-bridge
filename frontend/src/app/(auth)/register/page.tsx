"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrainCircuit, Mail, Lock, User, UserPlus, Loader2, GraduationCap, Users } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

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

      <Card className="w-full max-w-xl p-2 shadow-2xl relative z-10 border-white/5">
        <CardHeader className="flex flex-col items-center pb-8">
          <Link href="/" className="flex items-center gap-2 mb-6 transition-transform hover:scale-105">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">BrainBridge<span className="text-cyan-400">AI</span></span>
          </Link>
          <CardTitle className="text-2xl font-bold text-white mb-2">Create an Account</CardTitle>
          <CardDescription className="text-white/50 text-sm">Join the smartest learning platform</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "student" })}
                className={cn(
                  "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300",
                  formData.role === "student"
                    ? "bg-violet-500/20 border-violet-500/50 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                    : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                )}
              >
                <GraduationCap className="w-6 h-6" />
                <span className="font-medium text-sm">I'm a Student</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "teacher" })}
                className={cn(
                  "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300",
                  formData.role === "teacher"
                    ? "bg-cyan-500/20 border-cyan-500/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                )}
              >
                <Users className="w-6 h-6" />
                <span className="font-medium text-sm">I'm a Teacher</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <Input
                  type="text"
                  required
                  className="pl-12 bg-white/5 border-white/10 h-12"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <Input
                  type="email"
                  required
                  className="pl-12 bg-white/5 border-white/10 h-12"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <Input
                  type="password"
                  required
                  minLength={6}
                  className="pl-12 bg-white/5 border-white/10 h-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Preferred Language</label>
              <select
                className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:ring-2 focus:ring-violet-500/50 appearance-none outline-none transition-all"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value as "en" | "am" })}
              >
                <option value="en" className="bg-[#0b1021]">English</option>
                <option value="am" className="bg-[#0b1021]">Amharic (አማርኛ)</option>
              </select>
            </div>

            <Button 
                type="submit" 
                disabled={loading} 
                variant="premium" 
                size="xl" 
                className="w-full mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
              {loading ? "Creating Account..." : "Join BrainBridge"}
            </Button>
          </form>

          <p className="text-center text-white/50 text-sm mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
