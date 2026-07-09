"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, ShoppingCart, User, Phone } from "lucide-react";
import type { SessionUser } from "@/lib/auth";

const tabs = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { href: "/services", label: "Services", icon: Layers, match: (p: string) => p.startsWith("/services") },
  { href: "/order", label: "Order", icon: ShoppingCart, match: (p: string) => p.startsWith("/order") || p.startsWith("/cart"), primary: true },
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

          if (tab.primary) {
            return (
              <Link
                key={tab.href}
                href={href}
                className="relative -top-3 flex flex-col items-center justify-end px-2 pb-2 min-w-[4.5rem]"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg shadow-orange-500/30 transition-transform active:scale-95 ${
                    active
                      ? "bg-orange-500 text-white ring-4 ring-orange-500/20"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  <Icon className="h-6 w-6" strokeWidth={2.25} />
                </span>
                <span className={`mt-1 text-[10px] font-semibold ${active ? "text-orange-400" : "text-white/70"}`}>
                  {tab.label}
                </span>
              </Link>
            );
          }

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
