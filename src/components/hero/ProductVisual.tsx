"use client";

import { useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  ArrowUpRight,
  BarChart3,
  CreditCard,
  FileText,
  TrendingUp,
  Wallet,
} from "lucide-react";

/* ─── Dashboard stats ───────────────────────────── */

const stats = [
  { label: "Revenue", value: "$284,520", change: "+12.4%", icon: TrendingUp },
  { label: "Invoices", value: "1,247", change: "+8.1%", icon: FileText },
  { label: "Payments", value: "$198,340", change: "+15.2%", icon: CreditCard },
];

/* ─── Tilt tracking ─────────────────────────────── */

export function ProductVisual() {
  const reduced = useReducedMotion();
  const [hovering, setHovering] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY, reduced]
  );

  const handleMouseLeave = useCallback(() => {
    setHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <div className="relative mt-16 flex justify-center lg:mt-20">
      {/* Card */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleMouseLeave}
        animate={
          reduced
            ? {}
            : { y: [0, -10, 0, -6, 0] }
        }
        transition={
          reduced
            ? undefined
            : {
                y: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
        style={{
          perspective: 1200,
          transformStyle: "preserve-3d",
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
        }}
        className="relative z-10 w-full max-w-[620px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111]/80 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
      >
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <div className="ml-3 flex flex-1 items-center gap-2 rounded-md bg-white/[0.04] px-3 py-1">
            <Wallet className="h-3 w-3 text-white/30" />
            <span className="text-[11px] text-white/30">
              app.clientgateway.io/dashboard
            </span>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Financial Overview
              </h3>
              <p className="mt-0.5 text-xs text-white/40">
                July 2026 — Real-time
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-md bg-white/[0.06] px-2.5 py-1.5 text-xs text-white/50">
              <BarChart3 className="h-3 w-3" />
              Last 30 days
            </div>
          </div>

          {/* Stats grid */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5"
              >
                <div className="mb-2 flex items-center gap-1.5">
                  <stat.icon className="h-3 w-3 text-white/30" />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-white/35">
                    {stat.label}
                  </span>
                </div>
                <p className="text-lg font-bold tabular-nums text-white">
                  {stat.value}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                  <span className="text-[10px] font-medium text-emerald-400">
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mini chart area */}
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/35">
                Cash Flow Trend
              </span>
              <span className="text-[10px] text-white/25">+23.5% MTD</span>
            </div>
            {/* Simplified bar chart */}
            <div className="flex items-end gap-1.5" style={{ height: 60 }}>
              {[40, 55, 35, 65, 50, 70, 45, 80, 60, 75, 85, 70].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all duration-300"
                    style={{
                      height: `${h}%`,
                      backgroundColor:
                        i >= 10
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(255,255,255,0.08)",
                    }}
                  />
                )
              )}
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-[9px] text-white/20">Jan</span>
              <span className="text-[9px] text-white/20">Dec</span>
            </div>
          </div>
        </div>

        {/* Hover edge glow */}
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500"
          style={{
            opacity: hovering ? 1 : 0,
            boxShadow: "inset 0 0 40px rgba(255,255,255,0.03)",
          }}
        />
      </motion.div>
    </div>
  );
}
