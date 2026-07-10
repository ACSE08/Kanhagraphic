import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, createSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true, name: true, email: true, phone: true,
      companyName: true, address: true, gstNumber: true, createdAt: true,
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ user });
}

const updateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  address: z.string().optional(),
  gstNumber: z.string().optional(),
});

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { name, phone, companyName, address, gstNumber } = parsed.data;

  const user = await prisma.user.update({
    where: { id: session.id },
    data: {
      ...(name !== undefined && { name }),
      phone: phone ?? null,
      companyName: companyName ?? null,
      address: address ?? null,
      gstNumber: gstNumber ?? null,
    },
    select: {
      id: true, name: true, email: true, phone: true,
      companyName: true, address: true, gstNumber: true,
    },
  });

  // Refresh JWT cookie with updated details
  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    companyName: user.companyName,
    address: user.address,
    gstNumber: user.gstNumber,
  });

  return NextResponse.json({ user });
}
