import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/categories";
import Navbar from "@/components/Navbar";

const statusColor: Record<string, string> = {
  PENDING: "#f2ca50",
  READ: "rgba(208,197,175,0.5)",
  REPLIED: "#d4af37",
};
const statusLabel: Record<string, string> = {
  PENDING: "Awaiting reply",
  READ: "Seen by vendor",
  REPLIED: "Replied",
};

export default async function MyEnquiriesPage() {
  const session = await auth();
  if (!session || session.user.role !== "CELEBRANT") redirect("/dashboard");

  const enquiries = await prisma.enquiry.findMany({
    where: { celebrantId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      vendorProfile: { select: { id: true, slug: true, businessName: true, category: true, location: true } },
    },
  });

  return (
    <div style={{ background: "#131313", color: "#e5e2e1", minHeight: "100vh" }}>
      <Navbar session={session} />

      <main style={{ paddingTop: "7rem", paddingBottom: "6rem", paddingLeft: "5vw", paddingRight: "5vw", maxWidth: "56rem", margin: "0 auto" }}>
        <div className="flex items-start justify-between gap-6 flex-wrap mb-12">
          <div>
            <span className="label-caps block mb-3" style={{ color: "#f2ca50" }}>Celebrant</span>
            <h1 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(28px,4vw,48px)", fontWeight: 400, color: "#e5e2e1" }}>
              My Enquiries
            </h1>
          </div>
          <Link href="/vendors"
            className="label-caps flex items-center gap-2 transition-all hover:text-[#f2ca50]"
            style={{ color: "rgba(208,197,175,0.5)" }}>
            Browse Vendors
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
          </Link>
        </div>

        {enquiries.length === 0 ? (
          <div className="border p-16 text-center" style={{ borderColor: "rgba(77,70,53,0.3)" }}>
            <span className="material-symbols-outlined block mb-4" style={{ fontSize: "40px", color: "rgba(208,197,175,0.2)" }}>search</span>
            <p style={{ fontFamily: "var(--font-noto-serif)", fontSize: "24px", color: "rgba(208,197,175,0.4)" }}>No enquiries yet</p>
            <p className="text-sm mt-2 mb-6" style={{ color: "rgba(208,197,175,0.3)" }}>Find a vendor and send them a message about your event.</p>
            <Link href="/vendors" className="label-caps inline-block px-8 py-3 transition-all hover:opacity-90"
              style={{ background: "#f2ca50", color: "#3c2f00" }}>
              Browse Vendors
            </Link>
          </div>
        ) : (
          <div className="border divide-y" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
            {enquiries.map((e) => (
              <div key={e.id} className="p-6 flex items-start gap-5">
                {/* Category icon block */}
                <div className="w-12 h-12 shrink-0 flex items-center justify-center border"
                  style={{ borderColor: "rgba(77,70,53,0.4)", background: "#1c1b1b" }}>
                  <span style={{ fontSize: "22px" }}>{CATEGORY_ICONS[e.vendorProfile.category]}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <Link href={`/vendors/${e.vendorProfile.slug ?? e.vendorProfile.id}`}
                      style={{ fontFamily: "var(--font-noto-serif)", fontSize: "19px", color: "#e5e2e1" }}
                      className="hover:text-[#f2ca50] transition-colors">
                      {e.vendorProfile.businessName}
                    </Link>
                    <span className="label-caps px-2 py-1 shrink-0"
                      style={{
                        fontSize: "9px",
                        color: statusColor[e.status],
                        border: `1px solid ${e.status === "REPLIED" ? "rgba(212,175,55,0.35)" : e.status === "PENDING" ? "rgba(242,202,80,0.3)" : "rgba(77,70,53,0.5)"}`,
                        background: e.status === "REPLIED" ? "rgba(212,175,55,0.08)" : e.status === "PENDING" ? "rgba(242,202,80,0.08)" : "transparent",
                      }}>
                      {statusLabel[e.status]}
                    </span>
                  </div>

                  <p className="label-caps mb-3" style={{ color: "rgba(208,197,175,0.45)", fontSize: "10px" }}>
                    {CATEGORY_LABELS[e.vendorProfile.category]} · {e.vendorProfile.location}
                    {e.eventType && <span className="ml-2">· {e.eventType}</span>}
                  </p>

                  <p className="text-sm whitespace-pre-wrap" style={{ color: "rgba(208,197,175,0.65)", lineHeight: 1.6 }}>{e.message}</p>

                  {e.reply && (
                    <div className="mt-4 p-4 border-l-2" style={{ borderColor: "#d4af37", background: "rgba(212,175,55,0.05)" }}>
                      <p className="label-caps mb-2" style={{ color: "#d4af37", fontSize: "9px" }}>
                        {e.vendorProfile.businessName} replied
                        {e.repliedAt ? ` · ${new Date(e.repliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` : ""}
                      </p>
                      <p className="text-sm whitespace-pre-wrap" style={{ color: "rgba(229,226,225,0.85)", lineHeight: 1.7 }}>{e.reply}</p>
                    </div>
                  )}

                  <p className="label-caps mt-3" style={{ color: "rgba(208,197,175,0.3)", fontSize: "9px" }}>
                    Sent {new Date(e.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
