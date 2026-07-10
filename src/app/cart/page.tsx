import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { CartPageClient } from "@/components/CartPageClient";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review and checkout your Kanha Graphics printing orders.",
};

export default async function CartPage() {
  const session = await getSession();

  const customer = session
    ? {
        name: session.name,
        email: session.email,
        phone: session.phone,
        companyName: session.companyName,
        address: session.address,
        gstNumber: session.gstNumber,
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-[#0a1628] px-4 py-8 text-white lg:py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold lg:text-3xl">Your Cart</h1>
          <p className="mt-1 text-sm text-white/60">
            Add multiple services and checkout together
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-10">
        <CartPageClient userId={session?.id} customer={customer} />
      </div>
    </div>
  );
}
