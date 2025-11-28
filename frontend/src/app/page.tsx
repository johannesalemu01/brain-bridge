import Navbar from "@/components/Navbar";
import { ArrowRight, BrainCircuit, Mic, ShieldCheck, Sparkles, Languages, Rocket, Zap, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0b1021]">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 px-6 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[140px] -z-10 animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none -z-20" />
        
        <div className="container mx-auto text-center max-w-5xl animate-fade-in relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-10 border-violet-500/30 bg-violet-500/5 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-violet-300/80">Next-Gen AI Learning Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight">
            Study Smarter.<br />
            <span className="gradient-text drop-shadow-[0_0_30px_rgba(167,139,250,0.3)]">Learn Faster.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/50 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Empowering students with personalized AI study schedules, voice-based Amharic & English tutoring, and a teacher-verified knowledge base.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button asChild variant="premium" size="xl" className="h-16 px-10 rounded-2xl group text-lg font-bold shadow-2xl shadow-violet-500/40">
              <Link href="/register" className="flex items-center gap-2">
                Get Started for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="h-16 px-10 rounded-2xl bg-white/5 border-white/10 text-white group hover:bg-white/10 font-bold transition-all">
                <Link href="#features" className="flex items-center gap-2">
                    Explore Platform
                </Link>
            </Button>
          </div>
        </div>
        
        {/* Floating Dashboard Preview */}
        <div className="mt-32 container mx-auto relative z-10 animate-slide-up group">
            <div className="w-full max-w-5xl mx-auto aspect-[16/10] rounded-[2.5rem] glass border-white/5 p-3 overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.15)] transition-all group-hover:scale-[1.01] group-hover:shadow-[0_0_100px_rgba(139,92,246,0.25)]">
               <div className="w-full h-full bg-gradient-to-br from-violet-900/40 via-[#0b1021] to-cyan-900/40 rounded-[2rem] flex items-center justify-center relative overflow-hidden ring-1 ring-white/10 shadow-inner">
                 <BrainCircuit className="w-40 h-40 text-white/10 animate-float opacity-50" />
                 
                 {/* Decorative elements representing features */}
                 <div className="absolute top-1/4 left-1/4 p-5 glass rounded-2xl flex items-center gap-5 animate-float border-white/10 shadow-2xl" style={{ animationDelay: '0.5s' }}>
                    <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                        <Rocket className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white uppercase tracking-widest">AI Planner</p>
                        <p className="text-[10px] text-white/40 uppercase font-black">98% Success Rate</p>
                    </div>
                 </div>

                 <div className="absolute bottom-1/4 right-1/4 p-5 glass rounded-2xl flex items-center gap-5 animate-float border-white/10 shadow-2xl" style={{ animationDelay: '1.5s' }}>
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                        <Mic className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white uppercase tracking-widest">Voice Tutor</p>
                        <p className="text-[10px] text-white/40 uppercase font-black">Multi-lingual AI</p>
                    </div>
                 </div>

                 <div className="absolute top-1/2 right-20 p-5 glass rounded-2xl flex items-center gap-5 animate-float border-emerald-500/10 shadow-2xl" style={{ animationDelay: '2.5s' }}>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white uppercase tracking-widest">Verified Q&A</p>
                        <p className="text-[10px] text-white/40 uppercase font-black">Teacher Approved</p>
                    </div>
                 </div>
               </div>
            </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="py-32 bg-black/40 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent)] pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Revolutionary <span className="text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">Learning</span> Tools</h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg font-medium leading-relaxed">Everything you need to master your academics in one integrated platform.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Feature 1 */}
            <Card className="p-10 hover:bg-white/10 transition-all duration-500 group border-white/5 hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/10 active:scale-[0.98]">
              <CardHeader className="p-0 mb-8">
                <div className="w-16 h-16 rounded-[1.25rem] bg-violet-500/20 flex items-center justify-center mb-8 border border-violet-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <BrainCircuit className="w-8 h-8 text-violet-400" />
                </div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">AI Study Planner</CardTitle>
                <CardDescription className="text-base text-white/40 font-medium leading-relaxed">
                    Personalized schedules generated by GPT-4o based on your exam dates and weak subjects. Dynamic adjustments included.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="p-10 hover:bg-white/10 transition-all duration-500 group border-white/5 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10 active:scale-[0.98] relative overflow-hidden">
              <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Languages className="w-64 h-64 text-cyan-400" />
              </div>
              <CardHeader className="p-0 mb-8 relative z-10">
                <div className="w-16 h-16 rounded-[1.25rem] bg-cyan-500/20 flex items-center justify-center mb-8 border border-cyan-500/30 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                    <Mic className="w-8 h-8 text-cyan-400" />
                </div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">Voice Tutoring</CardTitle>
                <CardDescription className="text-base text-white/40 font-medium leading-relaxed">
                    Ask questions in <strong className="text-cyan-400">Amharic</strong> or English. Receive crystal-clear audio explanations instantly.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="p-10 hover:bg-white/10 transition-all duration-500 group border-white/5 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 active:scale-[0.98]">
              <CardHeader className="p-0 mb-8">
                <div className="w-16 h-16 rounded-[1.25rem] bg-emerald-500/20 flex items-center justify-center mb-8 border border-emerald-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">Verified Q&A</CardTitle>
                <CardDescription className="text-base text-white/40 font-medium leading-relaxed">
                    Access a massive knowledge base of AI answers reviewed and verified by real expert teachers.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Stats / Impact Section ── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] -z-10" />
        <div className="container mx-auto px-6 max-w-5xl">
            <Card className="bg-gradient-to-br from-violet-600 to-indigo-700 border-0 p-12 text-center shadow-[0_0_100px_rgba(139,92,246,0.3)] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/60-lines.png')] opacity-20 pointer-events-none" />
                <CardContent className="relative z-10 p-0">
                    <div className="inline-flex p-3 rounded-2xl bg-white/10 mb-8 group-hover:scale-110 transition-transform">
                        <Zap className="w-10 h-10 text-white fill-white" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Experience Global-Standard AI Learning</h2>
                    <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto font-medium">Join 5,000+ students already transforming their grades with BrainBridge AI Tutor.</p>
                    <Button asChild variant="secondary" size="xl" className="bg-white text-violet-700 hover:bg-white/90 h-16 px-12 rounded-2xl font-black shadow-2xl transition-all active:scale-95">
                        <Link href="/register">Start for Free Today</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-20 border-t border-white/5 text-center px-6 bg-black/20">
        <div className="flex items-center justify-center gap-3 mb-12">
            <div className="p-2 rounded-xl bg-violet-500/20 border border-violet-500/30">
              <BrainCircuit className="w-5 h-5 text-violet-400" />
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase">BrainBridge<span className="text-cyan-400">AI</span></span>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
            <Link href="#" className="text-xs font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Contact Support</Link>
        </div>
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            © 2026 BrainBridge AI <div className="w-1 h-1 rounded-full bg-white/20" /> Built with <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" /> for the Hackathon
        </p>
      </footer>
    </main>
  );
}
