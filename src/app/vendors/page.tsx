import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Artisan Vendors",
  description: "Browse Nigeria's most distinguished event artisans — photographers, caterers, decorators, DJs, makeup artists, and more.",
  openGraph: {
    title: "Artisan Vendors | AYEYE",
    description: "Browse Nigeria's most distinguished event artisans.",
    type: "website",
  },
};
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "./SearchBar";
import FavouriteButton from "@/components/FavouriteButton";

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS);

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const [{ category, q }, session] = await Promise.all([searchParams, auth()]);
  const activeCategory = ALL_CATEGORIES.includes(category ?? "") ? category : undefined;
  const query = q?.trim() ?? "";

  const [vendors, savedIds] = await Promise.all([
    prisma.vendorProfile.findMany({
      where: {
        ...(activeCategory ? { category: activeCategory as never } : {}),
        ...(query ? {
          OR: [
            { businessName: { contains: query } },
            { location: { contains: query } },
            { bio: { contains: query } },
          ],
        } : {}),
      },
      orderBy: [{ verified: "desc" }, { createdAt: "desc" }],
      include: {
        services: true,
        reviews: { select: { rating: true } },
      },
    }),
    session?.user.role === "CELEBRANT"
      ? prisma.favourite.findMany({
          where: { celebrantId: session.user.id },
          select: { vendorProfileId: true },
        }).then((favs) => new Set(favs.map((f) => f.vendorProfileId)))
      : Promise.resolve(new Set<string>()),
  ]);

  const isCelebrant = session?.user.role === "CELEBRANT";

  return (
    <div style={{ background: "#131313", color: "#e5e2e1", minHeight: "100vh" }}>
      <Navbar session={session} />

      <main style={{ paddingTop: "7rem" }}>
        {/* Header */}
        <header style={{ padding: "3rem 5vw 2rem" }}>
          <div style={{ maxWidth: "56rem" }}>
            <span className="label-caps mb-4 block" style={{ color: "#f2ca50" }}>
              {activeCategory ? CATEGORY_LABELS[activeCategory] : "All Artisans"}
            </span>
            <h1 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(36px,5vw,72px)", fontWeight: 400, lineHeight: 1.1, color: "#e5e2e1", marginBottom: "1rem" }}>
              Artisan Vendors
            </h1>
            <p style={{ fontSize: "18px", fontWeight: 300, lineHeight: 1.6, color: "rgba(208,197,175,0.8)", maxWidth: "40rem" }}>
              A curated selection of Nigeria&apos;s most distinguished event artisans. From award-winning photographers to master caterers, discover the vendors behind the finest celebrations.
            </p>
          </div>
        </header>

        {/* Search */}
        <div style={{ padding: "0 5vw 1.5rem" }}>
          <SearchBar initialQuery={query} />
        </div>

        {/* Filter Bar */}
        <section className="sticky z-40 py-4 border-y no-scrollbar"
          style={{ top: "88px", background: "rgba(19,19,19,0.97)", backdropFilter: "blur(8px)", borderColor: "rgba(77,70,53,0.4)", overflowX: "auto" }}>
          <div className="flex items-center gap-8 no-scrollbar" style={{ paddingLeft: "5vw", paddingRight: "5vw", whiteSpace: "nowrap" }}>
            <Link href={query ? `/vendors?q=${encodeURIComponent(query)}` : "/vendors"}
              className="label-caps transition-colors duration-300"
              style={{ color: !activeCategory ? "#f2ca50" : "rgba(208,197,175,0.7)" }}>
              All Artisans
            </Link>
            {ALL_CATEGORIES.map((cat) => (
              <Link key={cat}
                href={`/vendors?category=${cat}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                className="label-caps transition-colors duration-300 hover:text-[#f2ca50]"
                style={{ color: activeCategory === cat ? "#f2ca50" : "rgba(208,197,175,0.7)" }}>
                {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
              </Link>
            ))}
          </div>
        </section>

        {/* Vendor Grid */}
        <section style={{ padding: "4rem 5vw 8rem" }}>
          {vendors.length === 0 ? (
            <div className="text-center py-32">
              <p style={{ fontFamily: "var(--font-noto-serif)", fontSize: "32px", color: "rgba(208,197,175,0.4)", marginBottom: "1rem" }}>
                No vendors found.
              </p>
              <Link href="/vendors" className="label-caps pb-1 transition-all"
                style={{ color: "#f2ca50", borderBottom: "1px solid #f2ca50" }}>
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="masonry-grid">
              {vendors.map((v, i) => {
                const avgRating = v.reviews.length
                  ? v.reviews.reduce((s, r) => s + r.rating, 0) / v.reviews.length
                  : null;
                const offsets = [0, 6, 0, 3, 9, 0];
                const mtRem = i > 0 ? offsets[i % offsets.length] : 0;

                return (
                  <div key={v.id} className="masonry-item masonry-stagger group relative"
                    style={{ "--stagger": `${mtRem}rem` } as React.CSSProperties}>
                    <Link href={`/vendors/${v.slug ?? v.id}`} className="block">
                      <div className="relative overflow-hidden mb-4" style={{ aspectRatio: i % 3 === 1 ? "3/4" : "4/5", background: "#201f1f" }}>
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

                    {/* Save button — outside the Link, absolutely positioned */}
                    {isCelebrant && (
                      <div className="absolute top-4 right-4 z-10 p-1.5"
                        style={{ background: "rgba(19,19,19,0.7)", backdropFilter: "blur(4px)" }}>
                        <FavouriteButton vendorProfileId={v.id} initialSaved={savedIds.has(v.id)} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
