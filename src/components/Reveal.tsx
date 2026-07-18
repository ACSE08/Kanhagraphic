"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale" | "none";

interface RevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

function applyInitial(dir: Direction): string {
  switch (dir) {
    case "up":    return "translateY(40px)";
    case "down":  return "translateY(-40px)";
    case "left":  return "translateX(40px)";
    case "right": return "translateX(-40px)";
    case "scale": return "scale(0.88)";
    default:      return "none";
  }
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 600,
  className = "",
  threshold = 0.15,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "none";
          }, delay);
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.style.opacity = "0";
          el.style.transform = applyInitial(direction);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [direction, delay, once, threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: applyInitial(direction),
        transition: `opacity ${duration}ms cubic-bezier(0.4,0,0.2,1), transform ${duration}ms cubic-bezier(0.4,0,0.2,1)`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

export const RevealUp    = (p: Omit<RevealProps, "direction">) => <Reveal {...p} direction="up" />;
export const RevealLeft  = (p: Omit<RevealProps, "direction">) => <Reveal {...p} direction="left" />;
export const RevealRight = (p: Omit<RevealProps, "direction">) => <Reveal {...p} direction="right" />;
export const RevealScale = (p: Omit<RevealProps, "direction">) => <Reveal {...p} direction="scale" />;
