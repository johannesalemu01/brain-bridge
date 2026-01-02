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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const heroImage =
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1400&q=85";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#faf6f0] text-slate-800">
      <Navbar />

      {/* Soft page backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(251,191,36,0.28),transparent),radial-gradient(ellipse_70%_50%_at_100%_50%,rgba(20,184,166,0.12),transparent),linear-gradient(180deg,#faf6f0_0%,#fffdfb_50%,#f7f0e8_100%)]" />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16 sm:pt-36 lg:pt-40 lg:pb-24">
        <div className="container mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr,1.05fr] lg:gap-16">
            <div className="order-2 text-center lg:order-1 lg:text-left">
              <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-amber-200/80 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm lg:justify-start">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-900/80">
                  Calm, curious, connected learning
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem]">
                Big ideas start
                <br />
                <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-teal-600 bg-clip-text text-transparent">
                  where you are comfortable.
                </span>
              </h1>

              <p className="mb-10 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0 mx-auto">
                BrainBridge blends AI study planning, voice tutoring in{" "}
                <strong className="font-semibold text-teal-800">Amharic & English</strong>,
                and teacher-verified answers — so students can learn deeply, even when
                they&apos;re stretched out with a notebook and a dream.
              </p>

              <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                <Button
                  asChild
                  variant="premium"
                  size="xl"
                  className="h-14 rounded-2xl px-8 text-base shadow-lg shadow-orange-400/35"
                >
                  <Link href="/register" className="gap-2">
                    Start learning free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="xl"
                  className="h-14 rounded-2xl border-slate-200 bg-white/80 px-8 text-base font-semibold text-slate-800 shadow-sm hover:bg-amber-50/80"
                >
                  <Link href="#features">Explore the platform</Link>
                </Button>
              </div>

              <ul className="mt-10 flex flex-col gap-3 text-left text-sm font-medium text-slate-600 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 lg:justify-start">
                {[
                  "Personalized AI study plans",
                  "Voice-first Q&A in your language",
                  "Teacher-approved explanations",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative mx-auto max-w-xl lg:max-w-none">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-amber-200/60 via-orange-100/40 to-teal-200/50 blur-2xl lg:-inset-8" />
                <div className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_32px_64px_-12px_rgba(180,83,9,0.25)] ring-1 ring-amber-100">
                  <div className="relative aspect-[4/5] w-full sm:aspect-[5/6] lg:aspect-[3/4]">
                    <Image
                      src={heroImage}
                      alt="A student relaxed with a book, studying comfortably while lying down"
                      fill
                      className="object-cover object-[center_45%]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                      <p className="text-sm font-bold uppercase tracking-widest text-amber-200/95">
                        Learning unplugged
                      </p>
                      <p className="mt-1 max-w-sm text-lg font-bold leading-snug text-white drop-shadow-md">
                        Study in whatever position helps your mind breathe — we meet you
                        there.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-2 flex max-w-[200px] rotate-2 flex-col gap-1 rounded-2xl border border-white/90 bg-white/95 p-4 shadow-xl backdrop-blur sm:-right-4 lg:-bottom-6 lg:-right-8 lg:max-w-[220px]">
                  <div className="flex items-center gap-2 text-amber-700">
                    <BrainCircuit className="h-4 w-4" />
                    <span className="text-xs font-extrabold uppercase tracking-wide">
                      AI study buddy
                    </span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed text-slate-600">
                    Plans that adapt when exams, moods, or schedules shift.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="scroll-mt-28 border-y border-amber-100/80 bg-white/50 py-20 backdrop-blur-sm sm:py-28"
      >
        <div className="container mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Everything you need to{" "}
              <span className="text-transparent bg-gradient-to-r from-teal-700 to-amber-600 bg-clip-text">
                actually enjoy
              </span>{" "}
              studying
            </h2>
            <p className="text-lg text-slate-600">
              Clear tools, warm design, and serious intelligence — built for students,
              teachers, and late-night cram sessions alike.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <article
              id="planner"
              className="scroll-mt-28 rounded-3xl border border-amber-100/90 bg-gradient-to-b from-white to-amber-50/30 p-2 shadow-lg shadow-amber-900/5"
            >
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader className="pb-4 pt-8">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 ring-2 ring-amber-200/80">
                    <BrainCircuit className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl font-extrabold text-slate-900">
                    AI study planner
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed text-slate-600">
                    Exam dates, weak topics, and daily energy — turned into a schedule you
                    can follow without burning out.
                  </CardDescription>
                </CardHeader>
              </Card>
            </article>

            <article
              id="voice"
              className="scroll-mt-28 rounded-3xl border border-teal-100/90 bg-gradient-to-b from-white to-teal-50/35 p-2 shadow-lg shadow-teal-900/5"
            >
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader className="pb-4 pt-8">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-800 ring-2 ring-teal-200/80">
                    <Mic className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl font-extrabold text-slate-900">
                    Voice tutoring
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed text-slate-600">
                    Ask out loud in{" "}
                    <span className="font-semibold text-teal-800">Amharic or English</span>.
                    Get patient, spoken guidance when reading on the couch or pacing the
                    room.
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-teal-800">
                    <Languages className="h-4 w-4" />
                    Multilingual by design
                  </div>
                </CardHeader>
              </Card>
            </article>

            <article
              id="qa"
              className="scroll-mt-28 rounded-3xl border border-emerald-100/90 bg-gradient-to-b from-white to-emerald-50/30 p-2 shadow-lg shadow-emerald-900/5"
            >
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader className="pb-4 pt-8">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 ring-2 ring-emerald-200/80">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl font-extrabold text-slate-900">
                    Verified Q&amp;A
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed text-slate-600">
                    AI drafts, teachers refine — so answers stay accurate when it matters
                    most.
                  </CardDescription>
                </CardHeader>
              </Card>
            </article>
          </div>
        </div>
      </section>

      {/* ── CTA band ── */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto max-w-4xl px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 px-8 py-14 text-center shadow-2xl shadow-teal-900/30 sm:px-12">
            <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-amber-400/25 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-teal-400/20 blur-3xl" />
            <h2 className="relative text-3xl font-black text-white sm:text-4xl">
              Ready when you are — sprawled on the rug or at your desk.
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-lg text-amber-100/90">
              Join students using BrainBridge to plan smarter, ask boldly, and learn in
              their own rhythm.
            </p>
            <Button
              asChild
              size="xl"
              className="relative mt-10 h-14 rounded-2xl border-0 bg-gradient-to-r from-amber-400 to-orange-400 px-10 text-base font-bold text-amber-950 shadow-lg hover:from-amber-300 hover:to-orange-300"
            >
              <Link href="/register">Create your free account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-amber-100/80 bg-[#f3ece4]/80 px-5 py-16 backdrop-blur-sm lg:px-8">
        <div className="container mx-auto flex max-w-6xl flex-col items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-teal-600 shadow-md">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              BrainBridge
              <span className="text-teal-700">AI</span>
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
            <Link href="#" className="transition hover:text-slate-800">
              Privacy
            </Link>
            <Link href="#" className="transition hover:text-slate-800">
              Terms
            </Link>
            <Link href="#" className="transition hover:text-slate-800">
              Support
            </Link>
          </div>
          <p className="flex items-center gap-2 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            © 2026 BrainBridge AI
            <span className="inline-block h-1 w-1 rounded-full bg-slate-300" />
            Built with <Heart className="inline h-3 w-3 fill-rose-500 text-rose-500" /> for learners
          </p>
        </div>
      </footer>
    </main>
  );
}
