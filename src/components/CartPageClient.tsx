"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Loader2,
  ArrowRight,
  Package,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR, getServiceLabel } from "@/lib/cart";
import { formatLabelLayoutSummary } from "@/lib/label-layout";

export function CartPageClient({ userId }: { userId?: string }) {
  const router = useRouter();
  const { items, totals, removeItem, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="space-y-6">
      <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4">
        <h2 className="text-lg font-bold text-[#0a1628] mb-1">🛒 Shopping Cart</h2>
        <p className="text-sm text-gray-600">You have {items.length} item(s) in your cart. Review before checkout.</p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
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

      <div className="rounded-2xl bg-[#0a1628] p-6 text-white">
        <h3 className="mb-4 font-bold flex items-center gap-2">
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

        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-semibold hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Checkout All ({totals.count} items)
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

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
  );
}
