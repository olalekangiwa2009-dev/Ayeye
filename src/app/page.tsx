import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AYEYE | The Art of Celebration",
  description: "A curated ecosystem for Nigeria's most distinguished events. Find verified photographers, caterers, decorators, DJs and more.",
  openGraph: {
    title: "AYEYE | The Art of Celebration",
    description: "A curated ecosystem for Nigeria's most distinguished events.",
    type: "website",
  },
};
import Footer from "@/components/Footer";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/categories";

/* Curated editorial images (from Stitch design export) */
const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB82L-lYHu_TywwwvSUOv2k7vzAg8lj2qHLgY9ARHSxOGlp2JtWRpmS16DUAK8aemog0sdeQd2fr30lLW7fr9YhqDkrZ9iCFCdyt_XTCIzN80IK7NJ9Rym2tIBstXetojnRvZfDzxoVjlG3IXnKjQ_Kh3CJRgByE2u3JMVvgUWpl9-CaxD26WMggPpNETJBy6MDWXX1MOjEbuF0RHFZKTnRy3aYyRMnpHQVxQR-YXW4-hUo1Y7I9nfBJsgZpdHsuwRJzDYOdMv50xxF";

const COLLECTION = [
  {
    key: "PHOTOGRAPHY",
    num: "01",
    caption: "Award-winning editorial photography and cinematic film.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDFIyuTW4V3Ck56MH0f7KKaA9k2iD3bOC4UARDBXBrGyYZKek_dGkGANY258PKL0NyXSzUxtndnYN3G_aVv9Y4ZaihXQ3ACjfIF-DO_os9p6tRMg3pxj6DVvIWZfhnmPGJhW9clTCOLyk2ngzThxu9aGXj-zsqJ7aaRzqcZ9V9PbXscr0fezhnovlej-loHbLeT3oSID8_vciTZDLuJ9jstrPtRBBZyLt7hqpH_qO_LkMfd4PoeEJM55Ufuh0Cj8rOYUTefvlfy2TQ",
  },
  {
    key: "CATERING",
    num: "02",
    caption: "Exquisite culinary experiences crafted for the most discerning palates.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWd9LreIiSBSl81L9y-bK05KyeY3TS1I1aMrql64_F_sEbS6L6XFNrXvIlzftwwPiHlwTMA2Zl8D_lhP2VLGQk8rC1fX0kuLq1vswrnLPFPPqCAcf_MiVZR2NFB6HQo-vYAsgqQfVxfT0guM3bYwXKiAv_77Xd_VUo96tWCd8WRg2_VhtI8qmCoyLTH-Tud5mfyNJVHkF7Dh6o-4BrpIplnLAnd47GwMaldYotqlFkQFO3yQyp9PMulACvJHmfBDKawrdonuJE9i72",
  },
  {
    key: "DECORATION",
    num: "03",
    caption: "Bespoke botanical installations that redefine the atmosphere.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2COoBxpRyt8pdVCGS2fppV1m5XDitHdfX5zJotCyspcyyj1Gv1U4Oq3qwHk5SzVamuofNvoETf2JTpz9ZtvxO7Vopjz6DeL69Q7yOSSwBCgKXelUTgw-RUBLV7YXZtS0OS5uplo_M-SCQqoTol1UdCdLtS9shNwWHMZoDHoazZ45BjD1xRSzEg7AeYTnZWuEgmy22S0gzxm5zvfyAhxZT7NFbXc5Y9svxbgiVc5v9dLtzP4nDJ2c1u-nXEoMMCicVpv5xXfWBUxoO",
  },
];

const EDITORIAL_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCebwjE_-W1viic3RX75w8hzgPwpKvOCX4jFuHvHP7JR5vRNMRWj97_gC3Y8k-Ze-vZX9MSrk9s4onrwrsn29o-qxKqMBSriqlntrStPegcZQrGpOr0ECoOBiOPtkj6IM0WPfeoLkYhtQeBhIZyodZWsr5bGgDbHW6dORCNOVb0za9hrA49N_2_zAjBAiTmlxBkdwmjs2X3PkzZQFWCanIxtg05XuMewirkPQOJ9KQJ8m9Y0z0qVEWoQfOoT0PL9IoLTnladl12YO61";

/* Fallback images for vendor cards without a coverImage */
const FALLBACK_IMGS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCWd9LreIiSBSl81L9y-bK05KyeY3TS1I1aMrql64_F_sEbS6L6XFNrXvIlzftwwPiHlwTMA2Zl8D_lhP2VLGQk8rC1fX0kuLq1vswrnLPFPPqCAcf_MiVZR2NFB6HQo-vYAsgqQfVxfT0guM3bYwXKiAv_77Xd_VUo96tWCd8WRg2_VhtI8qmCoyLTH-Tud5mfyNJVHkF7Dh6o-4BrpIplnLAnd47GwMaldYotqlFkQFO3yQyp9PMulACvJHmfBDKawrdonuJE9i72",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAKrVV3L9aOVJqUF2lbA61d1hDQhiKZumhx4Hd-_o_rEAa506vyeDTeC2-JOo6kd1VQehyJMZpoRQEsNb6DQGh9biHZMzm3tHPCm4_ufTHhc4y7upVImZLwD5YRHBFidTqxtU3qbapyxVemahR9sm8tMBNQEAtFwMmNm39LdhZgbPDIvfP9BMBVxJPxzE3iUjxxR5cVIrRqT6Ei6jBcYyOQxOupsdOr3QlIfIawC6hnIGcj8508FKdz1kyC8t1KQNmaFLv4U7rzAjrY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCu0jTMQ9tZZX56lL1bZ1__fJ3lwfaMjRbX6_JRJz_4uDpqB_a14VcTLM6JHZIOzD1VQ7ztUIPQVu_FXAS9CPZVuu_EhUDDC_rux7Q9h0rHZ7FY6CAATrpLfIeY-eMAF9PS40IRZ5OAZdOJ3gXn0_eLv0xVFtYr5CQaFUifJZjF1H-GtZLYulibLn_MNVM3gE-36fuA4Vr2ggEUS90YckXa-YkHVf4BlOu5jf9XV8DABzcqYlhEs7t9yVcdL_10QA9mdzUyoh20e3jX",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA2COoBxpRyt8pdVCGS2fppV1m5XDitHdfX5zJotCyspcyyj1Gv1U4Oq3qwHk5SzVamuofNvoETf2JTpz9ZtvxO7Vopjz6DeL69Q7yOSSwBCgKXelUTgw-RUBLV7YXZtS0OS5uplo_M-SCQqoTol1UdCdLtS9shNwWHMZoDHoazZ45BjD1xRSzEg7AeYTnZWuEgmy22S0gzxm5zvfyAhxZT7NFbXc5Y9svxbgiVc5v9dLtzP4nDJ2c1u-nXEoMMCicVpv5xXfWBUxoO",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDDFIyuTW4V3Ck56MH0f7KKaA9k2iD3bOC4UARDBXBrGyYZKek_dGkGANY258PKL0NyXSzUxtndnYN3G_aVv9Y4ZaihXQ3ACjfIF-DO_os9p6tRMg3pxj6DVvIWZfhnmPGJhW9clTCOLyk2ngzThxu9aGXj-zsqJ7aaRzqcZ9V9PbXscr0fezhnovlej-loHbLeT3oSID8_vciTZDLuJ9jstrPtRBBZyLt7hqpH_qO_LkMfd4PoeEJM55Ufuh0Cj8rOYUTefvlfy2TQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCebwjE_-W1viic3RX75w8hzgPwpKvOCX4jFuHvHP7JR5vRNMRWj97_gC3Y8k-Ze-vZX9MSrk9s4onrwrsn29o-qxKqMBSriqlntrStPegcZQrGpOr0ECoOBiOPtkj6IM0WPfeoLkYhtQeBhIZyodZWsr5bGgDbHW6dORCNOVb0za9hrA49N_2_zAjBAiTmlxBkdwmjs2X3PkzZQFWCanIxtg05XuMewirkPQOJ9KQJ8m9Y0z0qVEWoQfOoT0PL9IoLTnladl12YO61",
];

export default async function HomePage() {
  const [session, featured] = await Promise.all([
    auth(),
    prisma.vendorProfile.findMany({
      where: { verified: true },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { reviews: { select: { rating: true } } },
    }),
  ]);

  return (
    <div style={{ background: "#131313", color: "#e5e2e1" }}>
      <Navbar session={session} />

      {/* ── HERO ── */}
      <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <Image
          src={HERO_IMG}
          alt="Elegant wedding celebration"
          fill
          priority
          className="object-cover"
          style={{ filter: "brightness(0.45) saturate(0.8)" }}
        />
        {/* gradient vignette */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(19,19,19,0.3) 0%, rgba(19,19,19,0.1) 40%, rgba(19,19,19,0.6) 100%)" }} />

        <div className="relative z-10 text-center" style={{ padding: "0 5vw" }}>
          <p className="label-caps mb-6" style={{ color: "#f2ca50", letterSpacing: "0.4em" }}>EST. 2024 · NIGERIA</p>
          <h1 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(52px,9vw,104px)", fontWeight: 400, lineHeight: 1.02, letterSpacing: "-0.02em", color: "#e5e2e1", marginBottom: "1.5rem", textShadow: "0 2px 32px rgba(0,0,0,0.5)" }}>
            The Art of<br />Celebration.
          </h1>
          <p style={{ fontSize: "18px", fontWeight: 300, lineHeight: 1.6, color: "rgba(229,226,225,0.82)", maxWidth: "36rem", margin: "0 auto 3rem", fontStyle: "italic" }}>
            A curated ecosystem for Nigeria&apos;s most distinguished events. Find verified photographers, caterers, decorators, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vendors"
              className="label-caps px-10 py-4 border transition-all duration-500 hover:bg-[#f2ca50] hover:text-[#3c2f00]"
              style={{ borderColor: "#f2ca50", color: "#f2ca50", backdropFilter: "blur(4px)" }}>
              Discover Vendors
            </Link>
            <Link href="/register"
              className="label-caps px-10 py-4 transition-all duration-300 hover:opacity-90"
              style={{ background: "#d4af37", color: "#3c2f00" }}>
              Join as Vendor
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 flex items-center gap-3" style={{ left: "5vw" }}>
          <div style={{ width: "32px", height: "1px", background: "#f2ca50", opacity: 0.5 }} />
          <span className="label-caps" style={{ color: "rgba(242,202,80,0.5)", letterSpacing: "0.3em" }}>Scroll to explore</span>
        </div>

        {/* corner stat */}
        <div className="absolute bottom-10 right-[5vw] text-right hidden md:block">
          <p style={{ fontFamily: "var(--font-noto-serif)", fontSize: "36px", color: "rgba(242,202,80,0.7)", lineHeight: 1 }}>16+</p>
          <p className="label-caps" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px", marginTop: "4px" }}>Vendor categories</p>
        </div>
      </header>

      {/* ── CURATED COLLECTION ── */}
      <section style={{ padding: "8rem 5vw", background: "#131313" }}>
        <div className="mb-14 pl-6" style={{ borderLeft: "2px solid #f2ca50" }}>
          <span className="label-caps" style={{ color: "#f2ca50" }}>The Portfolio</span>
          <h2 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 400, marginTop: "0.5rem", color: "#e5e2e1" }}>
            Curated Collection
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COLLECTION.map(({ key, num, caption, img }, i) => (
            <Link key={key} href={`/vendors?category=${key}`}
              className="masonry-stagger group cursor-pointer block"
              style={{ "--stagger": i === 1 ? "5rem" : "0rem" } as React.CSSProperties}>
              <div className="relative overflow-hidden mb-5 border" style={{ aspectRatio: "3/4", borderColor: "rgba(242,202,80,0.08)" }}>
                <Image
                  src={img}
                  alt={CATEGORY_LABELS[key]}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                  style={{ filter: "grayscale(20%)" }}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.45)" }}>
                  <span className="label-caps pb-1" style={{ color: "#f2ca50", borderBottom: "1px solid #f2ca50", letterSpacing: "0.25em" }}>
                    Browse {CATEGORY_LABELS[key]}
                  </span>
                </div>
              </div>
              <span className="label-caps block mb-1" style={{ color: "#f2ca50" }}>{num}</span>
              <h3 className="group-hover:text-[#f2ca50] transition-colors duration-300"
                style={{ fontFamily: "var(--font-noto-serif)", fontSize: "28px", fontWeight: 400, color: "#e5e2e1" }}>
                {CATEGORY_LABELS[key]}
              </h3>
              <p className="mt-3 pt-4 text-sm" style={{ borderTop: "1px solid rgba(242,202,80,0.15)", color: "rgba(208,197,175,0.75)", lineHeight: 1.7 }}>
                {caption}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── EDITORIAL FEATURE ── */}
      <section style={{ padding: "0", background: "#e4e4cc" }}>
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* image side */}
          <div className="lg:col-span-7 relative" style={{ minHeight: "600px" }}>
            <Image src={EDITORIAL_IMG} alt="Luxury celebration" fill className="object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, #e4e4cc 100%)" }} />
          </div>
          {/* text side */}
          <div className="lg:col-span-5 flex items-center" style={{ padding: "4rem 5vw" }}>
            <div>
              <span className="label-caps block mb-4" style={{ color: "#474836" }}>Editorial Feature</span>
              <h2 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 400, lineHeight: 1.2, color: "#1b1d0e", marginBottom: "1.5rem" }}>
                Every Celebration<br />Deserves a Masterpiece
              </h2>
              <p className="mb-8" style={{ fontSize: "17px", fontWeight: 300, lineHeight: 1.8, color: "#474836" }}>
                From intimate naming ceremonies to grand traditional weddings, Ayeye connects you with Nigeria&apos;s most distinguished artisans — each handpicked for quality, creativity, and reliability.
              </p>
              <Link href="/vendors"
                className="inline-flex items-center gap-3 label-caps pb-1 transition-all group"
                style={{ color: "#1b1d0e", borderBottom: "1px solid rgba(27,29,14,0.4)" }}>
                Explore All Vendors
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1" style={{ fontSize: "16px" }}>arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED VENDORS ── */}
      {featured.length > 0 && (
        <section style={{ padding: "8rem 5vw", background: "#0e0e0e" }}>
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="label-caps" style={{ color: "#f2ca50" }}>Verified Artisans</span>
              <h2 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 400, color: "#e5e2e1", marginTop: "0.5rem" }}>
                Featured Vendors
              </h2>
            </div>
            <Link href="/vendors" className="label-caps pb-1 flex items-center gap-2 group"
              style={{ color: "#f2ca50", borderBottom: "1px solid #f2ca50" }}>
              View All
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1" style={{ fontSize: "14px" }}>arrow_forward</span>
            </Link>
          </div>

          <div className="masonry-grid">
            {featured.map((v, idx) => {
              const avg = v.reviews.length
                ? (v.reviews.reduce((s, r) => s + r.rating, 0) / v.reviews.length).toFixed(1)
                : null;
              const coverSrc = v.coverImage || FALLBACK_IMGS[idx % FALLBACK_IMGS.length];
              return (
                <Link key={v.id} href={`/vendors/${v.slug ?? v.id}`} className="masonry-item group cursor-pointer block">
                  <div className="relative overflow-hidden mb-4" style={{ aspectRatio: idx % 3 === 1 ? "3/4" : "4/5" }}>
                    <Image src={coverSrc} alt={v.businessName} fill
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                      style={{ filter: "grayscale(20%) brightness(0.9)" }}
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
                      style={{ background: "rgba(0,0,0,0.45)" }}>
                      <span className="label-caps pb-1" style={{ color: "#f2ca50", borderBottom: "1px solid #f2ca50", letterSpacing: "0.25em" }}>
                        View Profile
                      </span>
                    </div>
                    {v.verified && (
                      <span className="absolute top-4 left-4 label-caps px-3 py-1"
                        style={{ background: "#d4af37", color: "#3c2f00", fontSize: "10px" }}>
                        Verified
                      </span>
                    )}
                  </div>
                  <h3 className="group-hover:text-[#f2ca50] transition-colors duration-300"
                    style={{ fontFamily: "var(--font-noto-serif)", fontSize: "24px", fontWeight: 400, color: "#e5e2e1" }}>
                    {v.businessName}
                  </h3>
                  <p className="label-caps mt-1" style={{ color: "rgba(208,197,175,0.7)" }}>
                    {CATEGORY_ICONS[v.category]} {CATEGORY_LABELS[v.category]}
                    {avg && <span className="ml-3" style={{ color: "#f2ca50" }}>★ {avg}</span>}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── FULL-BLEED MARQUEE STRIP ── */}
      <div style={{ background: "#f2ca50", padding: "1.25rem 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="label-caps inline-block mx-8" style={{ color: "#3c2f00", fontSize: "11px", letterSpacing: "0.25em" }}>
            Photography · Catering · Decoration · Music & DJ · Makeup & Hair · Asoebi · Cake & Desserts · Venues · MC Services
            <span className="mx-8">✦</span>
          </span>
        ))}
      </div>

      {/* ── VENDOR CTA ── */}
      <section style={{ padding: "8rem 5vw", background: "#201f1f" }}>
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="label-caps" style={{ color: "#f2ca50" }}>For Event Vendors</span>
          <h2 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 400, color: "#e5e2e1", marginTop: "1rem" }}>
            Join the Platform
          </h2>
          <p className="mt-6" style={{ color: "rgba(208,197,175,0.8)", fontSize: "18px", lineHeight: 1.7, fontWeight: 300 }}>
            Reach Nigeria&apos;s most discerning celebrants. Create your verified vendor profile and start receiving enquiries for their most important celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {[
            { icon: "verified", title: "Get Verified", body: "Build trust with celebrants through our verification badge.", num: "01" },
            { icon: "gallery_thumbnail", title: "Showcase Work", body: "Upload portfolio images and service packages with pricing.", num: "02" },
            { icon: "mail", title: "Receive Enquiries", body: "Celebrants send direct enquiries to your vendor inbox.", num: "03" },
          ].map((item, i) => (
            <div key={item.icon}
              className="p-10 border-t border-l transition-all duration-500 hover:bg-[rgba(242,202,80,0.04)]"
              style={{ borderColor: "rgba(242,202,80,0.12)", borderRight: i === 2 ? "1px solid rgba(242,202,80,0.12)" : "none", borderBottom: "1px solid rgba(242,202,80,0.12)" }}>
              <p className="label-caps mb-6" style={{ color: "rgba(242,202,80,0.35)", fontSize: "10px" }}>{item.num}</p>
              <div className="inline-flex items-center justify-center w-14 h-14 mb-5 border" style={{ borderColor: "rgba(242,202,80,0.4)" }}>
                <span className="material-symbols-outlined" style={{ color: "#f2ca50", fontSize: "26px" }}>{item.icon}</span>
              </div>
              <h4 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "24px", color: "#e5e2e1", marginBottom: "0.75rem" }}>{item.title}</h4>
              <p style={{ color: "rgba(208,197,175,0.7)", fontSize: "15px", lineHeight: 1.7 }}>{item.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link href="/register"
            className="label-caps inline-block px-12 py-5 transition-all hover:opacity-90"
            style={{ background: "#f2ca50", color: "#3c2f00", letterSpacing: "0.2em" }}>
            Register as a Vendor
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
