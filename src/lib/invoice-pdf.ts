// Invoice PDF generator — matches the Kanha Graphic Tax Invoice format exactly
// Runs client-side only (jsPDF)

import type { jsPDF as JsPDFType } from "jspdf";

export interface InvoiceOrder {
  id: string;
  orderNumber: string;
  batchNumber?: string | null;
  serviceType: string;
  productName?: string | null;
  quantity: number;
  unitPrice?: number | null;
  subtotal: number;
  gst: number;
  total: number;
  notes?: string | null;
  createdAt: Date | string;
}

export interface InvoiceCustomer {
  name: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  address?: string | null;
  gstNumber?: string | null;
}

// ── helpers ───────────────────────────────────────────────────────────────────

function numberToWords(amount: number): string {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (amount === 0) return "Zero";

  function convert(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
    if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
    return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
  }

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let result = convert(rupees) + " Rupees";
  if (paise > 0) result += " and " + convert(paise) + " Paise";
  return result + " only";
}

function buildInvoiceNo(orderNumber: string, date: Date): string {
  const year = date.getFullYear();
  const nextYear = (year + 1).toString().slice(2);
  const seq = orderNumber.split("-").pop() ?? "1";
  return `KG/${year}-${nextYear}/${seq}`;
}

function formatDate(d: Date | string): string {
  const dt = typeof d === "string" ? new Date(d) : d;
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yyyy = dt.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function serviceLabel(serviceType: string, productName?: string | null): string {
  const map: Record<string, string> = {
    "blister-strips-sachet": "Blister / Strip / Sachet Printing",
    "carton-printing": "Carton Printing",
    "label-printing": "Label Sheet Printing",
    "insert-printing": "Insert Printing",
  };
  const base = map[serviceType] ?? serviceType;
  return productName
    ? `${productName.toUpperCase()} - ${base.toUpperCase()}`
    : base.toUpperCase();
}

// Load image as base64 dataURL via fetch (avoids canvas CORS issues)
async function loadImageAsDataURL(src: string): Promise<string> {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Failed to load image: ${src}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ── public API ────────────────────────────────────────────────────────────────

export async function generateInvoicePDF(
  orders: InvoiceOrder[],
  customer: InvoiceCustomer
): Promise<void> {
  const doc = await buildInvoiceDoc(orders, customer);
  const filename =
    orders.length === 1
      ? `Invoice-${orders[0].orderNumber}.pdf`
      : `Invoice-Batch-${orders[0].batchNumber ?? orders[0].orderNumber}.pdf`;
  doc.save(filename);
}

// Returns PDF as a Blob — used for preview modal
export async function generateInvoiceBlob(
  orders: InvoiceOrder[],
  customer: InvoiceCustomer
): Promise<{ blob: Blob; filename: string }> {
  const doc = await buildInvoiceDoc(orders, customer);
  const filename =
    orders.length === 1
      ? `Invoice-${orders[0].orderNumber}.pdf`
      : `Invoice-Batch-${orders[0].batchNumber ?? orders[0].orderNumber}.pdf`;
  const blob = doc.output("blob") as Blob;
  return { blob, filename };
}

// ── builder ───────────────────────────────────────────────────────────────────

async function buildInvoiceDoc(
  orders: InvoiceOrder[],
  customer: InvoiceCustomer
): Promise<JsPDFType> {
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc: JsPDFType = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const ML = 8;
  const MR = 8;
  const CW = 210 - ML - MR; // 194 mm

  const firstOrder = orders[0];
  const orderDate =
    typeof firstOrder.createdAt === "string"
      ? new Date(firstOrder.createdAt)
      : firstOrder.createdAt;
  const invoiceNo = buildInvoiceNo(firstOrder.orderNumber, orderDate);

  // ── HEADER ────────────────────────────────────────────────────────────────
  const hY = 8;
  const hH = 30;
  const leftW = 70;
  const rightW = CW - leftW;

  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.3);
  doc.rect(ML, hY, CW, hH, "S");
  doc.line(ML + leftW, hY, ML + leftW, hY + hH);

  // Logo
  try {
    const logoData = await loadImageAsDataURL("/icons/kg-logo-main.jpeg");
    doc.addImage(logoData, "JPEG", ML + 1, hY + 2, 28, 18);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("KANHA", ML + 2, hY + 10);
    doc.setFontSize(9);
    doc.text("Graphic", ML + 2, hY + 15);
  }

  // Company info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("KANHA GRAPHIC", ML + 31, hY + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("D-100 INDUSTRIAL SOCIETY , NEW SAMA ROAD", ML + 31, hY + 12);
  doc.text("VADODARA - 390 024", ML + 31, hY + 16);
  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(0.2);
  doc.line(ML + 1, hY + 20, ML + leftW - 1, hY + 20);
  doc.setFontSize(7);
  doc.text("PAN NO", ML + 2, hY + 24);
  doc.setFont("helvetica", "bold");
  doc.text("DFRPS6567D", ML + 18, hY + 24);
  doc.setFont("helvetica", "normal");
  doc.text("GST NO", ML + 2, hY + 28.5);

  // Right header — Tax Invoice title + meta grid
  const rx = ML + leftW;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Tax Invoice", rx + rightW / 2, hY + 8, { align: "center" });

  doc.setLineWidth(0.2);
  doc.setDrawColor(120, 120, 120);

  const r1Y = hY + 11;
  doc.line(rx, r1Y, rx + rightW, r1Y);
  doc.line(rx + rightW * 0.45, r1Y, rx + rightW * 0.45, hY + hH);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Invoice No.", rx + 1.5, r1Y + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text(invoiceNo, rx + 1.5, r1Y + 7.5);
  doc.setFont("helvetica", "normal");
  doc.text("Date", rx + rightW * 0.45 + 1.5, r1Y + 3.5);
  doc.setFont("helvetica", "bold");
  doc.text(formatDate(orderDate), rx + rightW * 0.45 + 1.5, r1Y + 7.5);

  const r2Y = r1Y + 10;
  doc.line(rx, r2Y, rx + rightW, r2Y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Delivery Note", rx + 1.5, r2Y + 3.5);
  doc.text("Mode/Terms of Payment", rx + rightW * 0.45 + 1.5, r2Y + 3.5);

  const r3Y = r2Y + 6;
  doc.line(rx, r3Y, rx + rightW, r3Y);
  const payX = rx + rightW * 0.45 + 1.5;
  ["NEFT", "RTGS", "CASH", "CHQ"].forEach((lbl, i) => {
    doc.rect(payX + i * 14, r3Y + 1, 12, 4, "S");
    doc.setFontSize(6.5);
    doc.text(lbl, payX + i * 14 + 6, r3Y + 4, { align: "center" });
  });

  const r4Y = r3Y + 6;
  doc.line(rx, r4Y, rx + rightW, r4Y);
  doc.setFontSize(7);
  doc.text("Reference No. & Date.", rx + 1.5, r4Y + 3.5);
  doc.text("Other References", rx + rightW * 0.45 + 1.5, r4Y + 3.5);

  // ── BILLING TO ────────────────────────────────────────────────────────────
  let y = hY + hH;
  const billingH = 52;
  const bLeftW = leftW;
  const bRightW = CW - bLeftW;

  doc.setLineWidth(0.3);
  doc.setDrawColor(80, 80, 80);
  doc.rect(ML, y, CW, billingH, "S");
  doc.line(ML + bLeftW, y, ML + bLeftW, y + billingH);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("BILLING TO", ML + 1.5, y + 5);
  doc.setLineWidth(0.2);
  doc.setDrawColor(120, 120, 120);
  doc.line(ML, y + 7, ML + bLeftW, y + 7);

  let byOff = y + 12;
  if (customer.companyName) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(customer.companyName.toUpperCase(), ML + 1.5, byOff);
    byOff += 5;
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(customer.name, ML + 1.5, byOff);
  byOff += 4.5;
  if (customer.address) {
    const lines = doc.splitTextToSize(customer.address, bLeftW - 4);
    lines.slice(0, 3).forEach((ln: string) => {
      doc.text(ln, ML + 1.5, byOff);
      byOff += 4;
    });
  }
  if (customer.phone) {
    doc.text(customer.phone, ML + 1.5, byOff);
  }

  const bBotY = y + billingH - 18;
  doc.setLineWidth(0.2);
  doc.line(ML, bBotY, ML + bLeftW, bBotY);
  doc.setFontSize(7);
  doc.text("GST NO", ML + 1.5, bBotY + 4);
  doc.setFont("helvetica", "bold");
  doc.text(customer.gstNumber ?? "", ML + 16, bBotY + 4);
  doc.setFont("helvetica", "normal");
  doc.line(ML, bBotY + 6, ML + bLeftW, bBotY + 6);
  doc.text("State Name", ML + 1.5, bBotY + 10);
  doc.line(ML, bBotY + 12, ML + bLeftW, bBotY + 12);
  doc.text("PAN NO", ML + 1.5, bBotY + 16);

  // Right side of billing block
  const brx = ML + bLeftW;
  [
    { label: "Buyer's Order No.", label2: "Dated" },
    { label: "Dispatch Documents No.", label2: "Delivery Note Date" },
    { label: "Dispatched through", label2: "Destination" },
  ].forEach((row, i) => {
    const rowY = y + i * (billingH / 3);
    if (i > 0) doc.line(brx, rowY, ML + CW, rowY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(row.label, brx + 1.5, rowY + 4);
    doc.text(row.label2, brx + bRightW * 0.52 + 1.5, rowY + 4);
    doc.line(brx + bRightW * 0.52, rowY, brx + bRightW * 0.52, rowY + billingH / 3);
  });

  // ── ITEMS TABLE ───────────────────────────────────────────────────────────
  y += billingH;

  const hsnMap: Record<string, string> = {
    "label-printing": "4911",
    "insert-printing": "4901",
    "blister-strips-sachet": "4911",
    "carton-printing": "4819",
  };

  const tableBody = orders.map((order, idx) => [
    String(idx + 1).padStart(2, "0"),
    serviceLabel(order.serviceType, order.productName),
    hsnMap[order.serviceType] ?? "",
    String(order.quantity),
    order.unitPrice ? order.unitPrice.toFixed(2) : "",
    "Nos.",
    order.subtotal.toFixed(2),
  ]);

  while (tableBody.length < 8) tableBody.push(["", "", "", "", "", "", ""]);

  autoTable(doc, {
    startY: y,
    head: [[
      { content: "SR", styles: { halign: "center" } },
      { content: "Description of Goods/Services", styles: { halign: "left" } },
      { content: "HSN/SAC", styles: { halign: "center" } },
      { content: "Quantity", styles: { halign: "center" } },
      { content: "Rate", styles: { halign: "right" } },
      { content: "per", styles: { halign: "center" } },
      { content: "Amount", styles: { halign: "right" } },
    ]],
    body: tableBody,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: { top: 2, bottom: 2, left: 1.5, right: 1.5 }, lineColor: [120, 120, 120] },
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold", lineColor: [120, 120, 120], fontSize: 7.5 },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      1: { halign: "left", cellWidth: 78 },
      2: { halign: "center", cellWidth: 17 },
      3: { halign: "center", cellWidth: 17 },
      4: { halign: "right", cellWidth: 20 },
      5: { halign: "center", cellWidth: 13 },
      6: { halign: "right", cellWidth: 19 },
    },
    margin: { left: ML, right: MR },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY;

  const totalSubtotal = orders.reduce((s, o) => s + o.subtotal, 0);
  const totalGst = orders.reduce((s, o) => s + o.gst, 0);
  const totalAmount = orders.reduce((s, o) => s + o.total, 0);

  // TOTAL row
  autoTable(doc, {
    startY: y,
    body: [[
      { content: "", styles: { cellWidth: 10 } },
      { content: "", styles: { cellWidth: 78 } },
      { content: "", styles: { cellWidth: 17 } },
      { content: "", styles: { cellWidth: 17 } },
      { content: "TOTAL", colSpan: 2, styles: { halign: "right", fontStyle: "bold", fontSize: 8.5 } },
      { content: totalSubtotal.toFixed(2), styles: { halign: "right", fontStyle: "bold", fontSize: 8.5, cellWidth: 19 } },
    ]],
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2, lineColor: [120, 120, 120] },
    margin: { left: ML, right: MR },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY;

  // NET TOTAL row
  autoTable(doc, {
    startY: y,
    body: [[
      { content: "NET TOTAL", colSpan: 6, styles: { halign: "center", fontStyle: "bold", fontSize: 8.5 } },
      { content: `Rs ${totalAmount.toFixed(2)}`, styles: { halign: "right", fontStyle: "bold", fontSize: 8.5, cellWidth: 19 } },
    ]],
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2, lineColor: [120, 120, 120] },
    columnStyles: {
      0: { cellWidth: 10 }, 1: { cellWidth: 78 }, 2: { cellWidth: 17 },
      3: { cellWidth: 17 }, 4: { cellWidth: 20 }, 5: { cellWidth: 13 },
      6: { cellWidth: 19 },
    },
    margin: { left: ML, right: MR },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY;

  // AMOUNT IN WORDS
  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.3);
  const awH = 12;
  doc.rect(ML, y, CW, awH, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("AMOUNT CHARGABLE IN WORDS", ML + 1.5, y + 4.5);
  doc.setFont("helvetica", "normal");
  const amtWords = doc.splitTextToSize(numberToWords(totalAmount), CW - 4);
  doc.text(amtWords[0] ?? "", ML + 1.5, y + 9.5);
  y += awH;

  // ── BANK + GST TABLE ──────────────────────────────────────────────────────
  const bkW = 55;
  const txW = 25;
  const cgstW = 24;
  const sgstW = 24;
  const totW = CW - bkW - txW - cgstW - sgstW;
  const botH = 32;
  const cgst = totalGst / 2;
  const sgst = totalGst / 2;

  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.3);
  doc.rect(ML, y, CW, botH, "S");

  doc.setLineWidth(0.2);
  doc.setDrawColor(120, 120, 120);
  doc.line(ML + bkW, y, ML + bkW, y + botH);
  doc.line(ML + bkW + txW, y, ML + bkW + txW, y + botH);
  doc.line(ML + bkW + txW + cgstW, y, ML + bkW + txW + cgstW, y + botH);
  doc.line(ML + bkW + txW + cgstW + sgstW, y, ML + bkW + txW + cgstW + sgstW, y + botH);
  doc.line(ML + bkW, y + 9, ML + CW, y + 9);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("Bank Details", ML + 1.5, y + 5.5);
  doc.text("TAXABLE", ML + bkW + 1.5, y + 4);
  doc.text("AMOUNT", ML + bkW + 1.5, y + 7.5);
  doc.text("GST", ML + bkW + txW + cgstW, y + 5.5, { align: "center" });
  doc.text("TOTAL AMOUNT", ML + bkW + txW + cgstW + sgstW + totW / 2, y + 5.5, { align: "center" });

  doc.line(ML + bkW + txW, y + 9, ML + bkW + txW + cgstW + sgstW, y + 9);
  doc.line(ML + bkW + txW + cgstW, y + 9, ML + bkW + txW + cgstW, y + botH);
  doc.setFontSize(6.5);
  doc.text("CGST", ML + bkW + txW + 1.5, y + 13);
  doc.text("AMOUNT", ML + bkW + txW + 1.5, y + 16.5);
  doc.text("SGST", ML + bkW + txW + cgstW + 1.5, y + 13);
  doc.text("AMOUNT", ML + bkW + txW + cgstW + 1.5, y + 16.5);
  doc.line(ML + bkW, y + 18, ML + CW, y + 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("Bank Name : ICICI Bank", ML + 1.5, y + 13.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(totalSubtotal.toFixed(2), ML + bkW + txW - 1.5, y + 25, { align: "right" });
  doc.text(cgst.toFixed(2), ML + bkW + txW + cgstW - 1.5, y + 25, { align: "right" });
  doc.text(sgst.toFixed(2), ML + bkW + txW + cgstW + sgstW - 1.5, y + 25, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(`\u20B9 ${totalAmount.toFixed(2)}`, ML + CW - 1.5, y + 25, { align: "right" });

  y += botH;

  // ── FOOTER: bank account + terms + signature ──────────────────────────────
  const ftH = 44;
  const termW = bkW + txW;
  const sigW = CW - termW;

  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.3);
  doc.rect(ML, y, CW, ftH, "S");
  doc.line(ML + termW, y, ML + termW, y + ftH);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Account No. : 763305500096", ML + 1.5, y + 5);
  doc.text("IFSC Code : ICIC0007633", ML + 1.5, y + 9.5);
  doc.text("Branch Code/Name : 7633/Sama Branch", ML + 1.5, y + 14);

  doc.setLineWidth(0.2);
  doc.setDrawColor(120, 120, 120);
  doc.line(ML, y + 17, ML + termW, y + 17);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("Terms and Conditions :", ML + 1.5, y + 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("1) Any Problem in to be made in writing/mail within 2 days.", ML + 1.5, y + 27);
  doc.text("2) Payment within 7 days.", ML + 1.5, y + 31.5);

  doc.line(ML, y + 34, ML + termW, y + 34);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("Declaration :", ML + 1.5, y + 38.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  const declaration = doc.splitTextToSize(
    "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
    termW - 4
  );
  doc.text(declaration, ML + 1.5, y + 42.5);

  const sigX = ML + termW;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("TAX AMOUNT (IN WORDS)", sigX + 1.5, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const taxWords = doc.splitTextToSize(numberToWords(totalGst), sigW - 4);
  doc.text(taxWords.slice(0, 2), sigX + 1.5, y + 10);

  doc.setLineWidth(0.2);
  doc.line(sigX, y + 20, ML + CW, y + 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("for. KANHA GRAPHIC (PROPRIETOR)", sigX + 1.5, y + 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Authorised Signatory", ML + CW - 1.5, y + ftH - 2, { align: "right" });

  return doc;
}
