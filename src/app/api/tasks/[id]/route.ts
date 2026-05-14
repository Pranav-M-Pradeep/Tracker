import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  const { isCompleted } = await req.json();

  const task = await prisma.task.update({
    where: { id: id, userId: session.user.id },
    data: { isCompleted },
  });

  return NextResponse.json(task);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;

  await prisma.task.delete({
    where: { id: id, userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}
