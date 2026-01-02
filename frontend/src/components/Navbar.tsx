'use client';

import Link from 'next/link';
import {
  BrainCircuit,
  BookOpen,
  Menu,
  Mic,
  MessagesSquare,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { isLoggedIn, clearAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

const navLinks: { href: string; label: string; icon?: LucideIcon }[] = [
  { href: '#features', label: 'Why BrainBridge' },
  { href: '#planner', label: 'Planner', icon: BookOpen },
  { href: '#voice', label: 'Voice', icon: Mic },
  { href: '#qa', label: 'Q&A', icon: MessagesSquare },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isLoggedIn());
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/';
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-5 pb-2 pointer-events-none">
        <nav
          className={cn(
            'pointer-events-auto flex w-full max-w-5xl items-center gap-2 rounded-[999px] border px-2 py-2 pl-5 pr-2 shadow-xl transition-all duration-500',
            'border-amber-200/70 bg-[#fffdf8]/92 text-slate-800 backdrop-blur-xl',
            scrolled && 'shadow-2xl shadow-amber-900/15 ring-1 ring-amber-100/90',
          )}
        >
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 pr-2"
            onClick={() => setOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-teal-600 shadow-md shadow-orange-400/35">
              <BrainCircuit className="h-5 w-5 text-white" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                BrainBridge
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700/90">
                Learn in comfort
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex flex-1 items-center justify-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-amber-50 hover:text-slate-900"
              >
                {Icon ? <Icon className="h-3.5 w-3.5 text-teal-600 opacity-80" aria-hidden /> : null}
                <span className="relative">
                  {label}
                  <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full bg-gradient-to-r from-amber-500 to-teal-500 transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {authed ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-amber-200 hover:bg-amber-50/80"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden sm:inline-flex rounded-full px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:text-slate-800"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex rounded-full px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-bold text-amber-950 shadow-md shadow-orange-400/40 transition hover:from-amber-400 hover:to-orange-400 active:scale-[0.98]"
                >
                  Start free
                </Link>
              </>
            )}

            <button
              type="button"
              className="flex lg:hidden h-11 w-11 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-800 shadow-sm"
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      <div
        className={cn(
          'fixed left-4 right-4 top-[5.25rem] z-40 origin-top rounded-3xl border border-amber-100 bg-[#fffdf8]/98 p-5 shadow-2xl shadow-amber-900/20 backdrop-blur-xl transition-all duration-300 lg:hidden',
          open ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0',
        )}
      >
        <div className="flex flex-col gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-base font-semibold text-slate-700 hover:bg-amber-50"
              onClick={() => setOpen(false)}
            >
              {Icon ? <Icon className="h-5 w-5 text-teal-600" /> : null}
              {label}
            </Link>
          ))}
        </div>
        {authed ? (
          <div className="mt-4 flex flex-col gap-2 border-t border-amber-100 pt-4">
            <Link
              href="/dashboard"
              className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-center text-sm font-bold text-amber-950"
              onClick={() => setOpen(false)}
            >
              Open dashboard
            </Link>
            <button
              type="button"
              className="rounded-2xl py-3 text-center text-sm font-semibold text-slate-500"
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-amber-100 pt-4">
            <Link
              href="/login"
              className="rounded-2xl border border-slate-200 py-3 text-center text-sm font-bold text-slate-700"
              onClick={() => setOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-2xl bg-slate-900 py-3 text-center text-sm font-bold text-amber-50"
              onClick={() => setOpen(false)}
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
