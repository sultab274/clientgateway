"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { requestPasswordReset, type ResetState } from "@/app/actions/password-reset";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

const initialState: ResetState = { error: null, success: false };

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState);

  if (state.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle className="h-7 w-7 text-emerald-400" />
        </div>
        <h1 className="text-xl font-bold text-white">Check your email</h1>
        <p className="mt-2 text-sm text-white/40">
          If an account exists with that email, we&apos;ve sent a password reset link.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm"
    >
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <span className="text-xs font-bold text-black">CG</span>
          </div>
          <span className="text-lg font-bold text-white">ClientGateway</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#111111]/80 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <h1 className="mb-1 text-center text-xl font-bold text-white">
          Reset your password
        </h1>
        <p className="mb-6 text-center text-sm text-white/40">
          Enter your email and we&apos;ll send you a reset link
        </p>

        {state.error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {state.error}
          </motion.div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-white/50">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-white/20 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-white/30">
        <Link href="/login" className="font-medium text-white/60 hover:text-white">
          Back to sign in
        </Link>
      </p>
    </motion.div>
  );
}
