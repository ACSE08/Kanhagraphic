export type ServiceType =
  | "blister-strips-sachet"
  | "carton-printing"
  | "label-printing"
  | "insert-printing";

export type InsertPrintType = "coloured" | "bw";

export interface ServiceInfo {
  id: ServiceType;
  name: string;
  shortDescription: string;
  category: "printing" | "design";
  hasCalculator: boolean;
  rateLabel: string;
  moq?: number;
  deliveryDays?: string;
}

export const GST_RATE = 0.18;
export const LABEL_SHEET_RATE = 55;
export const INSERT_PRINT_RATES: Record<InsertPrintType, number> = {
  coloured: 12,
  bw: 3,
};

export const SERVICES: ServiceInfo[] = [
  {
    id: "blister-strips-sachet",
    name: "Blister / Strips / Sachet Printing",
    shortDescription:
      "Multicolor pharmaceutical blister, strip & sachet printing with no minimum quantity limit.",
    category: "printing",
    hasCalculator: true,
    rateLabel: "Tier-based pricing (₹1,000 fixed to ₹22 per piece based on quantity)",
    deliveryDays: "2-5 days",
  },
  {
    id: "carton-printing",
    name: "Carton Printing",
    shortDescription:
      "300/350 GSM FBB sheets with UV Gloss & Aqua Matt varnish. Flexible quantities supported.",
    category: "printing",
    hasCalculator: false,
    rateLabel: "1-50: ₹50 each | 51-100: ₹40 each | 101 & above: ₹35 each",
    moq: 10,
    deliveryDays: "2-3 days",
  },
  {
    id: "label-printing",
    name: "Label Sheet Layout Planner",
    shortDescription:
      "Set your label & sheet size in mm, cm or inches — see how many labels fit on one sheet.",
    category: "printing",
    hasCalculator: true,
    rateLabel: `₹${LABEL_SHEET_RATE} per sheet`,
    deliveryDays: "2-3 days",
  },
  {
    id: "insert-printing",
    name: "Insert Printing",
    shortDescription:
      "Pharma insert printing with two options: Coloured and B&W, charged per piece.",
    category: "printing",
    hasCalculator: true,
    rateLabel: "Coloured: ₹12/piece | B&W: ₹3/piece",
    moq: 1,
    deliveryDays: "2-3 days",
  },
];

export interface PriceBreakdown {
  quantity: number;
  unitPrice: number | null;
  subtotal: number;
  gst: number;
  total: number;
  tier: string;
}

export function calculateCartonPrice(quantity: number): PriceBreakdown {
  if (quantity <= 0) {
    return { quantity: 0, unitPrice: null, subtotal: 0, gst: 0, total: 0, tier: "—" };
  }

  let unitPrice = 35;
  let tier = "101 & Above";

  if (quantity <= 50) {
    unitPrice = 50;
    tier = "1 - 50";
  } else if (quantity <= 100) {
    unitPrice = 40;
    tier = "51 - 100";
  }

  const subtotal = quantity * unitPrice;
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;

  return { quantity, unitPrice, subtotal, gst, total, tier };
}

export function calculateBlisterPrice(quantity: number): PriceBreakdown {
  let subtotal: number;
  let unitPrice: number | null = null;
  let tier: string;

  if (quantity <= 0) {
    return { quantity: 0, unitPrice: null, subtotal: 0, gst: 0, total: 0, tier: "—" };
  }

  if (quantity <= 10) {
    subtotal = 1000;
    tier = "01 to 10 nos.";
  } else if (quantity <= 50) {
    subtotal = 1500;
    tier = "11 to 50 nos.";
  } else if (quantity <= 60) {
    unitPrice = 42;
    subtotal = quantity * unitPrice;
    tier = "50 - 60 nos.";
  } else if (quantity <= 80) {
    unitPrice = 40;
    subtotal = quantity * unitPrice;
    tier = "61 - 80 nos.";
  } else if (quantity <= 100) {
    unitPrice = 35;
    subtotal = quantity * unitPrice;
    tier = "81 - 100 nos.";
  } else if (quantity <= 150) {
    unitPrice = 33;
    subtotal = quantity * unitPrice;
    tier = "101 - 150 nos.";
  } else if (quantity <= 200) {
    unitPrice = 30;
    subtotal = quantity * unitPrice;
    tier = "151 - 200 nos.";
  } else if (quantity <= 300) {
    unitPrice = 28;
    subtotal = quantity * unitPrice;
    tier = "201 - 300 nos.";
  } else if (quantity <= 500) {
    unitPrice = 25;
    subtotal = quantity * unitPrice;
    tier = "301 - 500 nos.";
  } else {
    unitPrice = 22;
    subtotal = quantity * unitPrice;
    tier = "501 & Above";
  }

  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;

  return { quantity, unitPrice, subtotal, gst, total, tier };
}

export function calculateInsertPrice(
  quantity: number,
  insertType: InsertPrintType
): PriceBreakdown {
  if (quantity <= 0) {
    return { quantity: 0, unitPrice: null, subtotal: 0, gst: 0, total: 0, tier: "—" };
  }

  const unitPrice = INSERT_PRINT_RATES[insertType];
  const subtotal = quantity * unitPrice;
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + gst;
  const tier = insertType === "coloured" ? "Coloured" : "B&W";

  return { quantity, unitPrice, subtotal, gst, total, tier };
}

export const PRICING_TABLE = [
  { range: "01 to 10 nos.", rate: "₹1,000 (Total)" },
  { range: "11 to 50 nos.", rate: "₹1,500 (Total)" },
  { range: "50 - 60 nos.", rate: "₹42 / nos." },
  { range: "61 - 80 nos.", rate: "₹40 / nos." },
  { range: "81 - 100 nos.", rate: "₹35 / nos." },
  { range: "101 - 150 nos.", rate: "₹33 / nos." },
  { range: "151 - 200 nos.", rate: "₹30 / nos." },
  { range: "201 - 300 nos.", rate: "₹28 / nos." },
  { range: "301 - 500 nos.", rate: "₹25 / nos." },
  { range: "501 & Above", rate: "₹22 / nos." },
];

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderNumber() {
  const date = new Date();
  const prefix = "KG";
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${dateStr}-${random}`;
}

export function generateBatchNumber() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(10000 + Math.random() * 90000);
  return `KG-BATCH-${dateStr}-${random}`;
}

export function getServiceById(id: string) {
  return SERVICES.find((s) => s.id === id);
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Order Placed",
  AWAITING_FILE: "Awaiting Design File",
  PROOF_SENT: "Proof Sent on WhatsApp",
  APPROVED: "Proof Approved",
  IN_PRINTING: "In Printing",
  READY: "Ready for Pickup",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  AWAITING_FILE: "bg-orange-100 text-orange-800",
  PROOF_SENT: "bg-blue-100 text-blue-800",
  APPROVED: "bg-indigo-100 text-indigo-800",
  IN_PRINTING: "bg-purple-100 text-purple-800",
  READY: "bg-teal-100 text-teal-800",
  SHIPPED: "bg-cyan-100 text-cyan-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};
