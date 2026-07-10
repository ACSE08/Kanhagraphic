"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const SPLASH_KEY = "kg_splash_shown";

// Logo dimensions on the splash (full size)
const LOGO_W = 280;
const LOGO_H = 140;

export function SplashScreen() {
  const [phase, setPhase] = useState<"idle" | "enter" | "slide" | "done">("idle");
  const [slideStyle, setSlideStyle] = useState<React.CSSProperties>({});
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) return;

    // Small delay so DOM is painted before we start
    const t0 = setTimeout(() => setPhase("enter"), 60);

    // At 1.8s — measure the header logo and slide to it
    const t1 = setTimeout(() => {
      // Find the header logo image in the DOM
      const headerLogo = document.querySelector(
        "header img[alt='Kanha Graphic']"
      ) as HTMLImageElement | null;

      if (headerLogo && logoRef.current) {
        const dest   = headerLogo.getBoundingClientRect();
        const splash = logoRef.current.getBoundingClientRect();

        // How much to translate (from current centre-of-screen position)
        const dx = dest.left - splash.left + (dest.width  - LOGO_W) / 2;
        const dy = dest.top  - splash.top  + (dest.height - LOGO_H) / 2;

        // Scale to match header logo size
        const scaleX = dest.width  / LOGO_W;
        const scaleY = dest.height / LOGO_H;
        const scale  = Math.min(scaleX, scaleY);

        setSlideStyle({
          transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
          transformOrigin: "top left",
          transition:
            "transform 550ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease 300ms",
          opacity: 0,
        });
      } else {
        // Fallback — just slide up off screen
        setSlideStyle({
          transform: "translateY(-120px) scale(0.3)",
          transformOrigin: "top center",
          transition: "transform 550ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease 200ms",
          opacity: 0,
        });
      }

      setPhase("slide");
    }, 1800);

    // Remove from DOM after slide completes
    const t2 = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem(SPLASH_KEY, "1");
    }, 2450);

    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "idle" || phase === "done") return null;

  const isEnter = phase === "enter";
  const isSlide = phase === "slide";

  return (
    <>
      {/* White backdrop — fades away while logo slides up */}
      <div
        className="fixed inset-0 z-[9998] bg-white"
        style={{
          opacity: isSlide ? 0 : 1,
          transition: isSlide ? "opacity 500ms ease 50ms" : "none",
          pointerEvents: "none",
        }}
      />

      {/* Logo — centred during enter, slides to header during slide */}
      <div
        ref={logoRef}
        className="fixed z-[9999]"
        style={{
          // Always position from top-left of viewport so translate math is predictable
          top: "50%",
          left: "50%",
          marginTop: `-${LOGO_H / 2}px`,
          marginLeft: `-${LOGO_W / 2}px`,
          width: LOGO_W,
          height: LOGO_H,
          pointerEvents: "none",
          // Enter animation — spring pop-in
          transform: isSlide
            ? slideStyle.transform
            : isEnter
            ? "scale(1)"
            : "scale(0.75)",
          opacity: isSlide ? (slideStyle.opacity as number) : 1,
          transition: isSlide
            ? (slideStyle.transition as string)
            : isEnter
            ? "transform 550ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 400ms ease"
            : "none",
        }}
      >
        <Image
          src="/icons/kg-logo-main.jpeg"
          alt="Kanha Graphic"
          width={LOGO_W}
          height={LOGO_H}
          className="h-full w-full object-contain"
          priority
        />
      </div>

      {/* Progress bar — fills during enter phase only */}
      <div
        className="fixed z-[9999]"
        style={{
          top: `calc(50% + ${LOGO_H / 2 + 20}px)`,
          left: "50%",
          transform: "translateX(-50%)",
          width: 180,
          pointerEvents: "none",
          opacity: isSlide ? 0 : 1,
          transition: isSlide ? "opacity 200ms ease" : "none",
        }}
      >
        <div
          className="h-[3px] w-full overflow-hidden rounded-full"
          style={{ background: "#e5e7eb" }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 9999,
              background: "linear-gradient(90deg, #f97316, #ea580c)",
              transformOrigin: "left center",
              animation: isEnter ? "kg-progress 1.75s cubic-bezier(0.4,0,0.6,1) forwards" : "none",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes kg-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </>
  );
}
