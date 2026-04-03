"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Heart,
  Languages,
  Mic,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Trophy,
  Users,
  Star,
  Clock,
  Zap,
  Globe,
  TrendingUp,
  Award,
  Play,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const heroImage = "/images/children_studing.jpg";

/* ─── Reveal on scroll ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide ${className}`}>
      {children}
    </span>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => setShowLogo(hero.getBoundingClientRect().bottom < 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900 antialiased">
      <Navbar />

      {/* ── Floating side logo ── */}
      <div className={`fixed right-0 top-1/2 z-50 transition-all duration-500 ease-out ${showLogo ? "-translate-y-1/2 translate-x-0" : "-translate-y-1/2 translate-x-full"}`}>
        <div className="flex flex-col items-center gap-3 rounded-l-2xl border border-slate-200/80 bg-white/95 px-3 py-5 shadow-2xl backdrop-blur-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest" style={{ writingMode: "vertical-rl" }}>
            BrainBridge
          </span>
          <Link href="/register" className="rounded-lg bg-indigo-600 px-2 py-1.5 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-indigo-700 transition-colors">
            Join
          </Link>
        </div>
      </div>

      {/* ══════════ HERO — dark premium ══════════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-28 pb-0 sm:pt-32 lg:pt-36"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40" />

        <div className="container relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid items-end gap-0 lg:grid-cols-2 lg:gap-16">

            {/* Left copy */}
            <div className="pb-16 text-center lg:pb-24 lg:text-left">
              <Badge className="mb-6 bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Learning Platform
              </Badge>

              <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
                Learn smarter.{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                  Grow faster.
                </span>
              </h1>

              <p className="mb-10 max-w-lg text-lg leading-relaxed text-slate-400 lg:mx-0 mx-auto">
                BrainBridge combines AI study planning, real-time voice tutoring in{" "}
                <span className="font-semibold text-slate-200">Amharic & English</span>, and
                teacher-verified answers — so every student can learn deeply, in their own way.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button asChild size="xl" className="h-14 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-8 text-base font-semibold shadow-lg shadow-indigo-500/25 transition-all border-0">
                  <Link href="/register" className="flex items-center gap-2">
                    Get Started Free <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="h-14 rounded-xl border border-white/10 bg-white/5 px-8 text-base font-semibold text-white hover:bg-white/10 backdrop-blur-sm transition-all">
                  <Link href="#features" className="flex items-center gap-2">
                    <Play className="h-4 w-4" /> Watch Demo
                  </Link>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                {[
                  "No credit card required",
                  "Free forever plan",
                  "Amharic & English",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-slate-400">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Image — sits at bottom of dark hero */}
            <div className="relative flex items-end justify-center lg:justify-end">
              {/* Glow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-40 bg-indigo-600/30 blur-3xl rounded-full" />

              <div className="relative w-full max-w-lg lg:max-w-full">
                {/* Main image */}
                <div className="relative overflow-hidden rounded-t-[2rem] border border-white/10 shadow-[0_-20px_60px_-10px_rgba(99,102,241,0.4)]">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={heroImage}
                      alt="Students learning with BrainBridge AI"
                      fill
                      className="object-cover object-[center_40%]"
                      sizes="(max-width: 1024px) 90vw, 55vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  </div>
                </div>

                {/* Floating glass card — AI buddy */}
                <div className="absolute -left-4 bottom-12 lg:-left-12 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                      <BrainCircuit className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">AI Tutor Active</p>
                      <p className="text-[11px] text-slate-400">Answering in Amharic…</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-1 items-end h-6">
                    {[3,5,7,4,6,8,5,3].map((h, i) => (
                      <div key={i} className="w-1 rounded-full bg-indigo-400 animate-pulse" style={{ height: `${h * 3}px`, animationDelay: `${i * 120}ms` }} />
                    ))}
                  </div>
                </div>

                {/* Floating glass card — score */}
                <div className="absolute -right-4 top-8 lg:-right-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span className="text-xs font-bold text-white">Weekly Score</span>
                  </div>
                  <p className="text-2xl font-black text-white">94<span className="text-sm font-normal text-slate-400">%</span></p>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">↑ 12% from last week</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════ SOCIAL PROOF BAR ══════════ */}
      <section className="border-y border-slate-100 bg-slate-50 py-6">
        <div className="container mx-auto max-w-6xl px-5 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Trusted by</p>
            {[
              { value: "12,000+", label: "Active Students" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "3×", label: "Faster Learning" },
              { value: "2", label: "Languages Supported" },
              { value: "500+", label: "Teachers Verified" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-slate-900">{value}</p>
                <p className="text-xs text-slate-500 font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" className="scroll-mt-20 py-24 sm:py-32">
        <div className="container mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <Badge className="mb-4 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
              Platform Features
            </Badge>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Everything your students need to{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                succeed
              </span>
            </h2>
            <p className="mt-4 text-xl text-slate-500">
              Three powerful tools, one seamless platform.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <Tabs defaultValue="planner" className="w-full">
              <TabsList className="mx-auto mb-12 flex w-fit gap-1 rounded-xl bg-slate-100 p-1.5">
                <TabsTrigger value="planner" className="rounded-lg px-6 py-2.5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm transition-all">
                  AI Study Planner
                </TabsTrigger>
                <TabsTrigger value="voice" className="rounded-lg px-6 py-2.5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm transition-all">
                  Voice Tutoring
                </TabsTrigger>
                <TabsTrigger value="qa" className="rounded-lg px-6 py-2.5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm transition-all">
                  Verified Q&A
                </TabsTrigger>
              </TabsList>

              <TabsContent value="planner">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                  <div>
                    <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 ring-1 ring-indigo-100">
                      <BrainCircuit className="h-7 w-7 text-indigo-600" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Personalized AI Study Plans</h3>
                    <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                      Our AI analyzes your exam schedule, identifies weak topics, and creates a realistic daily study plan — one that adapts as you grow.
                    </p>
                    <div className="space-y-5">
                      {[
                        { label: "Mathematics", value: 85 },
                        { label: "Language Arts", value: 70 },
                        { label: "Sciences", value: 92 },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div className="flex justify-between text-sm font-semibold text-slate-600 mb-2">
                            <span>{label}</span><span className="text-indigo-600">{value}%</span>
                          </div>
                          <Progress value={value} className="h-2 rounded-full bg-slate-100" />
                        </div>
                      ))}
                    </div>
                    <Button asChild className="mt-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold border-0">
                      <Link href="/register" className="flex items-center gap-2">
                        Create your plan <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <Card className="border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/60">
                    <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-400" />
                        <div className="h-3 w-3 rounded-full bg-yellow-400" />
                        <div className="h-3 w-3 rounded-full bg-green-400" />
                      </div>
                      <span className="text-xs font-semibold text-slate-500 ml-2">Today's Study Schedule</span>
                    </div>
                    <CardContent className="p-5 space-y-3">
                      {[
                        { time: "8:00 AM", task: "Math — Quadratic Equations", done: true, color: "bg-indigo-600" },
                        { time: "10:00 AM", task: "English — Essay Outline", done: true, color: "bg-violet-600" },
                        { time: "1:00 PM", task: "Physics — Newton's Laws", done: false, color: "bg-blue-600" },
                        { time: "3:30 PM", task: "History Flashcard Review", done: false, color: "bg-purple-600" },
                      ].map(({ time, task, done, color }) => (
                        <div key={time} className={`flex items-center gap-3 rounded-xl p-3 border transition-all ${done ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-200 shadow-sm"}`}>
                          <div className={`h-2 w-2 rounded-full flex-shrink-0 ${done ? "bg-slate-300" : color}`} />
                          <span className="text-xs font-bold text-slate-400 w-16 shrink-0">{time}</span>
                          <span className={`text-sm font-semibold ${done ? "line-through text-slate-400" : "text-slate-700"}`}>{task}</span>
                          {done && <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500 shrink-0" />}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="voice">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                  <div>
                    <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 ring-1 ring-violet-100">
                      <Mic className="h-7 w-7 text-violet-600" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Voice Tutoring in Your Language</h3>
                    <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                      Ask questions out loud — in Amharic or English — and receive patient, spoken guidance. Perfect for studying without being glued to a screen.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Globe, label: "Amharic support", color: "text-violet-600 bg-violet-50" },
                        { icon: Languages, label: "English support", color: "text-indigo-600 bg-indigo-50" },
                        { icon: Zap, label: "Real-time responses", color: "text-yellow-600 bg-yellow-50" },
                        { icon: Clock, label: "Available 24/7", color: "text-emerald-600 bg-emerald-50" },
                      ].map(({ icon: Icon, label, color }) => (
                        <div key={label} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 bg-white shadow-sm">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Card className="border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/60">
                    <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold text-slate-500">AI Tutor — Active Session</span>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4 bg-slate-50/50">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-black shrink-0">You</div>
                        <div className="rounded-2xl rounded-tl-none bg-white border border-slate-200 px-4 py-3 shadow-sm text-sm font-medium text-slate-700">
                          "ሺህ ዓ.ም. ምን ተፈጠረ?"
                        </div>
                      </div>
                      <div className="flex gap-3 flex-row-reverse">
                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                          <BrainCircuit className="h-4 w-4 text-white" />
                        </div>
                        <div className="rounded-2xl rounded-tr-none bg-indigo-600 px-4 py-3 shadow-sm text-sm font-medium text-white max-w-[80%]">
                          In 1000 CE, the Zagwe dynasty was beginning to rise in Ethiopia, following the decline of the Axumite Empire…
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-2 rounded-xl bg-white border border-slate-200 px-4 py-3">
                        <div className="flex gap-0.5 items-end h-7">
                          {[3,5,7,4,6,8,5,3,7,4].map((h, i) => (
                            <div key={i} className="w-1 rounded-full bg-indigo-400 animate-pulse" style={{ height: `${h * 3.5}px`, animationDelay: `${i * 100}ms` }} />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-indigo-600">Listening…</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="qa">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                  <div>
                    <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                      <ShieldCheck className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Teacher-Verified Answers</h3>
                    <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                      AI drafts the answer. Qualified teachers review and approve it. Every answer is curriculum-aligned and accurate.
                    </p>
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 flex items-start gap-4">
                      <Award className="h-8 w-8 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900">100% Verified Content</p>
                        <p className="text-sm text-slate-500 mt-1">Every answer reviewed by certified Ethiopian educators before it reaches students.</p>
                      </div>
                    </div>
                  </div>
                  <Card className="border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/60">
                    <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                      <span className="text-xs font-semibold text-slate-500">Recent Q&A</span>
                    </div>
                    <CardContent className="p-5 space-y-3">
                      {[
                        { q: "What is photosynthesis?", status: "Verified", badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" },
                        { q: "Explain Newton's 2nd Law of Motion", status: "Verified", badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" },
                        { q: "Solve: 2x² + 5x - 3 = 0", status: "Under Review", badge: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-100" },
                      ].map(({ q, status, badge }) => (
                        <div key={q} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                          <p className="text-sm font-semibold text-slate-700 mb-3">{q}</p>
                          <div className="flex items-center justify-between">
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${badge}`}>{status}</span>
                            <span className="text-[11px] text-slate-400">Grade 10 · Math</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </Reveal>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <Badge className="mb-4 bg-white text-slate-600 ring-1 ring-slate-200">
              Getting Started
            </Badge>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Up and running in{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                3 minutes
              </span>
            </h2>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "01", icon: BookOpen, title: "Create your account", desc: "Sign up as a student or teacher. Tell us your subjects, exams, and learning goals.", color: "text-indigo-600 bg-indigo-50", delay: 0 },
              { step: "02", icon: BrainCircuit, title: "Get your AI plan", desc: "Our AI builds a personalized schedule tailored to your pace, strengths, and exam dates.", color: "text-violet-600 bg-violet-50", delay: 100 },
              { step: "03", icon: Trophy, title: "Learn & achieve", desc: "Study with your voice tutor, get verified answers, earn achievements, and ace your exams.", color: "text-pink-600 bg-pink-50", delay: 200 },
            ].map(({ step, icon: Icon, title, desc, color, delay }) => (
              <Reveal key={step} delay={delay}>
                <div className="relative rounded-2xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all">
                  <div className="absolute top-6 right-6 text-5xl font-black text-slate-100">{step}</div>
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <Badge className="mb-4 bg-yellow-50 text-yellow-700 ring-1 ring-yellow-100">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              Student Reviews
            </Badge>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Loved by learners across Ethiopia
            </h2>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Hana T.", role: "Grade 10 Student", quote: "The voice tutor explains things in Amharic and I just get it. I used to dread studying — now I actually look forward to it!", rating: 5, delay: 0 },
              { name: "Mr. Bekele A.", role: "Mathematics Teacher", quote: "I can review and approve AI-generated answers. My students trust the platform because they know I've personally verified the content.", rating: 5, delay: 100 },
              { name: "Yonas G.", role: "University Freshman", quote: "The AI study planner figured out I study better in the morning and scheduled hard topics early. My GPA jumped significantly!", rating: 5, delay: 200 },
            ].map(({ name, role, quote, rating, delay }) => (
              <Reveal key={name} delay={delay}>
                <Card className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-0">
                    <div className="mb-4 flex">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="mb-6 text-slate-600 leading-relaxed text-sm">"{quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{name[0]}</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{name}</p>
                        <p className="text-xs text-slate-400">{role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FOR TEACHERS ══════════ */}
      <section className="py-24 bg-slate-950 text-white">
        <div className="container mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <Reveal>
              <Badge className="mb-5 bg-white/10 text-white ring-1 ring-white/20">
                For Educators
              </Badge>
              <h2 className="text-4xl font-extrabold sm:text-5xl mb-6">
                Empower your{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  classroom
                </span>
              </h2>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                BrainBridge gives teachers a powerful oversight dashboard — so less time on repetitive questions, more time on meaningful teaching.
              </p>
              <div className="space-y-3 mb-10">
                {[
                  { icon: ShieldCheck, text: "Review & approve all AI-generated answers" },
                  { icon: TrendingUp, text: "Monitor individual student progress in real time" },
                  { icon: Zap, text: "Generate instant quizzes and assignments" },
                  { icon: Globe, text: "Support students in Amharic or English" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-slate-300">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-indigo-400" />
                    </div>
                    <span className="text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>
              <Button asChild className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold border-0 shadow-lg shadow-indigo-500/25">
                <Link href="/register" className="flex items-center gap-2">
                  Join as a Teacher <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Reveal>

            <Reveal delay={150}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "50%", label: "Less admin time", icon: Clock },
                  { value: "3×", label: "More engagement", icon: TrendingUp },
                  { value: "100%", label: "Content accuracy", icon: ShieldCheck },
                  { value: "24/7", label: "AI assistance", icon: Zap },
                ].map(({ value, label, icon: Icon }) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm hover:bg-white/10 transition-all">
                    <Icon className="mx-auto mb-3 h-6 w-6 text-indigo-400" />
                    <p className="text-3xl font-black text-white">{value}</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="container mx-auto max-w-5xl px-5 lg:px-8">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Start your learning journey today
            </h2>
            <p className="mt-4 text-xl text-slate-500">
              Free to sign up. No credit card required.
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            <Reveal delay={0}>
              <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50 p-8 hover:border-indigo-200 hover:shadow-lg transition-all h-full flex flex-col">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">I&apos;m a Student</h3>
                <p className="text-sm text-slate-500 mb-6 flex-1 leading-relaxed">
                  Get a personalized study plan, voice tutor in your language, and unlimited verified answers.
                </p>
                <ul className="space-y-2 mb-8">
                  {["Free forever plan", "AI study planner included", "Voice tutor in Amharic & English"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold border-0 shadow-lg shadow-indigo-200">
                  <Link href="/register" className="flex items-center justify-center gap-2">
                    Start as Student <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 hover:border-slate-300 hover:shadow-lg transition-all h-full flex flex-col">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-200">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">I&apos;m a Teacher</h3>
                <p className="text-sm text-slate-500 mb-6 flex-1 leading-relaxed">
                  Review AI answers, track student progress, and spend more time on the teaching that matters.
                </p>
                <ul className="space-y-2 mb-8">
                  {["Answer review dashboard", "Student progress analytics", "Instant quiz generator"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-slate-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full rounded-xl border-2 border-slate-900 bg-slate-900 text-white hover:bg-slate-800 font-semibold">
                  <Link href="/register" className="flex items-center justify-center gap-2">
                    Join as Teacher <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <p className="mt-8 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 underline underline-offset-4 transition-colors">
                Sign in
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="border-t border-slate-100 bg-slate-50 px-5 py-16 lg:px-8">
        <div className="container mx-auto flex max-w-6xl flex-col items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">BrainBridge AI</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-500">
            <Link href="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Support</Link>
            <Link href="#features" className="hover:text-slate-900 transition-colors">Features</Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">Sign In</Link>
          </div>
          <p className="flex items-center gap-2 text-sm text-slate-400">
            © 2026 BrainBridge AI · Built with <Heart className="inline h-3.5 w-3.5 fill-rose-500 text-rose-500" /> for learners everywhere
          </p>
        </div>
      </footer>
    </main>
  );
}
