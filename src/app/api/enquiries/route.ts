import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendEnquiryEmail } from "@/lib/email";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "CELEBRANT") {
    return NextResponse.json({ error: "Only celebrants can send enquiries" }, { status: 403 });
  }

  try {
    const { vendorProfileId, message, eventDate, eventType } = await req.json();

    if (!vendorProfileId || !message) {
      return NextResponse.json({ error: "Vendor and message are required" }, { status: 400 });
    }

    const vendor = await prisma.vendorProfile.findUnique({
      where: { id: vendorProfileId },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

    const enquiry = await prisma.enquiry.create({
      data: {
        message,
        eventDate: eventDate || null,
        eventType: eventType || null,
        celebrantId: session.user.id,
        vendorProfileId,
      },
    });

    // Fire-and-forget — never blocks or fails the response
    sendEnquiryEmail({
      vendorEmail: vendor.user.email,
      vendorName: vendor.user.name ?? vendor.businessName,
      businessName: vendor.businessName,
      celebrantName: session.user.name ?? "A celebrant",
      celebrantEmail: session.user.email ?? "",
      message,
      eventType: eventType || null,
      eventDate: eventDate || null,
      dashboardUrl: `${process.env.NEXTAUTH_URL}/vendor/enquiries`,
    }).catch((err) => console.error("[email] enquiry notification failed:", err));

    return NextResponse.json(enquiry, { status: 201 });
  } catch (err) {
    console.error("[enquiries POST]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
