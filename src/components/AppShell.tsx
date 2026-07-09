import { DesktopHeader } from "./DesktopHeader";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileFloatingActions } from "./MobileFloatingActions";
import type { SessionUser } from "@/lib/auth";

export function AppShell({ user, children }: { user: SessionUser | null; children: React.ReactNode }) {
  return (
    <>
      <MobileHeader user={user} />
      <DesktopHeader user={user} />
      <main className="mobile-shell-main flex-1 w-full overflow-x-hidden pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        {children}
      </main>
      <MobileFloatingActions />
      <MobileBottomNav user={user} />
    </>
  );
}
