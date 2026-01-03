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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden py-12 bg-[#fafafa]">
      {/* ── Decorative Lego Bricks ── */}
      <div className="absolute top-[10%] left-[5%] w-24 h-12 bg-blue-500 rounded-lg shadow-[0_6px_0_0_#1d4ed8] lego-dot rotate-12 animate-float opacity-80" />
      <div className="absolute top-[15%] right-[8%] w-16 h-16 bg-red-500 rounded-lg shadow-[0_6px_0_0_#b91c1c] lego-dot -rotate-12 animate-bounce opacity-70" />
      <div className="absolute bottom-[20%] left-[10%] w-16 h-16 bg-yellow-400 rounded-lg shadow-[0_6px_0_0_#d97706] lego-dot rotate-6 animate-pulse opacity-80" />
      <div className="absolute bottom-[10%] right-[5%] w-32 h-12 bg-green-500 rounded-lg shadow-[0_6px_0_0_#15803d] lego-dot -rotate-6 animate-float opacity-70" />
      
      {/* Soft page backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent)]" />

      <Card className="w-full max-w-xl p-2 shadow-[0_20px_0_0_#e2e8f0] relative z-10 border-slate-100 bg-white rounded-[3rem]">
        <CardHeader className="flex flex-col items-center pb-8 border-b border-slate-50 mb-6">
          <Link href="/" className="flex items-center gap-2 mb-6 transition-transform hover:scale-110">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 via-yellow-400 to-green-500 shadow-xl">
              <BrainCircuit className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-3xl font-black text-slate-900 tracking-tight font-playful">BrainBridge</span>
          </Link>
          <CardTitle className="text-3xl font-black text-slate-900 mb-2 font-playful">Join the Fun!</CardTitle>
          <CardDescription className="text-slate-500 text-lg font-bold">Build your learning empire today.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "student" })}
                className={cn(
                  "p-5 rounded-3xl border-4 flex flex-col items-center gap-3 transition-all duration-300 active:scale-95",
                  formData.role === "student"
                    ? "bg-yellow-50 border-yellow-400 text-yellow-950 shadow-[0_6px_0_0_#d97706]"
                    : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-slate-200"
                )}
              >
                <div className={cn("p-2 rounded-xl", formData.role === "student" ? "bg-yellow-400 text-white" : "bg-slate-200 text-slate-400")}>
                  <GraduationCap className="w-7 h-7" />
                </div>
                <span className="font-black text-sm uppercase tracking-wider">I'm a Student</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "teacher" })}
                className={cn(
                  "p-5 rounded-3xl border-4 flex flex-col items-center gap-3 transition-all duration-300 active:scale-95",
                  formData.role === "teacher"
                    ? "bg-blue-50 border-blue-400 text-blue-950 shadow-[0_6px_0_0_#1d4ed8]"
                    : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-slate-200"
                )}
              >
                <div className={cn("p-2 rounded-xl", formData.role === "teacher" ? "bg-blue-400 text-white" : "bg-slate-200 text-slate-400")}>
                  <Users className="w-7 h-7" />
                </div>
                <span className="font-black text-sm uppercase tracking-wider">I'm a Teacher</span>
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-yellow-500 transition-colors" />
                <Input
                  type="text"
                  required
                  className="pl-12 bg-slate-50 border-2 border-slate-100 rounded-2xl h-14 text-slate-900 font-bold focus:bg-white focus:border-yellow-400 transition-all placeholder:text-slate-300"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  type="email"
                  required
                  className="pl-12 bg-slate-50 border-2 border-slate-100 rounded-2xl h-14 text-slate-900 font-bold focus:bg-white focus:border-blue-400 transition-all placeholder:text-slate-300"
                  placeholder="hello@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Secret Key (Password)</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-green-500 transition-colors" />
                <Input
                  type="password"
                  required
                  minLength={6}
                  className="pl-12 bg-slate-50 border-2 border-slate-100 rounded-2xl h-14 text-slate-900 font-bold focus:bg-white focus:border-green-400 transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Your Language</label>
              <select
                className="w-full h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-900 focus:bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 appearance-none outline-none transition-all"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value as "en" | "am" })}
              >
                <option value="en">English (US)</option>
                <option value="am">Amharic (አማርኛ)</option>
              </select>
            </div>

            <Button 
                type="submit" 
                disabled={loading} 
                variant="default" 
                size="xl" 
                className="w-full mt-4 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-lg shadow-[0_8px_0_0_#1e40af] transition-all active:translate-y-1 active:shadow-none"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UserPlus className="w-6 h-6" />}
              {loading ? "Building Your Account..." : "Start Building!"}
            </Button>
          </form>

          <p className="text-center text-slate-500 font-bold mt-10">
            Already a member?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-500 font-black underline underline-offset-4 transition-colors">
              Sign In Here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
