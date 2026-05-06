"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface Props {
  session?: { user: { role: string; email?: string | null } } | null;
}

const links = [
  { label: "Explore", href: "/" },
  { label: "Vendors", href: "/vendors" },
  { label: "Dashboard", href: "/dashboard" },
];

const celebrantLinks = [
  { label: "Saved", href: "/favourites", icon: "favorite" },
];

export default function Navbar({ session }: Props) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [path]);
  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isCelebrant = session?.user?.role === "CELEBRANT";

  const allLinks = [
    ...links,
    ...(isCelebrant ? celebrantLinks : []),
    ...(isAdmin ? [{ label: "Admin", href: "/admin", icon: "" }] : []),
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md transition-colors duration-500"
        style={{ background: "rgba(19,19,19,0.85)" }}>
        <div className="flex justify-between items-center w-full" style={{ paddingLeft: "5vw", paddingRight: "5vw", paddingTop: "1.25rem", paddingBottom: "1.25rem" }}>
          <Link href="/"
            className="text-[#f2ca50] tracking-tighter"
            style={{ fontFamily: "var(--font-noto-serif)", fontSize: "26px", fontWeight: 400 }}>
            AYEYE
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {links.map(({ label, href }) => {
              const active = href === "/" ? path === "/" : path.startsWith(href);
              return (
                <Link key={href} href={href}
                  className="label-caps transition-colors duration-300"
                  style={{ color: active ? "#f2ca50" : "rgba(208,197,175,0.8)", borderBottom: active ? "1px solid #f2ca50" : "none", paddingBottom: active ? "4px" : 0 }}>
                  {label}
                </Link>
              );
            })}
            {isCelebrant && celebrantLinks.map(({ label, href, icon }) => {
              const active = path.startsWith(href);
              return (
                <Link key={href} href={href}
                  className="label-caps flex items-center gap-1 transition-colors duration-300"
                  style={{ color: active ? "#f2ca50" : "rgba(208,197,175,0.8)", borderBottom: active ? "1px solid #f2ca50" : "none", paddingBottom: active ? "4px" : 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "14px", fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
                  {label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link href="/admin" className="label-caps transition-colors duration-300"
                style={{ color: path.startsWith("/admin") ? "#f2ca50" : "rgba(208,197,175,0.6)", paddingBottom: path.startsWith("/admin") ? "4px" : 0, borderBottom: path.startsWith("/admin") ? "1px solid #f2ca50" : "none" }}>
                Admin
              </Link>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            {session ? (
              <Link href="/dashboard"
                className="label-caps px-6 py-3 transition-all duration-300"
                style={{ background: "#d4af37", color: "#3c2f00" }}>
                My Account
              </Link>
            ) : (
              <Link href="/login"
                className="label-caps px-6 py-3 transition-all duration-300 border hover:bg-[#f2ca50] hover:text-[#3c2f00]"
                style={{ borderColor: "#f2ca50", color: "#f2ca50" }}>
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile: right side — account link + hamburger */}
          <div className="flex md:hidden items-center gap-4">
            {session ? (
              <Link href="/dashboard" className="label-caps px-4 py-2"
                style={{ background: "#d4af37", color: "#3c2f00", fontSize: "10px" }}>
                Account
              </Link>
            ) : (
              <Link href="/login" className="label-caps px-4 py-2 border"
                style={{ borderColor: "#f2ca50", color: "#f2ca50", fontSize: "10px" }}>
                Sign In
              </Link>
            )}
            <button onClick={() => setOpen((v) => !v)} aria-label="Menu"
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#e5e2e1", display: "flex", alignItems: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>
                {open ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col md:hidden"
          style={{ background: "#131313", paddingTop: "5rem" }}>
          <nav className="flex flex-col" style={{ padding: "2rem 5vw" }}>
            {allLinks.map(({ label, href }) => {
              const active = href === "/" ? path === "/" : path.startsWith(href);
              return (
                <Link key={href} href={href}
                  onClick={() => setOpen(false)}
                  className="border-b py-5"
                  style={{
                    fontFamily: "var(--font-noto-serif)",
                    fontSize: "clamp(28px,6vw,40px)",
                    fontWeight: 400,
                    color: active ? "#f2ca50" : "#e5e2e1",
                    borderColor: "rgba(77,70,53,0.3)",
                    textDecoration: "none",
                    lineHeight: 1.2,
                  }}>
                  {label}
                </Link>
              );
            })}
          </nav>

          {!session && (
            <div style={{ padding: "2rem 5vw 0" }}>
              <Link href="/login" onClick={() => setOpen(false)}
                className="label-caps block text-center py-4 transition-all"
                style={{ background: "#f2ca50", color: "#3c2f00" }}>
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
