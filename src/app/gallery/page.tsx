import type { Metadata } from "next";
import { ProductSlider } from "@/components/ProductSlider";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pictures Gallery | Kanha Graphic — Pharmaceutical Printing Vadodara",
  description:
    "Browse our pharmaceutical printing gallery — carton printing, label printing, blister strips, sachets and more. See real work by Kanha Graphic, Vadodara.",
  alternates: { canonical: `${SITE.url}/gallery` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/gallery`,
    title: "Gallery | Kanha Graphic Pharmaceutical Printing",
    description: "See our pharmaceutical printing work — cartons, labels, blisters and more.",
    images: [{ url: `${SITE.url}/icons/kg-logo-main.jpeg`, width: 800, height: 600, alt: "Kanha Graphic Gallery" }],
  },
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-[#0a1628] px-4 py-10 text-white lg:py-16">
        <div className="mx-auto max-w-5xl text-center">
          <span className="mb-3 inline-block rounded-full bg-orange-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-400">
            Our Work
          </span>
          <h1 className="mb-3 text-3xl font-extrabold lg:text-5xl">Pictures Gallery</h1>
          <p className="mx-auto max-w-xl text-sm text-white/60 lg:text-base">
            Explore our pharmaceutical printing range — cartons, labels, blisters, strips, sachets and more.
            Real work. Real quality.
          </p>
        </div>
      </section>

      {/* Slider */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <ProductSlider />
      </section>

      {/* Grid info */}
      <section className="bg-white py-10 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-xl font-extrabold text-[#0a1628] lg:text-2xl">
            What We Print
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Carton Printing", desc: "300/350 GSM FBB, UV & Aqua Matt" },
              { label: "Label Printing", desc: "Round, sheet & roll form labels" },
              { label: "Blister / Strip", desc: "Multicolor pharmaceutical printing" },
              { label: "Insert Printing", desc: "Coloured & B&W, pharma inserts" },
            ].map(({ label, desc }) => (
              <div key={label} className="rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center shadow-sm">
                <p className="mb-1 font-bold text-[#0a1628]">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
