"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MultiImageUploader from "@/components/MultiImageUploader";

const fieldStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(153,144,124,0.4)",
  padding: "0.75rem 0",
  color: "#e5e2e1",
  fontSize: "15px",
  outline: "none",
  width: "100%",
  transition: "border-color 0.3s",
};

export default function NewServicePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;

    const res = await fetch("/api/vendor/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: (form.elements.namedItem("title") as HTMLInputElement).value,
        description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
        priceFrom: (form.elements.namedItem("priceFrom") as HTMLInputElement).value,
        priceTo: (form.elements.namedItem("priceTo") as HTMLInputElement).value || null,
        images,
      }),
    });

    setLoading(false);
    if (!res.ok) { const json = await res.json(); setError(json.error ?? "Something went wrong"); return; }
    router.push("/vendor/services");
    router.refresh();
  }

  return (
    <div style={{ background: "#131313", color: "#e5e2e1", minHeight: "100vh" }}>
      <div className="py-8 px-[5vw]">
        <Link href="/" style={{ fontFamily: "var(--font-noto-serif)", fontSize: "24px", color: "#f2ca50" }}>AYEYE</Link>
      </div>

      <div className="flex items-start justify-center" style={{ padding: "2rem 5vw 6rem" }}>
        <div style={{ width: "100%", maxWidth: "540px" }}>
          <div className="flex items-start justify-between gap-4 mb-10">
            <div>
              <span className="label-caps block mb-3" style={{ color: "#f2ca50" }}>Services</span>
              <h1 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 400, color: "#e5e2e1" }}>
                Add a Service
              </h1>
            </div>
            <Link href="/vendor/services" className="label-caps flex items-center gap-2 mt-2 transition-all hover:text-[#f2ca50]"
              style={{ color: "rgba(208,197,175,0.5)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_back</span>
              Services
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Service Name</label>
              <input name="title" type="text" required placeholder="e.g. Full-day wedding photography" style={fieldStyle} />
            </div>

            <div>
              <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Description</label>
              <textarea name="description" required rows={4}
                placeholder="What's included in this package?"
                style={{ ...fieldStyle, resize: "none" }} />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Price From (₦)</label>
                <input name="priceFrom" type="number" required min="0" placeholder="50000" style={fieldStyle} />
              </div>
              <div>
                <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>
                  Price To (₦) <span style={{ opacity: 0.5 }}>optional</span>
                </label>
                <input name="priceTo" type="number" min="0" placeholder="150000" style={fieldStyle} />
              </div>
            </div>

            <MultiImageUploader label="Service Photos (up to 4)" max={4} onChange={setImages} />

            {error && <p className="label-caps" style={{ color: "#ffb4ab", fontSize: "10px" }}>{error}</p>}

            <div className="flex gap-4 pt-2">
              <button type="submit" disabled={loading}
                className="label-caps flex-1 py-4 transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: "#f2ca50", color: "#3c2f00", letterSpacing: "0.15em" }}>
                {loading ? "Saving…" : "Add Service"}
              </button>
              <Link href="/vendor/services"
                className="label-caps flex-1 py-4 text-center border transition-all hover:border-[rgba(208,197,175,0.5)]"
                style={{ borderColor: "rgba(77,70,53,0.5)", color: "rgba(208,197,175,0.5)" }}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
