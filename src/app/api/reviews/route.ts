import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "CELEBRANT") {
    return NextResponse.json({ error: "Only celebrants can leave reviews" }, { status: 403 });
  }

  try {
    const { vendorProfileId, rating, comment } = await req.json();

    if (!vendorProfileId || !rating || !comment) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const existing = await prisma.review.findFirst({
      where: { celebrantId: session.user.id, vendorProfileId },
    });
    if (existing) {
      return NextResponse.json({ error: "You have already reviewed this vendor" }, { status: 409 });
    }

    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        celebrantId: session.user.id,
        vendorProfileId,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    console.error("[reviews POST]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
