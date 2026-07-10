import { defineConfig } from "prisma/config";

// Only load dotenv in local dev — on Vercel env vars are injected directly
if (process.env.NODE_ENV !== "production") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("dotenv").config();
  } catch {
    // dotenv not available — fine
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use the session-mode pooler for migrations — transaction-mode (pgbouncer)
    // does not support DDL statements that Prisma migrations emit.
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"] ?? "",
  },
});
