import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendReplyEmail } from "@/lib/email";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const profile = await prisma.vendorProfile.findUnique({ where: { userId: session.user.id } });
  const enquiry = await prisma.enquiry.findUnique({
    where: { id },
    include: { celebrant: { select: { name: true, email: true } } },
  });

  if (!enquiry || !profile || enquiry.vendorProfileId !== profile.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  // Mark as read
  if (body.status === "READ") {
    const updated = await prisma.enquiry.update({ where: { id }, data: { status: "READ" } });
    return NextResponse.json(updated);
  }

  // Send reply
  if (body.reply !== undefined) {
    const reply = body.reply?.trim();
    if (!reply) return NextResponse.json({ error: "Reply cannot be empty" }, { status: 400 });

    const updated = await prisma.enquiry.update({
      where: { id },
      data: { reply, repliedAt: new Date(), status: "REPLIED" },
    });

    sendReplyEmail({
      celebrantEmail: enquiry.celebrant.email,
      celebrantName: enquiry.celebrant.name ?? "there",
      businessName: profile.businessName,
      originalMessage: enquiry.message,
      reply,
      dashboardUrl: `${process.env.NEXTAUTH_URL}/enquiries`,
    }).catch((err) => console.error("[email] reply notification failed:", err));

    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
