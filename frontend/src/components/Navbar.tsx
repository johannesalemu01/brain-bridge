import Link from "next/link";
import { BrainCircuit, BookOpen, Mic, MessagesSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { isLoggedIn, clearAuth } from "@/lib/auth";

export default function Navbar() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isLoggedIn());
    const handleScroll = () => setHasScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        hasScrolled ? "bg-background/80 backdrop-blur-lg border-b border-white/10" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">BrainBridge<span className="text-cyan-400">AI</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Features</Link>
          <Link href="#planner" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
            <BookOpen className="w-4 h-4" /> Study Planner
          </Link>
          <Link href="#voice" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
            <Mic className="w-4 h-4" /> Voice Learning
          </Link>
          <Link href="#qa" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
            <MessagesSquare className="w-4 h-4" /> Q&A Board
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {authed ? (
            <>
              <Link href="/dashboard" className="btn-secondary py-2 px-4 shadow-none">Dashboard</Link>
              <button onClick={handleLogout} className="text-sm font-medium text-white/60 hover:text-white">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Log In</Link>
              <Link href="/register" className="btn-primary py-2 px-4 shadow-none">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
