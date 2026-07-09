import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { PatternBorder } from "./PatternBorder";
import { SITE, TERMS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto hidden lg:block">
      <PatternBorder />
      <div className="bg-[#0a1628] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo />
              <p className="mt-4 text-sm text-white/60 leading-relaxed">
                {SITE.tagline}
              </p>
              <p className="mt-2 text-xs text-white/40">GSTN: {SITE.gstn}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/" className="hover:text-orange-400 transition-colors">Home</Link></li>
                <li><Link href="/services" className="hover:text-orange-400 transition-colors">Services</Link></li>
                <li><Link href="/order" className="hover:text-orange-400 transition-colors">Place Order</Link></li>
                <li><Link href="/contact" className="hover:text-orange-400 transition-colors">Contact Us</Link></li>
                <li><Link href="/login" className="hover:text-orange-400 transition-colors">Login</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-4">
                Contact
              </h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 text-orange-400" />
                  <a href={`tel:${SITE.phoneRaw}`} className="hover:text-orange-400">{SITE.phone}</a>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 text-orange-400" />
                  <a href={`mailto:${SITE.email}`} className="hover:text-orange-400 break-all">{SITE.email}</a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-orange-400" />
                  <span>{SITE.address}</span>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${SITE.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat on WhatsApp
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-4">
                Terms
              </h3>
              <ul className="space-y-2 text-xs text-white/50">
                {TERMS.map((term, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-orange-400 shrink-0">•</span>
                    {term}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/40">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved. | {SITE.contactPerson}
          </div>
        </div>
      </div>
    </footer>
  );
}
