"use client";

import { useMemo, useState, useEffect } from "react";
import { LayoutGrid, Ruler } from "lucide-react";
import {
  calculateLabelLayout,
  SIZE_UNITS,
  DEFAULT_PAGE_WIDTH_MM,
  DEFAULT_PAGE_HEIGHT_MM,
  type LabelLayoutInput,
  type SizeUnit,
} from "@/lib/label-layout";

// Fixed page size in mm — 304.8 × 457.2
const PAGE_W = DEFAULT_PAGE_WIDTH_MM;
const PAGE_H = DEFAULT_PAGE_HEIGHT_MM;

// Preview canvas dimensions in px — proportional to the real sheet
const PREVIEW_H_PX = 320;
const PREVIEW_W_PX = Math.round((PAGE_W / PAGE_H) * PREVIEW_H_PX); // ≈ 214 px

export function LabelSheetPlanner({
  onLayoutChange,
}: {
  onLayoutChange?: (input: LabelLayoutInput, layoutJson: string) => void;
}) {
  const [unit, setUnit] = useState<SizeUnit>("mm");
  const [labelWidth, setLabelWidth] = useState(50);
  const [labelHeight, setLabelHeight] = useState(25);
  const [gap, setGap] = useState(2);
  const [margin, setMargin] = useState(5);
  const [totalLabels, setTotalLabels] = useState(0);

  const input: LabelLayoutInput = useMemo(
    () => ({
      pageWidth: PAGE_W,
      pageHeight: PAGE_H,
      labelWidth,
      labelHeight,
      gap,
      margin,
      unit,
      totalLabels,
    }),
    [labelWidth, labelHeight, gap, margin, unit, totalLabels]
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

  function updateField<K extends keyof LabelLayoutInput>(key: K, value: LabelLayoutInput[K]) {
    if (key === "labelWidth")   setLabelWidth(value as number);
    else if (key === "labelHeight")  setLabelHeight(value as number);
    else if (key === "gap")          setGap(value as number);
    else if (key === "margin")       setMargin(value as number);
    else if (key === "unit")         setUnit(value as SizeUnit);
    else if (key === "totalLabels")  setTotalLabels(value as number);
  }

  // ── Accurate proportional preview ────────────────────────────────────────
  // All preview sizes derived from the same scale factor (mm → px)
  const scale     = PREVIEW_H_PX / PAGE_H;
  const marginPx  = result.marginMm       * scale;
  const gapPx     = result.gapMm          * scale;
  const labelWPx  = result.labelWidthMm   * scale;
  const labelHPx  = result.labelHeightMm  * scale;

  return (
    <div className="space-y-6">
      {/* ── Inputs card ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-lg sm:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a1628] text-orange-400">
            <LayoutGrid className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0a1628]">Label Sheet Planner</h3>
            <p className="text-xs text-gray-500">
              Map your label size on the Kanha standard sheet ({PAGE_W} × {PAGE_H} mm).
            </p>
          </div>
        </div>

        {/* Unit */}
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
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </div>

        {/* Fixed sheet size */}
        <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Ruler className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-[#0a1628]">Sheet size (📌 Fixed)</span>
          </div>
          <div className="mb-3 rounded-lg bg-blue-100 p-3 text-sm text-blue-900">
            ✅ Standard Kanha format:{" "}
            <strong>{PAGE_W} × {PAGE_H} mm</strong>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Sheet width</p>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
                {PAGE_W} mm
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Sheet height</p>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
                {PAGE_H} mm
              </div>
            </div>
          </div>
        </div>

        {/* Label size */}
        <div className="mb-4 rounded-xl border border-orange-100 bg-orange-50/50 p-4">
          <span className="mb-2 block text-sm font-semibold text-[#0a1628]">
            🎨 Label size
          </span>
          <p className="mb-3 text-xs text-gray-600">
            Enter the size of one label. The preview updates instantly.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Width ({unit})
              </label>
              <input
                type="number" min={0} step="any" value={labelWidth}
                onChange={(e) => updateField("labelWidth", parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                placeholder="e.g. 50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Height ({unit})
              </label>
              <input
                type="number" min={0} step="any" value={labelHeight}
                onChange={(e) => updateField("labelHeight", parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                placeholder="e.g. 25"
              />
            </div>
          </div>
        </div>

        {/* Gap + margin */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Gap ({unit})</label>
            <input
              type="number" min={0} step="any" value={gap}
              onChange={(e) => updateField("gap", parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Margin ({unit})</label>
            <input
              type="number" min={0} step="any" value={margin}
              onChange={(e) => updateField("margin", parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        {/* Total labels */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-600">
            Total labels needed
          </label>
          <input
            type="number" min={0} value={totalLabels}
            onChange={(e) => updateField("totalLabels", Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base font-semibold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        {/* Results */}
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
            <span className="font-medium">{PAGE_W} × {PAGE_H} mm</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Label size</span>
            <span className="font-medium">{labelWidth} × {labelHeight} {unit}</span>
          </div>
          <p className="border-t border-white/10 pt-3 text-xs leading-relaxed text-white/70">
            {result.message}
          </p>
        </div>
      </div>

      {/* ── Accurate proportional preview ─────────────────────────────────── */}
      {result.fits && result.labelsPerPage > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-lg sm:p-6">
          <h4 className="mb-4 text-sm font-bold text-[#0a1628]">
            Sheet preview{" "}
            <span className="text-xs font-normal text-gray-400">
              (to scale — {result.cols} col × {result.rows} row)
            </span>
          </h4>

          <div className="flex justify-center overflow-auto">
            {/* Sheet — exact aspect ratio, all measurements in px derived from mm scale */}
            <div
              className="relative shrink-0 border-2 border-gray-400 bg-gray-50 shadow-md"
              style={{ width: PREVIEW_W_PX, height: PREVIEW_H_PX }}
            >
              {/* Dashed margin guide */}
              <div
                className="pointer-events-none absolute border border-dashed border-blue-300"
                style={{
                  top:    marginPx,
                  left:   marginPx,
                  width:  PREVIEW_W_PX - marginPx * 2,
                  height: PREVIEW_H_PX - marginPx * 2,
                }}
              />

              {/* Label cells — absolutely positioned to exact scale */}
              {Array.from({ length: result.rows }).map((_, row) =>
                Array.from({ length: result.cols }).map((_, col) => (
                  <div
                    key={`${row}-${col}`}
                    className="absolute border border-orange-500/50 bg-orange-400/75"
                    style={{
                      left:   marginPx + col * (labelWPx + gapPx),
                      top:    marginPx + row * (labelHPx + gapPx),
                      width:  labelWPx,
                      height: labelHPx,
                    }}
                  />
                ))
              )}
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-gray-400">
            {result.cols} col × {result.rows} row = {result.labelsPerPage} labels/sheet
            {"  •  "}
            {PAGE_W} × {PAGE_H} mm sheet
          </p>
        </div>
      )}
    </div>
  );
}
