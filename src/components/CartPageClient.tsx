"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, Trash2, Loader2, ArrowRight, Package,
  FileText, Download, X, Eye,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR, getServiceLabel } from "@/lib/cart";
import { formatLabelLayoutSummary } from "@/lib/label-layout";
import type { InvoiceCustomer, InvoiceOrder } from "@/lib/invoice-pdf";

interface CartPageClientProps {
  userId?: string;
  customer?: InvoiceCustomer | null;
}

export function CartPageClient({ userId, customer }: CartPageClientProps) {
  const router = useRouter();
  const { items, totals, removeItem, updateQuantity, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Invoice modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [invoiceViewed, setInvoiceViewed] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState("Invoice.pdf");
  const blobRef = useRef<Blob | null>(null);

  // Revoke blob URL on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  // Convert cart items → InvoiceOrder shape for the PDF generator
  const invoiceOrders: InvoiceOrder[] = items.map((item, idx) => ({
    id: item.id,
    orderNumber: `CART-${String(idx + 1).padStart(2, "0")}`,
    batchNumber: null,
    serviceType: item.serviceType,
    productName: item.productName || null,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.subtotal,
    gst: item.gst,
    total: item.total,
    notes: item.notes || null,
    createdAt: new Date(),
  }));

  async function handleViewInvoice() {
    if (!customer) {
      router.push("/login?redirect=/cart");
      return;
    }
    setInvoiceLoading(true);
    try {
      const { generateInvoiceBlob } = await import("@/lib/invoice-pdf");
      const { blob, filename } = await generateInvoiceBlob(invoiceOrders, customer);
      // Revoke previous URL
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const url = URL.createObjectURL(blob);
      blobRef.current = blob;
      setPdfUrl(url);
      setPdfFilename(filename);
      setModalOpen(true);
      setInvoiceViewed(true);
    } catch (err) {
      console.error("Invoice generation failed:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Could not generate invoice: ${msg}`);
    } finally {
      setInvoiceLoading(false);
    }
  }

  function handleDownloadInvoice() {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = pdfFilename;
    a.click();
  }

  async function handleCheckout() {
    if (!userId) {
      router.push("/login?redirect=/cart");
      return;
    }
    if (items.length === 0) return;

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            serviceType: i.serviceType,
            productName: i.productName,
            quantity: i.quantity,
            notes: i.notes,
            labelLayout: i.labelLayout,
            insertType: i.insertType,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed");
        return;
      }

      // 1. Auto-download the invoice
      handleDownloadInvoice();

      // 2. Build a detailed order summary for the email body
      const orderLines = items.map((item, idx) => {
        const svcMap: Record<string, string> = {
          "blister-strips-sachet": "Blister / Strip / Sachet Printing",
          "carton-printing": "Carton Printing",
          "label-printing": "Label Sheet Printing",
          "insert-printing": "Insert Printing",
        };
        const svc = svcMap[item.serviceType] ?? item.serviceType;
        const insertNote =
          item.serviceType === "insert-printing" && item.insertType
            ? ` (${item.insertType === "coloured" ? "Coloured" : "B&W"})`
            : "";
        const price =
          item.total > 0 ? `  Amount: Rs ${item.total.toFixed(2)}` : "  Amount: Custom quote";
        const notes = item.notes ? `\n  Notes: ${item.notes}` : "";
        return (
          `${idx + 1}. ${item.productName || svc}\n` +
          `   Service: ${svc}${insertNote}\n` +
          `   Qty: ${item.quantity}${notes}\n` +
          `${price}`
        );
      }).join("\n\n");

      const subtotal = totals.subtotal > 0 ? `\nSubtotal : Rs ${totals.subtotal.toFixed(2)}` : "";
      const gstLine  = totals.gst > 0      ? `\nGST (18%): Rs ${totals.gst.toFixed(2)}`      : "";
      const totalLine = totals.total > 0   ? `\nTotal    : Rs ${totals.total.toFixed(2)}`     : "";

      const customerBlock =
        `Customer : ${customer?.name ?? ""}` +
        (customer?.companyName ? `\nCompany  : ${customer.companyName}` : "") +
        (customer?.phone ? `\nPhone    : ${customer.phone}` : "") +
        (customer?.address ? `\nAddress  : ${customer.address}` : "") +
        (customer?.gstNumber ? `\nGST No   : ${customer.gstNumber}` : "");

      const emailBody =
        `Hi Kanha Graphic,\n\n` +
        `I would like to place the following order. Please find the details below.\n\n` +
        `─────────────────────────────\n` +
        `Batch No : ${data.batchNumber ?? ""}\n` +
        `Date     : ${new Date().toLocaleDateString("en-IN")}\n` +
        `─────────────────────────────\n\n` +
        `${customerBlock}\n\n` +
        `─────────────────────────────\n` +
        `ORDER ITEMS\n` +
        `─────────────────────────────\n` +
        `${orderLines}\n\n` +
        `─────────────────────────────` +
        `${subtotal}${gstLine}${totalLine}\n` +
        `─────────────────────────────\n\n` +
        `Please confirm the order and share proof for approval.\n\n` +
        `Thank you.`;

      const subject = encodeURIComponent(`New Order ${data.batchNumber ?? ""} - Kanha Graphic`);
      window.open(
        `https://mail.google.com/mail/?view=cm&to=info.kanhagraphic0701%40gmail.com&su=${subject}&body=${encodeURIComponent(emailBody)}`,
        "_blank"
      );

      clearCart();
      router.push(`/dashboard?batch=${data.batchNumber}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h2 className="mb-2 text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="mb-2 text-gray-500">Add multiple products and services to your cart in one go.</p>
        <p className="mb-6 text-sm text-gray-400">You can add multiple items, then purchase them all at once.</p>
        <Link
          href="/order"
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Start Adding Items <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* ── Invoice Preview Modal ───────────────────────────────────────── */}
      {modalOpen && pdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="flex w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl" style={{ maxHeight: "90vh" }}>
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" />
                <span className="font-bold text-[#0a1628]">Invoice Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadInvoice}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download Invoice
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            {/* PDF iframe */}
            <div className="flex-1 overflow-hidden rounded-b-2xl">
              <iframe
                src={pdfUrl}
                className="h-full w-full"
                style={{ minHeight: "65vh", border: "none" }}
                title="Invoice Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Page content ────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4">
          <h2 className="mb-1 text-lg font-bold text-[#0a1628]">🛒 Shopping Cart</h2>
          <p className="text-sm text-gray-600">
            You have {items.length} item(s) in your cart. Review before checkout.
          </p>
        </div>

        {/* Cart items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Package className="h-4 w-4 shrink-0 text-orange-500" />
                    <span className="text-xs font-medium text-gray-400">
                      {getServiceLabel(item.serviceType)}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0a1628]">
                    {item.productName || "Unnamed product"}
                  </h3>
                  {item.labelLayout && (
                    <p className="mt-1 text-xs text-gray-500">
                      {formatLabelLayoutSummary(item.labelLayout)}
                    </p>
                  )}
                  {item.serviceType === "insert-printing" && item.insertType && (
                    <p className="mt-1 text-xs text-gray-500">
                      Type: {item.insertType === "coloured" ? "Coloured" : "B&W"}
                    </p>
                  )}
                  {item.notes && (
                    <p className="mt-1 text-xs text-gray-400">Note: {item.notes}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                {item.serviceType !== "label-printing" ? (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500">Qty:</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-gray-600">{item.quantity} labels</span>
                )}
                <div className="text-right">
                  {item.total > 0 ? (
                    <p className="font-bold text-orange-600">{formatINR(item.total)}</p>
                  ) : (
                    <p className="text-sm text-gray-400">Custom quote</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="rounded-2xl bg-[#0a1628] p-6 text-white">
          <h3 className="mb-4 flex items-center gap-2 font-bold">
            💳 Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Items</span>
              <span>{totals.count}</span>
            </div>
            {totals.subtotal > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-white/60">Subtotal</span>
                  <span>{formatINR(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">GST (18%)</span>
                  <span>{formatINR(totals.gst)}</span>
                </div>
                <div className="flex justify-between border-t border-white/20 pt-2 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-400">{formatINR(totals.total)}</span>
                </div>
              </>
            )}
            {totals.quotedItems > 0 && (
              <p className="pt-2 text-xs text-white/50">
                {totals.quotedItems} item(s) will be quoted via WhatsApp.
              </p>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-500/20 p-3 text-sm text-red-200">{error}</div>
          )}

          {/* View Invoice button */}
          <button
            type="button"
            onClick={handleViewInvoice}
            disabled={invoiceLoading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 py-3.5 font-semibold text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
          >
            {invoiceLoading ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Generating…</>
            ) : (
              <><Eye className="h-5 w-5" /> View Invoice</>
            )}
          </button>

          {/* Checkout button — disabled until invoice is viewed */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading || !invoiceViewed}
            title={!invoiceViewed ? "Please view the invoice before checking out" : undefined}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-semibold hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
          >
            {loading ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Processing…</>
            ) : (
              <>Checkout All ({totals.count} items) <ArrowRight className="h-5 w-5" /></>
            )}
          </button>

          {!invoiceViewed && (
            <p className="mt-2 text-center text-xs text-white/40">
              View the invoice first to enable checkout
            </p>
          )}

          {invoiceViewed && (
            <p className="mt-2 text-center text-xs text-white/50">
              Checkout will download your invoice and open Gmail with full order details
            </p>
          )}

          {!userId && (
            <p className="mt-3 text-center text-xs text-white/50">
              <Link href="/login?redirect=/cart" className="text-orange-400 underline">
                Login
              </Link>{" "}
              required to checkout
            </p>
          )}
        </div>

        <Link
          href="/order"
          className="block text-center text-sm font-medium text-orange-600 hover:underline"
        >
          + Add more items
        </Link>
      </div>
    </>
  );
}
