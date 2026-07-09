"use client";

import { useMemo, useState, useEffect } from "react";
import { LayoutGrid, Ruler } from "lucide-react";
import {
  calculateLabelLayout,
  SIZE_UNITS,
  type LabelLayoutInput,
  type SizeUnit,
} from "@/lib/label-layout";

export function LabelSheetPlanner({
  onLayoutChange,
}: {
  onLayoutChange?: (input: LabelLayoutInput, layoutJson: string) => void;
}) {
  const [unit, setUnit] = useState<SizeUnit>("mm");
  // Fixed to Kanha Standard
  const pageWidth = 302.2;
  const pageHeight = 457.4;
  const [labelWidth, setLabelWidth] = useState(50);
  const [labelHeight, setLabelHeight] = useState(25);
  const [gap, setGap] = useState(2);
  const [margin, setMargin] = useState(5);
  const [totalLabels, setTotalLabels] = useState(0);

  const input: LabelLayoutInput = useMemo(
    () => ({
      pageWidth,
      pageHeight,
      labelWidth,
      labelHeight,
      gap,
      margin,
      unit,
      totalLabels,
    }),
    [pageWidth, pageHeight, labelWidth, labelHeight, gap, margin, unit, totalLabels]
  );

  const result = useMemo(() => calculateLabelLayout(input), [input]);

  useEffect(() => {
    if (!onLayoutChange) return;
    const json = JSON.stringify({
      unit: input.unit,
      page: { w: input.pageWidth, h: input.pageHeight },
      label: { w: input.labelWidth, h: input.labelHeight },
      gap: input.gap,
      margin: input.margin,
      totalLabels: input.totalLabels,
      labelsPerPage: result.labelsPerPage,
      cols: result.cols,
      rows: result.rows,
      pagesNeeded: result.pagesNeeded,
    });
    onLayoutChange(input, json);
  }, [input, result, onLayoutChange]);

  function updateField<K extends keyof LabelLayoutInput>(
    key: K,
    value: LabelLayoutInput[K]
  ) {
    if (key === "labelWidth") setLabelWidth(value as number);
    if (key === "labelHeight") setLabelHeight(value as number);
    if (key === "gap") setGap(value as number);
    if (key === "margin") setMargin(value as number);
    if (key === "unit") setUnit(value as SizeUnit);
    if (key === "totalLabels") setTotalLabels(value as number);
  }

  const previewCols = Math.min(result.cols, 8);
  const previewRows = Math.min(result.rows, 10);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-lg sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a1628] text-orange-400">
            <LayoutGrid className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0a1628]">Label Sheet Planner</h3>
            <p className="text-xs text-gray-500">
              Map your label size on the standard Kanha format ({pageWidth}×{pageHeight} mm). Choose your label size in mm, cm, inches, or points.
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-600">
            Measurement unit
          </label>
          <select
            value={unit}
            onChange={(e) => updateField("unit", e.target.value as SizeUnit)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          >
            {SIZE_UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Ruler className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-[#0a1628]">Sheet size (📌 Fixed)</span>
          </div>
          <div className="rounded-lg bg-blue-100 p-3 text-sm text-blue-900 mb-3">
            ✅ Standard Kanha printing format: <strong>{pageWidth} × {pageHeight} mm</strong> (Fixed for optimal printing)
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-gray-500 font-medium">Sheet width</label>
              <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
                {pageWidth} mm
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500 font-medium">Sheet height</label>
              <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
                {pageHeight} mm
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-orange-100 bg-orange-50/50 p-4">
          <span className="mb-3 block text-sm font-semibold text-[#0a1628]">
            🎨 Label size (Customize for your product)
          </span>
          <p className="mb-3 text-xs text-gray-600">
            Set the size of your individual labels. The planner will show how many fit on one {pageWidth}×{pageHeight} {unit} sheet.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-gray-500 font-medium">Label width ({unit})</label>
              <input
                type="number"
                min={0}
                step="any"
                value={labelWidth}
                onChange={(e) => updateField("labelWidth", parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                placeholder="e.g. 50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500 font-medium">Label height ({unit})</label>
              <input
                type="number"
                min={0}
                step="any"
                value={labelHeight}
                onChange={(e) => updateField("labelHeight", parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                placeholder="e.g. 25"
              />
            </div>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Gap between labels ({unit})</label>
            <input
              type="number"
              min={0}
              step="any"
              value={gap}
              onChange={(e) => updateField("gap", parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Sheet margin ({unit})</label>
            <input
              type="number"
              min={0}
              step="any"
              value={margin}
              onChange={(e) => updateField("margin", parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-600">
            Total labels needed (min. 0)
          </label>
          <input
            type="number"
            min={0}
            value={totalLabels}
            onChange={(e) => updateField("totalLabels", Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base font-semibold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        <div className="space-y-3 rounded-xl bg-[#0a1628] p-5 text-white">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Layout grid</span>
            <span className="font-medium">
              {result.cols} × {result.rows} = {result.labelsPerPage} / sheet
            </span>
          </div>
          {totalLabels > 0 && result.fits && (
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Sheets required</span>
              <span className="font-medium text-orange-300">{result.pagesNeeded}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Sheet size</span>
            <span className="font-medium">
              {pageWidth} × {pageHeight} {unit}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Label size</span>
            <span className="font-medium">
              {labelWidth} × {labelHeight} {unit}
            </span>
          </div>
          <p className="border-t border-white/10 pt-3 text-xs leading-relaxed text-white/70">
            {result.message}
          </p>
        </div>
      </div>

      {result.fits && result.labelsPerPage > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-lg sm:p-6">
          <h4 className="mb-3 text-sm font-bold text-[#0a1628]">Sheet preview</h4>
          <div className="mx-auto max-w-xs">
            <div
              className="relative mx-auto rounded border-2 border-gray-300 bg-gray-50"
              style={{ aspectRatio: `${result.pageWidthMm} / ${result.pageHeightMm}` }}
            >
              <div
                className="absolute inset-0 grid gap-px p-1"
                style={{
                  padding: `${Math.max(4, (margin / Math.max(pageHeight, 1)) * 100 * 0.08)}%`,
                  gridTemplateColumns: `repeat(${previewCols}, 1fr)`,
                  gridTemplateRows: `repeat(${previewRows}, 1fr)`,
                  gap: `${Math.max(1, gap)}px`,
                }}
              >
                {Array.from({ length: previewCols * previewRows }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-sm bg-orange-400/70 border border-orange-500/40"
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">
              Showing up to {previewCols}×{previewRows} grid preview
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
