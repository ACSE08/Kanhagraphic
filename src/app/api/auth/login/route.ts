import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { appendWorkbookEventSafely } from "@/lib/excel-report";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      companyName: user.companyName,
      address: user.address,
      gstNumber: user.gstNumber,
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
      eventType: "login",
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
