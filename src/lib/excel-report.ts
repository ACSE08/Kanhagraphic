import path from "path";

// On Vercel the filesystem is read-only — detect and skip all writes gracefully.
const IS_READONLY_FS =
  process.env.VERCEL === "1" ||
  process.env.VERCEL_ENV !== undefined ||
  process.env.NODE_ENV === "production";

const WORKBOOK_PATH = path.join(process.cwd(), "Orders & Clients.xls");
const DEFAULT_SHEET_NAME = "Orders & Clients";

const HEADER_ROW = [
  "event_type", "event_time", "user_id", "name", "email", "phone",
  "ip_address", "user_agent", "order_number", "batch_number",
  "service_type", "product_name", "quantity", "subtotal", "gst",
  "total", "status", "notes", "file_name", "label_layout",
];

type WorkbookBaseEvent = {
  eventType: "signup" | "login" | "order";
  eventTime: Date;
  userId: string;
  name: string;
  email: string;
  phone?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

type WorkbookOrderEvent = WorkbookBaseEvent & {
  eventType: "order";
  orderNumber: string;
  batchNumber?: string | null;
  serviceType: string;
  productName?: string | null;
  quantity: number;
  subtotal: number;
  gst: number;
  total: number;
  status: string;
  notes?: string | null;
  fileName?: string | null;
  labelLayout?: string | null;
};

type WorkbookSessionEvent = WorkbookBaseEvent & {
  eventType: "signup" | "login";
};

export type WorkbookEvent = WorkbookOrderEvent | WorkbookSessionEvent;

let workbookWriteQueue = Promise.resolve();

function toRow(event: WorkbookEvent) {
  return [
    event.eventType,
    event.eventTime.toISOString(),
    event.userId,
    event.name,
    event.email,
    event.phone || "",
    event.ipAddress || "",
    event.userAgent || "",
    event.eventType === "order" ? event.orderNumber : "",
    event.eventType === "order" ? event.batchNumber || "" : "",
    event.eventType === "order" ? event.serviceType : "",
    event.eventType === "order" ? event.productName || "" : "",
    event.eventType === "order" ? event.quantity : "",
    event.eventType === "order" ? event.subtotal : "",
    event.eventType === "order" ? event.gst : "",
    event.eventType === "order" ? event.total : "",
    event.eventType === "order" ? event.status : "",
    event.eventType === "order" ? event.notes || "" : "",
    event.eventType === "order" ? event.fileName || "" : "",
    event.eventType === "order" ? event.labelLayout || "" : "",
  ];
}

async function appendWorkbookEventInternal(event: WorkbookEvent) {
  // Skip filesystem writes on Vercel / read-only environments
  if (IS_READONLY_FS) {
    console.log("[excel-report] skipped (read-only env):", event.eventType, event.email);
    return;
  }

  // Dynamically import fs and xlsx only in local/writable environments
  const [{ existsSync }, XLSX] = await Promise.all([
    import("fs"),
    import("xlsx"),
  ]);

  let workbook: ReturnType<typeof XLSX.utils.book_new>;

  if (!existsSync(WORKBOOK_PATH)) {
    workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet([HEADER_ROW]);
    XLSX.utils.book_append_sheet(workbook, sheet, DEFAULT_SHEET_NAME);
  } else {
    workbook = XLSX.readFile(WORKBOOK_PATH, { cellDates: true });
    if (workbook.SheetNames.length === 0) {
      const sheet = XLSX.utils.aoa_to_sheet([HEADER_ROW]);
      XLSX.utils.book_append_sheet(workbook, sheet, DEFAULT_SHEET_NAME);
    }
  }

  const sheetName = workbook.SheetNames[0] || DEFAULT_SHEET_NAME;
  const currentSheet = workbook.Sheets[sheetName] || XLSX.utils.aoa_to_sheet([HEADER_ROW]);
  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(currentSheet, { header: 1 });
  if (rows.length === 0) rows.push(HEADER_ROW);
  rows.push(toRow(event));
  workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(rows);
  if (!workbook.SheetNames.includes(sheetName)) workbook.SheetNames.push(sheetName);
  XLSX.writeFile(workbook, WORKBOOK_PATH, { bookType: "xls" });
}

export function appendWorkbookEvent(event: WorkbookEvent) {
  workbookWriteQueue = workbookWriteQueue
    .catch(() => undefined)
    .then(() => appendWorkbookEventInternal(event));
  return workbookWriteQueue;
}

export async function appendWorkbookEventSafely(event: WorkbookEvent) {
  try {
    await appendWorkbookEvent(event);
    return { ok: true as const };
  } catch (error) {
    console.error("[excel-report] write failed (non-fatal):", error);
    return { ok: false as const };
  }
}
