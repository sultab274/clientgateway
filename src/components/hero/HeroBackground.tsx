import { GlowEffect } from "@/components/ui/GlowEffect";

export function HeroBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Layer 1: Deep radial base — subtle warm center */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255,255,255,0.04) 0%, transparent 70%)",
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 60%)",
            "var(--color-surface-primary)",
          ].join(", "),
        }}
      />

      {/* Layer 2: Circular ring glows — the GitHub Enterprise signature look */}
      {/* Outer ring 1 */}
      <div
        className="absolute"
        style={{
          width: 900,
          height: 900,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.04)",
          boxShadow:
            "0 0 80px rgba(255,255,255,0.03), inset 0 0 80px rgba(255,255,255,0.02)",
          animation: "ring-pulse 12s ease-in-out infinite",
        }}
      />
      {/* Outer ring 2 */}
      <div
        className="absolute hidden md:block"
        style={{
          width: 1100,
          height: 1100,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.025)",
          boxShadow: "0 0 120px rgba(255,255,255,0.015)",
          animation: "ring-pulse 16s ease-in-out 2s infinite",
        }}
      />
      {/* Outer ring 3 — largest, most subtle */}
      <div
        className="absolute hidden lg:block"
        style={{
          width: 1400,
          height: 1400,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.015)",
          animation: "ring-pulse 20s ease-in-out 4s infinite",
        }}
      />

      {/* Layer 3: Ambient light patches — soft, monochromatic */}
      <GlowEffect
        color="rgba(255, 255, 255, 0.06)"
        size={700}
        blur={150}
        top="40%"
        left="50%"
        animationName="ambient-drift"
        duration={20}
        opacity={0.15}
      />
      <GlowEffect
        color="rgba(255, 255, 255, 0.03)"
        size={500}
        blur={120}
        top="60%"
        left="30%"
        animationName="ambient-drift"
        duration={25}
        delay={3}
        opacity={0.1}
        className="hidden md:block"
      />
      <GlowEffect
        color="rgba(255, 255, 255, 0.03)"
        size={400}
        blur={100}
        top="30%"
        left="70%"
        animationName="ambient-drift"
        duration={22}
        delay={5}
        opacity={0.08}
        className="hidden md:block"
      />

      {/* Layer 4: Subtle vignette edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, var(--color-surface-primary) 100%)",
        }}
      />

      {/* Layer 5: Very subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
