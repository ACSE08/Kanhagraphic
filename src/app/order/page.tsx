import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { OrderWorkspace } from "@/components/OrderWorkspace";

export const metadata: Metadata = {
  title: "Place Order",
  description:
    "Place your printing order with Kanha Graphic. Upload Corel Draw files, get instant pricing for blister/strip printing, and track your order online.",
};

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  const defaultService = params.service || "blister-strips-sachet";

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-[#0a1628] py-8 text-white lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-3 text-2xl font-bold sm:text-3xl lg:mb-4 lg:text-4xl">Place Your Order</h1>
          <p className="max-w-2xl text-sm text-white/70 sm:text-base">
            Select your service, upload your design file, and get started. Proof
            approvals are sent via WhatsApp.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-12">
        <OrderWorkspace userId={session?.id} defaultService={defaultService} />
      </div>
    </div>
  );
}
