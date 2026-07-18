import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Package, CheckCircle, Receipt } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { InvoiceButton } from "@/components/InvoiceButton";
import { formatINR, getServiceById } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "My Orders",
  description: "Track and manage your Kanha Graphic printing orders.",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/dashboard");

  const params = await searchParams;

  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
  });

  const receiptOrders = params.batch
    ? orders.filter((order) => order.batchNumber === params.batch)
    : orders.slice(0, 1);

  const receiptTotal = receiptOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hidden bg-[#0a1628] py-12 text-white lg:block">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="mt-1 text-white/60">Welcome back, {session.name}</p>
          </div>
          <div className="flex gap-3 self-start">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 font-semibold hover:bg-white/10"
            >
              View Cart
            </Link>
            <Link
              href="/order"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold hover:bg-orange-600"
            >
              <Plus className="h-5 w-5" />
              New Order
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {params.batch && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Cart checkout successful!</p>
              <p className="text-sm">
                Batch <span className="font-mono">{params.batch}</span> — all items placed. Proof
                approvals will be sent on WhatsApp.
              </p>
            </div>
          </div>
        )}

        <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-bold text-[#0a1628]">Invoice / Bill Preview</h2>
              </div>
              {receiptOrders.length > 0 && (
                <InvoiceButton
                  orders={receiptOrders}
                  customer={{ name: session.name, email: session.email, phone: session.phone, companyName: session.companyName, address: session.address, gstNumber: session.gstNumber }}
                  label="Download PDF"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-60 transition-colors"
                />
              )}
            </div>
            {receiptOrders.length > 0 ? (
              <div className="space-y-3">
                {receiptOrders.map((order) => {
                  const service = getServiceById(order.serviceType);
                  return (
                    <div key={order.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#0a1628]">
                            {order.productName || service?.name || order.serviceType}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {order.quantity} • {service?.name || order.serviceType}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-orange-600">{formatINR(order.total)}</p>
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-sm font-semibold text-[#0a1628]">
                  <span>Total paid</span>
                  <span>{formatINR(receiptTotal)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Your latest purchase bill will appear here.</p>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-[#0a1628]">Account Summary</h2>
            </div>
            <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Name</p>
                <p className="text-sm font-semibold text-[#0a1628]">{session.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Email</p>
                <p className="text-sm text-gray-600">{session.email}</p>
              </div>
              {session.phone && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Phone</p>
                  <p className="text-sm text-gray-600">{session.phone}</p>
                </div>
              )}
              <p className="text-sm text-gray-500">
                Login activity and orders are recorded privately for admin use and are not shown in customer accounts.
              </p>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-md">
            <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h2 className="mb-2 text-xl font-bold text-gray-900">No orders yet</h2>
            <p className="mb-6 text-gray-500">Place your first printing order to get started.</p>
            <Link
              href="/order"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              <Plus className="h-5 w-5" />
              Place Order
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const service = getServiceById(order.serviceType);
              return (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="block rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all hover:border-orange-200 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm text-gray-400">{order.orderNumber}</span>
                        <StatusBadge status={order.status} />
                        {order.batchNumber && (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                            {order.batchNumber}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-[#0a1628]">
                        {order.productName || service?.name || order.serviceType}
                      </h3>
                      {order.productName && (
                        <p className="mt-0.5 text-xs text-gray-400">{service?.name}</p>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        Qty: {order.quantity} •{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      {order.total > 0 ? (
                        <p className="text-lg font-bold text-orange-600">{formatINR(order.total)}</p>
                      ) : (
                        <p className="text-sm text-gray-400">Custom quote</p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
