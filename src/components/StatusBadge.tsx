import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/pricing";

export function StatusBadge({ status }: { status: string }) {
  const label = ORDER_STATUS_LABELS[status] || status;
  const color = ORDER_STATUS_COLORS[status] || "bg-gray-100 text-gray-800";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
