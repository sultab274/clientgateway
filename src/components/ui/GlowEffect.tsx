interface GlowEffectProps {
  color: string;
  size: number;
  blur: number;
  top: string;
  left: string;
  animationName: string;
  duration: number;
  delay?: number;
  opacity?: number;
  className?: string;
}

export function GlowEffect({
  color,
  size,
  blur,
  top,
  left,
  animationName,
  duration,
  delay = 0,
  opacity = 0.3,
  className = "",
}: GlowEffectProps) {
  return (
    <div
      className={`absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        filter: `blur(${blur}px)`,
        top,
        left,
        transform: "translate(-50%, -50%)",
        willChange: "transform, opacity",
        animation: `${animationName} ${duration}s ease-in-out ${delay}s infinite`,
        opacity,
      }}
      aria-hidden="true"
    />
  );
}
