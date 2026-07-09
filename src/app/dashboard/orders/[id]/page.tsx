import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  MessageCircle,
  Download,
  CheckCircle,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { formatINR, getServiceById, ORDER_STATUS_LABELS } from "@/lib/pricing";
import { formatLabelLayoutSummary } from "@/lib/label-layout";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Order Details",
};

const STATUS_STEPS = [
  "PENDING",
  "AWAITING_FILE",
  "PROOF_SENT",
  "APPROVED",
  "IN_PRINTING",
  "READY",
  "SHIPPED",
  "DELIVERED",
];

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/dashboard");

  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: session.id },
  });

  if (!order) notFound();

  const service = getServiceById(order.serviceType);
  const currentStep = STATUS_STEPS.indexOf(order.status);
  const labelLayoutSummary = order.labelLayout
    ? formatLabelLayoutSummary(order.labelLayout)
    : null;

  let labelLayoutDetails: {
    unit: string;
    page: { w: number; h: number };
    label: { w: number; h: number };
    labelsPerPage: number;
    pagesNeeded: number;
  } | null = null;
  if (order.labelLayout) {
    try {
      labelLayoutDetails = JSON.parse(order.labelLayout);
    } catch {
      labelLayoutDetails = null;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-[#0a1628] text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-white/50 text-sm font-mono">{order.orderNumber}</p>
                <h1 className="text-2xl font-bold mt-1">
                  {order.productName || service?.name || order.serviceType}
                </h1>
                {order.productName && (
                  <p className="text-white/60 text-sm mt-1">{service?.name}</p>
                )}
              </div>
              <StatusBadge status={order.status} />
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Progress tracker */}
            {order.status !== "CANCELLED" && (
              <div>
                <h2 className="font-bold text-[#0a1628] mb-4">Order Progress</h2>
                <div className="flex flex-wrap gap-2">
                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= currentStep;
                    const active = i === currentStep;
                    return (
                      <div
                        key={step}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                          done
                            ? active
                              ? "bg-orange-100 text-orange-800 ring-2 ring-orange-300"
                              : "bg-green-50 text-green-700"
                            : "bg-gray-50 text-gray-400"
                        }`}
                      >
                        {done && !active && <CheckCircle className="w-3.5 h-3.5" />}
                        {ORDER_STATUS_LABELS[step]}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {order.productName && (
                <div className="sm:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Product Name</h3>
                  <p className="text-lg font-bold text-[#0a1628]">{order.productName}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Quantity</h3>
                <p className="text-lg font-bold">{order.quantity} nos.</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Order Date</h3>
                <p className="text-lg font-bold">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              {order.subtotal > 0 && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Subtotal</h3>
                    <p className="text-lg font-bold">{formatINR(order.subtotal)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">GST (18%)</h3>
                    <p className="text-lg font-bold">{formatINR(order.gst)}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Total</h3>
                    <p className="text-2xl font-bold text-orange-600">{formatINR(order.total)}</p>
                  </div>
                </>
              )}
            </div>

            {labelLayoutDetails && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                <h3 className="text-sm font-semibold text-blue-800 uppercase mb-3">
                  Label Sheet Layout
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Page size</p>
                    <p className="font-semibold text-[#0a1628]">
                      {labelLayoutDetails.page.w} × {labelLayoutDetails.page.h}{" "}
                      {labelLayoutDetails.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Label size</p>
                    <p className="font-semibold text-[#0a1628]">
                      {labelLayoutDetails.label.w} × {labelLayoutDetails.label.h}{" "}
                      {labelLayoutDetails.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Labels per page</p>
                    <p className="font-semibold text-orange-600">
                      {labelLayoutDetails.labelsPerPage}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Pages needed</p>
                    <p className="font-semibold text-orange-600">
                      {labelLayoutDetails.pagesNeeded}
                    </p>
                  </div>
                </div>
                {labelLayoutSummary && (
                  <p className="mt-3 text-xs text-blue-700">{labelLayoutSummary}</p>
                )}
              </div>
            )}

            {order.notes && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Notes</h3>
                <p className="text-gray-700 bg-gray-50 rounded-xl p-4">{order.notes}</p>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Invoice / Receipt</h3>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-[#0a1628]">
                      {order.productName || service?.name || order.serviceType}
                    </p>
                    <p className="text-sm text-gray-500">
                      Order #{order.orderNumber} • {order.batchNumber ? `Batch ${order.batchNumber}` : "No batch"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Qty</p>
                    <p className="font-bold text-[#0a1628]">{order.quantity}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 border-t border-gray-200 pt-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Unit price</span>
                    <span>{order.unitPrice ? formatINR(order.unitPrice) : "Custom quote"}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatINR(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span>{formatINR(order.gst)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-[#0a1628]">
                    <span>Total</span>
                    <span className="text-orange-600">{formatINR(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {order.fileName && (
              <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                <FileText className="w-8 h-8 text-orange-500" />
                <div className="flex-1">
                  <p className="font-medium">{order.fileName}</p>
                  <p className="text-sm text-gray-500">Design file uploaded</p>
                </div>
                {order.filePath && (
                  <a
                    href={order.filePath}
                    download
                    className="flex items-center gap-1 text-sm text-orange-600 font-medium hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                )}
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <MessageCircle className="w-8 h-8 text-green-600 shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-green-800">WhatsApp Proof Approval</h3>
                <p className="text-sm text-green-700 mt-1">
                  Proof approvals are sent to your WhatsApp. Once approved, printing begins.
                </p>
              </div>
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
                  `Hi, I have a query about order ${order.orderNumber}${order.productName ? ` for ${order.productName}` : ""}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors shrink-0"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
