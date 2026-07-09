import Link from "next/link";

const letterColors = ["#E53935", "#FDD835", "#43A047", "#1E88E5", "#FB8C00"];

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { box: "w-5 h-5 text-[10px]", svg: "h-8 w-6", sub: "text-[9px]" },
    md: { box: "w-7 h-7 text-sm", svg: "h-12 w-9", sub: "text-xs" },
    lg: { box: "w-9 h-9 text-base", svg: "h-16 w-12", sub: "text-sm" },
  };
  const s = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-2 group sm:gap-3">
      <svg
        viewBox="0 0 48 64"
        className={`${s.svg} shrink-0 text-white/90 group-hover:text-orange-400 transition-colors`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <circle cx="24" cy="10" r="6" />
        <path d="M24 16v8M18 28c0-4 2.5-8 6-8s6 4 6 8M20 36h8M16 44c2-4 6-6 8-6s6 2 8 6M12 52h24" />
        <path d="M30 20c4 2 8 6 10 12" strokeLinecap="round" />
        <ellipse cx="38" cy="34" rx="2" ry="6" transform="rotate(30 38 34)" />
      </svg>
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-0.5">
          {"KANHA".split("").map((letter, i) => (
            <span
              key={i}
              className={`${s.box} flex items-center justify-center rounded font-black text-white shadow-sm`}
              style={{ backgroundColor: letterColors[i] }}
            >
              {letter}
            </span>
          ))}
        </div>
        <span className={`${s.sub} font-semibold text-orange-400 mt-0.5 tracking-wide`}>
          Graphic
        </span>
      </div>
    </Link>
  );
}
