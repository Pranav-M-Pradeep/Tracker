import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "(not set — auto-detect)",
    dbConnection: false,
    dbError: null as string | null,
  };

  try {
    // Try a lightweight DB query
    await prisma.$runCommandRaw({ ping: 1 });
    checks.dbConnection = true;
  } catch (err: any) {
    checks.dbError = err?.message || "Unknown DB error";
  }

  const allOk = checks.DATABASE_URL && checks.NEXTAUTH_SECRET && checks.dbConnection;

  return NextResponse.json(checks, { status: allOk ? 200 : 500 });
}
