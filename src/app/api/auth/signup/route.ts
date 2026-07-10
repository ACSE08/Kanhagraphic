import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { appendWorkbookEventSafely } from "@/lib/excel-report";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  companyName: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Business address is required"),
  gstNumber: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, phone, companyName, address, gstNumber, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        companyName,
        address: address,
        gstNumber: gstNumber || null,
        password: hashed,
      },
    });

    // Create session — critical step
    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      companyName: user.companyName,
      address: user.address,
      gstNumber: user.gstNumber,
    });

    // Non-critical logging — must not block or crash signup
    try {
      const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
      const ipAddress = forwardedFor || request.headers.get("x-real-ip") || null;
      const userAgent = request.headers.get("user-agent") || null;

      const loginEntry = await prisma.loginHistory.create({
        data: { userId: user.id, email: user.email, ipAddress, userAgent },
      });

      // Fire-and-forget
      appendWorkbookEventSafely({
        eventType: "signup",
        eventTime: loginEntry.loggedAt,
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        ipAddress,
        userAgent,
      });
    } catch (loggingError) {
      console.error("[signup] logging failed (non-fatal):", loggingError);
    }

    return NextResponse.json(
      { user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (err) {
    console.error("[signup] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
