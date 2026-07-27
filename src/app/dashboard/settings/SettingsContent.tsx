"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { updateProfile, logout, type AuthState } from "@/app/actions/auth";
import { User, Mail, Shield, Loader2, LogOut, CreditCard, Check } from "lucide-react";

interface UserProps {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  provider: string;
  createdAt: Date;
}

const initialState: AuthState = { error: null, success: false };

export function SettingsContent({ user }: { user: UserProps | null }) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);

  return (
    <div className="mx-auto max-w-2xl px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/40">Manage your account settings</p>
      </div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
      >
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
          <User className="h-4 w-4 text-white/40" />
          Profile
        </h2>

        {state.success && (
          <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            Profile updated successfully
          </div>
        )}
        {state.error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">Full name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                name="name"
                defaultValue={user?.name || ""}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-white/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                name="email"
                type="email"
                defaultValue={user?.email || ""}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-white/20"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
          </button>
        </form>
      </motion.div>

      {/* Account info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
      >
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
          <Shield className="h-4 w-4 text-white/40" />
          Account
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-white/40">Auth provider</span>
            <span className="text-white/70 capitalize">{user?.provider?.replaceAll(",", " + ") || "credentials"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Member since</span>
            <span className="text-white/70">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
          </div>
        </div>
      </motion.div>

      {/* Billing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
      >
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
          <CreditCard className="h-4 w-4 text-white/40" />
          Billing
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Free Plan */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Free</span>
              <span className="text-lg font-bold text-white">$0<span className="text-xs font-normal text-white/30">/mo</span></span>
            </div>
            <ul className="mt-3 space-y-1.5">
              <li className="flex items-center gap-2 text-xs text-white/40"><Check className="h-3 w-3 text-emerald-400" /> Up to 5 clients</li>
              <li className="flex items-center gap-2 text-xs text-white/40"><Check className="h-3 w-3 text-emerald-400" /> Up to 10 invoices/month</li>
              <li className="flex items-center gap-2 text-xs text-white/40"><Check className="h-3 w-3 text-emerald-400" /> Basic payment tracking</li>
            </ul>
          </div>
          {/* Pro Plan */}
          <div className="rounded-xl border border-brand-primary/30 bg-white/[0.03] p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Pro</span>
              <span className="text-lg font-bold text-white">$29<span className="text-xs font-normal text-white/30">/mo</span></span>
            </div>
            <ul className="mt-3 space-y-1.5">
              <li className="flex items-center gap-2 text-xs text-white/40"><Check className="h-3 w-3 text-emerald-400" /> Unlimited clients</li>
              <li className="flex items-center gap-2 text-xs text-white/40"><Check className="h-3 w-3 text-emerald-400" /> Unlimited invoices</li>
              <li className="flex items-center gap-2 text-xs text-white/40"><Check className="h-3 w-3 text-emerald-400" /> Advanced analytics</li>
              <li className="flex items-center gap-2 text-xs text-white/40"><Check className="h-3 w-3 text-emerald-400" /> Priority support</li>
            </ul>
            <button
              onClick={async () => {
                const res = await fetch("/api/stripe/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ plan: "pro" }),
                });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
              }}
              className="mt-4 w-full rounded-lg bg-white py-2 text-xs font-semibold text-black hover:bg-white/90"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 rounded-2xl border border-red-500/10 bg-white/[0.02] p-6"
      >
        <h2 className="mb-4 text-sm font-semibold text-red-400">Danger Zone</h2>
        <form action={logout}>
          <button type="submit" className="flex items-center gap-2 rounded-xl border border-red-500/20 px-5 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10">
            <LogOut className="h-4 w-4" />
            Sign out of all sessions
          </button>
        </form>
      </motion.div>
    </div>
  );
}
