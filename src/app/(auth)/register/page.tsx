"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const fieldStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(153,144,124,0.4)",
  padding: "0.75rem 0",
  color: "#e5e2e1",
  fontSize: "14px",
  outline: "none",
  width: "100%",
  transition: "border-color 0.3s",
};

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        password: (form.elements.namedItem("password") as HTMLInputElement).value,
        role: (form.elements.namedItem("role") as HTMLSelectElement).value,
      }),
    });

    const json = await res.json();
    setLoading(false);
    if (!res.ok) { setError(json.error ?? "Something went wrong"); return; }
    router.push("/login?registered=1");
  }

  return (
    <div className="p-8 border" style={{ borderColor: "rgba(77,70,53,0.5)", background: "#1c1b1b" }}>
      <div className="mb-8">
        <span className="label-caps block mb-2" style={{ color: "#f2ca50" }}>Create Account</span>
        <h1 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "36px", fontWeight: 400, color: "#e5e2e1" }}>
          Join AYEYE
        </h1>
        <p className="mt-2 text-sm" style={{ color: "rgba(208,197,175,0.6)", lineHeight: 1.6 }}>
          Connect with Nigeria&apos;s finest event artisans.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Full Name</label>
          <input name="name" type="text" required placeholder="Your full name" style={fieldStyle} />
        </div>
        <div>
          <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Email Address</label>
          <input name="email" type="email" required style={fieldStyle} />
        </div>
        <div>
          <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Password</label>
          <input name="password" type="password" required minLength={8} style={fieldStyle} />
        </div>

        <div>
          <label className="label-caps block mb-4" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>I am a</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "CELEBRANT", label: "Celebrant", sub: "Planning an event" },
              { value: "VENDOR", label: "Vendor", sub: "Offering services" },
            ].map((opt) => (
              <label key={opt.value} className="relative cursor-pointer">
                <input type="radio" name="role" value={opt.value}
                  defaultChecked={opt.value === "CELEBRANT"}
                  className="peer sr-only" />
                <div className="p-4 border transition-all peer-checked:border-[#f2ca50] peer-checked:bg-[rgba(242,202,80,0.05)]"
                  style={{ borderColor: "rgba(77,70,53,0.5)" }}>
                  <p className="label-caps" style={{ color: "#e5e2e1", fontSize: "11px" }}>{opt.label}</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(208,197,175,0.5)" }}>{opt.sub}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="label-caps" style={{ color: "#ffb4ab", fontSize: "10px" }}>{error}</p>}

        <button type="submit" disabled={loading}
          className="label-caps w-full py-4 transition-all hover:opacity-90 disabled:opacity-40"
          style={{ background: "#f2ca50", color: "#3c2f00", letterSpacing: "0.15em" }}>
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-8 label-caps" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "#f2ca50", borderBottom: "1px solid #f2ca50" }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
