import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slugify";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { businessName, category, location, bio, coverImage, portfolio, instagram, website } = await req.json();

    if (!businessName || !category || !location || !bio) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existing = await prisma.vendorProfile.findUnique({ where: { userId: session.user.id } });
    if (existing) {
      return NextResponse.json({ error: "Profile already exists" }, { status: 409 });
    }

    const slug = await uniqueSlug(businessName, (s) =>
      prisma.vendorProfile.findUnique({ where: { slug: s } }).then(Boolean)
    );

    const profile = await prisma.vendorProfile.create({
      data: {
        userId: session.user.id,
        businessName,
        category,
        location,
        bio,
        slug,
        coverImage: coverImage ?? null,
        portfolio: JSON.stringify(portfolio ?? []),
        instagram: instagram || null,
        website: website || null,
      },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (err) {
    console.error("[vendor/profile POST]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { businessName, category, location, bio, coverImage, portfolio, instagram, website } = await req.json();

    if (!businessName || !category || !location || !bio) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const profile = await prisma.vendorProfile.update({
      where: { userId: session.user.id },
      data: {
        businessName,
        category,
        location,
        bio,
        ...(coverImage !== undefined && { coverImage }),
        ...(portfolio !== undefined && { portfolio: JSON.stringify(portfolio) }),
        instagram: instagram || null,
        website: website || null,
      },
    });

    return NextResponse.json(profile);
  } catch (err) {
    console.error("[vendor/profile PUT]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
