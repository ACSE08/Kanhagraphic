export const DEFAULT_PAGE_WIDTH_MM = 304.8;
export const DEFAULT_PAGE_HEIGHT_MM = 457.2;

export type SizeUnit = "mm" | "cm" | "inch" | "pt";

export interface LabelLayoutInput {
  pageWidth: number;
  pageHeight: number;
  labelWidth: number;
  labelHeight: number;
  gap: number;
  margin: number;
  unit: SizeUnit;
  totalLabels: number;
}

export interface LabelLayoutResult {
  pageWidthMm: number;
  pageHeightMm: number;
  labelWidthMm: number;
  labelHeightMm: number;
  gapMm: number;
  marginMm: number;
  cols: number;
  rows: number;
  labelsPerPage: number;
  pagesNeeded: number;
  totalLabels: number;
  unit: SizeUnit;
  fits: boolean;
  message: string;
}

export const SIZE_UNITS: { id: SizeUnit; label: string }[] = [
  { id: "mm", label: "Millimetres (mm)" },
  { id: "cm", label: "Centimetres (cm)" },
  { id: "inch", label: "Inches (in)" },
  { id: "pt", label: "Points (pt)" },
];

export const PAGE_PRESETS: {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: SizeUnit;
}[] = [
  {
    id: "kanha-standard",
    name: `Kanha Standard (${DEFAULT_PAGE_WIDTH_MM} × ${DEFAULT_PAGE_HEIGHT_MM} mm)`,
    width: DEFAULT_PAGE_WIDTH_MM,
    height: DEFAULT_PAGE_HEIGHT_MM,
    unit: "mm",
  },
  { id: "a4", name: "A4 (210 × 297 mm)", width: 210, height: 297, unit: "mm" },
  { id: "a3", name: "A3 (297 × 420 mm)", width: 297, height: 420, unit: "mm" },
  { id: "letter", name: "Letter (8.5 × 11 in)", width: 8.5, height: 11, unit: "inch" },
  { id: "legal", name: "Legal (8.5 × 14 in)", width: 8.5, height: 14, unit: "inch" },
  { id: "a5", name: "A5 (148 × 210 mm)", width: 148, height: 210, unit: "mm" },
  { id: "custom", name: "Custom page size", width: DEFAULT_PAGE_WIDTH_MM, height: DEFAULT_PAGE_HEIGHT_MM, unit: "mm" },
];

export function toMillimetres(value: number, unit: SizeUnit): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  switch (unit) {
    case "mm":
      return value;
    case "cm":
      return value * 10;
    case "inch":
      return value * 25.4;
    case "pt":
      return value * 0.352778;
  }
}

export function fromMillimetres(value: number, unit: SizeUnit): number {
  switch (unit) {
    case "mm":
      return Math.round(value * 100) / 100;
    case "cm":
      return Math.round((value / 10) * 100) / 100;
    case "inch":
      return Math.round((value / 25.4) * 100) / 100;
    case "pt":
      return Math.round((value / 0.352778) * 100) / 100;
  }
}

export function formatSize(value: number, unit: SizeUnit): string {
  return `${fromMillimetres(value, unit)} ${unit}`;
}

function fitCount(available: number, item: number, gap: number): number {
  if (available <= 0 || item <= 0) return 0;
  return Math.max(0, Math.floor((available + gap) / (item + gap)));
}

export function calculateLabelLayout(input: LabelLayoutInput): LabelLayoutResult {
  const pageWidthMm = toMillimetres(input.pageWidth, input.unit);
  const pageHeightMm = toMillimetres(input.pageHeight, input.unit);
  const labelWidthMm = toMillimetres(input.labelWidth, input.unit);
  const labelHeightMm = toMillimetres(input.labelHeight, input.unit);
  const gapMm = toMillimetres(input.gap, input.unit);
  const marginMm = toMillimetres(input.margin, input.unit);
  const totalLabels = Math.max(0, input.totalLabels || 0);

  const usableWidth = pageWidthMm - marginMm * 2;
  const usableHeight = pageHeightMm - marginMm * 2;

  const cols = fitCount(usableWidth, labelWidthMm, gapMm);
  const rows = fitCount(usableHeight, labelHeightMm, gapMm);
  const labelsPerPage = cols * rows;

  let message = "";
  let fits = labelsPerPage > 0;

  if (labelWidthMm <= 0 || labelHeightMm <= 0) {
    message = "Enter valid label width and height.";
    fits = false;
  } else if (pageWidthMm <= 0 || pageHeightMm <= 0) {
    message = "Enter valid page width and height.";
    fits = false;
  } else if (labelWidthMm > usableWidth || labelHeightMm > usableHeight) {
    message = "Label is larger than the printable area on this sheet.";
    fits = false;
  } else if (labelsPerPage === 0) {
    message = "No labels fit on this sheet with the current sizes.";
    fits = false;
  } else if (totalLabels === 0) {
    message = `${labelsPerPage} label(s) fit per sheet. Enter total quantity to calculate sheets needed.`;
  } else {
    message = `${labelsPerPage} label(s) per sheet × ${Math.ceil(totalLabels / labelsPerPage)} sheet(s) for ${totalLabels} labels.`;
  }

  const pagesNeeded =
    fits && totalLabels > 0 ? Math.ceil(totalLabels / labelsPerPage) : 0;

  return {
    pageWidthMm,
    pageHeightMm,
    labelWidthMm,
    labelHeightMm,
    gapMm,
    marginMm,
    cols,
    rows,
    labelsPerPage,
    pagesNeeded,
    totalLabels,
    unit: input.unit,
    fits,
    message,
  };
}

export function serializeLabelLayout(input: LabelLayoutInput, result: LabelLayoutResult): string {
  return JSON.stringify({
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
}

export function formatLabelLayoutSummary(json: string): string | null {
  try {
    const d = JSON.parse(json);
    return `${d.label.w}×${d.label.h} ${d.unit} label on ${d.page.w}×${d.page.h} ${d.unit} sheet — ${d.labelsPerPage}/sheet, ${d.pagesNeeded} sheet(s) for ${d.totalLabels} labels`;
  } catch {
    return null;
  }
}
