import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Saved Vendors",
  robots: { index: false },
};
import Link from "next/link";
import Image from "next/image";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/categories";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FavouriteButton from "@/components/FavouriteButton";

export default async function FavouritesPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "CELEBRANT") redirect("/dashboard");

  const favourites = await prisma.favourite.findMany({
    where: { celebrantId: session.user.id },
    include: {
      vendorProfile: {
        include: {
          services: { select: { id: true } },
          reviews: { select: { rating: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ background: "#131313", color: "#e5e2e1", minHeight: "100vh" }}>
      <Navbar session={session} />

      <main style={{ paddingTop: "7rem", paddingBottom: "8rem" }}>
        <header style={{ padding: "3rem 5vw 2rem" }}>
          <div style={{ maxWidth: "56rem" }}>
            <span className="label-caps mb-4 block" style={{ color: "#f2ca50" }}>Saved</span>
            <h1 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(36px,5vw,72px)", fontWeight: 400, lineHeight: 1.1, color: "#e5e2e1", marginBottom: "1rem" }}>
              My Favourites
            </h1>
            <p style={{ fontSize: "18px", fontWeight: 300, lineHeight: 1.6, color: "rgba(208,197,175,0.8)" }}>
              {favourites.length === 0
                ? "Vendors you save will appear here."
                : `${favourites.length} vendor${favourites.length !== 1 ? "s" : ""} saved.`}
            </p>
          </div>
        </header>

        <div style={{ padding: "2rem 5vw 0" }}>
          {favourites.length === 0 ? (
            <div className="text-center py-32 border-t" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
              <span className="material-symbols-outlined block mb-6" style={{ fontSize: "64px", color: "rgba(208,197,175,0.2)" }}>
                favorite
              </span>
              <p style={{ fontFamily: "var(--font-noto-serif)", fontSize: "28px", color: "rgba(208,197,175,0.4)", marginBottom: "1.5rem" }}>
                No saved vendors yet.
              </p>
              <Link href="/vendors" className="label-caps pb-1 transition-all"
                style={{ color: "#f2ca50", borderBottom: "1px solid #f2ca50" }}>
                Browse vendors
              </Link>
            </div>
          ) : (
            <div className="masonry-grid">
              {favourites.map(({ vendorProfile: v }, i) => {
                const avgRating = v.reviews.length
                  ? v.reviews.reduce((s, r) => s + r.rating, 0) / v.reviews.length
                  : null;
                const offsets = [0, 6, 0, 3, 9, 0];
                const mtRem = i > 0 ? offsets[i % offsets.length] : 0;

                return (
                  <div key={v.id} className="masonry-item masonry-stagger group relative"
                    style={{ "--stagger": `${mtRem}rem` } as React.CSSProperties}>
                    <Link href={`/vendors/${v.slug ?? v.id}`} className="block">
                      <div className="relative overflow-hidden mb-4"
                        style={{ aspectRatio: i % 3 === 1 ? "3/4" : "4/5", background: "#201f1f" }}>
                        {v.coverImage ? (
                          <Image src={v.coverImage} alt={v.businessName} fill
                            className="object-cover transition-all duration-700 group-hover:scale-105"
                            style={{ filter: "grayscale(25%)" }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span style={{ fontSize: "72px", opacity: 0.15 }}>{CATEGORY_ICONS[v.category] ?? "✨"}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
                          style={{ background: "rgba(0,0,0,0.45)" }}>
                          <span className="label-caps pb-1" style={{ color: "#f2ca50", borderBottom: "1px solid #f2ca50", letterSpacing: "0.3em" }}>
                            View Portfolio
                          </span>
                        </div>
                        {v.verified && (
                          <span className="absolute top-4 left-4 label-caps px-3 py-1"
                            style={{ background: "#d4af37", color: "#3c2f00", fontSize: "10px" }}>
                            Verified
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <h3 className="group-hover:text-[#f2ca50] transition-colors duration-300"
                          style={{ fontFamily: "var(--font-noto-serif)", fontSize: "28px", fontWeight: 400, color: "#e5e2e1" }}>
                          {v.businessName}
                        </h3>
                        <p className="label-caps mt-1 flex items-center gap-2" style={{ color: "rgba(208,197,175,0.8)" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>location_on</span>
                          {v.location.toUpperCase()}
                          {avgRating && (
                            <span className="ml-2" style={{ color: "#f2ca50" }}>★ {avgRating.toFixed(1)}</span>
                          )}
                        </p>
                        <p className="label-caps mt-0.5" style={{ color: "rgba(208,197,175,0.5)" }}>
                          {CATEGORY_LABELS[v.category]} · {v.services.length} service{v.services.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </Link>

                    <div className="absolute top-4 right-4 z-10 p-1.5"
                      style={{ background: "rgba(19,19,19,0.7)", backdropFilter: "blur(4px)" }}>
                      <FavouriteButton vendorProfileId={v.id} initialSaved={true} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
