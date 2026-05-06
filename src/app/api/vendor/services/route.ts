import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const profile = await prisma.vendorProfile.findUnique({ where: { userId: session.user.id } });
  if (!profile) {
    return NextResponse.json({ error: "Complete your vendor profile first" }, { status: 400 });
  }

  try {
    const { title, description, priceFrom, priceTo, images } = await req.json();

    if (!title || !description || priceFrom == null) {
      return NextResponse.json({ error: "Title, description and starting price are required" }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        priceFrom: Number(priceFrom),
        priceTo: priceTo ? Number(priceTo) : null,
        images: JSON.stringify(images ?? []),
        vendorProfileId: profile.id,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (err) {
    console.error("[vendor/services POST]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
