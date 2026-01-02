"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-[100px] -z-10" />

      <Card className="w-full max-w-md p-2 shadow-2xl relative z-10 border-white/5">
        <CardHeader className="flex flex-col items-center pb-8">
          <Link href="/" className="flex items-center gap-2 mb-6 transition-transform hover:scale-105">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-teal-600 shadow-lg shadow-amber-500/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">BrainBridge<span className="text-teal-400">AI</span></span>
          </Link>
          <CardTitle className="text-2xl font-bold text-white mb-2">Welcome Back</CardTitle>
          <CardDescription className="text-white/50 text-sm">Enter your credentials to continue</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <Input
                  type="email"
                  required
                  className="pl-12 bg-white/5 border-white/10"
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
                  className="pl-12 bg-white/5 border-white/10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              variant="premium" 
              size="xl" 
              className="w-full mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              {loading ? "Signing in..." : "Sign In to BrainBridge"}
            </Button>
          </form>

          <p className="text-center text-white/50 text-sm mt-8">
            Don't have an account?{" "}
            <Link href="/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              Create account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
