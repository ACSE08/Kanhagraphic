import Link from "next/link";
import {
  Package,
  Tag,
  Pill,
  ArrowRight,
} from "lucide-react";
import { SERVICES } from "@/lib/pricing";

const quickServices = SERVICES.filter((s) => s.category === "printing");

const iconMap: Record<string, React.ReactNode> = {
  "blister-strips-sachet": <Pill className="h-5 w-5" />,
  "carton-printing": <Package className="h-5 w-5" />,
  "label-printing": <Tag className="h-5 w-5" />,
};

export function MobileQuickServices() {
  return (
    <section className="bg-white px-4 py-6 lg:hidden">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#0a1628]">Quick Services</h2>
        <Link href="/services" className="text-xs font-semibold text-orange-600">
          View all
        </Link>
      </div>
      <div className="mobile-scroll-x -mx-1 px-1">
        {quickServices.map((service) => (
          <Link
            key={service.id}
            href={`/order?service=${service.id}`}
            className="flex w-[9.5rem] flex-col rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm active:scale-[0.98] transition-transform"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a1628] text-orange-400">
              {iconMap[service.id]}
            </div>
            <p className="line-clamp-2 text-sm font-bold leading-snug text-[#0a1628]">
              {service.name}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-600">
              Order <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
