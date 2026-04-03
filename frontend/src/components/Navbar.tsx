"use client";

import Link from "next/link";
import {
  BrainCircuit,
  BookOpen,
  Menu,
  Mic,
  MessagesSquare,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { isLoggedIn, clearAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navLinks: { href: string; label: string; icon?: LucideIcon }[] = [
  { href: "#features", label: "Features" },
  { href: "#planner", label: "Planner", icon: BookOpen },
  { href: "#voice", label: "Voice", icon: Mic },
  { href: "#qa", label: "Q&A", icon: MessagesSquare },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isLoggedIn());

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Add background/border when not at the very top
      setScrolled(currentScrollY > 20);

      // Hide navigation bar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out",
          hidden ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div
          className={cn(
            "w-full transition-all duration-300",
            scrolled
              ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm py-3"
              : "bg-transparent py-5"
          )}
        >
          <nav className="container mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
              onClick={() => setOpen(false)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
                <BrainCircuit className="h-4 w-4 text-white" />
              </div>
              <span
                className={cn(
                  "text-lg font-bold tracking-tight transition-colors",
                  scrolled ? "text-slate-900" : "text-white"
                )}
              >
                BrainBridge
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                    scrolled
                      ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  )}
                >
                  {Icon ? (
                    <Icon className="h-3.5 w-3.5 opacity-70" aria-hidden />
                  ) : null}
                  {label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {authed ? (
                <>
                  <Link
                    href="/dashboard"
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                      scrolled
                        ? "text-slate-700 hover:bg-slate-100"
                        : "text-white hover:bg-white/10"
                    )}
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                      scrolled
                        ? "text-rose-600 hover:bg-rose-50"
                        : "text-rose-300 hover:bg-rose-500/10"
                    )}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                      scrolled
                        ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        : "text-slate-300 hover:text-white hover:bg-white/10"
                    )}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className={cn(
                "flex lg:hidden h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                scrolled
                  ? "border-slate-200 bg-white text-slate-800"
                  : "border-white/20 bg-white/5 text-white backdrop-blur-sm"
              )}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          "fixed left-4 right-4 top-20 z-40 origin-top rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl transition-all duration-300 lg:hidden",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        )}
      >
        <div className="flex flex-col gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              {Icon ? <Icon className="h-4 w-4 text-indigo-500" /> : null}
              {label}
            </Link>
          ))}
        </div>

        {authed ? (
          <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-5">
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-50 py-3 text-center text-sm font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
              onClick={() => setOpen(false)}
            >
              Open Dashboard
            </Link>
            <button
              type="button"
              className="rounded-lg py-3 text-center text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
            <Link
              href="/login"
              className="rounded-lg border border-slate-200 py-2.5 text-center text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 py-2.5 text-center text-sm font-bold text-white hover:bg-indigo-500 transition-colors shadow-sm"
              onClick={() => setOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
