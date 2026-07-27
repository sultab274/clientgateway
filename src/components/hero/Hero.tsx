"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";
import { ProductVisual } from "./ProductVisual";

export function Hero() {
  return (
    <LazyMotion features={domAnimation}>
      <section
        aria-label="Hero"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      >
        <HeroBackground />

        <div className="relative z-10 w-full max-w-6xl px-6 pb-16 pt-20 lg:px-8">
          <HeroContent />
          <ProductVisual />
        </div>
      </section>
    </LazyMotion>
  );
}
