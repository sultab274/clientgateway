"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Clock,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Chasing payments wastes 15+ hours per month",
    description:
      "Small businesses spend an average of 15 hours per month following up on late payments. That's nearly two full work days lost to reminders, emails, and phone calls.",
    solution:
      "ClientGateway automates payment reminders and tracks invoice status in real-time so you know exactly who owes you and when.",
  },
  {
    icon: AlertTriangle,
    title: "Missing invoices means missing revenue",
    description:
      "Without a centralized system, invoices get lost in email threads, spreadsheets go stale, and revenue slips through the cracks.",
    solution:
      "Every invoice is tracked in one place with automatic status updates — from draft to sent to paid. Nothing falls through.",
  },
  {
    icon: BarChart3,
    title: "You can't make decisions without real data",
    description:
      "Most businesses don't know their actual cash flow position until it's too late. Spreadsheet-based tracking gives you yesterday's numbers, not today's.",
    solution:
      "Real-time dashboard shows your revenue, outstanding invoices, and payment trends — so you can make informed decisions instantly.",
  },
];

const audiences = [
  {
    icon: Zap,
    title: "For Startups",
    description:
      "Growing fast but your financial operations haven't kept up. You need a system that scales with you — not one you'll outgrow in 6 months.",
    features: [
      "Set up in under 5 minutes",
      "Send professional invoices instantly",
      "Track every dollar from day one",
      "Scale from 1 to 1000 clients",
    ],
  },
  {
    icon: Shield,
    title: "For Enterprises",
    description:
      "Managing finances across departments, teams, and regions requires enterprise-grade controls and real-time visibility.",
    features: [
      "Multi-user access with roles",
      "Audit trails for compliance",
      "Custom invoice branding",
      "API integrations with your stack",
    ],
  },
  {
    icon: Users,
    title: "For Accountants",
    description:
      "Manage multiple client accounts from one dashboard. Give your clients real-time visibility while you maintain control.",
    features: [
      "Multi-client dashboard",
      "Automated reconciliation",
      "Client portal for self-service",
      "Export-ready financial reports",
    ],
  },
];

const stats = [
  { value: "15hrs", label: "Saved per month on payment follow-ups" },
  { value: "23%", label: "Faster payment collection" },
  { value: "$14K", label: "Average annual revenue recovered" },
  { value: "98%", label: "Customer satisfaction rate" },
];

export function SolutionsContent() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="px-6 py-20 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl"
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-brand-primary">
            The Problem We Solve
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Stop losing money to
            <br />
            broken financial workflows
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/50">
            Businesses lose an average of 5% of annual revenue to inefficient
            invoicing, missed payments, and poor financial visibility.
            ClientGateway fixes this.
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-5xl px-6 pb-20 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 text-center"
            >
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-white/40">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Problems → Solutions */}
      <div className="mx-auto max-w-5xl px-6 pb-20 lg:px-8">
        <div className="space-y-8">
          {problems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="grid gap-6 md:grid-cols-2"
            >
              {/* Problem */}
              <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-6">
                <div className="mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-xs font-medium uppercase tracking-wider text-red-400/70">
                    The Problem
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">
                  {item.description}
                </p>
              </div>

              {/* Solution */}
              <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-6">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-medium uppercase tracking-wider text-emerald-400/70">
                    Our Solution
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{item.title.split(" ")[0]}? Solved.</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">
                  {item.solution}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* For Different Audiences */}
      <div className="mx-auto max-w-5xl px-6 pb-20 lg:px-8">
        <h2 className="mb-10 text-center text-3xl font-bold text-white">
          Built for how you work
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {audiences.map((audience, i) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06]">
                <audience.icon className="h-5 w-5 text-white/60" />
              </div>
              <h3 className="text-lg font-bold text-white">{audience.title}</h3>
              <p className="mt-2 text-sm text-white/40">{audience.description}</p>
              <ul className="mt-4 space-y-2">
                {audience.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-white/50">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="mx-auto max-w-4xl px-6 pb-20 lg:px-8">
        <h2 className="mb-10 text-center text-3xl font-bold text-white">
          How it works
        </h2>
        <div className="space-y-6">
          {[
            {
              step: "1",
              title: "Sign up in 30 seconds",
              description: "Create your account with email or Google. No credit card required.",
            },
            {
              step: "2",
              title: "Add your clients",
              description: "Import or manually add your clients. Set up payment terms and contact details.",
            },
            {
              step: "3",
              title: "Send invoices, get paid",
              description: "Create professional invoices in seconds. Track status from sent to paid. Get paid faster.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-start gap-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
                {item.step}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-white/40">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-24 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white">
            Ready to take control of your finances?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/40">
            Start for free. No credit card required. Set up in under 5 minutes.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-white/[0.05]"
            >
              View Pricing
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
