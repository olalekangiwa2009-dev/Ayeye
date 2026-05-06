import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DeleteServiceButton from "./DeleteServiceButton";

export default async function VendorServicesPage() {
  const session = await auth();
  if (!session || session.user.role !== "VENDOR") redirect("/dashboard");

  const profile = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
    include: { services: { orderBy: { createdAt: "desc" } } },
  });

  if (!profile) redirect("/vendor/setup");

  return (
    <div style={{ background: "#131313", color: "#e5e2e1", minHeight: "100vh" }}>
      <Navbar session={session} />

      <main style={{ paddingTop: "7rem", paddingBottom: "6rem", paddingLeft: "5vw", paddingRight: "5vw", maxWidth: "56rem", margin: "0 auto" }}>
        <div className="flex items-start justify-between gap-6 flex-wrap mb-12">
          <div>
            <span className="label-caps block mb-3" style={{ color: "#f2ca50" }}>{profile.businessName}</span>
            <h1 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(28px,4vw,48px)", fontWeight: 400, color: "#e5e2e1" }}>
              My Services
            </h1>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/dashboard" className="label-caps transition-all hover:text-[#f2ca50]"
              style={{ color: "rgba(208,197,175,0.5)", fontSize: "11px" }}>
              ← Dashboard
            </Link>
            <Link href="/vendor/services/new"
              className="label-caps px-6 py-3 transition-all hover:opacity-90"
              style={{ background: "#f2ca50", color: "#3c2f00" }}>
              + Add Service
            </Link>
          </div>
        </div>

        {profile.services.length === 0 ? (
          <div className="border p-16 text-center" style={{ borderColor: "rgba(77,70,53,0.3)" }}>
            <span className="material-symbols-outlined block mb-4" style={{ fontSize: "40px", color: "rgba(208,197,175,0.2)" }}>inventory_2</span>
            <p style={{ fontFamily: "var(--font-noto-serif)", fontSize: "24px", color: "rgba(208,197,175,0.4)" }}>No services listed yet</p>
            <p className="text-sm mt-2 mb-6" style={{ color: "rgba(208,197,175,0.3)" }}>Add your first service package so celebrants can enquire.</p>
            <Link href="/vendor/services/new" className="label-caps inline-block px-8 py-3 transition-all hover:opacity-90"
              style={{ background: "#f2ca50", color: "#3c2f00" }}>
              Add a Service
            </Link>
          </div>
        ) : (
          <div className="border divide-y" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
            {profile.services.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-6 gap-4">
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: "var(--font-noto-serif)", fontSize: "19px", color: "#e5e2e1" }}>{s.title}</p>
                  <p className="text-sm mt-1 line-clamp-1" style={{ color: "rgba(208,197,175,0.55)", lineHeight: 1.5 }}>{s.description}</p>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <span style={{ fontFamily: "var(--font-noto-serif)", fontSize: "20px", color: "#f2ca50" }}>
                    ₦{s.priceFrom.toLocaleString()}
                    <span style={{ fontSize: "14px", color: "rgba(208,197,175,0.5)" }}>
                      {s.priceTo ? `–${s.priceTo.toLocaleString()}` : "+"}
                    </span>
                  </span>
                  <Link href={`/vendor/services/${s.id}/edit`}
                    className="label-caps transition-all hover:text-[#f2ca50]"
                    style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>
                    Edit
                  </Link>
                  <DeleteServiceButton id={s.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
