import Link from "next/link";
import Image from "next/image";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const heights = { sm: 36, md: 48, lg: 64 };
  const widths  = { sm: 108, md: 144, lg: 192 };
  const h = heights[size];
  const w = widths[size];

  return (
    <Link href="/" className="flex items-center shrink-0">
      <Image
        src="/icons/kg-logo-main.jpeg"
        alt="Kanha Graphic"
        width={w}
        height={h}
        className="object-contain"
        priority
      />
    </Link>
  );
}
