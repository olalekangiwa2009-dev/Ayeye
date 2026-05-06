import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#131313", color: "#e5e2e1" }}>
      <div className="py-8" style={{ paddingLeft: "5vw" }}>
        <Link href="/"
          style={{ fontFamily: "var(--font-noto-serif)", fontSize: "24px", color: "#f2ca50", letterSpacing: "-0.02em" }}>
          AYEYE
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full" style={{ maxWidth: "420px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
