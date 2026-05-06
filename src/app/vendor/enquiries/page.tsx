import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MarkReadButton from "./MarkReadButton";
import ReplyForm from "@/components/ReplyForm";

export default async function VendorEnquiriesPage() {
  const session = await auth();
  if (!session || session.user.role !== "VENDOR") redirect("/dashboard");

  const profile = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      enquiries: {
        orderBy: { createdAt: "desc" },
        include: { celebrant: { select: { name: true, email: true } } },
      },
    },
  });

  if (!profile) redirect("/vendor/setup");

  const pending = profile.enquiries.filter((e) => e.status === "PENDING").length;

  const statusColor: Record<string, string> = {
    PENDING: "#f2ca50",
    READ: "rgba(208,197,175,0.5)",
    REPLIED: "#d4af37",
  };
  const statusLabel: Record<string, string> = {
    PENDING: "New",
    READ: "Seen",
    REPLIED: "Replied",
  };

  return (
    <div style={{ background: "#131313", color: "#e5e2e1", minHeight: "100vh" }}>
      <Navbar session={session} />

      <main style={{ paddingTop: "7rem", paddingBottom: "6rem", paddingLeft: "5vw", paddingRight: "5vw", maxWidth: "56rem", margin: "0 auto" }}>
        <div className="flex items-start justify-between gap-6 flex-wrap mb-12">
          <div>
            <span className="label-caps block mb-3" style={{ color: "#f2ca50" }}>Vendor Inbox</span>
            <h1 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(28px,4vw,48px)", fontWeight: 400, color: "#e5e2e1" }}>
              Enquiries
            </h1>
            {pending > 0 && (
              <p className="label-caps mt-2" style={{ color: "#f2ca50" }}>
                {pending} new enquir{pending === 1 ? "y" : "ies"}
              </p>
            )}
          </div>
          <Link href="/dashboard" className="label-caps flex items-center gap-2 transition-all hover:text-[#f2ca50]"
            style={{ color: "rgba(208,197,175,0.5)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_back</span>
            Dashboard
          </Link>
        </div>

        {profile.enquiries.length === 0 ? (
          <div className="border p-16 text-center" style={{ borderColor: "rgba(77,70,53,0.3)" }}>
            <span className="material-symbols-outlined block mb-4" style={{ fontSize: "40px", color: "rgba(208,197,175,0.2)" }}>inbox</span>
            <p style={{ fontFamily: "var(--font-noto-serif)", fontSize: "24px", color: "rgba(208,197,175,0.4)" }}>No enquiries yet</p>
            <p className="text-sm mt-2" style={{ color: "rgba(208,197,175,0.3)" }}>When celebrants contact you, they&apos;ll appear here.</p>
          </div>
        ) : (
          <div className="border divide-y" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
            {profile.enquiries.map((e) => (
              <div key={e.id} className="p-7"
                style={{ background: e.status === "PENDING" ? "rgba(242,202,80,0.025)" : "transparent" }}>

                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p style={{ fontFamily: "var(--font-noto-serif)", fontSize: "20px", color: "#e5e2e1" }}>
                      {e.celebrant.name ?? "Anonymous"}
                    </p>
                    <p className="label-caps mt-1" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>
                      {e.celebrant.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="label-caps px-3 py-1"
                      style={{
                        fontSize: "10px",
                        color: statusColor[e.status],
                        border: `1px solid ${e.status === "PENDING" ? "rgba(242,202,80,0.35)" : "rgba(77,70,53,0.5)"}`,
                        background: e.status === "PENDING" ? "rgba(242,202,80,0.08)" : "transparent",
                      }}>
                      {statusLabel[e.status]}
                    </span>
                    {e.status === "PENDING" && <MarkReadButton id={e.id} />}
                  </div>
                </div>

                {/* Event details */}
                {(e.eventType || e.eventDate) && (
                  <div className="flex flex-wrap gap-6 mb-4">
                    {e.eventType && (
                      <div>
                        <span className="label-caps block" style={{ color: "rgba(208,197,175,0.4)", fontSize: "9px" }}>Event</span>
                        <span className="label-caps" style={{ color: "#e5e2e1", fontSize: "11px" }}>{e.eventType}</span>
                      </div>
                    )}
                    {e.eventDate && (
                      <div>
                        <span className="label-caps block" style={{ color: "rgba(208,197,175,0.4)", fontSize: "9px" }}>Date</span>
                        <span className="label-caps" style={{ color: "#e5e2e1", fontSize: "11px" }}>
                          {new Date(e.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Message */}
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(229,226,225,0.75)" }}>{e.message}</p>

                {/* Existing reply */}
                {e.reply && (
                  <div className="mt-5 p-4 border-l-2" style={{ borderColor: "#d4af37", background: "rgba(212,175,55,0.05)" }}>
                    <p className="label-caps mb-2" style={{ color: "#d4af37", fontSize: "9px" }}>
                      Your Reply · {e.repliedAt ? new Date(e.repliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(229,226,225,0.8)" }}>{e.reply}</p>
                  </div>
                )}

                {/* Reply form — only if not yet replied */}
                {e.status !== "REPLIED" && <ReplyForm enquiryId={e.id} />}

                <p className="label-caps mt-5" style={{ color: "rgba(208,197,175,0.35)", fontSize: "10px" }}>
                  {new Date(e.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
