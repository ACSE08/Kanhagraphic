import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const widths = { sm: 100, md: 140, lg: 190 };
  const w = widths[size];

  return (
    <Link href="/" className="flex items-center shrink-0 group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/kanha2.png"
        alt="Kanha Graphic"
        style={{
          width: w,
          height: "auto",
          display: "block",
          objectFit: "contain",
        }}
      />
    </Link>
  );
}
