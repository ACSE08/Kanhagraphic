import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, CheckCircle, Clock, FileText, Phone, Mail,
  MessageCircle, Package, Tag, Pill, Zap, Star, Shield,
  Truck, Award, Users, ThumbsUp, MapPin, BadgeCheck,
} from "lucide-react";
import { PatternBorder } from "@/components/PatternBorder";
import { MobileQuickServices } from "@/components/MobileQuickServices";
import { ProductSlider } from "@/components/ProductSlider";
import { SERVICES } from "@/lib/pricing";
import { SITE, CARTON_FEATURES, LABEL_FEATURES, BLISTER_FEATURES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kanha Graphics | Best Pharmaceutical Printing Services in Vadodara",
  description:
    "Kanha Graphics — Vadodara's trusted pharmaceutical printing company. Expert in carton printing, label printing, blister/strip/sachet printing. Low MOQ, fast delivery, no die cost. Serving Gujarat since 2015.",
  keywords: [
    "pharmaceutical printing Vadodara",
    "carton printing Gujarat",
    "label printing Vadodara",
    "blister printing",
    "strip printing Gujarat",
    "sachet printing",
    "FBB sheet printing",
    "medicine packaging printing",
    "Kanha Graphics Vadodara",
    "small quantity printing Gujarat",
    "UV gloss printing Vadodara",
    "printing company near me Vadodara",
  ],
  alternates: { canonical: SITE.url },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.name,
    title: "Kanha Graphics | Pharmaceutical Printing Experts in Vadodara",
    description:
      "Premium carton, label & blister printing for pharmaceutical companies in Gujarat. Fast 2-3 day delivery. MOQ just 10 pieces. Call +91 966 233 0701.",
    images: [{ url: `${SITE.url}/icons/kg-logo-main.jpeg`, width: 800, height: 600, alt: "Kanha Graphics Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kanha Graphics | Pharmaceutical Printing Vadodara",
    description: "Carton, label & blister printing experts in Vadodara, Gujarat. Fast delivery, low MOQ.",
  },
};

const NODE_ICON_MAP: Record<string, React.ReactNode> = {
  "blister-strips-sachet": <Pill className="h-5 w-5" />,
  "carton-printing": <Package className="h-5 w-5" />,
  "label-printing": <Tag className="h-5 w-5" />,
  "insert-printing": <FileText className="h-5 w-5" />,
};

const STATS = [
  { value: "10+", label: "Years in Business" },
  { value: "5000+", label: "Orders Delivered" },
  { value: "500+", label: "Happy Clients" },
  { value: "2-3", label: "Days Delivery" },
];

const WHY_CHOOSE_US = [
  { icon: Zap, title: "Fast Turnaround", desc: "Orders delivered in just 2-3 working days from proof approval." },
  { icon: Shield, title: "No Hidden Costs", desc: "No die cost, no punching cost for small quantities. Transparent pricing always." },
  { icon: BadgeCheck, title: "Premium Quality", desc: "300/350 GSM FBB sheets with UV Gloss & Aqua Matt varnish for sharp, vibrant prints." },
  { icon: Users, title: "Dedicated Support", desc: "Personal WhatsApp proof approvals and dedicated support from order to delivery." },
  { icon: Truck, title: "Doorstep Delivery", desc: "Courier facility available across Gujarat and India at additional cost." },
  { icon: Award, title: "Trusted Since 2015", desc: "Over a decade of serving pharmaceutical companies and brands across Gujarat." },
];

const PROCESS_STEPS = [
  { step: "01", title: "Place Your Order", desc: "Select your service, enter product details, and submit your order online." },
  { step: "02", title: "Upload Design File", desc: "Send your Corel Draw file via WhatsApp or email for processing." },
  { step: "03", title: "Proof Approval", desc: "We send a digital proof on WhatsApp. Printing begins only after your approval." },
  { step: "04", title: "Make Payment", desc: "100% advance via UPI, NEFT, or IMPS after proof approval." },
  { step: "05", title: "Print & Deliver", desc: "Your order is printed, quality-checked, and dispatched within 2-3 days." },
];

const TESTIMONIALS = [
  { name: "Rajesh Patel", company: "Sunrise Pharma, Vadodara", rating: 5, text: "Outstanding quality and fastest delivery in Vadodara. Our blister printing has never looked better. Highly recommended!" },
  { name: "Priya Shah", company: "MediCare Labs, Ahmedabad", rating: 5, text: "Kanha Graphics delivers exactly what they promise — premium carton printing at very competitive rates. MOQ of just 10 pieces is a game changer for us." },
  { name: "Amit Desai", company: "Global Healthcare, Surat", rating: 5, text: "Professional team, quick proof turnaround, and zero compromise on print quality. We've been their client for 3 years now." },
];

export default function HomePage() {
  const printingServices = SERVICES.filter((s) => s.category === "printing");

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0a1628] text-white">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute right-1/3 top-1/2 h-48 w-48 rounded-full border border-white/5" />
          <div className="absolute right-1/4 top-1/4 h-24 w-24 rounded-full border border-orange-500/10" />
        </div>

        {/* Mobile hero */}
        <div className="relative px-4 py-8 lg:hidden">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5">
            <MapPin className="h-3 w-3 text-orange-400" />
            <span className="text-xs font-semibold text-orange-400">Vadodara, Gujarat</span>
          </div>
          <h1 className="mb-3 text-2xl font-extrabold leading-tight">
            INNOVATIVE DESIGNS,{" "}
            <span className="text-orange-400">EXPERT PRINTING</span>
          </h1>
          <p className="mb-5 text-sm leading-relaxed text-white/70">
            Pharmaceutical cartons, labels, inserts &amp; blisters.
            <span className="block">Fast 2-3 day delivery. MOQ just 10 pieces.</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Link href="/order" className="col-span-3 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-bold active:scale-[0.98] hover:bg-orange-600">
              Place Order <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 py-3 text-xs font-semibold">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a href={`tel:${SITE.phoneRaw}`}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 py-3 text-xs font-semibold">
              <Phone className="h-4 w-4" /> Call
            </a>
            <a href={SITE.emailHref}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 py-3 text-xs font-semibold">
              <Mail className="h-4 w-4" /> Mail
            </a>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[{ icon: Zap, label: "2-3 Day Delivery" }, { icon: CheckCircle, label: "No Die Cost" }, { icon: Clock, label: "MOQ 10 pcs" }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2.5">
                <Icon className="h-4 w-4 shrink-0 text-orange-400" />
                <span className="text-[11px] font-medium leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop hero */}
        <div className="relative mx-auto hidden max-w-7xl px-6 py-28 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 xl:px-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2">
              <MapPin className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-semibold text-orange-400">Vadodara&apos;s Trusted Printing Partner</span>
            </div>
            <h1 className="mb-6 text-5xl font-extrabold leading-tight xl:text-6xl">
              INNOVATIVE DESIGNS,{" "}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                EXPERT PRINTING
              </span>
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/70">
              Gujarat&apos;s premier pharmaceutical printing house — cartons, labels, blisters &amp; inserts.
              Premium quality, 2-3 day delivery, MOQ just 10 pieces.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/order" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 font-bold shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-600 hover:shadow-orange-500/50">
                Place Order <ArrowRight className="h-5 w-5" />
              </Link>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold backdrop-blur-sm transition-all hover:bg-white/20">
                <MessageCircle className="h-5 w-5" /> WhatsApp Us
              </a>
              <a href={`tel:${SITE.phoneRaw}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold transition-all hover:bg-white/20">
                <Phone className="h-5 w-5" /> Call Now
              </a>
            </div>
            <div className="mt-10 grid grid-cols-4 gap-4">
              {STATS.map(({ value, label }) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
                  <p className="text-2xl font-extrabold text-orange-400">{value}</p>
                  <p className="mt-1 text-xs text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Hero visual */}
          <div className="relative hidden lg:block">
            <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <Image src="/icons/kg-logo-main.jpeg" alt="Kanha Graphics - Pharmaceutical Printing Vadodara" fill className="object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Trusted Since 2015</p>
                    <p className="text-sm text-white/60">500+ satisfied pharmaceutical clients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block"><PatternBorder /></div>
      </section>

      <MobileQuickServices />

      {/* ── STATS BAR (mobile) ───────────────────────────────────────────── */}
      <section className="bg-orange-500 py-6 text-white lg:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-extrabold">{value}</p>
              <p className="text-xs text-white/80">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PICTURES GALLERY ─────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-12 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center lg:mb-12">
            <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-600">Our Work</span>
            <h2 className="mb-3 text-2xl font-extrabold text-[#0a1628] lg:text-4xl">Pictures Gallery</h2>
            <p className="mx-auto max-w-xl text-sm text-gray-600 lg:text-base">
              Explore our pharmaceutical printing range — cartons, labels, blisters and more.
            </p>
          </div>
          <ProductSlider />
        </div>
      </section>

      {/* ── ABOUT US ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Text */}
            <div>
              <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-600">About Us</span>
              <h2 className="mb-5 text-2xl font-extrabold text-[#0a1628] lg:text-4xl">
                Vadodara&apos;s Trusted<br />
                <span className="text-orange-500">Pharmaceutical Printing Partner</span>
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-gray-600 lg:text-base">
                Kanha Graphics is a leading pharmaceutical packaging and printing company based in Vadodara, Gujarat.
                Since 2015, we have been delivering premium-quality printed materials to pharmaceutical companies,
                healthcare brands, and startups across India.
              </p>
              <p className="mb-6 text-sm leading-relaxed text-gray-600 lg:text-base">
                We specialize in carton printing, label printing, blister/strip/sachet printing, and insert printing —
                all under one roof with state-of-the-art equipment and a dedicated team ensuring every print meets
                the highest standards.
              </p>
              <div className="mb-6 grid grid-cols-2 gap-3">
                {[
                  "Expert pharmaceutical printers",
                  "300/350 GSM FBB sheets",
                  "UV Gloss & Aqua Matt varnish",
                  "GST registered business",
                  "PAN: DFRPS6567D",
                  "GSTN: 24DFRPS6567D1ZV",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/order" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600">
                  Start Printing <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border-2 border-[#0a1628] px-6 py-3 font-semibold text-[#0a1628] hover:bg-[#0a1628] hover:text-white">
                  Contact Us
                </Link>
              </div>
            </div>
            {/* Info cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MapPin, title: "Location", value: "Nizampura, Vadodara 390002", bg: "bg-blue-50", color: "text-blue-600" },
                { icon: Phone, title: "Phone", value: SITE.phone, bg: "bg-green-50", color: "text-green-600" },
                { icon: Mail, title: "Email", value: SITE.email, bg: "bg-orange-50", color: "text-orange-600" },
                { icon: Clock, title: "Working Hours", value: "Mon–Sat: 9 AM – 7 PM", bg: "bg-purple-50", color: "text-purple-600" },
              ].map(({ icon: Icon, title, value, bg, color }) => (
                <div key={title} className={`rounded-2xl ${bg} p-5`}>
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">{title}</p>
                  <p className="text-sm font-semibold text-gray-800 break-all">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────────── */}
      <section className="bg-[#0a1628] py-12 text-white lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center lg:mb-16">
            <span className="mb-3 inline-block rounded-full bg-orange-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-400">Why Choose Us</span>
            <h2 className="mb-3 text-2xl font-extrabold lg:text-4xl">
              The Kanha Graphics Advantage
            </h2>
            <p className="mx-auto max-w-xl text-sm text-white/60 lg:text-base">
              We don&apos;t just print — we deliver quality, speed and trust with every order.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_CHOOSE_US.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-orange-500/50 hover:bg-white/10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR SERVICES ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center lg:mb-16">
            <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-600">Our Services</span>
            <h2 className="mb-3 text-2xl font-extrabold text-[#0a1628] lg:text-4xl">
              Complete Pharmaceutical Printing Solutions
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-gray-600 lg:text-base">
              Every printing service your pharma business needs — under one roof, at competitive prices.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Carton & Label */}
            <div className="group overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-all hover:border-orange-200 hover:shadow-xl">
              <div className="border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white"><Package className="h-5 w-5" /></div>
                  <h3 className="text-lg font-extrabold text-[#0a1628]">Carton &amp; Label Printing</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-orange-600 uppercase tracking-wide">Carton Printing</h4>
                    <ul className="space-y-2">
                      {CARTON_FEATURES.map((f) => (
                        <li key={f} className="flex gap-2 text-sm text-gray-600">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-orange-600 uppercase tracking-wide">Label Printing</h4>
                    <ul className="space-y-2">
                      {LABEL_FEATURES.map((f) => (
                        <li key={f} className="flex gap-2 text-sm text-gray-600">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Link href="/order?service=carton-printing" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600">
                  Order Cartons / Labels <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Blister */}
            <div className="group overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-sm transition-all hover:border-orange-200 hover:shadow-xl">
              <div className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white"><Pill className="h-5 w-5" /></div>
                  <h3 className="text-lg font-extrabold text-[#0a1628]">Blister / Strip / Sachet</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="mb-5 space-y-2">
                  {BLISTER_FEATURES.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-gray-600">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/order?service=blister-strips-sachet" className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-purple-700">
                  Get Instant Quote <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Service cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {printingServices.map((service) => (
              <div key={service.id} className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0a1628] text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  {NODE_ICON_MAP[service.id]}
                </div>
                <h3 className="mb-2 font-bold text-[#0a1628]">{service.name}</h3>
                <p className="mb-4 text-xs leading-relaxed text-gray-500">{service.shortDescription}</p>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {service.moq && <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">MOQ: {service.moq}</span>}
                  {service.deliveryDays && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{service.deliveryDays}</span>}
                </div>
                <Link href={`/order?service=${service.id}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700">
                  Order Now <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="bg-white py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center lg:mb-16">
            <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-600">How It Works</span>
            <h2 className="mb-3 text-2xl font-extrabold text-[#0a1628] lg:text-4xl">Simple 5-Step Process</h2>
            <p className="mx-auto max-w-xl text-sm text-gray-600 lg:text-base">From order to delivery in just 2-3 days.</p>
          </div>
          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS_STEPS.map(({ step, title, desc }, i) => (
              <div key={step} className="relative text-center">
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="absolute left-full top-8 hidden h-px w-full -translate-x-1/2 border-t-2 border-dashed border-orange-200 lg:block" />
                )}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0a1628] text-orange-400">
                  <span className="text-xl font-extrabold">{step}</span>
                </div>
                <h3 className="mb-2 font-bold text-[#0a1628]">{title}</h3>
                <p className="text-xs leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center lg:mb-16">
            <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-600">Client Reviews</span>
            <h2 className="mb-3 text-2xl font-extrabold text-[#0a1628] lg:text-4xl">What Our Clients Say</h2>
            <p className="mx-auto max-w-xl text-sm text-gray-600 lg:text-base">
              Trusted by 500+ pharmaceutical companies and healthcare brands across India.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map(({ name, company, rating, text }) => (
              <div key={name} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="mb-5 text-sm leading-relaxed text-gray-600">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0a1628]">{name}</p>
                    <p className="text-xs text-gray-500">{company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Trust badges */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:mt-14">
            {[
              { icon: ThumbsUp, label: "4.9/5 Rating", sub: "Client satisfaction" },
              { icon: Shield,   label: "GST Registered", sub: "GSTN: 24DFRPS6567D1ZV" },
              { icon: Award,    label: "Trusted Since 2015", sub: "10+ years experience" },
              { icon: BadgeCheck, label: "Quality Assured", sub: "Every print checked" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0a1628]">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT STRIP ────────────────────────────────────────────────── */}
      <section className="bg-white py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-[#0a1628] to-[#1a2a48] p-6 lg:p-10">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-center">
              <div className="lg:col-span-2">
                <h3 className="mb-2 text-xl font-extrabold text-white lg:text-2xl">
                  Have a Printing Requirement? Let&apos;s Talk!
                </h3>
                <p className="text-sm text-white/60 lg:text-base">
                  Call, WhatsApp or email us — we respond within 2 hours on working days.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-white hover:bg-green-600">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <a href={`tel:${SITE.phoneRaw}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600">
                  <Phone className="h-4 w-4" /> Call Now
                </a>
                <a href={SITE.emailHref}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/20">
                  <Mail className="h-4 w-4" /> Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="bg-orange-500 py-12 text-white lg:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-extrabold lg:text-4xl">
            Ready to Start Your Printing Project?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-sm text-white/80 lg:text-base">
            Join 500+ pharmaceutical companies who trust Kanha Graphics for their packaging needs.
            Create a free account and place your first order today.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link href="/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a1628] px-8 py-4 font-bold shadow-xl transition-all hover:bg-[#1a2a48] sm:w-auto">
              Create Free Account <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/order"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-8 py-4 font-bold transition-all hover:bg-white/20 sm:w-auto">
              Place an Order
            </Link>
            <Link href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-8 py-4 font-bold transition-all hover:bg-white/20 sm:w-auto">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
