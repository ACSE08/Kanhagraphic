import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // In serverless environments (Vercel) each function invocation may spin up a
  // fresh process, so we cap the pool to a small number to avoid exhausting
  // Supabase's connection limit.  On the Supabase Supavisor pooler (port 6543)
  // this is a no-op since the pooler manages connections itself, but it is
  // harmless and keeps local dev safe too.
  const adapter = new PrismaPg({
    connectionString: url,
    max: process.env.NODE_ENV === "production" ? 1 : 10,
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
