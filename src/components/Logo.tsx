import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  // Width controls size — height is auto via aspect-ratio so full image always shows
  const widths = { sm: 110, md: 150, lg: 200 };
  const w = widths[size];

  return (
    <Link href="/" className="flex items-center shrink-0 group">
      <div
        style={{
          width: w,
          // Let height be natural so image is never cropped
          position: "relative",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
        className="group-hover:opacity-90 group-hover:scale-[1.03]"
      >
        <Image
          src="/icons/kanha2.png"
          alt="Kanha Graphic"
          width={w * 2}
          height={w}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            objectPosition: "left center",
            // Screen blend removes the white/grey background on dark header
            mixBlendMode: "screen",
            filter: "brightness(1.1) saturate(1.15)",
          }}
          priority
        />
      </div>
    </Link>
  );
}
