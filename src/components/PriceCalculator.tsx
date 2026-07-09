"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import {
  calculateBlisterPrice,
  formatINR,
  PRICING_TABLE,
  type PriceBreakdown,
} from "@/lib/pricing";

export function PriceCalculator({
  onPriceChange,
  onProductNameChange,
}: {
  onPriceChange?: (price: PriceBreakdown) => void;
  onProductNameChange?: (name: string) => void;
}) {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(100);
  const price = calculateBlisterPrice(quantity);

  function handleQuantityChange(val: number) {
    const q = Math.max(0, val);
    setQuantity(q);
    onPriceChange?.(calculateBlisterPrice(q));
  }

  function handleProductNameChange(name: string) {
    setProductName(name);
    onProductNameChange?.(name);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 sm:p-6">
        <h3 className="text-lg font-bold text-[#0a1628] mb-4">Price Calculator</h3>

        <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0a1628]">Product Name</p>
              <p className="text-xs text-gray-500">Enter your medicine or product name</p>
            </div>
          </div>
          <input
            type="text"
            value={productName}
            onChange={(e) => handleProductNameChange(e.target.value)}
            placeholder="e.g. Clarithromycin Tablets BP 250 MG"
            className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        <label className="block text-sm font-medium text-gray-600 mb-2">
          Quantity (pieces) — Minimum 0
          <span className="ml-2 text-xs font-normal text-gray-400">(You can start with 0 and adjust)</span>
        </label>
        <input
          type="number"
          min={0}
          value={quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-base font-semibold"
          placeholder="Enter quantity or use slider"
        />
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.min(quantity, 1000)}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
          className="w-full mt-4 accent-orange-500"
        />

        {quantity === 0 && (
          <p className="mt-2 text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg p-2">
            💡 Enter quantity to calculate price. Minimum order requirements apply based on service type.
          </p>
        )}

        <div className="mt-6 space-y-3 bg-[#0a1628] rounded-xl p-5 text-white">
          {productName.trim() && (
            <div className="flex justify-between gap-4 text-sm border-b border-white/10 pb-3">
              <span className="text-white/60 shrink-0">Product</span>
              <span className="font-medium text-right text-orange-300">{productName.trim()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Pricing Tier</span>
            <span className="font-medium">{price.tier}</span>
          </div>
          {price.unitPrice && (
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Rate per piece</span>
              <span className="font-medium">{formatINR(price.unitPrice)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Subtotal</span>
            <span className="font-medium">{formatINR(price.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">GST (18%)</span>
            <span className="font-medium">{formatINR(price.gst)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-white/20 pt-3">
            <span>Total</span>
            <span className="text-orange-400">{formatINR(price.total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 overflow-x-auto">
        <h3 className="text-lg font-bold text-[#0a1628] mb-4">Pricing Table</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-semibold text-gray-600">Quantity</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-600">Rate</th>
            </tr>
          </thead>
          <tbody>
            {PRICING_TABLE.map((row) => (
              <tr
                key={row.range}
                className={`border-b border-gray-50 ${
                  price.tier === row.range ? "bg-orange-50 font-semibold" : ""
                }`}
              >
                <td className="py-2.5 px-2">{row.range}</td>
                <td className="py-2.5 px-2 text-right text-orange-600">{row.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
