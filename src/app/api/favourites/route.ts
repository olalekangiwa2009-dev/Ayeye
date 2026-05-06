import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const favourites = await prisma.favourite.findMany({
    where: { celebrantId: session.user.id },
    include: {
      vendorProfile: {
        select: {
          id: true,
          businessName: true,
          category: true,
          location: true,
          coverImage: true,
          verified: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(favourites);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { vendorProfileId } = await req.json();
  if (!vendorProfileId) return NextResponse.json({ error: "Missing vendorProfileId" }, { status: 400 });

  const existing = await prisma.favourite.findUnique({
    where: { celebrantId_vendorProfileId: { celebrantId: session.user.id, vendorProfileId } },
  });

  if (existing) {
    await prisma.favourite.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.favourite.create({ data: { celebrantId: session.user.id, vendorProfileId } });
  return NextResponse.json({ saved: true });
}
