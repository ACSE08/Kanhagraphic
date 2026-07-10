"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Package, ShoppingBag, CheckCircle } from "lucide-react";
import {
  formatINR,
  SERVICES,
  PRICING_TABLE,
  calculateBlisterPrice,
  calculateCartonPrice,
  calculateInsertPrice,
  type ServiceType,
  type InsertPrintType,
  type PriceBreakdown,
} from "@/lib/pricing";
import { useCart } from "@/context/CartContext";

export function OrderForm({
  userId,
  defaultService,
  onServiceChange,
  labelLayoutJson = "",
  hideButtons = false,
  buttonsOnly = false,
}: {
  userId?: string;
  defaultService?: string;
  onServiceChange?: (service: ServiceType) => void;
  labelLayoutJson?: string;
  hideButtons?: boolean;
  buttonsOnly?: boolean;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [serviceType, setServiceType] = useState<ServiceType>(
    (defaultService as ServiceType) || "blister-strips-sachet"
  );
  const [insertType, setInsertType] = useState<InsertPrintType | null>(null);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [error, setError] = useState("");

  const selectedService = SERVICES.find((s) => s.id === serviceType);
  const isLabel = serviceType === "label-printing";
  const isBlister = serviceType === "blister-strips-sachet";
  const isCarton = serviceType === "carton-printing";
  const isInsert = serviceType === "insert-printing";
  const isBelowMoq = !isLabel && !!selectedService?.moq && quantity < selectedService.moq;

  const price: PriceBreakdown | null = isBlister ? calculateBlisterPrice(quantity) : null;
  const cartonPrice: PriceBreakdown | null = isCarton ? calculateCartonPrice(quantity) : null;
  const insertPrice: PriceBreakdown | null = isInsert && insertType ? calculateInsertPrice(quantity, insertType) : null;

  function handleServiceChange(value: ServiceType) {
    setServiceType(value);
    onServiceChange?.(value);
    setError("");
  }

  function getOrderQuantity() {
    if (isLabel && labelLayoutJson) {
      try {
        const layout = JSON.parse(labelLayoutJson);
        return layout.totalLabels ?? 0;
      } catch {
        return 0;
      }
    }
    return quantity;
  }

  async function handleAddToCart() {
    setError("");
    setCartLoading(true);

    const orderQty = getOrderQuantity();
    if (!isLabel && selectedService?.moq && orderQty < selectedService.moq) {
      setCartLoading(false);
      setError(`Minimum order quantity for ${selectedService.name} is ${selectedService.moq}.`);
      return;
    }

    if (isLabel && !labelLayoutJson) {
      setCartLoading(false);
      setError("Please configure the label layout before adding to cart.");
      return;
    }

    if (isInsert && !insertType) {
      setCartLoading(false);
      setError("Please select an insert type (Coloured or B&W).");
      return;
    }

    const result = addItem({
      serviceType,
      productName,
      quantity: orderQty,
      notes,
      labelLayout: isLabel ? labelLayoutJson : null,
      insertType: isInsert ? insertType ?? undefined : undefined,
    });

    setCartLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    // Flash green tick, then immediately reset + scroll
    setCartAdded(true);
    setTimeout(() => {
      setProductName("");
      setNotes("");
      if (!isLabel) setQuantity(100);
      setCartAdded(false);
      setError("");
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.refresh();
    }, 400);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!userId) {
      router.push(`/login?redirect=/order&service=${serviceType}`);
      return;
    }

    if (isLabel && !labelLayoutJson) {
      setError("Please configure label & page size in the planner.");
      return;
    }

    if (isInsert && !insertType) {
      setError("Please select an insert type (Coloured or B&W).");
      return;
    }

    const orderQty = getOrderQuantity();
    if (!isLabel && selectedService?.moq && orderQty < selectedService.moq) {
      setError(`Minimum order quantity for ${selectedService.name} is ${selectedService.moq}.`);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("serviceType", serviceType);
      formData.append("productName", productName.trim());
      formData.append("quantity", String(orderQty));
      formData.append("notes", notes);
      if (isInsert && insertType) formData.append("insertType", insertType);
      if (labelLayoutJson) formData.append("labelLayout", labelLayoutJson);

      const res = await fetch("/api/orders", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to place order");
        return;
      }

      router.push(`/dashboard/orders/${data.order.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Shared button block used in both modes ────────────────────────────────
  function renderButtons(isFormSubmit = true) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={cartLoading || cartAdded}
          className={`relative flex items-center justify-center gap-2 rounded-xl border-2 py-4 font-semibold transition-all duration-300 ${
            cartAdded
              ? "border-green-500 bg-green-500 text-white scale-95"
              : "border-orange-500 text-orange-600 hover:bg-orange-50 active:scale-95"
          } disabled:cursor-not-allowed`}
        >
          {cartLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : cartAdded ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <ShoppingBag className="h-5 w-5" />
          )}
          {cartLoading ? "Adding..." : cartAdded ? "Added to Cart ✓" : "Add to Cart"}
        </button>

        <button
          type={isFormSubmit ? "submit" : "button"}
          onClick={isFormSubmit ? undefined : (e) => handleSubmit(e as unknown as React.FormEvent)}
          disabled={loading || cartAdded}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-semibold text-lg text-white transition-all duration-200 hover:bg-orange-600 active:scale-95 disabled:opacity-50"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          {loading ? "Placing..." : "Order Now"}
        </button>
      </div>
    );
  }

  // buttonsOnly mode — for label service step 4
  if (buttonsOnly) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}
        {renderButtons(false)}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Added to cart toast banner */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          cartAdded ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
          Item added to cart! You can add another item below.
        </div>
      </div>

      {!userId && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
          Please{" "}
          <Link href="/login?redirect=/order" className="font-semibold underline">
            login
          </Link>{" "}
          or{" "}
          <Link href="/signup?redirect=/order" className="font-semibold underline">
            sign up
          </Link>{" "}
          to place an order. You can still add items to cart and preview pricing.
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Select Service</label>
        <select
          value={serviceType}
          onChange={(e) => handleServiceChange(e.target.value as ServiceType)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
        >
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {selectedService && (
          <p className="mt-2 text-sm text-gray-500">{selectedService.shortDescription}</p>
        )}
      </div>

      <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <label htmlFor="productName" className="text-sm font-semibold text-[#0a1628]">
              Product Name
            </label>
            <p className="text-xs text-gray-500">Enter your medicine or product name</p>
          </div>
        </div>
        <input
          id="productName"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="e.g. Clarithromycin Tablets BP 250 MG"
          className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        />
      </div>

      {!isLabel && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Quantity {selectedService?.moq ? `(MOQ: ${selectedService.moq})` : "(min. 0 for estimate)"}
          </label>
          <input
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
          />
          {isBelowMoq && (
            <p className="mt-2 text-sm font-medium text-red-600">
              Minimum quantity for {selectedService?.name} is {selectedService?.moq}.
            </p>
          )}
        </div>
      )}

      {isInsert && (
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Insert Type <span className="text-orange-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { value: "coloured", label: "Coloured", rate: "₹12/piece" },
                { value: "bw", label: "B&W", rate: "₹3/piece" },
              ] as const
            ).map(({ value, label, rate }) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition-colors ${
                  insertType === value
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-white hover:border-orange-300"
                }`}
              >
                <input
                  type="radio"
                  name="insertType"
                  value={value}
                  checked={insertType === value}
                  onChange={() => setInsertType(value)}
                  className="accent-orange-500"
                  required
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500">{rate}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {isBlister && price && quantity > 0 && price.subtotal > 0 && (
        <div className="space-y-2 rounded-xl bg-[#0a1628] p-5 text-white">
          {productName.trim() && (
            <div className="flex justify-between gap-4 border-b border-white/10 pb-2 text-sm">
              <span className="shrink-0 text-white/60">Product</span>
              <span className="text-right font-medium text-orange-300">{productName.trim()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Subtotal</span>
            <span>{formatINR(price.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">GST (18%)</span>
            <span>{formatINR(price.gst)}</span>
          </div>
          <div className="flex justify-between border-t border-white/20 pt-2 text-lg font-bold">
            <span>Estimated Total</span>
            <span className="text-orange-400">{formatINR(price.total)}</span>
          </div>
        </div>
      )}

      {isCarton && !isBelowMoq && cartonPrice && quantity > 0 && cartonPrice.subtotal > 0 && (
        <div className="space-y-2 rounded-xl bg-[#0a1628] p-5 text-white">
          {productName.trim() && (
            <div className="flex justify-between gap-4 border-b border-white/10 pb-2 text-sm">
              <span className="shrink-0 text-white/60">Product</span>
              <span className="text-right font-medium text-orange-300">{productName.trim()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Rate Slab</span>
            <span>{cartonPrice.tier}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Unit Price</span>
            <span>{cartonPrice.unitPrice ? formatINR(cartonPrice.unitPrice) : "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Subtotal</span>
            <span>{formatINR(cartonPrice.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">GST (18%)</span>
            <span>{formatINR(cartonPrice.gst)}</span>
          </div>
          <div className="flex justify-between border-t border-white/20 pt-2 text-lg font-bold">
            <span>Estimated Total</span>
            <span className="text-orange-400">{formatINR(cartonPrice.total)}</span>
          </div>
        </div>
      )}

      {isInsert && insertPrice && quantity > 0 && insertPrice.subtotal > 0 && (
        <div className="space-y-2 rounded-xl bg-[#0a1628] p-5 text-white">
          {productName.trim() && (
            <div className="flex justify-between gap-4 border-b border-white/10 pb-2 text-sm">
              <span className="shrink-0 text-white/60">Product</span>
              <span className="text-right font-medium text-orange-300">{productName.trim()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Insert Type</span>
            <span>{insertPrice.tier}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Unit Price</span>
            <span>{insertPrice.unitPrice ? formatINR(insertPrice.unitPrice) : "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Subtotal</span>
            <span>{formatINR(insertPrice.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">GST (18%)</span>
            <span>{formatINR(insertPrice.gst)}</span>
          </div>
          <div className="flex justify-between border-t border-white/20 pt-2 text-lg font-bold">
            <span>Estimated Total</span>
            <span className="text-orange-400">{formatINR(insertPrice.total)}</span>
          </div>
        </div>
      )}

      {isBlister && quantity === 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          Enter quantity above 0 to see blister/strip pricing estimate.
        </div>
      )}

      {isBlister && (
        <div className="overflow-hidden rounded-xl border border-orange-200 bg-white">
          <div className="border-b border-orange-100 bg-orange-50 px-4 py-3">
            <h3 className="text-sm font-bold text-[#0a1628]">Blister / Strips / Sachet Pricing Table</h3>
            <p className="mt-1 text-xs text-gray-600">GST extra as applicable.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Quantity Range</th>
                  <th className="px-4 py-3 font-semibold">Rate</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_TABLE.map((row) => (
                  <tr key={row.range} className="border-t border-gray-100">
                    <td className="px-4 py-2.5 text-gray-700">{row.range}</td>
                    <td className="px-4 py-2.5 font-medium text-[#0a1628]">{row.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Additional Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Size, finish, varnish type, delivery preferences..."
          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {!hideButtons && renderButtons(true)}
    </form>
  );
}
