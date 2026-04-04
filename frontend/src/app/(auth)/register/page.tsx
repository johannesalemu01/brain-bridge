"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#fafafa]">
      {/* Soft page backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-yellow-50 to-white" />

      <Card className="w-full max-w-6xl min-h-[600px] lg:min-h-[750px] overflow-hidden rounded-[2.5rem] border-0 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row">
        
        {/* Left Side: Brand Imagery */}
        <div className="relative hidden lg:flex flex-col justify-center bg-yellow-400 p-12 lg:w-5/12 overflow-hidden">
          {/* Playful background pattern dots */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0f172a_3px,transparent_3px)] [background-size:24px_24px]" />
          <div className="relative z-10 flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-2 mb-8 transition-transform hover:scale-105">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 via-yellow-400 to-green-500 shadow-xl">
                <BrainCircuit className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-3xl font-black text-slate-900 tracking-tight font-playful">BrainBridge</span>
            </Link>
            <h2 className="text-4xl font-black text-slate-900 font-playful leading-tight">Think big,<br/>play bigger!</h2>
            <p className="text-slate-800 font-bold mb-10 text-lg">Build your learning empire with AI study plans and voice tutoring.</p>
          </div>
          <div className="relative w-full aspect-square mt-auto z-10">
            <Image 
              src="/images/robot_bag.png" 
              alt="Playful Robot" 
              fill 
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain drop-shadow-2xl animate-float" 
              priority
            />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 sm:p-12 lg:w-7/12 flex flex-col justify-center">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 via-yellow-400 to-green-500 shadow-md">
              <BrainCircuit className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight font-playful">BrainBridge</span>
          </div>
          
          <CardHeader className="p-0 pb-8">
            <CardTitle className="text-3xl font-black text-slate-900 mb-2 font-playful">Create Account</CardTitle>
            <CardDescription className="text-slate-500 text-base font-medium">Join thousands of students learning smarter today.</CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "student" })}
                  className={cn(
                    "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all duration-300",
                    formData.role === "student"
                      ? "bg-yellow-50 border-yellow-400 text-yellow-900 shadow-sm"
                      : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                  )}
                >
                  <GraduationCap className={cn("w-6 h-6", formData.role === "student" ? "text-yellow-600" : "text-slate-400")} />
                  <span className="font-bold text-sm">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "teacher" })}
                  className={cn(
                    "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all duration-300",
                    formData.role === "teacher"
                      ? "bg-blue-50 border-blue-400 text-blue-900 shadow-sm"
                      : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                  )}
                >
                  <Users className={cn("w-6 h-6", formData.role === "teacher" ? "text-blue-600" : "text-slate-400")} />
                  <span className="font-bold text-sm">Teacher</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      type="text"
                      required
                      className="pl-11 bg-slate-50 border-slate-200 rounded-xl h-12 text-slate-900 font-medium focus:bg-white focus:border-blue-400 focus:ring-blue-400/20 transition-all placeholder:text-slate-400"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      type="email"
                      required
                      className="pl-11 bg-slate-50 border-slate-200 rounded-xl h-12 text-slate-900 font-medium focus:bg-white focus:border-blue-400 focus:ring-blue-400/20 transition-all placeholder:text-slate-400"
                      placeholder="hello@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      type="password"
                      required
                      minLength={6}
                      className="pl-11 bg-slate-50 border-slate-200 rounded-xl h-12 text-slate-900 font-medium focus:bg-white focus:border-blue-400 focus:ring-blue-400/20 transition-all placeholder:text-slate-400"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Language</label>
                  <select
                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 appearance-none outline-none transition-all"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value as "en" | "am" })}
                  >
                    <option value="en">English (US)</option>
                    <option value="am">Amharic (አማርኛ)</option>
                  </select>
                </div>
              </div>

              <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full mt-6 h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-slate-500 font-medium mt-8 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-all">
                Sign In
              </Link>
            </p>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
