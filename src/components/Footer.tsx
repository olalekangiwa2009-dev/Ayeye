import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t" style={{ background: "#494a38", borderColor: "rgba(242,202,80,0.2)" }}>
      <div className="grid grid-cols-12 gap-8 py-24" style={{ paddingLeft: "5vw", paddingRight: "5vw" }}>
        <div className="col-span-12 lg:col-span-4 mb-8 lg:mb-0">
          <div className="mb-4" style={{ fontFamily: "var(--font-noto-serif)", fontSize: "36px", color: "#1b1d0e" }}>
            AYEYE
          </div>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#474836" }}>
            The art of celebration. Connecting Nigeria's most distinguished celebrants with verified event artisans.
          </p>
        </div>

        <div className="col-span-6 lg:col-span-2">
          <h4 className="label-caps mb-6" style={{ color: "#1b1d0e", opacity: 0.6 }}>Explore</h4>
          <div className="flex flex-col gap-4">
            {[["Browse Vendors", "/vendors"], ["Dashboard", "/dashboard"]].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm transition-all hover:opacity-100" style={{ color: "#474836", opacity: 0.8 }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="col-span-6 lg:col-span-2">
          <h4 className="label-caps mb-6" style={{ color: "#1b1d0e", opacity: 0.6 }}>Account</h4>
          <div className="flex flex-col gap-4">
            {[["Sign In", "/login"], ["Register", "/register"]].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm transition-all hover:opacity-100" style={{ color: "#474836", opacity: 0.8 }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 mt-8 lg:mt-0">
          <h4 className="label-caps mb-6" style={{ color: "#1b1d0e", opacity: 0.6 }}>Stay Inspired</h4>
          <div className="relative flex items-center border-b" style={{ borderColor: "rgba(27,29,14,0.3)" }}>
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              className="input-gold flex-1"
              style={{ color: "#1b1d0e", borderBottom: "none" }}
            />
            <span className="material-symbols-outlined text-sm" style={{ color: "#1b1d0e" }}>arrow_forward</span>
          </div>
        </div>

        <div className="col-span-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t" style={{ borderColor: "rgba(27,29,14,0.1)" }}>
          <span className="label-caps text-[10px]" style={{ color: "#1b1d0e", opacity: 0.5 }}>
            © {new Date().getFullYear()} AYEYE. ALL RIGHTS RESERVED.
          </span>
          <div className="flex gap-8">
            {["Terms", "Privacy"].map((t) => (
              <span key={t} className="label-caps text-[10px] transition-opacity hover:opacity-100 cursor-pointer" style={{ color: "#1b1d0e", opacity: 0.5 }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
