"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  CreditCard,
  FileText,
  Users,
  ArrowUpRight,
  Plus,
  TrendingUp,
  Clock,
} from "lucide-react";

interface Stats {
  totalRevenue: number;
  outstandingInvoices: number;
  paymentsLast30Days: number;
  activeClients: number;
}

interface Invoice {
  id: string;
  number: string;
  status: string;
  dueDate: Date;
  client: { name: string } | null;
  items: { quantity: number; unitPrice: number }[];
  payments: { amount: number; status: string }[];
}

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  date: Date;
  client: { name: string } | null;
}

const statusColors: Record<string, string> = {
  draft: "bg-white/10 text-white/50",
  sent: "bg-blue-500/15 text-blue-400",
  paid: "bg-emerald-500/15 text-emerald-400",
  overdue: "bg-red-500/15 text-red-400",
};

const quickActions = [
  { label: "Create Invoice", href: "/dashboard/invoices", icon: FileText },
  { label: "Record Payment", href: "/dashboard/payments", icon: CreditCard },
  { label: "Add Client", href: "/dashboard/clients", icon: Users },
];

export function DashboardContent({
  user,
  stats,
  recentInvoices,
  recentPayments,
}: {
  user: { name: string | null } | null;
  stats: Stats;
  recentInvoices: Invoice[];
  recentPayments: Payment[];
}) {
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.name || "there"}
        </h1>
        <p className="mt-1 text-sm text-white/40">Here&apos;s an overview of your financial operations.</p>
      </motion.div>

      {/* Stats grid */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: fmt(stats.totalRevenue), icon: TrendingUp, change: "All time" },
          { label: "Outstanding", value: stats.outstandingInvoices.toString(), icon: FileText, change: "Awaiting payment" },
          { label: "Last 30 Days", value: fmt(stats.paymentsLast30Days), icon: Clock, change: "Recent payments" },
          { label: "Active Clients", value: stats.activeClients.toString(), icon: Users, change: "Total clients" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="mb-3 flex items-center gap-2">
              <stat.icon className="h-4 w-4 text-white/30" />
              <span className="text-xs font-medium uppercase tracking-wider text-white/35">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold tabular-nums text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-emerald-400/70">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mb-10">
        <h2 className="mb-4 text-sm font-semibold text-white/60">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/60 transition-all hover:border-white/15 hover:bg-white/[0.06] hover:text-white">
              <Plus className="h-3.5 w-3.5" />
              {action.label}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent invoices + payments */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Invoices */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/60">Recent Invoices</h2>
            <Link href="/dashboard/invoices" className="text-xs text-white/30 hover:text-white/60">View all →</Link>
          </div>
          {recentInvoices.length === 0 ? (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <p className="text-xs text-white/30">No invoices yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentInvoices.map((inv) => {
                const total = inv.items.reduce((s, item) => s + item.quantity * item.unitPrice, 0);
                return (
                  <div key={inv.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-white/25" />
                      <div>
                        <p className="text-sm font-medium text-white">{inv.number}</p>
                        <p className="text-[11px] text-white/30">{inv.client?.name || "No client"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium tabular-nums text-white">{fmt(total)}</p>
                      <span className={`text-[10px] font-medium ${statusColors[inv.status] || ""} rounded-full px-1.5 py-0.5`}>{inv.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Recent Payments */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/60">Recent Payments</h2>
            <Link href="/dashboard/payments" className="text-xs text-white/30 hover:text-white/60">View all →</Link>
          </div>
          {recentPayments.length === 0 ? (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <p className="text-xs text-white/30">No payments yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-white/25" />
                    <div>
                      <p className="text-sm font-medium text-white">{p.client?.name || "Unknown"}</p>
                      <p className="text-[11px] text-white/30">{new Date(p.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium tabular-nums text-emerald-400">+{fmt(p.amount)}</p>
                    <p className="text-[10px] text-white/25 capitalize">{p.method.replace("_", " ")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
