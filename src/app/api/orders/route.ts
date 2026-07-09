import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { appendWorkbookEventSafely } from "@/lib/excel-report";
import { notifyOwnerOrderPlacedSafely } from "@/lib/owner-notifications";
import {
  calculateBlisterPrice,
  calculateCartonPrice,
  calculateInsertPrice,
  GST_RATE,
  LABEL_SHEET_RATE,
  generateOrderNumber,
  getServiceById,
  type InsertPrintType,
} from "@/lib/pricing";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Please login to place an order" }, { status: 401 });
    }

    const formData = await request.formData();
    const serviceType = formData.get("serviceType") as string;
    const productName = ((formData.get("productName") as string) || "").trim();
    let quantity = Math.max(0, parseInt(formData.get("quantity") as string) || 0);
    const notes = (formData.get("notes") as string) || "";
    const insertTypeRaw = (formData.get("insertType") as string) || "";
    const insertType: InsertPrintType = insertTypeRaw === "bw" ? "bw" : "coloured";
    const labelLayout = (formData.get("labelLayout") as string) || null;
    const file = formData.get("file") as File | null;

    const service = getServiceById(serviceType);
    if (!service) {
      return NextResponse.json({ error: "Invalid service type" }, { status: 400 });
    }

    if (service.moq && quantity < service.moq) {
      return NextResponse.json(
        { error: `Minimum order quantity is ${service.moq}` },
        { status: 400 }
      );
    }

    let subtotal = 0;
    let unitPrice: number | null = null;
    let gst = 0;
    let total = 0;

    if (serviceType === "blister-strips-sachet") {
      const price = calculateBlisterPrice(quantity);
      subtotal = price.subtotal;
      unitPrice = price.unitPrice;
      gst = price.gst;
      total = price.total;
    } else if (serviceType === "carton-printing") {
      const price = calculateCartonPrice(quantity);
      subtotal = price.subtotal;
      unitPrice = price.unitPrice;
      gst = price.gst;
      total = price.total;
    } else if (serviceType === "label-printing") {
      if (!labelLayout) {
        return NextResponse.json({ error: "Label layout is required for label printing" }, { status: 400 });
      }
      try {
        const layout = JSON.parse(labelLayout);
        const labelsPerSheet = Number(layout.labelsPerPage ?? 0);
        const totalLabelCount = Number(layout.totalLabels ?? quantity ?? 0);
        const sheetsNeeded = Number(
          layout.pagesNeeded ?? (labelsPerSheet > 0 ? Math.ceil(totalLabelCount / labelsPerSheet) : 0)
        );

        if (totalLabelCount <= 0 || sheetsNeeded <= 0) {
          return NextResponse.json({ error: "Invalid label sheet layout data" }, { status: 400 });
        }

        quantity = totalLabelCount;
        unitPrice = LABEL_SHEET_RATE;
        subtotal = sheetsNeeded * unitPrice;
        gst = Math.round(subtotal * GST_RATE);
        total = subtotal + gst;
      } catch {
        return NextResponse.json({ error: "Invalid label layout in order" }, { status: 400 });
      }
    } else if (serviceType === "insert-printing") {
      const price = calculateInsertPrice(quantity, insertType);
      subtotal = price.subtotal;
      unitPrice = price.unitPrice;
      gst = price.gst;
      total = price.total;
    }

    const finalNotes =
      serviceType === "insert-printing"
        ? `Insert Type: ${insertType === "coloured" ? "Coloured" : "B&W"}${notes.trim() ? `\n${notes.trim()}` : ""}`
        : notes;

    let fileName: string | null = null;
    let filePath: string | null = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const fullPath = path.join(uploadDir, safeName);
      await writeFile(fullPath, buffer);
      fileName = file.name;
      filePath = `/uploads/${safeName}`;
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.id,
        serviceType,
        productName: productName || null,
        quantity,
        unitPrice,
        subtotal,
        gst,
        total,
        notes: finalNotes || null,
        labelLayout: labelLayout || null,
        fileName,
        filePath,
        status: filePath ? "PENDING" : "AWAITING_FILE",
      },
    });

    await appendWorkbookEventSafely({
      eventType: "order",
      eventTime: order.createdAt,
      userId: session.id,
      name: session.name,
      email: session.email,
      phone: session.phone,
      orderNumber: order.orderNumber,
      batchNumber: order.batchNumber,
      serviceType: order.serviceType,
      productName: order.productName,
      quantity: order.quantity,
      subtotal: order.subtotal,
      gst: order.gst,
      total: order.total,
      status: order.status,
      notes: order.notes,
      fileName: order.fileName,
      labelLayout: order.labelLayout,
    });

    await notifyOwnerOrderPlacedSafely({
      orderNumber: order.orderNumber,
      batchNumber: order.batchNumber,
      serviceType: service.name,
      productName: order.productName,
      quantity: order.quantity,
      subtotal: order.subtotal,
      gst: order.gst,
      total: order.total,
      status: order.status,
      fileName: order.fileName,
      customer: {
        id: session.id,
        name: session.name,
        email: session.email,
        phone: session.phone,
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
