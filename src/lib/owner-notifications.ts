import nodemailer from "nodemailer";
import { SITE } from "@/lib/constants";

function envFirst(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }
  }
  return undefined;
}

const SMTP_HOST = () => envFirst("SMTP_HOST", "EMAIL_HOST", "MAIL_HOST");
const SMTP_PORT = () => envFirst("SMTP_PORT", "EMAIL_PORT", "MAIL_PORT") || "587";
const SMTP_SECURE = () => envFirst("SMTP_SECURE", "EMAIL_SECURE", "MAIL_SECURE");
const SMTP_USER = () => envFirst("SMTP_USER", "EMAIL_USER", "MAIL_USER");
const SMTP_PASS = () => envFirst("SMTP_PASS", "EMAIL_PASS", "MAIL_PASS");
const SMTP_FROM = () => envFirst("SMTP_FROM", "EMAIL_FROM", "MAIL_FROM");
const ADMIN_WEBHOOK_URL = () =>
  envFirst("ADMIN_WEBHOOK_URL", "OWNER_WEBHOOK_URL", "NOTIFY_WEBHOOK_URL");

type OrderAlertInput = {
  orderNumber: string;
  batchNumber?: string | null;
  serviceType: string;
  productName?: string | null;
  quantity: number;
  subtotal: number;
  gst: number;
  total: number;
  status: string;
  fileName?: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
};

type BatchAlertInput = {
  batchNumber: string;
  itemCount: number;
  subtotal: number;
  gst: number;
  total: number;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  orders: Array<{
    orderNumber: string;
    serviceType: string;
    productName?: string | null;
    quantity: number;
    total: number;
    status: string;
  }>;
};

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function notificationsEnabled() {
  const value = process.env.NOTIFY_OWNER_ON_NEW_ORDER?.toLowerCase();
  if (!value) return true;
  return value !== "false" && value !== "0" && value !== "off";
}

function ownerEmailAddress() {
  return process.env.OWNER_NOTIFICATION_EMAIL || SITE.email;
}

function hasSmtpConfig() {
  return Boolean(SMTP_HOST() && SMTP_USER() && SMTP_PASS());
}

function missingSmtpKeys() {
  const missing: string[] = [];
  if (!SMTP_HOST()) missing.push("SMTP_HOST");
  if (!SMTP_USER()) missing.push("SMTP_USER");
  if (!SMTP_PASS()) missing.push("SMTP_PASS");
  return missing;
}

function createSmtpTransporter() {
  const port = Number(SMTP_PORT() || 587);
  const secureFlag = SMTP_SECURE()?.toLowerCase();
  const secure =
    secureFlag === "true" ||
    (secureFlag !== "false" && secureFlag !== "0" && port === 465);

  return nodemailer.createTransport({
    host: SMTP_HOST(),
    port,
    secure,
    auth: {
      user: SMTP_USER(),
      pass: SMTP_PASS(),
    },
  });
}

async function sendOrderEmail(input: OrderAlertInput) {
  const to = ownerEmailAddress();
  const transporter = createSmtpTransporter();
  const from = SMTP_FROM() || SMTP_USER() || to;
  const subject = `New Order ${input.orderNumber} (${input.customer.name})`;

  const text = [
    "New customer order received.",
    "",
    `Order Number: ${input.orderNumber}`,
    `Batch Number: ${input.batchNumber || "-"}`,
    `Service: ${input.serviceType}`,
    `Product: ${input.productName || "-"}`,
    `Quantity: ${input.quantity}`,
    `Subtotal: ${formatINR(input.subtotal)}`,
    `GST: ${formatINR(input.gst)}`,
    `Total: ${formatINR(input.total)}`,
    `Status: ${input.status}`,
    `Design File: ${input.fileName || "Not uploaded"}`,
    "",
    `Customer Name: ${input.customer.name}`,
    `Customer Email: ${input.customer.email}`,
    `Customer Phone: ${input.customer.phone || "-"}`,
  ].join("\n");

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });
}

async function sendBatchEmail(input: BatchAlertInput) {
  const to = ownerEmailAddress();
  const transporter = createSmtpTransporter();
  const from = SMTP_FROM() || SMTP_USER() || to;
  const subject = `New Checkout Batch ${input.batchNumber} (${input.itemCount} items)`;

  const orderLines = input.orders
    .map(
      (o, i) =>
        `${i + 1}. ${o.orderNumber} | ${o.serviceType} | ${o.productName || "-"} | Qty ${o.quantity} | ${formatINR(o.total)} | ${o.status}`
    )
    .join("\n");

  const text = [
    "New multi-item checkout received.",
    "",
    `Batch Number: ${input.batchNumber}`,
    `Items: ${input.itemCount}`,
    `Subtotal: ${formatINR(input.subtotal)}`,
    `GST: ${formatINR(input.gst)}`,
    `Total: ${formatINR(input.total)}`,
    "",
    `Customer Name: ${input.customer.name}`,
    `Customer Email: ${input.customer.email}`,
    `Customer Phone: ${input.customer.phone || "-"}`,
    "",
    "Orders:",
    orderLines,
  ].join("\n");

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });
}

async function sendWebhook(event: "new_order" | "new_batch", payload: unknown) {
  const url = ADMIN_WEBHOOK_URL();
  if (!url) return;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, payload, sentAt: new Date().toISOString() }),
  });
}

export async function notifyOwnerOrderPlacedSafely(input: OrderAlertInput) {
  if (!notificationsEnabled()) return;

  const tasks: Array<Promise<unknown>> = [];
  if (hasSmtpConfig()) {
    tasks.push(sendOrderEmail(input));
  }
  if (ADMIN_WEBHOOK_URL()) {
    tasks.push(sendWebhook("new_order", input));
  }

  if (tasks.length === 0) {
    const missing = missingSmtpKeys();
    console.warn(
      `Owner notifications are enabled but no provider is configured. Missing SMTP keys: ${
        missing.length ? missing.join(", ") : "none"
      }. Configure SMTP_* (or EMAIL_*/MAIL_*) or ADMIN_WEBHOOK_URL.`
    );
    return;
  }

  const settled = await Promise.allSettled(tasks);
  for (const result of settled) {
    if (result.status === "rejected") {
      console.error("Owner notification failed:", result.reason);
    }
  }
}

export async function notifyOwnerBatchPlacedSafely(input: BatchAlertInput) {
  if (!notificationsEnabled()) return;

  const tasks: Array<Promise<unknown>> = [];
  if (hasSmtpConfig()) {
    tasks.push(sendBatchEmail(input));
  }
  if (ADMIN_WEBHOOK_URL()) {
    tasks.push(sendWebhook("new_batch", input));
  }

  if (tasks.length === 0) {
    const missing = missingSmtpKeys();
    console.warn(
      `Owner notifications are enabled but no provider is configured. Missing SMTP keys: ${
        missing.length ? missing.join(", ") : "none"
      }. Configure SMTP_* (or EMAIL_*/MAIL_*) or ADMIN_WEBHOOK_URL.`
    );
    return;
  }

  const settled = await Promise.allSettled(tasks);
  for (const result of settled) {
    if (result.status === "rejected") {
      console.error("Owner notification failed:", result.reason);
    }
  }
}