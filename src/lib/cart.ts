import {
  calculateBlisterPrice,
  calculateCartonPrice,
  calculateInsertPrice,
  GST_RATE,
  LABEL_SHEET_RATE,
  formatINR,
  getServiceById,
  type InsertPrintType,
  type ServiceType,
} from "./pricing";

export interface CartItem {
  id: string;
  serviceType: ServiceType;
  productName: string;
  quantity: number;
  notes: string;
  labelLayout: string | null;
  insertType?: InsertPrintType;
  subtotal: number;
  gst: number;
  total: number;
  unitPrice: number | null;
  addedAt: number;
}

export interface CartItemInput {
  serviceType: ServiceType;
  productName: string;
  quantity: number;
  notes?: string;
  labelLayout?: string | null;
  insertType?: InsertPrintType;
}

const CART_KEY = "kanha_cart";

export function createCartItemId() {
  return `ci_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildCartItem(input: CartItemInput): CartItem | { error: string } {
  const service = getServiceById(input.serviceType);
  if (!service) return { error: "Invalid service" };

  const productName = input.productName.trim();
  let quantity = Math.max(0, input.quantity);
  const labelLayout = input.labelLayout || null;
  const insertType: InsertPrintType = input.insertType === "bw" ? "bw" : "coloured";

  if (input.serviceType === "label-printing") {
    if (!labelLayout) {
      return { error: "Please configure label & page size in the planner first." };
    }
    try {
      const layout = JSON.parse(labelLayout);
      if (!layout.labelsPerPage || layout.labelsPerPage <= 0) {
        return { error: "Label layout is invalid — no labels fit on the page." };
      }
      quantity = layout.totalLabels ?? 0;
      if (quantity <= 0) {
        return { error: "Enter total labels needed (greater than 0) in the planner." };
      }
    } catch {
      return { error: "Invalid label layout data." };
    }
  }

  if (service.moq && quantity < service.moq) {
    return { error: `Minimum order quantity for ${service.name} is ${service.moq}.` };
  }

  if (input.serviceType !== "label-printing" && quantity < 0) {
    return { error: "Quantity cannot be negative." };
  }

  let subtotal = 0;
  let gst = 0;
  let total = 0;
  let unitPrice: number | null = null;

  if (input.serviceType === "blister-strips-sachet") {
    const price = calculateBlisterPrice(quantity);
    subtotal = price.subtotal;
    gst = price.gst;
    total = price.total;
    unitPrice = price.unitPrice;
  } else if (input.serviceType === "carton-printing") {
    const price = calculateCartonPrice(quantity);
    subtotal = price.subtotal;
    gst = price.gst;
    total = price.total;
    unitPrice = price.unitPrice;
  } else if (input.serviceType === "label-printing") {
    try {
      const layout = JSON.parse(labelLayout || "{}");
      const labelsPerSheet = Number(layout.labelsPerPage ?? 0);
      const totalLabelCount = Number(layout.totalLabels ?? quantity ?? 0);
      const sheetsNeeded = Number(
        layout.pagesNeeded ?? (labelsPerSheet > 0 ? Math.ceil(totalLabelCount / labelsPerSheet) : 0)
      );

      if (sheetsNeeded > 0) {
        unitPrice = LABEL_SHEET_RATE;
        subtotal = sheetsNeeded * unitPrice;
        gst = Math.round(subtotal * GST_RATE);
        total = subtotal + gst;
      }
    } catch {
      unitPrice = null;
    }
  } else if (input.serviceType === "insert-printing") {
    const price = calculateInsertPrice(quantity, insertType);
    subtotal = price.subtotal;
    gst = price.gst;
    total = price.total;
    unitPrice = price.unitPrice;
  }

  return {
    id: createCartItemId(),
    serviceType: input.serviceType,
    productName,
    quantity,
    notes: input.notes?.trim() || "",
    labelLayout,
    insertType: input.serviceType === "insert-printing" ? insertType : undefined,
    subtotal,
    gst,
    total,
    unitPrice,
    addedAt: Date.now(),
  };
}

export function getCartTotals(items: CartItem[]) {
  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const gst = items.reduce((s, i) => s + i.gst, 0);
  const total = items.reduce((s, i) => s + i.total, 0);
  const quotedItems = items.filter((i) => i.subtotal === 0).length;
  return { subtotal, gst, total, quotedItems, count: items.length };
}

export function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function getServiceLabel(serviceType: ServiceType) {
  return getServiceById(serviceType)?.name || serviceType;
}

export { formatINR };
