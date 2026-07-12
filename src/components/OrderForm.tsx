"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Package, ShoppingBag, CheckCircle, ArrowRight } from "lucide-react";
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
  serviceType: controlledServiceType,
  onServiceChange,
  labelLayoutJson = "",
  hideButtons = false,
  buttonsOnly = false,
}: {
  userId?: string;
  defaultService?: string;
  serviceType?: ServiceType;
  onServiceChange?: (service: ServiceType) => void;
  labelLayoutJson?: string;
  hideButtons?: boolean;
  buttonsOnly?: boolean;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const mountedRef = useRef(true);

  // If parent passes serviceType as a controlled prop use it, otherwise manage internally
  const [internalServiceType, setInternalServiceType] = useState<ServiceType>(
    (defaultService as ServiceType) || "blister-strips-sachet"
  );
  const serviceType = controlledServiceType ?? internalServiceType;
  const [insertType, setInsertType] = useState<InsertPrintType | null>(null);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [notes, setNotes] = useState("");

  // Separate loading states for cart vs direct-submit
  const [cartLoading, setCartLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [error, setError] = useState("");

  const selectedService = SERVICES.find((s) => s.id === serviceType);
  const isLabel   = serviceType === "label-printing";
  const isBlister = serviceType === "blister-strips-sachet";
  const isCarton  = serviceType === "carton-printing";
  const isInsert  = serviceType === "insert-printing";
  const isBelowMoq = !isLabel && !!selectedService?.moq && quantity < selectedService.moq;

  const price: PriceBreakdown | null       = isBlister ? calculateBlisterPrice(quantity) : null;
  const cartonPrice: PriceBreakdown | null = isCarton  ? calculateCartonPrice(quantity)  : null;
  const insertPrice: PriceBreakdown | null = isInsert && insertType
    ? calculateInsertPrice(quantity, insertType) : null;

  // Reset per-service fields when service changes
  function handleServiceChange(value: ServiceType) {
    setInternalServiceType(value);
    setInsertType(null);
    setError("");
    onServiceChange?.(value);
  }

  function getOrderQuantity() {
    if (isLabel && labelLayoutJson) {
      try {
        const layout = JSON.parse(labelLayoutJson);
        return Number(layout.totalLabels) || 0;
      } catch {
        return 0;
      }
    }
    return quantity;
  }

  // Centralised validation — returns error string or null
  function validate(): string | null {
    if (!isLabel && !productName.trim()) return "Please enter a product name.";
    const orderQty = getOrderQuantity();
    if (isLabel && !labelLayoutJson) return "Please configure the label layout before adding to cart.";
    if (isInsert && !insertType) return "Please select an insert type (Coloured or B&W).";
    if (!isLabel && selectedService?.moq && orderQty < selectedService.moq)
      return `Minimum order quantity for ${selectedService.name} is ${selectedService.moq}.`;
    return null;
  }

  const handleAddToCart = useCallback(async (): Promise<boolean> => {
    setError("");
    const validationError = validate();
    if (validationError) { setError(validationError); return false; }

    setCartLoading(true);
    try {
      const result = addItem({
        serviceType,
        productName,
        quantity: getOrderQuantity(),
        notes,
        labelLayout: isLabel ? labelLayoutJson : null,
        insertType: isInsert ? (insertType ?? undefined) : undefined,
      });

      if (!result.ok) { setError(result.error); return false; }

      setCartAdded(true);
      setTimeout(() => {
        if (!mountedRef.current) return;
        setProductName("");
        setNotes("");
        if (!isLabel) setQuantity(100);
        setCartAdded(false);
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
        router.refresh();
      }, 600);
      return true;
    } finally {
      setCartLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceType, productName, quantity, notes, insertType, isLabel, isInsert, labelLayoutJson]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!userId) {
      router.push(`/login?redirect=/order&service=${serviceType}`);
      return;
    }

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append("serviceType", serviceType);
      formData.append("productName", productName.trim());
      formData.append("quantity", String(getOrderQuantity()));
      formData.append("notes", notes);
      if (isInsert && insertType) formData.append("insertType", insertType);
      if (labelLayoutJson)        formData.append("labelLayout", labelLayoutJson);

      const res  = await fetch("/api/orders", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) { setError(data.error || "Failed to place order"); return; }

      router.push(`/dashboard/orders/${data.order.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  }

  // ── Button block ──────────────────────────────────────────────────────────
  function renderButtons() {
    const busy = cartLoading || submitLoading;
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={busy || cartAdded}
          className={`relative flex items-center justify-center gap-2 rounded-xl border-2 py-4 font-semibold transition-all duration-300
            ${cartAdded
              ? "border-green-500 bg-green-500 text-white scale-95"
              : "border-orange-500 text-orange-600 hover:bg-orange-50 active:scale-95"}
            disabled:cursor-not-allowed`}
        >
          {cartLoading ? <Loader2 className="h-5 w-5 animate-spin" /> :
           cartAdded   ? <CheckCircle className="h-5 w-5" /> :
                         <ShoppingBag className="h-5 w-5" />}
          {cartLoading ? "Adding…" : cartAdded ? "Added to Cart ✓" : "Add to Cart"}
        </button>

        {/* Go to Cart */}
        <button
          type="button"
          onClick={() => router.push("/cart")}
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-semibold text-white transition-all duration-200 hover:bg-orange-600 active:scale-95 disabled:opacity-50"
        >
          <ArrowRight className="h-5 w-5" />
          Go to Cart
        </button>
      </div>
    );
  }

  // ── buttonsOnly mode (label step 4) ───────────────────────────────────────
  if (buttonsOnly) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {renderButtons()}
      </div>
    );
  }

  // ── Full form ─────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cart success toast */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          cartAdded ? "max-h-20 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
          Item added to cart! You can add another item below.
        </div>
      </div>

      {/* Login nudge */}
      {!userId && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
          Please{" "}
          <Link href="/login?redirect=/order" className="font-semibold underline">login</Link>{" "}
          or{" "}
          <Link href="/signup?redirect=/order" className="font-semibold underline">sign up</Link>{" "}
          to place an order. You can still add items to cart and preview pricing.
        </div>
      )}

      {/* Service selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Select Service</label>
        <select
          value={serviceType}
          onChange={(e) => handleServiceChange(e.target.value as ServiceType)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
        >
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {selectedService && (
          <p className="mt-2 text-sm text-gray-500">{selectedService.shortDescription}</p>
        )}
      </div>

      {/* Product name */}
      <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <label htmlFor="productName" className="text-sm font-semibold text-[#0a1628]">
              Product Name {!isLabel && <span className="text-orange-500">*</span>}
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

      {/* Quantity */}
      {!isLabel && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Quantity {selectedService?.moq ? `(MOQ: ${selectedService.moq})` : "(min. 0 for estimate)"}
          </label>
          <input
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              setQuantity(isNaN(v) ? 0 : Math.max(0, v));
            }}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
          />
          {isBelowMoq && (
            <p className="mt-2 text-sm font-medium text-red-600">
              Minimum quantity for {selectedService?.name} is {selectedService?.moq}.
            </p>
          )}
        </div>
      )}

      {/* Insert type radio buttons */}
      {isInsert && (
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Insert Type <span className="text-orange-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: "coloured", label: "Coloured", rate: "₹12/piece" },
              { value: "bw",       label: "B&W",      rate: "₹3/piece"  },
            ] as const).map(({ value, label, rate }) => (
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

      {/* Price summaries */}
      {isBlister && price && quantity > 0 && price.subtotal > 0 && (
        <PriceSummary
          productName={productName}
          rows={[
            { label: "Subtotal", value: formatINR(price.subtotal) },
            { label: "GST (18%)", value: formatINR(price.gst) },
          ]}
          total={formatINR(price.total)}
        />
      )}

      {isCarton && !isBelowMoq && cartonPrice && quantity > 0 && cartonPrice.subtotal > 0 && (
        <PriceSummary
          productName={productName}
          rows={[
            { label: "Rate Slab",  value: cartonPrice.tier },
            { label: "Unit Price", value: cartonPrice.unitPrice ? formatINR(cartonPrice.unitPrice) : "—" },
            { label: "Subtotal",   value: formatINR(cartonPrice.subtotal) },
            { label: "GST (18%)", value: formatINR(cartonPrice.gst) },
          ]}
          total={formatINR(cartonPrice.total)}
        />
      )}

      {isInsert && insertPrice && quantity > 0 && insertPrice.subtotal > 0 && (
        <PriceSummary
          productName={productName}
          rows={[
            { label: "Insert Type", value: insertPrice.tier },
            { label: "Unit Price",  value: insertPrice.unitPrice ? formatINR(insertPrice.unitPrice) : "—" },
            { label: "Subtotal",    value: formatINR(insertPrice.subtotal) },
            { label: "GST (18%)",  value: formatINR(insertPrice.gst) },
          ]}
          total={formatINR(insertPrice.total)}
        />
      )}

      {isBlister && quantity === 0 && (
        <p className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
          Enter quantity above 0 to see blister/strip pricing estimate.
        </p>
      )}

      {/* Pricing table */}
      {isBlister && (
        <div className="overflow-hidden rounded-xl border border-orange-200 bg-white">
          <div className="border-b border-orange-100 bg-orange-50 px-4 py-3">
            <h3 className="text-sm font-bold text-[#0a1628]">Blister / Strips / Sachet Pricing</h3>
            <p className="mt-0.5 text-xs text-gray-500">GST extra as applicable.</p>
          </div>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Quantity Range</th>
                <th className="px-4 py-3 font-semibold">Rate</th>
              </tr>
            </thead>
            <tbody>
              {PRICING_TABLE.map((row) => (
                <tr key={row.range} className="border-t border-gray-100 hover:bg-orange-50/40 transition-colors">
                  <td className="px-4 py-2.5 text-gray-700">{row.range}</td>
                  <td className="px-4 py-2.5 font-semibold text-[#0a1628]">{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Additional Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Size, finish, varnish type, delivery preferences…"
          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!hideButtons && renderButtons()}
    </form>
  );
}

// ── Shared price summary card ─────────────────────────────────────────────────
function PriceSummary({
  productName,
  rows,
  total,
}: {
  productName: string;
  rows: { label: string; value: string }[];
  total: string;
}) {
  return (
    <div className="space-y-2 rounded-xl bg-[#0a1628] p-5 text-white">
      {productName.trim() && (
        <div className="flex justify-between gap-4 border-b border-white/10 pb-2 text-sm">
          <span className="shrink-0 text-white/60">Product</span>
          <span className="text-right font-medium text-orange-300">{productName.trim()}</span>
        </div>
      )}
      {rows.map(({ label, value }) => (
        <div key={label} className="flex justify-between text-sm">
          <span className="text-white/60">{label}</span>
          <span>{value}</span>
        </div>
      ))}
      <div className="flex justify-between border-t border-white/20 pt-2 text-lg font-bold">
        <span>Estimated Total</span>
        <span className="text-orange-400">{total}</span>
      </div>
    </div>
  );
}
