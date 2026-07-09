import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight, Printer } from "lucide-react";
import { LabelSheetPlanner } from "@/components/LabelSheetPlanner";
import { PriceCalculator } from "@/components/PriceCalculator";
import {
  CARTON_FEATURES,
  BLISTER_FEATURES,
  TERMS,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Kanha Graphics printing services — carton printing, label printing, and blister/strip/sachet printing in Vadodara.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a1628] to-blue-900 py-10 text-white lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-3xl font-bold sm:text-4xl lg:mb-6 lg:text-5xl">Our Services</h1>
            <p className="text-sm leading-relaxed text-white/80 sm:text-base lg:text-lg">
              Comprehensive printing solutions for pharmaceutical packaging and product branding,
              delivered with quality assurance and on-time service.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-20">

        {/* ========== PRINTING SERVICES ========== */}
        <section className="mb-14 lg:mb-20">
          {/* Section Header */}
          <div className="mb-8 border-b-2 border-blue-500 pb-6 lg:mb-16 lg:pb-8">
            <div className="mb-3 flex items-center gap-3 lg:mb-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Printer className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#0a1628] sm:text-3xl lg:text-4xl">Printing Services</h2>
            </div>
            <p className="max-w-2xl text-sm text-gray-600 sm:text-base">Professional quality printing with fast turnaround and competitive pricing</p>
          </div>

          {/* CARTON PRINTING - Featured */}
          <div className="mb-8 overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white shadow-xl lg:mb-12">
            <div className="p-5 sm:p-8 lg:p-12">
              <div className="mb-3 inline-block">
                <span className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold">★ FEATURED</span>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-[#0a1628] lg:text-3xl">Carton Printing</h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-700 sm:text-base">
                High-quality carton printing for pharmaceutical, food &amp; beverage, and consumer goods packaging.
                We ensure perfect color matching and crisp, clear prints every time.
              </p>
              <ul className="space-y-3 mb-8">
                {CARTON_FEATURES.slice(0, 5).map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/order?service=carton-printing"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 font-bold text-white transition-all hover:bg-blue-700 sm:w-fit sm:px-8 sm:py-4"
              >
                Order Carton Printing <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* BLISTER/STRIPS - Featured */}
          <div className="mb-8 overflow-hidden rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-white shadow-xl lg:mb-12">
            <div className="p-5 sm:p-8 lg:p-12">
              <div className="mb-3 inline-block">
                <span className="px-4 py-2 rounded-full bg-purple-600 text-white text-xs font-bold">⚕️ PHARMACEUTICAL</span>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-[#0a1628] lg:text-3xl">Blister / Strips / Sachet</h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-700 sm:text-base">
                Precision pharmaceutical packaging with exact color matching and regulatory compliance.
                Ideal for blisters, strips, and sachets for medicine and healthcare products.
              </p>
              <ul className="space-y-3 mb-8">
                {BLISTER_FEATURES.slice(0, 5).map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/order?service=blister-strips-sachet"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3.5 font-bold text-white transition-all hover:bg-purple-700 sm:w-fit sm:px-8 sm:py-4"
              >
                Get Quote <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* LABEL PRINTING - Interactive */}
          <div className="mb-8 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/20 p-5 shadow-lg sm:p-8 lg:mb-12 lg:p-12">
            <div className="mb-6 lg:mb-8">
              <div className="mb-3 inline-block">
                <span className="px-4 py-2 rounded-full bg-amber-500 text-white text-xs font-bold">🎯 INTERACTIVE TOOL</span>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-[#0a1628] lg:text-3xl">Label Sheet Planner</h3>
              <p className="text-sm text-gray-700 sm:text-base">
                Calculate exactly how many labels fit on one sheet. Our interactive planner helps you plan perfectly.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 sm:p-6 lg:col-span-2">
                <LabelSheetPlanner />
              </div>
              <div>
                <div className="rounded-lg bg-amber-100 border border-amber-300 p-6 mb-6">
                  <h4 className="font-bold text-[#0a1628] mb-4">✨ How to Use</h4>
                  <ol className="space-y-3 text-sm text-gray-700">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-amber-500 text-white text-xs font-bold">1</span>
                      <span>Enter your label dimensions</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-amber-500 text-white text-xs font-bold">2</span>
                      <span>Select your unit (mm, cm, inches)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-amber-500 text-white text-xs font-bold">3</span>
                      <span>See instant calculations</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-amber-500 text-white text-xs font-bold">4</span>
                      <span>Order with confidence</span>
                    </li>
                  </ol>
                </div>
                <Link 
                  href="/order?service=label-printing" 
                  className="block w-full rounded-lg bg-amber-600 px-6 py-3 text-center font-bold text-white transition-all hover:bg-amber-700"
                >
                  Order Labels
                </Link>
              </div>
            </div>
          </div>

          {/* PRICING CALCULATOR */}
          <div className="mb-8 rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-5 shadow-lg sm:p-8 lg:mb-12 lg:p-12">
            <div className="mb-6 lg:mb-8">
              <h3 className="mb-2 text-2xl font-bold text-[#0a1628] lg:text-3xl">💰 Pricing Calculator</h3>
              <p className="text-sm text-gray-700 sm:text-base">
                Get instant pricing for blister, strips, and sachet printing based on quantity.
              </p>
            </div>
            <PriceCalculator />
          </div>


        </section>

        {/* ========== TERMS & CONDITIONS ========== */}
        <section>
          <div className="mb-6 border-b-2 border-orange-500 pb-5 lg:mb-8 lg:pb-6">
            <h2 className="text-2xl font-bold text-[#0a1628] lg:text-3xl">📋 Terms & Conditions</h2>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 sm:p-8 lg:p-12">
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {TERMS.map((term) => (
                <li key={term} className="flex gap-3 text-sm text-gray-700">
                  <span className="text-orange-500 shrink-0 font-bold text-lg">✓</span>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
