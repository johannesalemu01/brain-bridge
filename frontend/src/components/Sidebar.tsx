"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, LayoutDashboard, BookOpen, Mic, MessagesSquare, Users, Settings, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAuth, getUser } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/";
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Study Planner", href: "/dashboard/planner", icon: BookOpen },
    { name: "Voice Learning", href: "/dashboard/voice", icon: Mic },
    { name: "Q&A Board", href: "/dashboard/qa", icon: MessagesSquare },
  ];

  if (user?.role === "teacher") {
    navItems.push({ name: "Teacher Panel", href: "/dashboard/teacher", icon: Users });
  }

  const sidebarContent = (
    <>
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-teal-600">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">BrainBridge</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <div className="mb-6 px-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Main Menu</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "sidebar-link",
                isActive ? "active" : ""
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-amber-400" : "text-white/40")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <button className="sidebar-link w-full">
            <Settings className="w-5 h-5 text-white/40" />
            Settings
        </button>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut className="w-5 h-5" />
            Logout
        </button>
        
        {user && (
            <div className="mt-4 flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-teal-600 flex flex-col items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-white/40 capitalize">{user.role}</p>
                </div>
            </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 text-white shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 flex-col z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 w-72 bg-black/90 backdrop-blur-xl border-r border-white/10 flex flex-col z-40 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
