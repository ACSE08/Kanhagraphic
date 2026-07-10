"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SPLASH_KEY = "kg_splash_shown";

export function SplashScreen() {
  const [visible, setVisible]   = useState(false);
  const [animate, setAnimate]   = useState(false); // triggers bar + logo scale-in
  const [fading, setFading]     = useState(false); // triggers fade-out

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) return;

    setVisible(true);

    // Next frame — start animations
    const t1 = setTimeout(() => setAnimate(true), 50);

    // Begin fade out at 1.8s
    const t2 = setTimeout(() => setFading(true), 1800);

    // Remove from DOM at 2.3s
    const t3 = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SPLASH_KEY, "1");
    }, 2300);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
      style={{ opacity: fading ? 0 : 1, transition: "opacity 500ms ease" }}
    >
      {/* Logo — scales in from 80% on mount */}
      <div
        style={{
          transform: animate ? "scale(1) translateY(0)" : "scale(0.8) translateY(12px)",
          opacity: animate ? 1 : 0,
          transition: "transform 600ms cubic-bezier(0.34,1.56,0.64,1), opacity 500ms ease",
        }}
      >
        <Image
          src="/icons/kg-logo-main.jpeg"
          alt="Kanha Graphic"
          width={300}
          height={150}
          className="object-contain"
          priority
        />
      </div>

      {/* Progress bar */}
      <div className="mt-8 h-1 w-44 overflow-hidden rounded-full bg-gray-100">
        <div
          style={{
            width: animate ? "100%" : "0%",
            transition: "width 1750ms cubic-bezier(0.4,0,0.2,1)",
            height: "100%",
            borderRadius: "9999px",
            background: "linear-gradient(90deg, #f97316, #ea580c)",
          }}
        />
      </div>
    </div>
  );
}
