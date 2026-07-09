import { Phone, MessageCircle, Mail } from "lucide-react";
import { PatternBorder } from "./PatternBorder";
import { SITE } from "@/lib/constants";

export function MobileFooter() {
  return (
    <footer className="mt-auto pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:hidden lg:pb-0">
      <PatternBorder />
      <div className="bg-[#0a1628] px-4 py-6 text-white">
        <div className="flex gap-3">
          <a
            href={`tel:${SITE.phoneRaw}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-semibold"
          >
            <Phone className="h-4 w-4 text-orange-400" />
            Call
          </a>
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <a
            href={SITE.emailHref}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
        </div>
        <p className="mt-4 text-center text-[11px] text-white/40">
          © {new Date().getFullYear()} {SITE.name} · GSTN {SITE.gstn}
        </p>
      </div>
    </footer>
  );
}
