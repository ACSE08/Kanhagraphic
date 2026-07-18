"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, ShoppingCart, User, Phone, Image } from "lucide-react";
import type { SessionUser } from "@/lib/auth";

const tabs = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { href: "/services", label: "Services", icon: Layers, match: (p: string) => p.startsWith("/services") },
  { href: "/gallery", label: "Gallery", icon: Image, match: (p: string) => p.startsWith("/gallery") },
  { href: "/cart", label: "Cart", icon: ShoppingCart, match: (p: string) => p.startsWith("/cart") },
  { href: "/dashboard", label: "Orders", icon: User, match: (p: string) => p.startsWith("/dashboard") || p.startsWith("/login") || p.startsWith("/signup") },
  { href: "/contact", label: "Contact", icon: Phone, match: (p: string) => p.startsWith("/contact") },
];

export function MobileBottomNav({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();

  return (
    <nav
      className="mobile-bottom-nav lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch justify-around px-1 pt-1">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          const href =
            tab.href === "/dashboard" && !user ? "/login?redirect=/dashboard" : tab.href;

          return (
            <Link
              key={tab.href}
              href={href}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 min-h-[3.25rem] transition-colors active:bg-white/5 ${
                active ? "text-orange-400" : "text-white/55"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
              {active && (
                <span className="absolute bottom-[calc(0.5rem+env(safe-area-inset-bottom))] h-0.5 w-5 rounded-full bg-orange-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
