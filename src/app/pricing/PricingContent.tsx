"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    description: "For freelancers and small businesses just getting started",
    price: 0,
    period: "",
    cta: "Get Started",
    ctaHref: "/signup",
    popular: false,
    features: [
      "Up to 5 clients",
      "Up to 10 invoices per month",
      "Basic payment tracking",
      "Email support",
      "Single user",
    ],
  },
  {
    name: "Pro",
    description: "For growing businesses that need more power",
    price: 29,
    period: "/month",
    cta: "Start Free Trial",
    ctaHref: "#",
    popular: true,
    features: [
      "Unlimited clients",
      "Unlimited invoices",
      "Advanced payment tracking",
      "Priority support",
      "Up to 5 team members",
      "Financial analytics dashboard",
      "Custom invoice branding",
      "Automated payment reminders",
    ],
  },
  {
    name: "Enterprise",
    description: "For large organizations with custom needs",
    price: 99,
    period: "/month",
    cta: "Contact Sales",
    ctaHref: "#",
    popular: false,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Custom integrations",
      "Dedicated account manager",
      "SSO & advanced security",
      "Audit logs",
      "API access",
      "Custom SLA",
    ],
  },
];

export function PricingContent() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
    if (plan === "free") {
      window.location.href = "/signup";
      return;
    }
    if (plan === "enterprise") {
      window.location.href = "mailto:sales@clientgateway.io";
      return;
    }

    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="px-6 py-20 text-center lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          Simple, transparent pricing
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-xl text-lg text-white/50"
        >
          Start for free. Upgrade when your business needs more.
          No hidden fees. Cancel anytime.
        </motion.p>
      </div>

      {/* Plans */}
      <div className="mx-auto max-w-6xl px-6 pb-24 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className={cn(
                "relative rounded-2xl border p-8",
                plan.popular
                  ? "border-brand-primary/30 bg-white/[0.04]"
                  : "border-white/[0.06] bg-white/[0.02]"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-white/40">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">
                  ${plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-white/40">{plan.period}</span>
                )}
              </div>

              <button
                onClick={() => handleCheckout(plan.name.toLowerCase())}
                disabled={loading !== null}
                className={cn(
                  "mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all",
                  plan.popular
                    ? "bg-white text-black hover:bg-white/90"
                    : "border border-white/15 bg-transparent text-white hover:bg-white/[0.05]",
                  loading === plan.name.toLowerCase() && "opacity-50"
                )}
              >
                {loading === plan.name.toLowerCase() ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-white/60">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24 max-w-2xl mx-auto">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I switch plans at any time?",
                a: "Yes. Upgrade or downgrade anytime. When you upgrade, you're charged a prorated amount. When you downgrade, credit is applied to your next billing cycle.",
              },
              {
                q: "Is there a free trial for Pro?",
                a: "Yes. Every Pro plan starts with a 14-day free trial. No credit card required. If you don't upgrade, you'll automatically be moved to the Free plan.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, Amex) through Stripe. Enterprise customers can also pay via invoice/wire transfer.",
              },
              {
                q: "How does billing work?",
                a: "You're billed monthly or annually (with a 20% discount). All payments are processed securely through Stripe. You can manage your billing from your dashboard settings.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <h3 className="text-sm font-semibold text-white">{faq.q}</h3>
                <p className="mt-2 text-sm text-white/40">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
