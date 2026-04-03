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
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const heroImage = "/images/children_studing.jpg";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right";
}) {
  const { ref, visible } = useReveal();
  const hidden =
    direction === "left"
      ? "opacity-0 -translate-x-8"
      : direction === "right"
      ? "opacity-0 translate-x-8"
      : "opacity-0 translate-y-8";
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        visible ? "opacity-100 translate-x-0 translate-y-0" : hidden
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-700">
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
    <main
      className="min-h-screen overflow-x-hidden bg-white text-slate-900 antialiased"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      <Navbar />

      {/* Floating side logo */}
      <div
        className={`fixed right-0 top-1/2 z-50 transition-all duration-500 ease-out ${
          showLogo ? "-translate-y-1/2 translate-x-0" : "-translate-y-1/2 translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center gap-3 rounded-l-2xl border border-slate-200 bg-white/95 px-3 py-5 shadow-2xl backdrop-blur-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>
          <span
            className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]"
            style={{ writingMode: "vertical-rl" }}
          >
            BrainBridge
          </span>
          <Link
            href="/register"
            className="rounded-lg bg-indigo-600 px-2 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-white hover:bg-indigo-700 transition-colors"
          >
            Join
          </Link>
        </div>
      </div>

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0f1729] to-slate-900 pt-28 pb-0 sm:pt-32 lg:pt-36"
      >
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(99,102,241,0.25),transparent)]" />
        {/* Top border shine */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #6366f1 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid items-end gap-0 lg:grid-cols-2 lg:gap-20">
            {/* Left */}
            <div className="pb-16 text-center lg:pb-24 lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Learning Platform for Ethiopian Students
              </div>

              <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-6xl lg:text-[4.25rem]">
                Learn smarter.{" "}
                <br className="hidden lg:block" />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-300 bg-clip-text text-transparent">
                  Grow faster.
                </span>
              </h1>

              <p className="mb-10 max-w-lg text-lg leading-relaxed text-slate-400 lg:mx-0 mx-auto">
                BrainBridge unifies AI study planning, real-time voice tutoring
                in{" "}
                <span className="font-medium text-slate-200">
                  Amharic & English
                </span>
                , and teacher-verified Q&A — so every student achieves their
                potential.
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Button
                  asChild
                  size="xl"
                  className="h-12 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-7 text-sm font-semibold shadow-lg shadow-indigo-900/40 transition-all border-0"
                >
                  <Link href="/register" className="flex items-center gap-2">
                    Get Started — It&apos;s Free{" "}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="xl"
                  className="h-12 rounded-lg border border-white/10 bg-white/5 px-7 text-sm font-semibold text-white hover:bg-white/10 backdrop-blur-sm transition-all"
                >
                  <Link href="#features">See Features</Link>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-5 justify-center lg:justify-start">
                {[
                  "No credit card required",
                  "Free forever plan",
                  "Amharic & English support",
                ].map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-2 text-xs text-slate-500"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — hero image */}
            <div className="relative flex items-end justify-center lg:justify-end">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-32 bg-indigo-600/20 blur-3xl rounded-full" />
              <div className="relative w-full max-w-lg lg:max-w-full">
                <div className="relative overflow-hidden rounded-t-[1.75rem] border border-white/10 shadow-[0_-16px_48px_-8px_rgba(99,102,241,0.35)]">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={heroImage}
                      alt="Students learning with BrainBridge AI"
                      fill
                      className="object-cover object-[center_40%]"
                      sizes="(max-width: 1024px) 90vw, 55vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
                  </div>
                </div>
                {/* Glass card — AI tutor */}
                <div className="absolute -left-4 bottom-10 lg:-left-10 rounded-xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                      <BrainCircuit className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        AI Tutor Active
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Answering in Amharic…
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-0.5 items-end h-5">
                    {[3, 5, 7, 4, 6, 8, 5, 3].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-indigo-400 animate-pulse"
                        style={{
                          height: `${h * 2.5}px`,
                          animationDelay: `${i * 120}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                {/* Glass card — score */}
                <div className="absolute -right-4 top-6 lg:-right-8 rounded-xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-[11px] font-semibold text-white">
                      Weekly Score
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    94
                    <span className="text-sm font-normal text-slate-400">%</span>
                  </p>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    ↑ 12% from last week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SOCIAL PROOF
      ════════════════════════════════ */}
      <section className="border-b border-slate-100 bg-slate-50">
        <div className="container mx-auto max-w-6xl px-5 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Trusted by
            </p>
            {[
              { value: "12,000+", label: "Active Students" },
              { value: "98%", label: "Satisfaction" },
              { value: "3×", label: "Faster Learning" },
              { value: "2", label: "Languages" },
              { value: "500+", label: "Teachers" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FEATURE 1 — AI STUDY PLANNER
      ════════════════════════════════ */}
      <section id="features" className="scroll-mt-20 py-24 lg:py-32">
        <div className="container mx-auto max-w-6xl px-5 lg:px-8">
          {/* Section header */}
          <Reveal className="mx-auto mb-20 max-w-2xl text-center">
            <Tag>Platform Features</Tag>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.02em] text-slate-900 sm:text-5xl">
              Three tools. One platform.{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Unlimited potential.
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              Purpose-built for Ethiopian students and teachers — available in
              Amharic and English.
            </p>
          </Reveal>

          {/* Feature 1 */}
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20 mb-28">
            <Reveal direction="left">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 mb-6">
                <BrainCircuit className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-600">
                01 — AI Study Planner
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
                A study plan that actually adapts to you
              </h3>
              <p className="text-lg text-slate-500 leading-relaxed mb-8">
                Tell us your exam dates, subjects, and daily schedule. Our AI
                analyzes your weak areas and builds a realistic, personalized
                plan that adjusts as your understanding grows.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Adaptive scheduling based on your performance",
                  "Prioritizes weaker subjects automatically",
                  "Syncs with your exam calendar",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-sm text-slate-600"
                  >
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Create your plan <ChevronRight className="h-4 w-4" />
              </Link>
            </Reveal>

            <Reveal direction="right" delay={100}>
              <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-100 overflow-hidden">
                {/* Window chrome */}
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3.5">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="ml-2 text-xs font-medium text-slate-400">
                    Today's Study Schedule
                  </span>
                </div>
                <div className="p-5 space-y-2.5">
                  {[
                    { time: "08:00", label: "Mathematics — Quadratic Equations", done: true },
                    { time: "10:00", label: "English — Essay Structure", done: true },
                    { time: "13:00", label: "Physics — Newton's Laws", done: false },
                    { time: "15:30", label: "History — Axumite Empire", done: false },
                  ].map(({ time, label, done }) => (
                    <div
                      key={time}
                      className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-all ${
                        done
                          ? "border-slate-100 bg-slate-50/60"
                          : "border-slate-200 bg-white shadow-sm"
                      }`}
                    >
                      <span className="w-10 shrink-0 text-[11px] font-semibold text-slate-400">
                        {time}
                      </span>
                      <span
                        className={`flex-1 text-sm font-medium ${
                          done
                            ? "line-through text-slate-400"
                            : "text-slate-700"
                        }`}
                      >
                        {label}
                      </span>
                      {done && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                  ))}
                  <div className="pt-2 space-y-2">
                    {[
                      { label: "Math & Sciences", val: 88 },
                      { label: "Language Arts", val: 72 },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                          <span>{label}</span>
                          <span className="text-indigo-600">{val}%</span>
                        </div>
                        <Progress
                          value={val}
                          className="h-1.5 rounded-full bg-slate-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Feature 2 */}
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20 mb-28">
            <Reveal direction="right" className="order-1 lg:order-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 mb-6">
                <Mic className="h-6 w-6 text-violet-600" />
              </div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-600">
                02 — Voice Tutoring
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
                Ask questions in your own language
              </h3>
              <p className="text-lg text-slate-500 leading-relaxed mb-8">
                Speak your question aloud — in Amharic or English — and receive
                a clear, patient spoken response. Hands-free learning designed
                for how students actually study.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: Globe, label: "Amharic & English" },
                  { icon: Zap, label: "Real-time responses" },
                  { icon: Clock, label: "Available 24/7" },
                  { icon: Languages, label: "Natural language" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
                  >
                    <Icon className="h-4 w-4 text-violet-500 shrink-0" />
                    <span className="text-xs font-medium text-slate-700">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
              >
                Try voice tutoring <ChevronRight className="h-4 w-4" />
              </Link>
            </Reveal>

            <Reveal direction="left" delay={100} className="order-2 lg:order-1">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-100 overflow-hidden">
                <div className="flex items-center gap-2 justify-between border-b border-slate-100 bg-slate-50 px-5 py-3.5">
                  <span className="text-xs font-medium text-slate-400">
                    Live Tutoring Session
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="p-5 space-y-4 bg-slate-50/40">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-[11px] font-bold shrink-0">
                      You
                    </div>
                    <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-white px-4 py-3 shadow-sm text-sm text-slate-700 font-medium">
                      "ሺህ ዓ.ም. ምን ተፈጠረ?"
                    </div>
                  </div>
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                      <BrainCircuit className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="max-w-[80%] rounded-2xl rounded-tr-none bg-indigo-600 px-4 py-3 shadow-sm text-sm text-white font-normal leading-relaxed">
                      In 1000 CE, the Zagwe dynasty began to rise in Ethiopia,
                      following the decline of the Axumite Empire. They ruled
                      from Lalibela…
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex gap-0.5 items-end h-6">
                      {[3, 5, 8, 4, 7, 9, 5, 3, 6, 4].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full bg-violet-400 animate-pulse"
                          style={{
                            height: `${h * 2.8}px`,
                            animationDelay: `${i * 100}ms`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      Listening for your question…
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Feature 3 */}
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal direction="left">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 mb-6">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                03 — Verified Q&A
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
                AI drafts. Teachers approve.
              </h3>
              <p className="text-lg text-slate-500 leading-relaxed mb-8">
                Every answer starts with AI — then gets reviewed and approved by
                certified Ethiopian teachers. The result: accurate,
                curriculum-aligned explanations you can trust.
              </p>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5 flex items-start gap-4 mb-8">
                <Award className="h-7 w-7 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">
                    100% Verified Content
                  </p>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    No answer reaches a student until it has been reviewed by a
                    qualified educator.
                  </p>
                </div>
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Start asking questions <ChevronRight className="h-4 w-4" />
              </Link>
            </Reveal>

            <Reveal direction="right" delay={100}>
              <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-100 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3.5">
                  <span className="text-xs font-medium text-slate-400">
                    Verified Q&A Feed
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-600">
                    Grade 10
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                    {
                      q: "What is the process of photosynthesis?",
                      verified: true,
                      subject: "Biology",
                      time: "2 min ago",
                    },
                    {
                      q: "Explain Newton's Second Law of Motion",
                      verified: true,
                      subject: "Physics",
                      time: "5 min ago",
                    },
                    {
                      q: "Solve for x: 2x² + 5x − 3 = 0",
                      verified: false,
                      subject: "Mathematics",
                      time: "Just now",
                    },
                  ].map(({ q, verified, subject, time }) => (
                    <div key={q} className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-800 mb-3">
                        {q}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                              verified
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {verified ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            {verified ? "Verified" : "Under Review"}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {subject}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════ */}
      <section className="border-y border-slate-100 bg-slate-50 py-24 lg:py-32">
        <div className="container mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <Tag>Getting Started</Tag>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.02em] text-slate-900 sm:text-5xl">
              Up and running in{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                three steps
              </span>
            </h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: BookOpen,
                title: "Create your account",
                desc: "Sign up as a student or teacher. Share your subjects, exam dates, and learning goals.",
                color: "bg-indigo-50 text-indigo-600",
                delay: 0,
              },
              {
                step: "02",
                icon: BrainCircuit,
                title: "Receive your AI plan",
                desc: "Our AI generates a tailored study schedule that adapts dynamically to your progress.",
                color: "bg-violet-50 text-violet-600",
                delay: 100,
              },
              {
                step: "03",
                icon: Trophy,
                title: "Learn and achieve",
                desc: "Use your voice tutor, get verified answers, track your progress, and excel in your exams.",
                color: "bg-emerald-50 text-emerald-600",
                delay: 200,
              },
            ].map(({ step, icon: Icon, title, desc, color, delay }) => (
              <Reveal key={step} delay={delay}>
                <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-all">
                  <span className="absolute top-6 right-6 text-4xl font-extrabold text-slate-100 select-none">
                    {step}
                  </span>
                  <div
                    className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════ */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <Tag>
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Student
              Reviews
            </Tag>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.02em] text-slate-900 sm:text-5xl">
              Trusted by students and teachers
            </h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Hana Tesfaye",
                role: "Grade 10 Student",
                quote:
                  "The voice tutor explains everything in Amharic and I finally understand topics I've struggled with for years. My confidence has improved significantly.",
                delay: 0,
              },
              {
                name: "Ato Bekele Alemu",
                role: "Mathematics Teacher",
                quote:
                  "I can review and approve every AI-generated answer before it reaches my students. The platform respects my role as an educator rather than replacing me.",
                delay: 100,
              },
              {
                name: "Yonas Girma",
                role: "University Student",
                quote:
                  "The AI study planner recognized I perform better in morning sessions and scheduled my hardest topics accordingly. My GPA improved by a full grade point.",
                delay: 200,
              },
            ].map(({ name, role, quote, delay }) => (
              <Reveal key={name} delay={delay}>
                <Card className="h-full rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="mb-4 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="mb-6 text-sm leading-relaxed text-slate-600">
                      "{quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {name}
                        </p>
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

      {/* ════════════════════════════════
          FOR TEACHERS
      ════════════════════════════════ */}
      <section className="border-y border-slate-100 bg-slate-950 py-24 lg:py-32 text-white">
        <div className="container mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <Reveal>
              <div className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-300 mb-6">
                For Educators
              </div>
              <h2 className="text-4xl font-bold tracking-[-0.02em] sm:text-5xl mb-5">
                Augment your teaching,{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  not replace it
                </span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-10">
                BrainBridge gives teachers a powerful oversight layer — spend
                less time on repetitive questions and more time on the teaching
                moments that matter.
              </p>
              <div className="space-y-3 mb-10">
                {[
                  {
                    icon: ShieldCheck,
                    text: "Review and approve all AI-generated answers",
                  },
                  {
                    icon: TrendingUp,
                    text: "Monitor individual student progress in real time",
                  },
                  {
                    icon: Zap,
                    text: "Instantly generate quizzes and assignments",
                  },
                  {
                    icon: Globe,
                    text: "Support students natively in Amharic or English",
                  },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-indigo-400" />
                    </div>
                    <span className="text-sm text-slate-300">{text}</span>
                  </div>
                ))}
              </div>
              <Button
                asChild
                className="h-11 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-semibold border-0 shadow-lg"
              >
                <Link href="/register" className="flex items-center gap-2">
                  Join as a Teacher <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Reveal>

            <Reveal delay={150}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "50%", label: "Reduction in admin time", icon: Clock },
                  { value: "3×", label: "Increase in engagement", icon: TrendingUp },
                  { value: "100%", label: "Content accuracy", icon: ShieldCheck },
                  { value: "24/7", label: "AI assistance available", icon: Zap },
                ].map(({ value, label, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center hover:bg-white/8 transition-all"
                  >
                    <Icon className="mx-auto mb-3 h-5 w-5 text-indigo-400" />
                    <p className="text-3xl font-bold text-white">{value}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-tight">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA
      ════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto max-w-5xl px-5 lg:px-8">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-[-0.02em] text-slate-900 sm:text-5xl">
              Start your learning journey today
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Free to sign up. No credit card required.
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 max-w-3xl mx-auto">
            <Reveal delay={0}>
              <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50 p-8 hover:border-indigo-200 hover:shadow-lg transition-all h-full flex flex-col">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-200">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  I&apos;m a Student
                </h3>
                <p className="text-sm text-slate-500 mb-6 flex-1 leading-relaxed">
                  A personalized AI study plan, voice tutor in your language,
                  and unlimited verified answers.
                </p>
                <ul className="space-y-2 mb-7">
                  {[
                    "Free forever plan",
                    "AI study planner included",
                    "Voice tutor in Amharic & English",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold border-0 shadow-md shadow-indigo-100"
                >
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-2"
                  >
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 hover:border-slate-300 hover:shadow-lg transition-all h-full flex flex-col">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 shadow-md shadow-slate-200">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  I&apos;m a Teacher
                </h3>
                <p className="text-sm text-slate-500 mb-6 flex-1 leading-relaxed">
                  Review AI answers, track student progress, and spend more time
                  on impactful teaching.
                </p>
                <ul className="space-y-2 mb-7">
                  {[
                    "Answer review dashboard",
                    "Student progress analytics",
                    "Instant quiz generator",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-lg border-2 border-slate-900 bg-slate-900 text-white hover:bg-slate-800 font-semibold"
                >
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-2"
                  >
                    Join as Teacher <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <p className="mt-7 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500 underline underline-offset-4 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer className="border-t border-slate-100 bg-slate-50 px-5 py-12 lg:px-8">
        <div className="container mx-auto flex max-w-6xl flex-col items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <BrainCircuit className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-slate-900">
              BrainBridge AI
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-slate-900 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">
              Support
            </Link>
            <Link
              href="#features"
              className="hover:text-slate-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/login"
              className="hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            © 2026 BrainBridge AI · Built with{" "}
            <Heart className="inline h-3 w-3 fill-rose-500 text-rose-500" /> for
            learners everywhere
          </p>
        </div>
      </footer>
    </main>
  );
}
