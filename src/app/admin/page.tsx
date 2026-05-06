import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/categories";
import VerifyToggle from "./VerifyToggle";

export default async function AdminPage() {
  const session = await auth();
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) redirect("/dashboard");

  const [vendors, totalUsers, totalEnquiries, totalReviews] = await Promise.all([
    prisma.vendorProfile.findMany({
      orderBy: [{ verified: "asc" }, { createdAt: "desc" }],
      include: {
        user: { select: { name: true, email: true, createdAt: true } },
        _count: { select: { services: true, enquiries: true, reviews: true } },
      },
    }),
    prisma.user.count(),
    prisma.enquiry.count(),
    prisma.review.count(),
  ]);

  const verified = vendors.filter((v) => v.verified).length;
  const pending = vendors.filter((v) => !v.verified).length;
  const celebrants = totalUsers - vendors.length;

  return (
    <div style={{ background: "#131313", color: "#e5e2e1", minHeight: "100vh" }}>
      <Navbar session={session} />

      <main style={{ paddingTop: "7rem", paddingBottom: "6rem", paddingLeft: "5vw", paddingRight: "5vw" }}>

        {/* Header */}
        <div className="mb-14">
          <span className="label-caps block mb-3" style={{ color: "#f2ca50" }}>Admin Console</span>
          <h1 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(32px,4vw,56px)", fontWeight: 400, color: "#e5e2e1" }}>
            Platform Overview
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-px mb-14"
          style={{ border: "1px solid rgba(77,70,53,0.4)", background: "rgba(77,70,53,0.4)" }}>
          {[
            { label: "Total Vendors", value: vendors.length, icon: "storefront" },
            { label: "Verified", value: verified, icon: "verified", gold: true },
            { label: "Pending Review", value: pending, icon: "pending", warn: pending > 0 },
            { label: "Celebrants", value: celebrants, icon: "celebration" },
            { label: "Enquiries", value: totalEnquiries, icon: "mail" },
          ].map((s) => (
            <div key={s.label} className="p-7" style={{ background: "#1c1b1b" }}>
              <span className="material-symbols-outlined mb-3 block"
                style={{ fontSize: "18px", color: s.gold ? "#f2ca50" : s.warn ? "#ffb4ab" : "rgba(208,197,175,0.4)" }}>
                {s.icon}
              </span>
              <p style={{ fontFamily: "var(--font-noto-serif)", fontSize: "40px", fontWeight: 400, color: s.gold ? "#f2ca50" : s.warn && s.value > 0 ? "#ffb4ab" : "#e5e2e1", lineHeight: 1 }}>
                {s.value}
              </p>
              <p className="label-caps mt-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pending vendors first callout */}
        {pending > 0 && (
          <div className="flex items-center gap-4 p-5 border-l-2 mb-8"
            style={{ borderColor: "#f2ca50", background: "rgba(242,202,80,0.04)", border: "1px solid rgba(242,202,80,0.2)", borderLeft: "3px solid #f2ca50" }}>
            <span className="material-symbols-outlined" style={{ color: "#f2ca50" }}>pending_actions</span>
            <p className="label-caps" style={{ color: "#f2ca50", fontSize: "11px" }}>
              {pending} vendor profile{pending !== 1 ? "s" : ""} awaiting verification — scroll down to review.
            </p>
          </div>
        )}

        {/* Vendor table */}
        <div className="mb-6 flex items-center justify-between">
          <span className="label-caps" style={{ color: "rgba(208,197,175,0.5)" }}>
            All Vendor Profiles ({vendors.length})
          </span>
        </div>

        <div className="border divide-y" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
          {vendors.length === 0 && (
            <div className="p-12 text-center">
              <p style={{ color: "rgba(208,197,175,0.4)", fontStyle: "italic" }}>No vendor profiles yet.</p>
            </div>
          )}

          {vendors.map((v) => (
            <div key={v.id}
              className="flex items-start gap-5 p-6"
              style={{ background: !v.verified ? "rgba(242,202,80,0.015)" : "transparent" }}>

              {/* Cover thumbnail */}
              <div className="relative w-16 h-16 shrink-0 overflow-hidden" style={{ background: "#201f1f" }}>
                {v.coverImage ? (
                  <Image src={v.coverImage} alt={v.businessName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span style={{ fontSize: "26px", opacity: 0.25 }}>{CATEGORY_ICONS[v.category]}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <Link href={`/vendors/${v.slug ?? v.id}`} target="_blank"
                      style={{ fontFamily: "var(--font-noto-serif)", fontSize: "19px", color: "#e5e2e1" }}
                      className="hover:text-[#f2ca50] transition-colors">
                      {v.businessName}
                    </Link>
                    <p className="label-caps mt-0.5" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>
                      {CATEGORY_ICONS[v.category]} {CATEGORY_LABELS[v.category]} · {v.location}
                    </p>
                  </div>
                  <VerifyToggle id={v.id} verified={v.verified} />
                </div>

                {/* Sub-stats */}
                <div className="flex flex-wrap gap-6 mt-3">
                  {[
                    { label: "Services", value: v._count.services },
                    { label: "Enquiries", value: v._count.enquiries },
                    { label: "Reviews", value: v._count.reviews },
                  ].map((s) => (
                    <div key={s.label}>
                      <span style={{ fontFamily: "var(--font-noto-serif)", fontSize: "20px", color: "#e5e2e1" }}>{s.value}</span>
                      <span className="label-caps ml-1.5" style={{ color: "rgba(208,197,175,0.4)", fontSize: "9px" }}>{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Owner info */}
                <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: "rgba(77,70,53,0.3)" }}>
                  <p className="label-caps" style={{ color: "rgba(208,197,175,0.4)", fontSize: "9px" }}>
                    Owner: {v.user.name ?? "—"} · {v.user.email}
                  </p>
                  <p className="label-caps" style={{ color: "rgba(208,197,175,0.3)", fontSize: "9px" }}>
                    Joined {new Date(v.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* User summary */}
        <div className="mt-14">
          <span className="label-caps block mb-6" style={{ color: "rgba(208,197,175,0.5)" }}>Platform Stats</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px"
            style={{ border: "1px solid rgba(77,70,53,0.4)", background: "rgba(77,70,53,0.4)" }}>
            {[
              { label: "Total Users", value: totalUsers, icon: "group" },
              { label: "Total Enquiries", value: totalEnquiries, icon: "question_answer" },
              { label: "Total Reviews", value: totalReviews, icon: "star" },
            ].map((s) => (
              <div key={s.label} className="p-8 flex items-center gap-5" style={{ background: "#1c1b1b" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "rgba(208,197,175,0.2)" }}>{s.icon}</span>
                <div>
                  <p style={{ fontFamily: "var(--font-noto-serif)", fontSize: "36px", color: "#e5e2e1", lineHeight: 1 }}>{s.value}</p>
                  <p className="label-caps mt-1" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
