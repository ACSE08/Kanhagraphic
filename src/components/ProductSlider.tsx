"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, X } from "lucide-react";

const slides = [
  {
    src: "/images/products/Obj_1.jpeg",
    alt: "Obj 1",
    badge: "Product 1",
    badgeColor: "bg-blue-600",
    title: "Premium Printing Product",
    subtitle: "Kanha Graphics",
    description: "High-quality pharmaceutical printing output with precise color and sharp finish.",
    cta: "Order Now",
    href: "/order?service=carton-printing",
    accent: "from-blue-900/80",
  },
  {
    src: "/images/products/Obj_2.jpeg",
    alt: "Obj 2",
    badge: "Product 2",
    badgeColor: "bg-purple-600",
    title: "Pharmaceutical Print Quality",
    subtitle: "Kanha Graphics",
    description: "Reliable pharmaceutical packaging and print quality suitable for production use.",
    cta: "Get Instant Quote",
    href: "/order?service=blister-strips-sachet",
    accent: "from-purple-900/80",
  },
  {
    src: "/images/products/Obj_3.jpeg",
    alt: "Obj 3",
    badge: "Product 3",
    badgeColor: "bg-emerald-600",
    title: "Precision Product Printing",
    subtitle: "Kanha Graphics",
    description: "Consistent quality and premium finish designed for medicine and packaging needs.",
    cta: "Order Now",
    href: "/order?service=carton-printing",
    accent: "from-emerald-900/80",
  },
  {
    src: "/images/products/Obj_4.jpeg",
    alt: "Obj 4",
    badge: "Product 4",
    badgeColor: "bg-amber-600",
    title: "Advanced Print Finish",
    subtitle: "Kanha Graphics",
    description: "Clean and attractive print finish with strong visual quality for product branding.",
    cta: "Get Instant Quote",
    href: "/order?service=blister-strips-sachet",
    accent: "from-amber-900/80",
  },
  {
    src: "/images/products/Obj_5.jpeg",
    alt: "Obj 5",
    badge: "Product 5",
    badgeColor: "bg-rose-600",
    title: "Color-Rich Product Output",
    subtitle: "Kanha Graphics",
    description: "Vibrant, durable and production-ready product printing tailored to your requirements.",
    cta: "Order Now",
    href: "/order?service=carton-printing",
    accent: "from-rose-900/80",
  },
  {
    src: "/images/products/Obj_6.jpeg",
    alt: "Obj 6",
    badge: "Product 6",
    badgeColor: "bg-cyan-600",
    title: "Trusted Packaging Prints",
    subtitle: "Kanha Graphics",
    description: "Trusted print results for pharmaceutical products with detail-focused finishing.",
    cta: "Get Instant Quote",
    href: "/order?service=blister-strips-sachet",
    accent: "from-cyan-900/80",
  },
  {
    src: "/images/products/product-1.jpeg",
    alt: "Product 1",
    badge: "Gallery 1",
    badgeColor: "bg-blue-700",
    title: "Premium Printing Product",
    subtitle: "Kanha Graphics",
    description: "High-quality pharmaceutical printing output with precise color and sharp finish.",
    cta: "Order Now",
    href: "/order?service=carton-printing",
    accent: "from-blue-900/80",
  },
  {
    src: "/images/products/product-2.jpeg",
    alt: "Product 2",
    badge: "Gallery 2",
    badgeColor: "bg-purple-700",
    title: "Pharmaceutical Print Quality",
    subtitle: "Kanha Graphics",
    description: "Reliable pharmaceutical packaging and print quality suitable for production use.",
    cta: "Get Instant Quote",
    href: "/order?service=blister-strips-sachet",
    accent: "from-purple-900/80",
  },
  {
    src: "/images/products/product-3.jpeg",
    alt: "Product 3",
    badge: "Gallery 3",
    badgeColor: "bg-emerald-700",
    title: "Precision Product Printing",
    subtitle: "Kanha Graphics",
    description: "Consistent quality and premium finish designed for medicine and packaging needs.",
    cta: "Order Now",
    href: "/order?service=carton-printing",
    accent: "from-emerald-900/80",
  },
  {
    src: "/images/products/product-4.jpeg",
    alt: "Product 4",
    badge: "Gallery 4",
    badgeColor: "bg-amber-700",
    title: "Advanced Print Finish",
    subtitle: "Kanha Graphics",
    description: "Clean and attractive print finish with strong visual quality for product branding.",
    cta: "Get Instant Quote",
    href: "/order?service=blister-strips-sachet",
    accent: "from-amber-900/80",
  },
  {
    src: "/images/products/product-5.jpeg",
    alt: "Product 5",
    badge: "Gallery 5",
    badgeColor: "bg-rose-700",
    title: "Color-Rich Product Output",
    subtitle: "Kanha Graphics",
    description: "Vibrant, durable and production-ready product printing tailored to your requirements.",
    cta: "Order Now",
    href: "/order?service=carton-printing",
    accent: "from-rose-900/80",
  },
  {
    src: "/images/products/product-6.jpeg",
    alt: "Product 6",
    badge: "Gallery 6",
    badgeColor: "bg-cyan-700",
    title: "Trusted Packaging Prints",
    subtitle: "Kanha Graphics",
    description: "Trusted print results for pharmaceutical products with detail-focused finishing.",
    cta: "Get Instant Quote",
    href: "/order?service=blister-strips-sachet",
    accent: "from-cyan-900/80",
  },
];

export function ProductSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (idx: number, dir: "left" | "right" = "right") => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(idx);
        setAnimating(false);
      }, 350);
    },
    [animating]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, "right");
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, "left");
  }, [current, goTo]);

  // Auto-slide every 4 s
  useEffect(() => {
    autoTimer.current = setInterval(next, 4000);
    return () => { if (autoTimer.current) clearInterval(autoTimer.current); };
  }, [next]);

  const resetTimer = useCallback(() => {
    if (autoTimer.current) clearInterval(autoTimer.current);
    autoTimer.current = setInterval(next, 4000);
  }, [next]);

  const handlePrev = useCallback(() => {
    prev();
    resetTimer();
  }, [prev, resetTimer]);

  const handleNext = useCallback(() => {
    next();
    resetTimer();
  }, [next, resetTimer]);

  const handleDot = useCallback(
    (i: number) => {
      if (i !== current) {
        goTo(i, i > current ? "right" : "left");
      }
      resetTimer();
    },
    [current, goTo, resetTimer]
  );

  // Touch / swipe
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = (touchStartY.current ?? 0) - e.changedTouches[0].clientY;
    if (Math.abs(diffY) > Math.abs(diff)) {
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }

  const slide = slides[current];

  useEffect(() => {
    if (!fullscreen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    }

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [fullscreen, handleNext, handlePrev]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl select-none touch-pan-y">
      {/* Slide */}
      <div
        className={`relative h-64 sm:h-80 lg:h-[420px] transition-all duration-350 ${
          animating
            ? direction === "right"
              ? "-translate-x-4 opacity-0"
              : "translate-x-4 opacity-0"
            : "translate-x-0 opacity-100"
        }`}
        style={{ transition: "opacity 350ms ease, transform 350ms ease" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={() => setFullscreen(true)}
      >
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          className="object-cover object-top"
          loading="eager"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
        />

        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${slide.accent} via-black/20 to-transparent`} />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-10">
          <span
            className={`mb-2 inline-block w-fit rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white ${slide.badgeColor}`}
          >
            {slide.badge}
          </span>
          <h3 className="mb-1 text-xl font-extrabold text-white drop-shadow sm:text-2xl lg:text-3xl">
            {slide.title}
          </h3>
          <p className="mb-1 text-xs font-medium text-white/80 sm:text-sm">{slide.subtitle}</p>
          <p className="mb-4 max-w-md text-xs leading-relaxed text-white/70 sm:text-sm">
            {slide.description}
          </p>
          <Link
            href={slide.href}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/40 transition-transform active:scale-95 hover:bg-orange-600"
          >
            {slide.cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 active:scale-95 sm:h-11 sm:w-11"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 active:scale-95 sm:h-11 sm:w-11"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDot(i);
            }}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 bg-orange-400 h-2"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute right-3 bottom-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
        {current + 1} / {slides.length}
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-[70] bg-black/95 touch-pan-y"
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen product image"
          onClick={() => setFullscreen(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            aria-label="Close fullscreen"
            className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-4"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-4"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-contain"
              sizes="100vw"
              loading="eager"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white">
            {current + 1} / {slides.length}
          </div>
        </div>
      )}
    </div>
  );
}
