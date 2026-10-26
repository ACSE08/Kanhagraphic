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

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      el.dataset.revealStatic = "true";
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    el.dataset.revealPending = "true";
    el.style.opacity = "0";
    el.style.transform = applyInitial(direction);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "none";
            delete el.dataset.revealPending;
          }, delay);
          if (once) observer.unobserve(el);
        } else if (!once) {
          clearTimeout(timer);
          el.dataset.revealPending = "true";
          el.style.opacity = "0";
          el.style.transform = applyInitial(direction);
        }
      },
      { threshold }
    );

    observer.observe(el);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      delete el.dataset.revealPending;
    };
  }, [direction, delay, once, threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 1,
        transform: "none",
        transition: `opacity ${duration}ms cubic-bezier(0.4,0,0.2,1), transform ${duration}ms cubic-bezier(0.4,0,0.2,1)`,
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
