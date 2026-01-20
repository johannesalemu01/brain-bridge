import Navbar from "@/components/Navbar";
import { ArrowRight, BrainCircuit, Mic, ShieldCheck, Sparkles, Languages } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[120px] -z-10 animate-pulse-glow" />
        
        <div className="container mx-auto text-center max-w-4xl animate-fade-in relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-violet-500/30 bg-violet-500/10">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-300">The Future of Learning is Here</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Connect. Learn.<br />
            <span className="gradient-text">Master Everything.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            BrainBridge AI combines personalized AI study planning, voice-based Amharic & English tutoring, and a teacher-verified knowledge base to help you study smarter.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto group">
              Start Learning Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#features" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
              Explore Features
            </Link>
          </div>
        </div>
        
        {/* Placeholder for vibrant hero illustration */}
        <div className="mt-20 container mx-auto relative z-10 animate-slide-up">
            <div className="w-full max-w-5xl mx-auto aspect-video rounded-3xl glass border-white/20 p-2 overflow-hidden shadow-2xl shadow-violet-500/20">
               <div className="w-full h-full bg-gradient-to-br from-violet-900/40 to-cyan-900/40 rounded-2xl flex items-center justify-center relative overflow-hidden">
                 {/* Decorative elements indicating AI learning */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                 <BrainCircuit className="w-32 h-32 text-white/20 animate-float" />
                 <div className="absolute bottom-10 left-10 p-4 glass rounded-xl flex items-center gap-4 animate-float" style={{ animationDelay: '1s' }}>
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Voice Question</p>
                        <p className="text-xs text-white/60">"What is photosynthesis?"</p>
                    </div>
                 </div>
                 <div className="absolute top-10 right-10 p-4 glass rounded-xl flex items-center gap-4 animate-float" style={{ animationDelay: '2s' }}>
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Verified Answer</p>
                        <p className="text-xs text-white/60">Reviewed by Ms. Sarah</p>
                    </div>
                 </div>
               </div>
            </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-24 bg-black/40 border-y border-white/5 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Three Pillars of <span className="text-cyan-400">BrainBridge</span></h2>
            <p className="text-white/60 max-w-2xl mx-auto">Everything you need to accelerate your learning journey in one seamless platform.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="glass p-8 hover:bg-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-7 h-7 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Study Planner</h3>
              <p className="text-white/60 mb-6 leading-relaxed">
                Personalized schedules generated by GPT-4o based on your exam dates, weak subjects, and available time. Automatically adjusts if you fall behind.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass p-8 hover:bg-white/10 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Languages className="w-32 h-32 text-cyan-400" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                <Mic className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">Voice Learning</h3>
              <p className="text-white/60 mb-6 leading-relaxed relative z-10">
                Ask questions using voice or text. Receive crystal-clear audio explanations in <strong className="text-white">Amharic</strong> or English. Perfect for auditory learners.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass p-8 hover:bg-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Verified Q&A</h3>
              <p className="text-white/60 mb-6 leading-relaxed">
                Ask anything anytime. AI provides instant answers, and human teachers review and verify them to build a highly trusted knowledge base.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Setup/CTA Section ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] -z-10" />
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to transform how you study?</h2>
            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">Join BrainBridge AI today and experience the perfect blend of artificial intelligence and human teaching.</p>
            <Link href="/register" className="btn-primary text-xl px-10 py-5 shadow-2xl shadow-violet-500/30">
                Create Free Account
            </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center px-6">
        <p className="text-white/40 text-sm">© 2026 BrainBridge AI. Built for the Hackathon.</p>
      </footer>
    </main>
  );
}
