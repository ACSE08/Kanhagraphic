"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import type { InvoiceOrder, InvoiceCustomer } from "@/lib/invoice-pdf";

interface Props {
  orders: InvoiceOrder[];
  customer: InvoiceCustomer;
  label?: string;
  className?: string;
}

export function InvoiceButton({ orders, customer, label = "Download Invoice", className }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const { generateInvoicePDF } = await import("@/lib/invoice-pdf");
      await generateInvoicePDF(orders, customer);
    } catch (err) {
      console.error("Invoice generation failed:", err);
      alert("Could not generate invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      }
    >
      <Download className="w-4 h-4" />
      {loading ? "Generating…" : label}
    </button>
  );
}
