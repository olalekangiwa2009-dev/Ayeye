import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const profile = await prisma.vendorProfile.findUnique({ where: { userId: session.user.id } });
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service || !profile || service.vendorProfileId !== profile.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, description, priceFrom, priceTo, images } = await req.json();
  const updated = await prisma.service.update({
    where: { id },
    data: {
      title,
      description,
      priceFrom: Number(priceFrom),
      priceTo: priceTo ? Number(priceTo) : null,
      ...(images !== undefined && { images: JSON.stringify(images) }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const profile = await prisma.vendorProfile.findUnique({ where: { userId: session.user.id } });
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service || !profile || service.vendorProfileId !== profile.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
