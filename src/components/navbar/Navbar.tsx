"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { SearchModal } from "@/components/search/SearchModal";
import { logout } from "@/app/actions/auth";
import {
  ChevronDown,
  LayoutDashboard,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  Shield,
  Zap,
  Users,
  HelpCircle,
  BookOpen,
  MessageSquare,
  LogOut,
  User,
  Loader2,
} from "lucide-react";

/* ─── Navigation structure ──────────────────────── */

const navItems = [
  {
    label: "Platform",
    children: [
      { label: "Dashboard", icon: LayoutDashboard, desc: "Financial overview at a glance", href: "/dashboard" },
      { label: "Invoicing", icon: FileText, desc: "Create and manage invoices", href: "/dashboard/invoices" },
      { label: "Payments", icon: CreditCard, desc: "Accept and track payments", href: "/dashboard/payments" },
      { label: "Clients", icon: Users, desc: "Manage your clients", href: "/dashboard/clients" },
    ],
  },
  {
    label: "Solutions",
    children: [
      { label: "For Startups", icon: Zap, desc: "Scale your financial operations", href: "/solutions" },
      { label: "For Enterprises", icon: Shield, desc: "Enterprise-grade controls", href: "/solutions" },
      { label: "For Accountants", icon: Users, desc: "Client management tools", href: "/solutions" },
    ],
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Resources",
    children: [
      { label: "Settings", icon: Settings, desc: "Account configuration", href: "/dashboard/settings" },
    ],
  },
];

/* ─── Component ─────────────────────────────────── */

interface NavbarProps {
  user?: {
    name: string | null;
    email: string;
    avatar: string | null;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
      {/* ─── Desktop pill nav ──────────────────────── */}
      <nav
        className="relative hidden items-center gap-1 md:flex"
        onMouseLeave={() => {
          setActiveDropdown(null);
          setHovering(false);
          setProfileOpen(false);
        }}
      >
        <div
          className={cn(
            "relative flex items-center gap-1 rounded-full border border-white/[0.08] px-2 py-1.5",
            "bg-[#0a0a0a]/80 backdrop-blur-xl",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_24px_rgba(0,0,0,0.4)]",
            "transition-shadow duration-500",
            hovering && "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_40px_rgba(0,0,0,0.5)]"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold tracking-tight text-white transition-colors hover:text-white/90"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-white">
              <span className="text-[10px] font-bold text-black">CG</span>
            </div>
            ClientGateway
          </Link>

          <div className="mx-1 h-5 w-px bg-white/10" />

          {/* Nav items */}
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.href && !item.children ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white/60 transition-all duration-200 hover:text-white hover:bg-white/[0.04]"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  onMouseEnter={() => {
                    if (item.children) {
                      setActiveDropdown(item.label);
                      setHovering(true);
                    }
                  }}
                  onClick={() =>
                    setActiveDropdown(activeDropdown === item.label ? null : item.label)
                  }
                  aria-expanded={activeDropdown === item.label}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200",
                    activeDropdown === item.label
                      ? "bg-white/[0.08] text-white"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        activeDropdown === item.label && "rotate-180"
                      )}
                    />
                  )}
                </button>
              )}

              {/* Dropdown */}
              <AnimatePresence>
                {item.children && activeDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                    className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111]/95 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                    onMouseEnter={() => {
                      setActiveDropdown(item.label);
                      setHovering(true);
                    }}
                    onMouseLeave={() => {
                      setActiveDropdown(null);
                      setHovering(false);
                    }}
                    role="menu"
                  >
                    <div className="p-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-white/[0.06]"
                          role="menuitem"
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/40 transition-colors group-hover:bg-white/[0.1] group-hover:text-white/70">
                            <child.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-white/90">
                              {child.label}
                            </p>
                            <p className="mt-0.5 text-[11px] text-white/35">
                              {child.desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <div className="mx-1 h-5 w-px bg-white/10" />

          {/* Search */}
          <SearchModal />

          <div className="mx-1 h-5 w-px bg-white/10" />

          {/* Auth section */}
          {user ? (
            <div className="relative">
              <button
                onMouseEnter={() => {
                  setProfileOpen(true);
                  setHovering(true);
                }}
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full px-2 py-1 text-[13px] font-medium text-white/60 transition-colors hover:text-white"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/70">
                  {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className={cn("h-3 w-3 transition-transform", profileOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                    className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111]/95 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                    onMouseEnter={() => {
                      setProfileOpen(true);
                      setHovering(true);
                    }}
                    onMouseLeave={() => {
                      setProfileOpen(false);
                      setHovering(false);
                    }}
                    role="menu"
                  >
                    <div className="border-b border-white/[0.06] p-3">
                      <p className="text-[13px] font-medium text-white">{user.name || "User"}</p>
                      <p className="text-[11px] text-white/35 truncate">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
                        role="menuitem"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
                        role="menuitem"
                      >
                        <User className="h-3.5 w-3.5" />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
                        role="menuitem"
                      >
                        <Settings className="h-3.5 w-3.5" />
                        Settings
                      </Link>
                    </div>
                    <div className="border-t border-white/[0.06] p-1.5">
                      <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-red-400/80 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        role="menuitem"
                      >
                        {loggingOut ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <LogOut className="h-3.5 w-3.5" />
                        )}
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-1.5 text-[13px] font-medium text-white/60 transition-colors duration-200 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-white px-4 py-1.5 text-[13px] font-semibold text-black transition-all duration-200 hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ─── Mobile nav ────────────────────────────── */}
      <div className="w-full md:hidden">
        <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/80 px-4 py-3 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white">
              <span className="text-[10px] font-bold text-black">CG</span>
            </div>
            <span className="text-sm font-bold text-white">ClientGateway</span>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
            aria-label="Toggle menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="4" y1="4" x2="14" y2="14" />
                  <line x1="14" y1="4" x2="4" y2="14" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="15" y2="6" />
                  <line x1="3" y1="12" x2="15" y2="12" />
                </>
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="mt-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111]/95 backdrop-blur-xl"
            >
              <div className="p-3">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() =>
                            setActiveDropdown(activeDropdown === item.label ? null : item.label)
                          }
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                        >
                          {item.label}
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 transition-transform duration-200",
                              activeDropdown === item.label && "rotate-180"
                            )}
                          />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === item.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              {item.children.map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-[12px] text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/80"
                                >
                                  <child.icon className="h-3.5 w-3.5" />
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        className="block rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}

                <div className="mt-3 flex flex-col gap-2 border-t border-white/[0.06] pt-3">
                  {user ? (
                    <>
                      <div className="px-3 py-2">
                        <p className="text-[13px] font-medium text-white">{user.name || "User"}</p>
                        <p className="text-[11px] text-white/35">{user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl bg-white/[0.06] px-3 py-2.5 text-center text-[13px] font-medium text-white/70"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="rounded-xl py-2.5 text-center text-[13px] font-medium text-red-400/80"
                      >
                        {loggingOut ? "Signing out..." : "Sign out"}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl py-2.5 text-center text-[13px] font-medium text-white/60 transition-colors hover:text-white"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl bg-white py-2.5 text-center text-[13px] font-semibold text-black"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
