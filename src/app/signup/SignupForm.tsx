"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signup, type AuthState } from "@/app/actions/auth";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";

const initialState: AuthState = { error: null, success: false };

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      className="w-full max-w-sm"
    >
      {/* Logo */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <span className="text-xs font-bold text-black">CG</span>
          </div>
          <span className="text-lg font-bold text-white">ClientGateway</span>
        </Link>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111111]/80 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <h1 className="mb-1 text-center text-xl font-bold text-white">
          Create your account
        </h1>
        <p className="mb-6 text-center text-sm text-white/40">
          Start managing your finances today
        </p>

        {/* Error message */}
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
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-xs font-medium text-white/50"
            >
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="John Smith"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-white/20 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-medium text-white/50"
            >
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

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-medium text-white/50"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Min. 8 characters"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-white/20 focus:bg-white/[0.06]"
              />
            </div>
            <p className="mt-1 text-[11px] text-white/25">
              Must contain uppercase, lowercase, and a number
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-black transition-all hover:bg-white/90 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Create account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-[11px] text-white/25">or</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        {/* Google OAuth */}
        <a
          href="/api/auth/google"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] py-2.5 text-sm font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </a>
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-white/30">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-white/60 transition-colors hover:text-white"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
