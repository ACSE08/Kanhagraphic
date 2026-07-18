import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a free Kanha Graphic account to place orders, upload design files, and track your printing projects.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;

  if (session) {
    redirect(params.redirect || "/dashboard");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-8 lg:min-h-[80vh] lg:py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0a1628]">Create Account</h1>
          <p className="text-gray-600 mt-2">Join Kanha Graphic to start ordering</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
          <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100 rounded-xl" />}>
            <AuthForm mode="signup" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
