import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ProfileForm } from "@/components/ProfileForm";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Update your company and contact details used on invoices.",
};

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/dashboard/profile");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#0a1628] py-10 text-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="mt-1 text-white/60 text-sm">
            These details appear on your invoices. Keep them accurate.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <ProfileForm
          initial={{
            name: session.name,
            email: session.email,
            phone: session.phone ?? "",
            companyName: session.companyName ?? "",
            address: session.address ?? "",
            gstNumber: session.gstNumber ?? "",
          }}
        />
      </div>
    </div>
  );
}
