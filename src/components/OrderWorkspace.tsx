"use client";

import { useState, Suspense } from "react";
import { OrderForm } from "@/components/OrderForm";
import { LabelSheetPlanner } from "@/components/LabelSheetPlanner";
import { TERMS } from "@/lib/constants";
import { LABEL_SHEET_RATE, GST_RATE, formatINR, type ServiceType } from "@/lib/pricing";

export function OrderWorkspace({
  userId,
  defaultService,
}: {
  userId?: string;
  defaultService: string;
}) {
  const [serviceType, setServiceType] = useState<ServiceType>(
    (defaultService as ServiceType) || "blister-strips-sachet"
  );
  const [labelLayoutJson, setLabelLayoutJson] = useState("");

  const isLabel = serviceType === "label-printing";

  // Compute label price from layout JSON
  const labelPrice = (() => {
    if (!isLabel || !labelLayoutJson) return null;
    try {
      const layout = JSON.parse(labelLayoutJson);
      const labelsPerSheet  = Number(layout.labelsPerPage ?? 0);
      const totalLabelCount = Number(layout.totalLabels ?? 0);
      const sheetsNeeded    = Number(
        layout.pagesNeeded ?? (labelsPerSheet > 0 ? Math.ceil(totalLabelCount / labelsPerSheet) : 0)
      );
      if (totalLabelCount <= 0 || sheetsNeeded <= 0) return null;
      const subtotal = sheetsNeeded * LABEL_SHEET_RATE;
      const gst = Math.round(subtotal * GST_RATE);
      return { sheetsNeeded, subtotal, gst, total: subtotal + gst };
    } catch {
      return null;
    }
  })();

  return (
    // Single persistent component tree — no conditional branches that cause
    // unmount/remount when switching to label-printing.
    <div className="space-y-6">

      {/* ── Non-label layout (hidden when label-printing is selected) ─────── */}
      {!isLabel && (
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-5 lg:gap-10">
          <div className="order-1 lg:col-span-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md sm:p-8">
              <h2 className="mb-5 text-lg font-bold text-[#0a1628] lg:mb-6 lg:text-xl">
                Order Details
              </h2>
              <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
                <OrderForm
                  userId={userId}
                  defaultService={defaultService}
                  serviceType={serviceType}
                  onServiceChange={setServiceType}
                  labelLayoutJson={labelLayoutJson}
                />
              </Suspense>
            </div>
          </div>

          <div className="order-2 space-y-6 lg:col-span-2">
            <div className="hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-md lg:block">
              <h3 className="mb-4 font-bold text-[#0a1628]">How It Works</h3>
              <ol className="space-y-4 text-sm text-gray-600">
                {[
                  "Place your order & upload Corel Draw file",
                  "Receive proof approval on WhatsApp",
                  "Make 100% advance payment via UPI/NEFT",
                  "Track printing & delivery in your dashboard",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5 lg:p-6">
              <h3 className="mb-3 font-bold text-orange-800">Important Notes</h3>
              <ul className="space-y-2 text-xs text-orange-700">
                {TERMS.map((t) => <li key={t}>• {t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── Label layout (hidden when another service is selected) ────────── */}
      {isLabel && (
        <div className="mx-auto max-w-3xl space-y-6">

          {/* Step 1 — Order details */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">1</span>
              <h2 className="text-lg font-bold text-[#0a1628]">Order Details</h2>
            </div>
            <OrderForm
              userId={userId}
              defaultService={defaultService}
              serviceType={serviceType}
              onServiceChange={setServiceType}
              labelLayoutJson={labelLayoutJson}
              hideButtons
            />
          </div>

          {/* Step 2 — Label Sheet Planner */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">2</span>
              <h2 className="text-lg font-bold text-[#0a1628]">Configure Label Layout</h2>
            </div>
            <LabelSheetPlanner
              onLayoutChange={(_input, json) => setLabelLayoutJson(json)}
            />
          </div>

          {/* Step 3 — Estimated Total */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${labelPrice ? "bg-orange-500" : "bg-gray-300"}`}>3</span>
              <h2 className={`text-lg font-bold ${labelPrice ? "text-[#0a1628]" : "text-gray-400"}`}>
                Estimated Total
              </h2>
            </div>
            {labelPrice ? (
              <div className="space-y-2 rounded-xl bg-[#0a1628] p-5 text-white">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Rate</span>
                  <span>{formatINR(LABEL_SHEET_RATE)} / sheet</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Sheets required</span>
                  <span>{labelPrice.sheetsNeeded}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Subtotal</span>
                  <span>{formatINR(labelPrice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">GST (18%)</span>
                  <span>{formatINR(labelPrice.gst)}</span>
                </div>
                <div className="flex justify-between border-t border-white/20 pt-3 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-400">{formatINR(labelPrice.total)}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
                Complete the label layout above to see your pricing at{" "}
                <span className="font-semibold text-gray-600">{formatINR(LABEL_SHEET_RATE)}/sheet</span>.
              </div>
            )}
          </div>

          {/* Step 4 — Place Order buttons */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">4</span>
              <h2 className="text-lg font-bold text-[#0a1628]">Place Your Order</h2>
            </div>
            <OrderForm
              userId={userId}
              defaultService={defaultService}
              serviceType={serviceType}
              onServiceChange={setServiceType}
              labelLayoutJson={labelLayoutJson}
              buttonsOnly
            />
          </div>

          {/* Important Notes */}
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
            <h3 className="mb-3 font-bold text-orange-800">Important Notes</h3>
            <ul className="space-y-2 text-xs text-orange-700">
              {TERMS.map((t) => <li key={t}>• {t}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
