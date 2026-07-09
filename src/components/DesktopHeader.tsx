"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { CartButton } from "./CartButton";
import type { SessionUser } from "@/lib/auth";

const navLinks = [
  { href: "/", label: "Home", exact: true },
  { href: "/services", label: "Services", exact: false },
  { href: "/order", label: "Place Order", exact: false },
  { href: "/contact", label: "Contact", exact: false },
];

export function DesktopHeader({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 hidden border-b border-white/10 bg-[#0a1628]/95 backdrop-blur-md lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 xl:px-8">
        <Logo />

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-orange-500 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <CartButton />
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <User className="h-4 w-4" />
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
