import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import VendorEditForm from "./VendorEditForm";

export default async function VendorEditPage() {
  const session = await auth();
  if (!session || session.user.role !== "VENDOR") redirect("/dashboard");

  const profile = await prisma.vendorProfile.findUnique({ where: { userId: session.user.id } });
  if (!profile) redirect("/vendor/setup");

  return (
    <div style={{ background: "#131313", color: "#e5e2e1", minHeight: "100vh" }}>
      <Navbar session={session} />

      <main style={{ paddingTop: "7rem", paddingBottom: "6rem", paddingLeft: "5vw", paddingRight: "5vw" }}>
        <div style={{ maxWidth: "580px", margin: "0 auto" }}>
          <div className="flex items-start justify-between gap-4 mb-10">
            <div>
              <span className="label-caps block mb-3" style={{ color: "#f2ca50" }}>Vendor Profile</span>
              <h1 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 400, color: "#e5e2e1" }}>
                Edit Profile
              </h1>
            </div>
            <Link href="/dashboard" className="label-caps flex items-center gap-2 mt-2 transition-all hover:text-[#f2ca50]"
              style={{ color: "rgba(208,197,175,0.5)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_back</span>
              Dashboard
            </Link>
          </div>

          <VendorEditForm profile={{
            businessName: profile.businessName,
            category: profile.category,
            location: profile.location,
            bio: profile.bio,
            coverImage: profile.coverImage ?? null,
            portfolio: JSON.parse(profile.portfolio || "[]"),
            instagram: profile.instagram ?? null,
            website: profile.website ?? null,
          }} />
        </div>
      </main>
    </div>
  );
}
