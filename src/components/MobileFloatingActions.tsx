import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";

export function MobileFloatingActions() {
  return (
    <div className="fixed right-4 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] z-40 flex flex-col gap-3 lg:hidden">
      <a
        href={`https://wa.me/${SITE.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 active:scale-95 transition-transform"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
