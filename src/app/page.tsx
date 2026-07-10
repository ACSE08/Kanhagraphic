import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Phone,
  Mail,
  MessageCircle,
  Package,
  Tag,
  Pill,
  Zap,
} from "lucide-react";
import { PatternBorder } from "@/components/PatternBorder";
import { MobileQuickServices } from "@/components/MobileQuickServices";
import { ProductSlider } from "@/components/ProductSlider";
import { SERVICES } from "@/lib/pricing";
import {
  SITE,
  CARTON_FEATURES,
  LABEL_FEATURES,
  BLISTER_FEATURES,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Home",
  description: SITE.description,
};

const NODE_ICON_MAP: Record<string, React.ReactNode> = {
  "blister-strips-sachet": <Pill className="h-5 w-5" />,
  "carton-printing": <Package className="h-5 w-5" />,
  "label-printing": <Tag className="h-5 w-5" />,
  "insert-printing": <FileText className="h-5 w-5" />,
};

export default function HomePage() {
  const printingServices = SERVICES.filter((service) => service.category === "printing");

  return (
    <>
      {/* Hero — compact on mobile, full on desktop */}
      <section className="relative overflow-hidden bg-[#0a1628] text-white lg:block">
        <div className="absolute inset-0 opacity-5 hidden lg:block">
          <div className="absolute top-10 right-10 h-80 w-64 rounded-full border border-white/30" />
          <div className="absolute bottom-20 left-20 h-40 w-40 rounded-full border border-orange-500/30" />
        </div>

        {/* Mobile hero */}
        <div className="relative px-4 py-6 lg:hidden">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-orange-400">
            Vadodara&apos;s Trusted Printing Partner
          </p>
          <h1 className="mb-3 text-2xl font-extrabold leading-tight">
            INNOVATIVE DESIGNS,{" "}
            <span className="text-orange-400">EXPERT PRINTING</span>
          </h1>
          <p className="mb-5 text-sm leading-relaxed text-white/70">
            Cartons, Labels, Inserts &amp; Blisters Printing
            <span className="block">Fast Delivery, Small MOQ.</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/order"
              className="col-span-3 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-semibold active:scale-[0.98]"
            >
              Place Order <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-3 text-xs font-semibold"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-3 text-xs font-semibold"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
            <a
              href={SITE.emailHref}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-3 text-xs font-semibold"
            >
              <Mail className="h-4 w-4" />
              Mail
            </a>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { icon: Zap, label: "2-3 Day Delivery" },
              { icon: CheckCircle, label: "No Die Cost" },
              { icon: Clock, label: "MOQ 10 pieces for carton" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2.5"
              >
                <Icon className="h-4 w-4 shrink-0 text-orange-400" />
                <span className="text-[11px] font-medium leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop hero */}
        <div className="relative mx-auto hidden max-w-7xl px-6 py-28 lg:block xl:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-orange-400">
              Vadodara&apos;s Trusted Printing Partner
            </p>
            <h1 className="mb-6 text-5xl font-extrabold leading-tight lg:text-6xl">
              INNOVATIVE DESIGNS,{" "}
              <span className="text-orange-400">EXPERT PRINTING</span>
            </h1>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-white/70">
              {SITE.tagline} From pharmaceutical blister packs to custom cartons
              and labels — we deliver quality with fast turnaround.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/order"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 font-semibold transition-colors hover:bg-orange-600"
              >
                Place Order <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold transition-colors hover:bg-white/20"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Us
              </a>
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold transition-colors hover:bg-white/20"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
              <a
                href={SITE.emailHref}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold transition-colors hover:bg-white/20"
              >
                <Mail className="h-5 w-5" />
                Mail Us
              </a>
            </div>
          </div>
          <div className="mt-12 grid max-w-3xl grid-cols-3 gap-4">
            {[
              { icon: Zap, label: "2-3 Day Delivery" },
              { icon: CheckCircle, label: "No Die Cost (Small Qty)" },
              { icon: Clock, label: "MOQ 10 pieces for carton" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <Icon className="h-5 w-5 shrink-0 text-orange-400" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block">
          <PatternBorder />
        </div>
      </section>

      <MobileQuickServices />

      {/* Product Image Slider */}
      <section className="page-section bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center lg:mb-10">
            <h2 className="mb-2 text-2xl font-bold text-[#0a1628] lg:text-4xl">
              Our Products
            </h2>
            <p className="text-sm text-gray-600 lg:text-base">
              Swipe or use arrows to explore our pharmaceutical printing range.
            </p>
          </div>
          <ProductSlider />
        </div>
      </section>

      {/* Featured Services */}
      <section className="page-section bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center lg:mb-14">
            <h2 className="mb-2 text-2xl font-bold text-[#0a1628] lg:mb-4 lg:text-4xl">
              Our Printing Services
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-gray-600 lg:text-base">
              Specialized in registration products printing with premium quality
              and competitive pricing.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:mb-16 lg:grid-cols-2 lg:gap-10">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
              <div className="p-5 sm:p-8">
                <h3 className="mb-3 text-xl font-bold text-[#0a1628] lg:mb-4 lg:text-2xl">
                  Carton & Label Printing
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <h4 className="mb-2 font-semibold text-orange-600">Carton Printing</h4>
                    <ul className="space-y-1.5">
                      {CARTON_FEATURES.map((f) => (
                        <li key={f} className="flex gap-2 text-sm text-gray-600">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-orange-600">Label Printing</h4>
                    <ul className="space-y-1.5">
                      {LABEL_FEATURES.map((f) => (
                        <li key={f} className="flex gap-2 text-sm text-gray-600">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Link
                  href="/order?service=carton-printing"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 lg:mt-6 lg:text-base"
                >
                  Order Cartons / Labels <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
              <div className="p-5 sm:p-8">
                <h3 className="mb-3 text-xl font-bold text-[#0a1628] lg:mb-4 lg:text-2xl">
                  Blister / Strips / Sachet
                </h3>
                <ul className="mb-4 space-y-2 lg:mb-6">
                  {BLISTER_FEATURES.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-gray-600">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/order?service=blister-strips-sachet"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 lg:text-base"
                >
                  Get Instant Quote <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Printing Service Nodes */}
      <section className="page-section bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center lg:mb-14">
            <h2 className="mb-2 text-2xl font-bold text-[#0a1628] lg:mb-4 lg:text-4xl">
              Printing Services
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-gray-600 lg:text-base">
              Every printing service in one node map so you can browse the full range at a glance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {printingServices.map((service, index) => (
              <div
                key={service.id}
                className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                {index < printingServices.length - 1 ? (
                  <div className="absolute right-4 top-8 hidden h-px w-10 bg-orange-200 lg:block" />
                ) : null}
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0a1628] text-orange-400">
                  {NODE_ICON_MAP[service.id]}
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#0a1628]">{service.name}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{service.shortDescription}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-gray-500">
                  {service.moq ? <span className="rounded-full bg-white px-3 py-1">MOQ: {service.moq}</span> : null}
                  {service.deliveryDays ? <span className="rounded-full bg-white px-3 py-1">{service.deliveryDays}</span> : null}
                </div>
                <Link
                  href={`/order?service=${service.id}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600"
                >
                  Order Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-section bg-[#0a1628] text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-bold lg:mb-4 lg:text-4xl">
            Ready to Start Your Project?
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-sm text-white/60 lg:mb-8 lg:text-base">
            Create an account to track orders, upload design files, and receive
            proof approvals via WhatsApp.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/cart"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-3.5 font-semibold lg:py-4 hover:bg-orange-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              View Cart
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-white/30 px-8 py-3.5 font-semibold lg:py-4 hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
