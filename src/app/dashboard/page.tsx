import type { Metadata } from "next";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};
import Link from "next/link";
import Image from "next/image";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/categories";
import Navbar from "@/components/Navbar";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const isVendor = session.user.role === "VENDOR";

  /* ── Vendor data ── */
  const vendorProfile = isVendor
    ? await prisma.vendorProfile.findUnique({
        where: { userId: session.user.id },
        include: {
          services: true,
          reviews: { select: { rating: true } },
          enquiries: {
            orderBy: { createdAt: "desc" },
            take: 4,
            include: { celebrant: { select: { name: true, email: true } } },
          },
          _count: {
            select: {
              enquiries: { where: { status: "PENDING" } },
              services: true,
              reviews: true,
            },
          },
        },
      })
    : null;

  /* ── Celebrant data ── */
  const [celebrantEnquiries, savedCount] = !isVendor
    ? await Promise.all([
        prisma.enquiry.findMany({
          where: { celebrantId: session.user.id },
          orderBy: { createdAt: "desc" },
          take: 4,
          include: { vendorProfile: { select: { id: true, slug: true, businessName: true, category: true, coverImage: true } } },
        }),
        prisma.favourite.count({ where: { celebrantId: session.user.id } }),
      ])
    : [[], 0];

  const vendorAvgRating =
    vendorProfile && vendorProfile.reviews.length
      ? vendorProfile.reviews.reduce((s, r) => s + r.rating, 0) / vendorProfile.reviews.length
      : null;

  const pendingCount = vendorProfile?._count?.enquiries ?? 0;

  return (
    <div style={{ background: "#131313", color: "#e5e2e1", minHeight: "100vh" }}>
      <Navbar session={session} />

      <main style={{ paddingTop: "7rem", paddingBottom: "6rem", paddingLeft: "5vw", paddingRight: "5vw" }}>

        {/* ── Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-6 mb-16">
          <div>
            <span className="label-caps block mb-3" style={{ color: "#f2ca50" }}>
              {isVendor ? "Vendor" : "Celebrant"} Account
            </span>
            <h1 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(32px,4vw,56px)", fontWeight: 400, color: "#e5e2e1", lineHeight: 1.1 }}>
              Welcome back,<br />{session.user?.name?.split(" ")[0] ?? session.user?.email?.split("@")[0]}.
            </h1>
            <p className="mt-3 text-sm" style={{ color: "rgba(208,197,175,0.6)" }}>{session.user?.email}</p>
          </div>

          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button type="submit"
              className="label-caps px-6 py-3 border transition-all hover:border-[#ffb4ab] hover:text-[#ffb4ab]"
              style={{ borderColor: "rgba(153,144,124,0.4)", color: "rgba(208,197,175,0.6)" }}>
              Sign Out
            </button>
          </form>
        </div>

        {/* ══════════════════════════════════════════
            VENDOR DASHBOARD
        ══════════════════════════════════════════ */}
        {isVendor && (
          <>
            {/* ── No profile yet ── */}
            {!vendorProfile && (
              <div className="border p-12 text-center" style={{ borderColor: "rgba(242,202,80,0.2)", background: "rgba(242,202,80,0.03)" }}>
                <span className="label-caps block mb-4" style={{ color: "#f2ca50" }}>Profile Incomplete</span>
                <h2 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "32px", color: "#e5e2e1", marginBottom: "1rem" }}>
                  Set up your vendor profile
                </h2>
                <p className="mb-8 text-sm" style={{ color: "rgba(208,197,175,0.7)", lineHeight: 1.7, maxWidth: "28rem", margin: "0 auto 2rem" }}>
                  Complete your profile so celebrants can find your services, view your portfolio, and send enquiries.
                </p>
                <Link href="/vendor/setup"
                  className="label-caps inline-block px-10 py-4 transition-all hover:opacity-90"
                  style={{ background: "#f2ca50", color: "#3c2f00" }}>
                  Get Started
                </Link>
              </div>
            )}

            {/* ── Has profile ── */}
            {vendorProfile && (
              <>
                {/* Stats row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-12"
                  style={{ border: "1px solid rgba(77,70,53,0.4)", background: "rgba(77,70,53,0.4)" }}>
                  {[
                    { label: "Pending Enquiries", value: pendingCount, accent: pendingCount > 0, icon: "mail" },
                    { label: "Services Listed", value: vendorProfile._count.services, accent: false, icon: "inventory_2" },
                    { label: "Total Reviews", value: vendorProfile._count.reviews, accent: false, icon: "star" },
                    { label: "Avg Rating", value: vendorAvgRating ? `${vendorAvgRating.toFixed(1)} ★` : "—", accent: false, icon: "grade" },
                  ].map((s) => (
                    <div key={s.label} className="p-8" style={{ background: "#1c1b1b" }}>
                      <span className="material-symbols-outlined mb-3 block" style={{ color: s.accent ? "#f2ca50" : "rgba(208,197,175,0.4)", fontSize: "20px" }}>{s.icon}</span>
                      <p style={{ fontFamily: "var(--font-noto-serif)", fontSize: "36px", fontWeight: 400, color: s.accent ? "#f2ca50" : "#e5e2e1", lineHeight: 1 }}>
                        {s.value}
                      </p>
                      <p className="label-caps mt-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: profile card + quick actions */}
                  <div className="lg:col-span-1 space-y-4">
                    {/* Profile card */}
                    <div className="border overflow-hidden" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
                      <div className="relative h-40" style={{ background: "#201f1f" }}>
                        {vendorProfile.coverImage && (
                          <Image src={vendorProfile.coverImage} alt={vendorProfile.businessName} fill className="object-cover" style={{ filter: "brightness(0.7)" }} />
                        )}
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #1c1b1b 0%, transparent 60%)" }} />
                        {vendorProfile.verified && (
                          <span className="absolute top-3 right-3 label-caps px-3 py-1"
                            style={{ background: "#d4af37", color: "#3c2f00", fontSize: "9px" }}>
                            ✓ Verified
                          </span>
                        )}
                        {!vendorProfile.verified && (
                          <span className="absolute top-3 right-3 label-caps px-3 py-1"
                            style={{ border: "1px solid rgba(153,144,124,0.5)", color: "rgba(208,197,175,0.6)", fontSize: "9px" }}>
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="p-5" style={{ background: "#1c1b1b" }}>
                        <h3 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "20px", color: "#e5e2e1" }}>
                          {vendorProfile.businessName}
                        </h3>
                        <p className="label-caps mt-1" style={{ color: "rgba(208,197,175,0.6)", fontSize: "10px" }}>
                          {CATEGORY_ICONS[vendorProfile.category]} {CATEGORY_LABELS[vendorProfile.category]}
                        </p>
                        <p className="label-caps mt-0.5 flex items-center gap-1" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>location_on</span>
                          {vendorProfile.location}
                        </p>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="border divide-y" style={{ borderColor: "rgba(77,70,53,0.4)", "--tw-divide-opacity": 1 } as React.CSSProperties}>
                      {[
                        { href: `/vendors/${vendorProfile.slug ?? vendorProfile.id}`, label: "View Public Profile", icon: "open_in_new" },
                        { href: "/vendor/edit", label: "Edit Profile", icon: "edit" },
                        { href: "/vendor/services", label: "Manage Services", icon: "inventory_2" },
                        { href: "/vendor/services/new", label: "Add New Service", icon: "add_circle" },
                      ].map((a) => (
                        <Link key={a.href} href={a.href}
                          className="flex items-center justify-between px-5 py-4 transition-all hover:bg-[rgba(242,202,80,0.04)] group"
                          style={{ borderColor: "rgba(77,70,53,0.4)" }}>
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "rgba(208,197,175,0.4)" }}>{a.icon}</span>
                            <span className="label-caps" style={{ color: "#e5e2e1", fontSize: "11px" }}>{a.label}</span>
                          </div>
                          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1" style={{ fontSize: "14px", color: "rgba(242,202,80,0.5)" }}>chevron_right</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right: recent enquiries */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                      <span className="label-caps" style={{ color: "rgba(208,197,175,0.5)" }}>
                        Recent Enquiries
                        {pendingCount > 0 && (
                          <span className="ml-3 px-2 py-0.5 label-caps" style={{ background: "#f2ca50", color: "#3c2f00", fontSize: "9px" }}>
                            {pendingCount} new
                          </span>
                        )}
                      </span>
                      <Link href="/vendor/enquiries" className="label-caps pb-0.5 transition-all"
                        style={{ color: "#f2ca50", borderBottom: "1px solid #f2ca50", fontSize: "10px" }}>
                        View All
                      </Link>
                    </div>

                    {vendorProfile.enquiries.length === 0 ? (
                      <div className="border p-12 text-center" style={{ borderColor: "rgba(77,70,53,0.3)" }}>
                        <span className="material-symbols-outlined block mb-3" style={{ fontSize: "32px", color: "rgba(208,197,175,0.2)" }}>inbox</span>
                        <p style={{ color: "rgba(208,197,175,0.4)", fontStyle: "italic" }}>No enquiries yet.</p>
                        <p className="text-xs mt-1" style={{ color: "rgba(208,197,175,0.3)" }}>Celebrants will reach out here once they find your profile.</p>
                      </div>
                    ) : (
                      <div className="border divide-y" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
                        {vendorProfile.enquiries.map((enq) => (
                          <div key={enq.id} className="p-6" style={{ background: enq.status === "PENDING" ? "rgba(242,202,80,0.03)" : "transparent" }}>
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <p style={{ fontFamily: "var(--font-noto-serif)", fontSize: "16px", color: "#e5e2e1" }}>
                                  {enq.celebrant.name ?? "Anonymous"}
                                </p>
                                <p className="label-caps mt-0.5" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>
                                  {enq.celebrant.email}
                                  {enq.eventType && <span className="ml-2">· {enq.eventType}</span>}
                                  {enq.eventDate && <span className="ml-2">· {new Date(enq.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>}
                                </p>
                              </div>
                              <span className="label-caps px-2 py-1 shrink-0"
                                style={{
                                  fontSize: "9px",
                                  background: enq.status === "PENDING" ? "rgba(242,202,80,0.15)" : enq.status === "READ" ? "rgba(77,70,53,0.5)" : "rgba(212,175,55,0.2)",
                                  color: enq.status === "PENDING" ? "#f2ca50" : enq.status === "READ" ? "rgba(208,197,175,0.6)" : "#d4af37",
                                  border: `1px solid ${enq.status === "PENDING" ? "rgba(242,202,80,0.3)" : "transparent"}`,
                                }}>
                                {enq.status === "PENDING" ? "New" : enq.status === "READ" ? "Seen" : "Replied"}
                              </span>
                            </div>
                            <p className="text-sm line-clamp-2" style={{ color: "rgba(208,197,175,0.65)", lineHeight: 1.6 }}>{enq.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Services mini-grid */}
                    {vendorProfile.services.length > 0 && (
                      <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                          <span className="label-caps" style={{ color: "rgba(208,197,175,0.5)" }}>Your Services</span>
                          <Link href="/vendor/services/new" className="label-caps pb-0.5"
                            style={{ color: "#f2ca50", borderBottom: "1px solid #f2ca50", fontSize: "10px" }}>
                            + Add Service
                          </Link>
                        </div>
                        <div className="border divide-y" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
                          {vendorProfile.services.slice(0, 3).map((s) => (
                            <div key={s.id} className="flex items-center justify-between px-5 py-4">
                              <p style={{ fontSize: "15px", color: "#e5e2e1" }}>{s.title}</p>
                              <div className="flex items-center gap-4">
                                <span style={{ fontFamily: "var(--font-noto-serif)", fontSize: "16px", color: "#f2ca50" }}>
                                  ₦{s.priceFrom.toLocaleString()}{s.priceTo ? `–${s.priceTo.toLocaleString()}` : "+"}
                                </span>
                                <Link href={`/vendor/services/${s.id}/edit`}
                                  className="label-caps transition-all hover:text-[#f2ca50]"
                                  style={{ color: "rgba(208,197,175,0.4)", fontSize: "10px" }}>
                                  Edit
                                </Link>
                              </div>
                            </div>
                          ))}
                          {vendorProfile.services.length > 3 && (
                            <Link href="/vendor/services"
                              className="flex items-center justify-center py-3 label-caps transition-all hover:text-[#f2ca50]"
                              style={{ color: "rgba(208,197,175,0.4)", fontSize: "10px" }}>
                              +{vendorProfile.services.length - 3} more services
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════
            CELEBRANT DASHBOARD
        ══════════════════════════════════════════ */}
        {!isVendor && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-12"
              style={{ border: "1px solid rgba(77,70,53,0.4)", background: "rgba(77,70,53,0.4)" }}>
              {[
                { label: "Enquiries Sent", value: celebrantEnquiries.length, icon: "send" },
                { label: "Awaiting Reply", value: celebrantEnquiries.filter((e) => e.status === "PENDING").length, icon: "hourglass_empty" },
                { label: "Vendors Replied", value: celebrantEnquiries.filter((e) => e.status === "REPLIED").length, icon: "mark_email_read" },
                { label: "Saved Vendors", value: savedCount, icon: "favorite" },
              ].map((s) => (
                <div key={s.label} className="p-8" style={{ background: "#1c1b1b" }}>
                  <span className="material-symbols-outlined mb-3 block" style={{ color: "rgba(208,197,175,0.4)", fontSize: "20px" }}>{s.icon}</span>
                  <p style={{ fontFamily: "var(--font-noto-serif)", fontSize: "40px", fontWeight: 400, color: "#e5e2e1", lineHeight: 1 }}>{s.value}</p>
                  <p className="label-caps mt-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick actions */}
              <div className="lg:col-span-1">
                <span className="label-caps block mb-4" style={{ color: "rgba(208,197,175,0.5)" }}>Quick Actions</span>
                <div className="border divide-y" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
                  {[
                    { href: "/vendors", label: "Browse All Vendors", icon: "search" },
                    { href: "/favourites", label: "Saved Vendors", icon: "favorite" },
                    { href: "/vendors?category=PHOTOGRAPHY", label: "Find Photographers", icon: "photo_camera" },
                    { href: "/vendors?category=CATERING", label: "Find Caterers", icon: "restaurant" },
                    { href: "/vendors?category=DECORATION", label: "Find Decorators", icon: "celebration" },
                    { href: "/enquiries", label: "All My Enquiries", icon: "inbox" },
                  ].map((a) => (
                    <Link key={a.href} href={a.href}
                      className="flex items-center justify-between px-5 py-4 transition-all hover:bg-[rgba(242,202,80,0.04)] group"
                      style={{ borderColor: "rgba(77,70,53,0.4)" }}>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "rgba(208,197,175,0.4)" }}>{a.icon}</span>
                        <span className="label-caps" style={{ color: "#e5e2e1", fontSize: "11px" }}>{a.label}</span>
                      </div>
                      <span className="material-symbols-outlined transition-transform group-hover:translate-x-1" style={{ fontSize: "14px", color: "rgba(242,202,80,0.5)" }}>chevron_right</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent enquiries */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <span className="label-caps" style={{ color: "rgba(208,197,175,0.5)" }}>Recent Enquiries</span>
                  {celebrantEnquiries.length > 0 && (
                    <Link href="/enquiries" className="label-caps pb-0.5"
                      style={{ color: "#f2ca50", borderBottom: "1px solid #f2ca50", fontSize: "10px" }}>
                      View All
                    </Link>
                  )}
                </div>

                {celebrantEnquiries.length === 0 ? (
                  <div className="border p-12 text-center" style={{ borderColor: "rgba(77,70,53,0.3)" }}>
                    <span className="material-symbols-outlined block mb-3" style={{ fontSize: "32px", color: "rgba(208,197,175,0.2)" }}>search</span>
                    <p style={{ color: "rgba(208,197,175,0.4)", fontStyle: "italic" }}>No enquiries sent yet.</p>
                    <Link href="/vendors" className="label-caps inline-block mt-4 pb-0.5"
                      style={{ color: "#f2ca50", borderBottom: "1px solid #f2ca50", fontSize: "10px" }}>
                      Browse Vendors
                    </Link>
                  </div>
                ) : (
                  <div className="border divide-y" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
                    {celebrantEnquiries.map((enq) => (
                      <Link key={enq.id} href={`/vendors/${enq.vendorProfile.slug ?? enq.vendorProfile.id}`}
                        className="flex items-start gap-5 p-6 transition-all hover:bg-[rgba(242,202,80,0.03)] group block">
                        <div className="relative w-14 h-14 shrink-0 overflow-hidden" style={{ background: "#201f1f" }}>
                          {enq.vendorProfile.coverImage ? (
                            <Image src={enq.vendorProfile.coverImage} alt={enq.vendorProfile.businessName} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span style={{ fontSize: "24px", opacity: 0.3 }}>{CATEGORY_ICONS[enq.vendorProfile.category]}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <p style={{ fontFamily: "var(--font-noto-serif)", fontSize: "17px", color: "#e5e2e1" }}
                              className="group-hover:text-[#f2ca50] transition-colors">
                              {enq.vendorProfile.businessName}
                            </p>
                            <span className="label-caps px-2 py-1 shrink-0"
                              style={{
                                fontSize: "9px",
                                background: enq.status === "PENDING" ? "rgba(242,202,80,0.12)" : enq.status === "REPLIED" ? "rgba(212,175,55,0.15)" : "rgba(77,70,53,0.4)",
                                color: enq.status === "PENDING" ? "#f2ca50" : enq.status === "REPLIED" ? "#d4af37" : "rgba(208,197,175,0.5)",
                              }}>
                              {enq.status === "PENDING" ? "Awaiting reply" : enq.status === "READ" ? "Seen" : "Replied"}
                            </span>
                          </div>
                          <p className="label-caps mt-0.5" style={{ color: "rgba(208,197,175,0.45)", fontSize: "10px" }}>
                            {CATEGORY_LABELS[enq.vendorProfile.category]}
                            {enq.eventType && <span className="ml-2">· {enq.eventType}</span>}
                          </p>
                          <p className="text-sm mt-2 line-clamp-1" style={{ color: "rgba(208,197,175,0.6)", lineHeight: 1.5 }}>{enq.message}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Discover more */}
            <div className="mt-16 border p-10 flex flex-col md:flex-row items-center justify-between gap-8"
              style={{ borderColor: "rgba(242,202,80,0.15)", background: "rgba(242,202,80,0.02)" }}>
              <div>
                <span className="label-caps block mb-2" style={{ color: "#f2ca50" }}>Discover More</span>
                <h3 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "28px", color: "#e5e2e1" }}>
                  Find the perfect vendor for your celebration
                </h3>
              </div>
              <Link href="/vendors"
                className="label-caps px-10 py-4 shrink-0 transition-all hover:opacity-90"
                style={{ background: "#f2ca50", color: "#3c2f00" }}>
                Browse Vendors
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
