import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { appendWorkbookEventSafely } from "@/lib/excel-report";
import { notifyOwnerBatchPlacedSafely } from "@/lib/owner-notifications";
import {
  calculateBlisterPrice,
  calculateCartonPrice,
  calculateInsertPrice,
  GST_RATE,
  LABEL_SHEET_RATE,
  generateOrderNumber,
  generateBatchNumber,
  getServiceById,
  type InsertPrintType,
} from "@/lib/pricing";

const itemSchema = z.object({
  serviceType: z.string(),
  productName: z.string().optional(),
  quantity: z.number().int().min(0),
  notes: z.string().optional(),
  labelLayout: z.string().nullable().optional(),
  insertType: z.enum(["coloured", "bw"]).optional(),
});

const checkoutSchema = z.object({
  items: z.array(itemSchema).min(1, "Cart is empty"),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Please login to checkout" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid cart data" },
        { status: 400 }
      );
    }

    const batchNumber = generateBatchNumber();
    const orders = [];

    for (const item of parsed.data.items) {
      const service = getServiceById(item.serviceType);
      if (!service) {
        return NextResponse.json({ error: `Invalid service: ${item.serviceType}` }, { status: 400 });
      }

      let quantity = item.quantity;
      const labelLayout = item.labelLayout || null;
      const insertType: InsertPrintType = item.insertType === "bw" ? "bw" : "coloured";

      if (item.serviceType === "label-printing") {
        if (!labelLayout) {
          return NextResponse.json({ error: "Label layout required for label printing item" }, { status: 400 });
        }
        try {
          const layout = JSON.parse(labelLayout);
          quantity = layout.totalLabels ?? 0;
          if (quantity <= 0) {
            return NextResponse.json({ error: "Label item must have total labels > 0" }, { status: 400 });
          }
        } catch {
          return NextResponse.json({ error: "Invalid label layout in cart item" }, { status: 400 });
        }
      }

      if (service.moq && quantity < service.moq) {
        return NextResponse.json(
          { error: `Minimum quantity for ${service.name} is ${service.moq}` },
          { status: 400 }
        );
      }

      if (item.serviceType !== "label-printing" && quantity < 0) {
        return NextResponse.json({ error: "Each item must have quantity 0 or greater" }, { status: 400 });
      }

      let subtotal = 0;
      let unitPrice: number | null = null;
      let gst = 0;
      let total = 0;

      if (item.serviceType === "blister-strips-sachet") {
        const price = calculateBlisterPrice(quantity);
        subtotal = price.subtotal;
        unitPrice = price.unitPrice;
        gst = price.gst;
        total = price.total;
      } else if (item.serviceType === "carton-printing") {
        const price = calculateCartonPrice(quantity);
        subtotal = price.subtotal;
        unitPrice = price.unitPrice;
        gst = price.gst;
        total = price.total;
      } else if (item.serviceType === "label-printing") {
        if (!labelLayout) {
          return NextResponse.json({ error: "Label layout required for label printing item" }, { status: 400 });
        }

        try {
          const layout = JSON.parse(labelLayout);
          const labelsPerSheet = Number(layout.labelsPerPage ?? 0);
          const totalLabelCount = Number(layout.totalLabels ?? quantity ?? 0);
          const sheetsNeeded = Number(
            layout.pagesNeeded ?? (labelsPerSheet > 0 ? Math.ceil(totalLabelCount / labelsPerSheet) : 0)
          );

          if (totalLabelCount <= 0 || sheetsNeeded <= 0) {
            return NextResponse.json({ error: "Invalid label sheet layout in cart item" }, { status: 400 });
          }

          quantity = totalLabelCount;
          unitPrice = LABEL_SHEET_RATE;
          subtotal = sheetsNeeded * unitPrice;
          gst = Math.round(subtotal * GST_RATE);
          total = subtotal + gst;
        } catch {
          return NextResponse.json({ error: "Invalid label layout in cart item" }, { status: 400 });
        }
      } else if (item.serviceType === "insert-printing") {
        const price = calculateInsertPrice(quantity, insertType);
        subtotal = price.subtotal;
        unitPrice = price.unitPrice;
        gst = price.gst;
        total = price.total;
      }

      const finalNotes =
        item.serviceType === "insert-printing"
          ? `Insert Type: ${insertType === "coloured" ? "Coloured" : "B&W"}${item.notes?.trim() ? `\n${item.notes.trim()}` : ""}`
          : item.notes?.trim() || null;

      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          batchNumber,
          userId: session.id,
          serviceType: item.serviceType,
          productName: item.productName?.trim() || null,
          quantity,
          unitPrice,
          subtotal,
          gst,
          total,
          notes: finalNotes,
          labelLayout,
          status: "AWAITING_FILE",
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

      orders.push(order);
    }

    const batchSubtotal = orders.reduce((s, o) => s + o.subtotal, 0);
    const batchGst = orders.reduce((s, o) => s + o.gst, 0);
    const batchTotal = orders.reduce((s, o) => s + o.total, 0);

    await notifyOwnerBatchPlacedSafely({
      batchNumber,
      itemCount: orders.length,
      subtotal: batchSubtotal,
      gst: batchGst,
      total: batchTotal,
      customer: {
        id: session.id,
        name: session.name,
        email: session.email,
        phone: session.phone,
      },
      orders: orders.map((order) => ({
        orderNumber: order.orderNumber,
        serviceType: getServiceById(order.serviceType)?.name || order.serviceType,
        productName: order.productName,
        quantity: order.quantity,
        total: order.total,
        status: order.status,
      })),
    });

    await prisma.cartSnapshot.create({
      data: {
        userId: session.id,
        itemsJson: JSON.stringify(parsed.data.items),
        itemCount: parsed.data.items.length,
        total: batchTotal,
      },
    });

    return NextResponse.json(
      {
        batchNumber,
        orders,
        summary: { subtotal: batchSubtotal, gst: batchGst, total: batchTotal, count: orders.length },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
