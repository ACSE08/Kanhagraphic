import Link from "next/link";
import {
  Package,
  Tag,
  Pill,
  ArrowRight,
} from "lucide-react";
import type { ServiceInfo } from "@/lib/pricing";

const iconMap: Record<string, React.ReactNode> = {
  "blister-strips-sachet": <Pill className="w-7 h-7" />,
  "carton-printing": <Package className="w-7 h-7" />,
  "label-printing": <Tag className="w-7 h-7" />,
};

export function ServiceCard({ service }: { service: ServiceInfo }) {
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col">
      <div className="w-14 h-14 rounded-xl bg-[#0a1628] text-orange-400 flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
        {iconMap[service.id]}
      </div>
      <h3 className="text-lg font-bold text-[#0a1628] mb-2">{service.name}</h3>
      <p className="text-sm text-gray-600 flex-1 leading-relaxed">
        {service.shortDescription}
      </p>
      <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
        {service.moq && <span>MOQ: {service.moq} pcs</span>}
        {service.deliveryDays && <span>Delivery: {service.deliveryDays}</span>}
      </div>
      <Link
        href={`/order?service=${service.id}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 group-hover:gap-2 transition-all"
      >
        Order Now <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
