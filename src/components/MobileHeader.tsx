"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, LogOut, User, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Logo } from "./Logo";
import { CartButton } from "./CartButton";
import type { SessionUser } from "@/lib/auth";

export function MobileHeader({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const pageTitles: Record<string, string> = {
    "/": "Kanha Graphic",
    "/services": "Services",
    "/order": "Place Order",
    "/cart": "Cart",
    "/contact": "Contact",
    "/gallery": "Gallery",
    "/login": "Login",
    "/signup": "Sign Up",
    "/dashboard": "My Orders",
    "/dashboard/profile": "My Profile",
  };

  const title =
    pageTitles[pathname] ||
    (pathname.startsWith("/dashboard/orders") ? "Order Details" : "Kanha Graphic");

  const showLogo = pathname === "/";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="mobile-top-header lg:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        {showLogo ? (
          <Logo size="sm" />
        ) : (
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-white">{title}</p>
            <p className="truncate text-[11px] text-white/50">Kanha Graphic</p>
          </div>
        )}

        <div className="flex shrink-0 items-center gap-2">
          <CartButton />
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30"
                aria-label="Account menu"
              >
                <span className="text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-gray-100 bg-white shadow-xl py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p>
                    {user.companyName && (
                      <p className="text-xs text-gray-500 truncate">{user.companyName}</p>
                    )}
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <User className="w-4 h-4" />
                    My Orders
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
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
