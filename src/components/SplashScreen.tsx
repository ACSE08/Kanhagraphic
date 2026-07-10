"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const SPLASH_KEY = "kg_splash_shown";

// Website's dark navy color
const BG = "#0a1628";

const LOGO_W = 300;
const LOGO_H = 150;

export function SplashScreen() {
  const [phase, setPhase] = useState<"idle" | "enter" | "slide" | "done">("idle");
  const [slideStyle, setSlideStyle] = useState<React.CSSProperties>({});
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) return;

    const t0 = setTimeout(() => setPhase("enter"), 60);

    const t1 = setTimeout(() => {
      const headerLogo = document.querySelector(
        "header img[alt='Kanha Graphic']"
      ) as HTMLImageElement | null;

      if (headerLogo && logoRef.current) {
        const dest  = headerLogo.getBoundingClientRect();
        const splash = logoRef.current.getBoundingClientRect();
        const dx    = dest.left - splash.left + (dest.width  - LOGO_W) / 2;
        const dy    = dest.top  - splash.top  + (dest.height - LOGO_H) / 2;
        const scale = Math.min(dest.width / LOGO_W, dest.height / LOGO_H);

        setSlideStyle({
          transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
          transformOrigin: "top left",
          transition: "transform 580ms cubic-bezier(0.4,0,0.2,1), opacity 250ms ease 350ms",
          opacity: 0,
        });
      } else {
        setSlideStyle({
          transform: "translateY(-160px) scale(0.3)",
          transformOrigin: "top center",
          transition: "transform 580ms cubic-bezier(0.4,0,0.2,1), opacity 250ms ease 300ms",
          opacity: 0,
        });
      }

      setPhase("slide");
    }, 1900);

    const t2 = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem(SPLASH_KEY, "1");
    }, 2550);

    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "idle" || phase === "done") return null;

  const isEnter = phase === "enter";
  const isSlide = phase === "slide";

  return (
    <>
      {/* Backdrop — dark navy matching website header */}
      <div
        className="fixed inset-0 z-[9998]"
        style={{
          background: BG,
          opacity: isSlide ? 0 : 1,
          transition: isSlide ? "opacity 550ms ease 80ms" : "none",
          pointerEvents: "none",
        }}
      />

      {/* Subtle radial glow */}
      {isEnter && (
        <div
          className="fixed z-[9998] pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0.04) 45%, transparent 70%)",
            animation: "kg-pulse 2.2s ease-in-out infinite",
          }}
        />
      )}

      {/* Logo — full image, no crop */}
      <div
        ref={logoRef}
        className="fixed z-[9999] pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          marginTop: `-${LOGO_H / 2}px`,
          marginLeft: `-${LOGO_W / 2}px`,
          width: LOGO_W,
          height: LOGO_H,
          transform: isSlide
            ? (slideStyle.transform as string)
            : isEnter
            ? "scale(1)"
            : "scale(0.75)",
          opacity: isSlide ? (slideStyle.opacity as number) : 1,
          transition: isSlide
            ? (slideStyle.transition as string)
            : isEnter
            ? "transform 650ms cubic-bezier(0.34,1.56,0.64,1), opacity 400ms ease"
            : "none",
        }}
      >
        <Image
          src="/icons/kanha2.png"
          alt="Kanha Graphic"
          width={LOGO_W}
          height={LOGO_H}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            // screen blend removes white bg on dark backdrop
            mixBlendMode: "screen",
            filter: "brightness(1.15) saturate(1.2)",
          }}
          priority
        />
      </div>

      {/* Progress bar */}
      <div
        className="fixed z-[9999] pointer-events-none"
        style={{
          top: `calc(50% + ${LOGO_H / 2 + 28}px)`,
          left: "50%",
          transform: "translateX(-50%)",
          width: 160,
          opacity: isSlide ? 0 : 1,
          transition: isSlide ? "opacity 200ms ease" : "none",
        }}
      >
        <div
          style={{
            height: 3,
            width: "100%",
            borderRadius: 9999,
            background: "rgba(255,255,255,0.12)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 9999,
              background: "linear-gradient(90deg, #f97316, #ea580c)",
              transformOrigin: "left center",
              animation: isEnter
                ? "kg-progress 1.85s cubic-bezier(0.4,0,0.6,1) forwards"
                : "none",
            }}
          />
        </div>
        <p
          style={{
            marginTop: 12,
            textAlign: "center",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "inherit",
          }}
        >
          KANHA GRAPHIC
        </p>
      </div>

      <style>{`
        @keyframes kg-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes kg-pulse {
          0%, 100% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          50%       { opacity: 0.5; transform: translate(-50%,-50%) scale(1.1); }
        }
      `}</style>
    </>
  );
}
