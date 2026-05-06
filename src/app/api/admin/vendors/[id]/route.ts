import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin(req: Request) {
  const session = await auth();
  return session?.user?.email === process.env.ADMIN_EMAIL;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const { verified } = await req.json();

  const updated = await prisma.vendorProfile.update({
    where: { id },
    data: { verified: Boolean(verified) },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.vendorProfile.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
