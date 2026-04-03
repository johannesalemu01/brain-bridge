"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BrainCircuit, Mail, Lock, Loader2, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login(formData);
      saveAuth(data.data.token, data.data.user);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden py-12 bg-yellow-400">
      {/* Playful background pattern dots */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0f172a_3px,transparent_3px)] [background-size:24px_24px] dark:bg-[radial-gradient(#000000_3px,transparent_3px)] pointer-events-none" />

      {/* Decorative Lego Bricks */}
      <div className="absolute top-[15%] left-[10%] w-16 h-16 bg-white border-4 border-slate-900 rounded-lg shadow-[8px_8px_0_0_#0f172a] rotate-12 animate-bounce opacity-80" />
      <div className="absolute top-[20%] right-[12%] w-24 h-12 bg-blue-500 border-4 border-slate-900 rounded-lg shadow-[8px_8px_0_0_#0f172a] -rotate-12 animate-float opacity-70" />
      <div className="absolute bottom-[10%] left-[8%] w-32 h-12 bg-red-500 border-4 border-slate-900 rounded-lg shadow-[8px_8px_0_0_#0f172a] rotate-6 animate-float opacity-80" />
      
      {/* Robot Image Container (Background element) */}
      <div className="hidden lg:block absolute bottom-[-10%] right-[-10%] xl:right-[-5%] w-[45rem] h-[45rem] xl:w-[50rem] xl:h-[50rem] z-0 pointer-events-none animate-float mix-blend-multiply opacity-90">
        <Image 
          src="/images/robot_study.png" 
          alt="Playful Robot studying" 
          fill 
          className="object-contain" 
          priority 
          sizes="(max-width: 1280px) 720px, 800px" 
        />
      </div>

      <Card className="w-full max-w-xl p-2 md:p-6 relative z-10 border-8 border-slate-900 bg-white rounded-[3rem] shadow-[16px_16px_0_0_#0f172a] hover:-translate-y-1 hover:shadow-[20px_20px_0_0_#0f172a] transition-all dark:border-slate-800 dark:bg-slate-900 dark:shadow-[16px_16px_0_0_#020617]">
        <CardHeader className="flex flex-col items-center pb-8 border-b border-slate-50 mb-6">
          <Link href="/" className="flex items-center gap-2 mb-6 transition-transform hover:scale-110">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 via-yellow-400 to-green-500 shadow-xl">
              <BrainCircuit className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-3xl font-black text-slate-900 tracking-tight font-playful">BrainBridge</span>
          </Link>
          <CardTitle className="text-3xl font-black text-slate-900 mb-2 font-playful">Welcome Back!</CardTitle>
          <CardDescription className="text-slate-500 text-lg font-bold">Ready to build more knowledge?</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-yellow-500 transition-colors" />
                <Input
                  type="password"
                  required
                  className="pl-12 bg-slate-50 border-2 border-slate-100 rounded-2xl h-14 text-slate-900 font-bold focus:bg-white focus:border-yellow-400 transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              variant="default" 
              size="xl" 
              className="w-full mt-4 h-16 rounded-full bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black text-lg shadow-[0_8px_0_0_#d97706] transition-all active:translate-y-1 active:shadow-none"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <LogIn className="w-6 h-6" />}
              {loading ? "Waking the AI..." : "Let's Play!"}
            </Button>
          </form>

          <p className="text-center text-slate-500 font-bold mt-10">
            New here?{" "}
            <Link href="/register" className="text-yellow-500 hover:text-yellow-600 font-black underline underline-offset-4 transition-colors">
              Create Your Empire
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
