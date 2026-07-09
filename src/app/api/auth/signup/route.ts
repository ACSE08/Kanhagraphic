import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { appendWorkbookEventSafely } from "@/lib/excel-report";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
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

    const { name, email, phone, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, phone: phone || null, password: hashed },
    });

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });

    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ipAddress = forwardedFor || request.headers.get("x-real-ip") || null;
    const userAgent = request.headers.get("user-agent") || null;

    const loginEntry = await prisma.loginHistory.create({
      data: {
        userId: user.id,
        email: user.email,
        ipAddress,
        userAgent,
      },
    });

    await appendWorkbookEventSafely({
      eventType: "signup",
      eventTime: loginEntry.loggedAt,
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
