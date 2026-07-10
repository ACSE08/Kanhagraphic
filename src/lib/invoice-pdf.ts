// Invoice PDF generator — matches the Kanha Graphic Tax Invoice format
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
}

// Convert number to words (Indian numbering)
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

// Generate a sequential invoice number from order number
function buildInvoiceNo(orderNumber: string, date: Date): string {
  // Format: KG/YYYY-YY/seq  e.g. KG/2026-27/17
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
  return productName ? `${productName} - ${base}` : base;
}

export async function generateInvoicePDF(
  orders: InvoiceOrder[],
  customer: InvoiceCustomer
): Promise<void> {
  // Dynamic import — jsPDF is client-side only
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc: JsPDFType = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW = 210;
  const marginL = 10;
  const marginR = 10;
  const contentW = pageW - marginL - marginR;
  const firstOrder = orders[0];
  const orderDate = typeof firstOrder.createdAt === "string"
    ? new Date(firstOrder.createdAt)
    : firstOrder.createdAt;
  const invoiceNo = buildInvoiceNo(firstOrder.orderNumber, orderDate);

  // ── HEADER ────────────────────────────────────────────────────────────────
  // Left block: company info
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(180, 180, 180);
  doc.rect(marginL, 8, contentW, 28, "S");

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("KANHA GRAPHIC", marginL + 38, 14);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("D-100 INDUSTRIAL SOCIETY , NEW SAMA ROAD", marginL + 2, 22);
  doc.text("VADODARA - 390 024", marginL + 2, 27);
  doc.text(`PAN NO      DFRPS6567D`, marginL + 2, 32);
  doc.text(`GST NO`, marginL + 2, 36);

  // Title — Tax Invoice
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Tax Invoice", marginL + 100, 14, { align: "center" });

  // Right block: invoice no / date
  const rightX = marginL + contentW / 2 + 2;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  // Header right table — invoice no, date, delivery note, payment mode
  doc.text("Invoice No.", rightX, 13);
  doc.text(invoiceNo, rightX + 30, 13);
  doc.text("Date", rightX + 65, 13);
  doc.text(formatDate(orderDate), rightX + 80, 13);

  doc.setLineWidth(0.2);
  doc.line(rightX, 15, marginL + contentW, 15);

  doc.text("Delivery Note", rightX, 20);
  doc.text("Mode/Terms of Payment", rightX + 40, 20);
  doc.line(rightX, 22, marginL + contentW, 22);

  doc.text("NEFT", rightX + 40, 27);
  doc.text("RTGS", rightX + 52, 27);
  doc.text("CASH", rightX + 64, 27);
  doc.text("CHQ", rightX + 76, 27);

  doc.line(rightX, 29, marginL + contentW, 29);
  doc.text("Reference No. & Date.", rightX, 34);
  doc.text("Other References", rightX + 40, 34);

  // ── BILLING TO ────────────────────────────────────────────────────────────
  let y = 40;
  doc.setDrawColor(180, 180, 180);
  doc.rect(marginL, y, contentW / 2 - 2, 36, "S");
  doc.rect(marginL + contentW / 2, y, contentW / 2, 36, "S");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("BILLING TO", marginL + 2, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(customer.name.toUpperCase(), marginL + 2, y + 11);
  doc.setFontSize(8);
  if (customer.email) doc.text(customer.email, marginL + 2, y + 16);
  if (customer.phone) doc.text(customer.phone, marginL + 2, y + 21);
  doc.text("GST NO", marginL + 2, y + 28);
  doc.text("State Name", marginL + 2, y + 33);
  doc.text("PAN NO", marginL + 2, y + 38);

  // Right side of billing block
  const bRx = marginL + contentW / 2 + 2;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Buyer's Order No.", bRx, y + 5);
  doc.text("Dated", bRx + 40, y + 5);
  doc.line(bRx, y + 8, marginL + contentW, y + 8);
  doc.text("Dispatch Documents No.", bRx, y + 14);
  doc.text("Delivery Note Date", bRx + 40, y + 14);
  doc.line(bRx, y + 17, marginL + contentW, y + 17);
  doc.text("Dispatched through", bRx, y + 23);
  doc.text("Destination", bRx + 40, y + 23);
  doc.line(bRx, y + 26, marginL + contentW, y + 26);

  // ── ITEMS TABLE ───────────────────────────────────────────────────────────
  y = 80;
  const tableBody = orders.map((order, idx) => [
    String(idx + 1).padStart(2, "0"),
    serviceLabel(order.serviceType, order.productName),
    "",  // HSN/SAC
    String(order.quantity),
    order.unitPrice ? `${order.unitPrice.toFixed(2)}` : "-",
    "Nos.",
    order.subtotal.toFixed(2),
  ]);

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
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold", lineColor: [180, 180, 180] },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      1: { halign: "left", cellWidth: 75 },
      2: { halign: "center", cellWidth: 18 },
      3: { halign: "center", cellWidth: 18 },
      4: { halign: "right", cellWidth: 18 },
      5: { halign: "center", cellWidth: 12 },
      6: { halign: "right", cellWidth: 19 },
    },
    margin: { left: marginL, right: marginR },
    didParseCell: () => {},
  });

  // ── TOTALS ────────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable.finalY + 2;

  const totalSubtotal = orders.reduce((s, o) => s + o.subtotal, 0);
  const totalGst = orders.reduce((s, o) => s + o.gst, 0);
  const totalAmount = orders.reduce((s, o) => s + o.total, 0);

  // TOTAL row
  autoTable(doc, {
    startY: finalY,
    body: [
      [{ content: "TOTAL", colSpan: 6, styles: { halign: "right", fontStyle: "bold", fontSize: 9 } },
       { content: totalSubtotal.toFixed(2), styles: { halign: "right", fontStyle: "bold", fontSize: 9 } }],
    ],
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 10 }, 1: { cellWidth: 75 }, 2: { cellWidth: 18 },
      3: { cellWidth: 18 }, 4: { cellWidth: 18 }, 5: { cellWidth: 12 },
      6: { cellWidth: 19, halign: "right" },
    },
    margin: { left: marginL, right: marginR },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const afterTotal = (doc as any).lastAutoTable.finalY + 1;

  // NET TOTAL row
  autoTable(doc, {
    startY: afterTotal,
    body: [
      [{ content: "NET TOTAL", colSpan: 6, styles: { halign: "center", fontStyle: "bold", fontSize: 9 } },
       { content: `Rs ${totalAmount.toFixed(2)}`, styles: { halign: "right", fontStyle: "bold", fontSize: 9 } }],
    ],
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 10 }, 1: { cellWidth: 75 }, 2: { cellWidth: 18 },
      3: { cellWidth: 18 }, 4: { cellWidth: 18 }, 5: { cellWidth: 12 },
      6: { cellWidth: 19, halign: "right" },
    },
    margin: { left: marginL, right: marginR },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fy = (doc as any).lastAutoTable.finalY + 3;

  // Amount in words
  doc.setDrawColor(180, 180, 180);
  doc.rect(marginL, fy, contentW, 8, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("AMOUNT CHARGABLE IN WORDS", marginL + 2, fy + 3.5);
  doc.setFont("helvetica", "normal");
  doc.text(numberToWords(totalAmount), marginL + 2, fy + 7);
  fy += 10;

  // ── BOTTOM SECTION: Bank Details + GST table ──────────────────────────────
  const cgst = totalGst / 2;
  const sgst = totalGst / 2;
  const leftW = contentW * 0.45;
  const rightW = contentW - leftW;

  // Bank Details box
  doc.setDrawColor(180, 180, 180);
  doc.rect(marginL, fy, leftW, 36, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Bank Details", marginL + 2, fy + 5);
  doc.setFont("helvetica", "normal");
  doc.text("Bank Name : ICICI Bank", marginL + 2, fy + 10);
  doc.text("Account No. : 763305500096", marginL + 2, fy + 15);
  doc.text("IFSC Code : ICIC0007633", marginL + 2, fy + 20);
  doc.text("Branch Code/Name : 7633/Sama Branch", marginL + 2, fy + 25);

  // GST table (right side)
  const gx = marginL + leftW;
  doc.rect(gx, fy, rightW, 36, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("TAXABLE", gx + 4, fy + 4);
  doc.text("AMOUNT", gx + 4, fy + 8);
  doc.line(gx + 22, fy, gx + 22, fy + 36);
  // GST sub-columns
  const gstW = (rightW - 22) / 2;
  doc.text("GST", gx + 22 + gstW / 2, fy + 4, { align: "center" });
  doc.line(gx + 22, fy + 9, gx + rightW, fy + 9);
  doc.text("CGST", gx + 24, fy + 13);
  doc.text("AMOUNT", gx + 30, fy + 13);
  doc.line(gx + 22 + gstW, fy, gx + 22 + gstW, fy + 36);
  doc.text("SGST", gx + 22 + gstW + 2, fy + 13);
  doc.text("AMOUNT", gx + 22 + gstW + 8, fy + 13);
  doc.line(gx + 22, fy + 15, gx + rightW, fy + 15);
  doc.setFont("helvetica", "normal");
  doc.text(totalSubtotal.toFixed(2), gx + 2, fy + 21);
  doc.text(cgst.toFixed(2), gx + 26, fy + 21);
  doc.text(sgst.toFixed(2), gx + 22 + gstW + 4, fy + 21);
  doc.line(gx + 22, fy + 23, gx + rightW, fy + 23);
  doc.text(totalSubtotal.toFixed(2), gx + 2, fy + 27);
  // Total amount right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(`\u20B9 ${totalAmount.toFixed(2)}`, gx + rightW - 2, fy + 27, { align: "right" });

  // TOTAL AMOUNT label
  doc.text("TOTAL AMOUNT", gx + rightW - 2, fy + 5, { align: "right" });

  fy += 38;

  // ── TERMS + DECLARATION + SIGNATURE ──────────────────────────────────────
  const termsW = leftW;
  const sigW = rightW;

  doc.setDrawColor(180, 180, 180);
  doc.rect(marginL, fy, termsW, 42, "S");
  doc.rect(marginL + termsW, fy, sigW, 42, "S");

  // Terms and Conditions
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("Terms and Conditions :", marginL + 2, fy + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("1) Any Problem in to be made in writing/mail within 2 days.", marginL + 2, fy + 10);
  doc.text("2) Payment within 7 days.", marginL + 2, fy + 15);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("Declaration :", marginL + 2, fy + 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const declaration = doc.splitTextToSize(
    "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
    termsW - 4
  );
  doc.text(declaration, marginL + 2, fy + 27);

  // Tax amount in words (right side)
  const sx = marginL + termsW + 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("TAX AMOUNT (IN WORDS)", sx, fy + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const taxWords = doc.splitTextToSize(numberToWords(totalGst), sigW - 4);
  doc.text(taxWords, sx, fy + 10);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("for. KANHA GRAPHIC (PROPRIETOR)", sx, fy + 22);

  // Signature area
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Authorised Signatory", marginL + termsW + sigW - 2, fy + 38, { align: "right" });

  // ── SAVE ──────────────────────────────────────────────────────────────────
  const filename = orders.length === 1
    ? `Invoice-${orders[0].orderNumber}.pdf`
    : `Invoice-Batch-${orders[0].batchNumber ?? orders[0].orderNumber}.pdf`;

  doc.save(filename);
}
