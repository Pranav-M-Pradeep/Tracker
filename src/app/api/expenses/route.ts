import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const month = url.searchParams.get("month"); // 1-12
  const year = url.searchParams.get("year");

  let where: any = { userId: session.user.id };

  if (month && year) {
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 1);
    where.date = { gte: startDate, lt: endDate };
  }

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return NextResponse.json(expenses);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amount, description, category, type, date } = await req.json();

  const expense = await prisma.expense.create({
    data: {
      amount,
      description,
      category: category || "General",
      type: type || "expense",
      date: date ? new Date(date) : new Date(),
      userId: session.user.id,
    },
  });

  return NextResponse.json(expense);
}
