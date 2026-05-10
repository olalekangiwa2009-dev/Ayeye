import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/categories";
import EnquiryForm from "@/components/EnquiryForm";
import ReviewSection from "./ReviewSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FavouriteButton from "@/components/FavouriteButton";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await prisma.vendorProfile.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    select: { businessName: true, bio: true, category: true, location: true, coverImage: true, slug: true, id: true },
  });

  if (!vendor) return { title: "Vendor Not Found" };

  const title = vendor.businessName;
  const category = CATEGORY_LABELS[vendor.category] ?? vendor.category;
  const description = `${category} in ${vendor.location}. ${vendor.bio.slice(0, 120)}${vendor.bio.length > 120 ? "…" : ""}`;
  const url = `/vendors/${vendor.slug ?? vendor.id}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | AYEYE`,
      description,
      type: "profile",
      url,
      ...(vendor.coverImage ? { images: [{ url: vendor.coverImage, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | AYEYE`,
      description,
      ...(vendor.coverImage ? { images: [vendor.coverImage] } : {}),
    },
  };
}

export default async function VendorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [vendor, session] = await Promise.all([
    prisma.vendorProfile.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: {
        user: { select: { name: true } },
        services: { orderBy: { createdAt: "asc" } },
        reviews: {
          orderBy: { createdAt: "desc" },
          include: { celebrant: { select: { name: true } } },
        },
      },
    }),
    auth(),
  ]);

  if (!vendor) notFound();

  let portfolio: string[] = [];
  try { portfolio = JSON.parse(vendor.portfolio || "[]"); } catch { portfolio = []; }
  const isCelebrant = session?.user.role === "CELEBRANT";
  const isOwnProfile = session?.user.role === "VENDOR" &&
    (await prisma.vendorProfile.findUnique({ where: { userId: session.user.id } }))?.id === vendor.id;

  const [hasReviewed, isSaved] = await Promise.all([
    isCelebrant
      ? prisma.review.findFirst({ where: { celebrantId: session!.user.id, vendorProfileId: vendor.id } }).then(Boolean)
      : Promise.resolve(false),
    isCelebrant
      ? prisma.favourite.findUnique({
          where: { celebrantId_vendorProfileId: { celebrantId: session!.user.id, vendorProfileId: vendor.id } },
        }).then(Boolean)
      : Promise.resolve(false),
  ]);

  const avgRating = vendor.reviews.length
    ? vendor.reviews.reduce((sum, r) => sum + r.rating, 0) / vendor.reviews.length
    : null;

  return (
    <div style={{ background: "#131313", color: "#e5e2e1", minHeight: "100vh" }}>
      <Navbar session={session} />

      {/* Hero Cover */}
      <div className="relative w-full overflow-hidden" style={{ height: "65vh", marginTop: 0 }}>
        {vendor.coverImage ? (
          <Image src={vendor.coverImage} alt={vendor.businessName} fill className="object-cover" style={{ filter: "brightness(0.55)" }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0e0e0e 0%, #201f1f 100%)" }}>
            <span style={{ fontSize: "140px", opacity: 0.12 }}>{CATEGORY_ICONS[vendor.category] ?? "✨"}</span>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #131313 0%, transparent 60%)" }} />

        {/* Floating header info */}
        <div className="absolute bottom-0 left-0 right-0" style={{ padding: "clamp(1.5rem,4vw,3rem) 5vw" }}>
          <span className="label-caps block mb-3" style={{ color: "#f2ca50" }}>
            {CATEGORY_ICONS[vendor.category]} {CATEGORY_LABELS[vendor.category]}
          </span>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h1 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(32px,5vw,64px)", fontWeight: 400, color: "#e5e2e1", lineHeight: 1.1 }}>
                {vendor.businessName}
              </h1>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <span className="label-caps flex items-center gap-1" style={{ color: "rgba(208,197,175,0.7)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>location_on</span>
                  {vendor.location}
                </span>
                {vendor.verified && (
                  <span className="label-caps px-3 py-1" style={{ background: "#d4af37", color: "#3c2f00", fontSize: "10px" }}>
                    ✓ Verified
                  </span>
                )}
                {avgRating !== null && (
                  <span className="label-caps" style={{ color: "#f2ca50" }}>
                    ★ {avgRating.toFixed(1)} ({vendor.reviews.length} review{vendor.reviews.length !== 1 ? "s" : ""})
                  </span>
                )}
                {vendor.instagram && (
                  <a href={`https://instagram.com/${vendor.instagram}`} target="_blank" rel="noopener noreferrer"
                    className="label-caps flex items-center gap-1 transition-colors hover:text-[#f2ca50]"
                    style={{ color: "rgba(208,197,175,0.7)" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    @{vendor.instagram}
                  </a>
                )}
                {vendor.website && (
                  <a href={vendor.website} target="_blank" rel="noopener noreferrer"
                    className="label-caps flex items-center gap-1 transition-colors hover:text-[#f2ca50]"
                    style={{ color: "rgba(208,197,175,0.7)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>language</span>
                    Website
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isCelebrant && (
                <div className="flex items-center gap-2 px-4 py-3 border"
                  style={{ borderColor: "rgba(77,70,53,0.6)", background: "rgba(19,19,19,0.7)" }}>
                  <FavouriteButton vendorProfileId={vendor.id} initialSaved={isSaved} />
                  <span className="label-caps" style={{ color: "rgba(208,197,175,0.6)", fontSize: "10px" }}>
                    Save
                  </span>
                </div>
              )}
              {isOwnProfile && (
                <Link href="/vendor/edit"
                  className="label-caps px-6 py-3 border transition-all hover:bg-[#f2ca50] hover:text-[#3c2f00]"
                  style={{ borderColor: "#f2ca50", color: "#f2ca50" }}>
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "4rem 5vw 8rem", maxWidth: "80rem", margin: "0 auto" }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-16">

            {/* Bio */}
            <div>
              <span className="label-caps block mb-4" style={{ color: "rgba(208,197,175,0.5)" }}>About</span>
              <p style={{ fontSize: "18px", fontWeight: 300, lineHeight: 1.8, color: "rgba(229,226,225,0.85)" }}>
                {vendor.bio}
              </p>
            </div>

            {/* Portfolio */}
            {portfolio.length > 0 && (
              <div>
                <span className="label-caps block mb-4" style={{ color: "rgba(208,197,175,0.5)" }}>Portfolio</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {portfolio.map((url, i) => (
                    <div key={i} className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
                      <Image src={url} alt={`Portfolio ${i + 1}`} fill className="object-cover transition-all duration-700 hover:scale-105" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            <div>
              <span className="label-caps block mb-6" style={{ color: "rgba(208,197,175,0.5)" }}>Services & Packages</span>
              {vendor.services.length === 0 ? (
                <p style={{ color: "rgba(208,197,175,0.4)", fontStyle: "italic" }}>No services listed yet.</p>
              ) : (
                <div className="space-y-px">
                  {vendor.services.map((s) => {
                    let serviceImages: string[] = [];
                    try { serviceImages = JSON.parse(s.images || "[]"); } catch { serviceImages = []; }
                    return (
                      <div key={s.id} className="border-t" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
                        {serviceImages.length > 0 && (
                          <div className="flex gap-1 py-3">
                            {serviceImages.map((img, i) => (
                              <div key={i} className="relative flex-1 overflow-hidden" style={{ height: "100px" }}>
                                <Image src={img} alt="" fill className="object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-start justify-between py-5">
                          <div className="flex-1">
                            <h3 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "22px", fontWeight: 400, color: "#e5e2e1" }}>{s.title}</h3>
                            <p className="mt-1 text-sm" style={{ color: "rgba(208,197,175,0.7)", lineHeight: 1.6 }}>{s.description}</p>
                          </div>
                          <div className="ml-8 text-right shrink-0">
                            <p style={{ fontFamily: "var(--font-noto-serif)", fontSize: "22px", color: "#f2ca50" }}>
                              ₦{s.priceFrom.toLocaleString()}
                              <span style={{ fontSize: "16px", color: "rgba(208,197,175,0.6)" }}>
                                {s.priceTo ? ` – ₦${s.priceTo.toLocaleString()}` : "+"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="border-t" style={{ borderColor: "rgba(77,70,53,0.4)" }} />
                </div>
              )}
            </div>

            {/* Reviews */}
            <ReviewSection
              vendorProfileId={vendor.id}
              vendorName={vendor.businessName}
              reviews={vendor.reviews.map((r) => ({
                id: r.id,
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt.toISOString(),
                celebrantName: r.celebrant.name ?? "Anonymous",
              }))}
              isCelebrant={isCelebrant}
              hasReviewed={hasReviewed}
            />
          </div>

          {/* Sidebar: Enquiry */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              {isCelebrant && (
                <div className="p-8 border mb-6" style={{ borderColor: "rgba(77,70,53,0.5)", background: "#1c1b1b" }}>
                  <span className="label-caps block mb-4" style={{ color: "#f2ca50" }}>Send Enquiry</span>
                  <EnquiryForm vendorProfileId={vendor.id} vendorName={vendor.businessName} />
                </div>
              )}
              {!session && (
                <div className="p-8 border text-center" style={{ borderColor: "rgba(77,70,53,0.5)", background: "#1c1b1b" }}>
                  <p style={{ fontFamily: "var(--font-noto-serif)", fontSize: "20px", color: "#e5e2e1", marginBottom: "0.75rem" }}>
                    Interested in {vendor.businessName}?
                  </p>
                  <p className="text-sm mb-6" style={{ color: "rgba(208,197,175,0.7)", lineHeight: 1.6 }}>
                    Sign in as a celebrant to send an enquiry.
                  </p>
                  <Link href="/login"
                    className="label-caps block w-full py-4 text-center transition-all hover:opacity-90"
                    style={{ background: "#f2ca50", color: "#3c2f00" }}>
                    Sign In to Enquire
                  </Link>
                </div>
              )}

              <div className="mt-6">
                <Link href="/vendors" className="label-caps flex items-center gap-2 transition-all hover:text-[#f2ca50]"
                  style={{ color: "rgba(208,197,175,0.6)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_back</span>
                  All Vendors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
