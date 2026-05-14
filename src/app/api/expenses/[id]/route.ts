import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  const { amount, description, category, type, date } = await req.json();

  const expense = await prisma.expense.update({
    where: { id, userId: session.user.id },
    data: { amount, description, category, type, date: new Date(date) },
  });

  return NextResponse.json(expense);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;

  await prisma.expense.delete({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}
