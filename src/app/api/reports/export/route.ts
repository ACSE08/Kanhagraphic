import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please login first" }, { status: 401 });
  }

  return NextResponse.json(
    { error: "Private activity export is not available to customer accounts." },
    { status: 403 }
  );
}
