"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import { Logo } from "./Logo";
import { CartButton } from "./CartButton";
import type { SessionUser } from "@/lib/auth";

export function MobileHeader({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();

  const pageTitles: Record<string, string> = {
    "/": "Kanha Graphics",
    "/services": "Services",
    "/order": "Place Order",
    "/cart": "Cart",
    "/contact": "Contact",
    "/login": "Login",
    "/signup": "Sign Up",
    "/dashboard": "My Orders",
  };

  const title =
    pageTitles[pathname] ||
    (pathname.startsWith("/dashboard/orders") ? "Order Details" : "Kanha Graphics");

  const showLogo = pathname === "/";

  return (
    <header className="mobile-top-header lg:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        {showLogo ? (
          <Logo size="sm" />
        ) : (
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-white">{title}</p>
            <p className="truncate text-[11px] text-white/50">Kanha Graphics</p>
          </div>
        )}

        <div className="flex shrink-0 items-center gap-2">
          <CartButton />
          {user ? (
          <Link
            href="/dashboard"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30"
            aria-label="My account"
          >
            <span className="text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex h-10 items-center gap-1.5 rounded-full bg-white/10 px-3 text-xs font-semibold text-white"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        )}
        </div>
      </div>
    </header>
  );
}
