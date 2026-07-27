"use client";

import { motion } from "framer-motion";
import { CTAButton } from "./CTAButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ChevronRight } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

const trustedLogos = [
  "Meridian Corp",
  "Apex Financial",
  "Vertex Capital",
  "Pinnacle Group",
  "Stratos Holdings",
];

export function HeroContent() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      variants={reduced ? undefined : containerVariants}
      initial={reduced ? undefined : "hidden"}
      animate={reduced ? undefined : "visible"}
      className="relative z-10 mx-auto max-w-4xl text-center"
    >
      {/* Headline */}
      <motion.h1
        variants={reduced ? undefined : itemVariants}
        className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-[4.5rem]"
      >
        Control Cash Flow
        <br />
        With Confidence
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        variants={reduced ? undefined : itemVariants}
        className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg lg:text-xl"
      >
        ClientGateway helps businesses manage invoices, payments, and financial
        operations through one intelligent platform.
      </motion.p>

      {/* CTAs */}
      <motion.div
        variants={reduced ? undefined : itemVariants}
        className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <CTAButton variant="primary" href="/signup">
          Get Started
          <ChevronRight className="h-4 w-4" />
        </CTAButton>
        <CTAButton variant="secondary" href="/login">
          Book Demo
          <ChevronRight className="h-4 w-4" />
        </CTAButton>
      </motion.div>

      {/* Trusted by */}
      <motion.div
        variants={reduced ? undefined : itemVariants}
        className="mt-16 border-t border-white/[0.06] pt-8"
      >
        <p className="mb-5 text-[11px] font-medium uppercase tracking-widest text-text-tertiary">
          Trusted by forward-thinking finance teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {trustedLogos.map((name) => (
            <span
              key={name}
              className="text-sm font-medium text-white/20 transition-colors duration-300 hover:text-white/40"
            >
              {name}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
