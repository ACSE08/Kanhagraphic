import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  /** dark = on dark navy header (blend white away), light = on white background */
  variant?: "dark" | "light";
}

export function Logo({ size = "md", variant = "dark" }: LogoProps) {
  const heights = { sm: 38, md: 52, lg: 68 };
  const widths  = { sm: 114, md: 156, lg: 204 };
  const h = heights[size];
  const w = widths[size];

  return (
    <Link href="/" className="flex items-center shrink-0 group">
      <div
        style={{
          width: w,
          height: h,
          position: "relative",
          // Round the container so any bleed looks clean
          borderRadius: 8,
          overflow: "hidden",
          // On dark bg: multiply blends white logo bg into the dark header
          // On light bg: normal render
          mixBlendMode: variant === "dark" ? "screen" : "normal",
          // Slight transition on hover
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
        className="group-hover:opacity-90 group-hover:scale-[1.03]"
      >
        <Image
          src="/icons/kg-logo-main.jpeg"
          alt="Kanha Graphic"
          width={w}
          height={h}
          className="h-full w-full object-contain"
          style={{
            // On dark header: invert makes black→white, then we hue-rotate back
            // Best approach: brighten + contrast so colors stay vivid on dark bg
            filter:
              variant === "dark"
                ? "brightness(1.15) contrast(1.1) saturate(1.2)"
                : "none",
          }}
          priority
        />
      </div>
    </Link>
  );
}
