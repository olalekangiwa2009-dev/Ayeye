"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/categories";
import ImageUploader from "@/components/ImageUploader";
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

export default function VendorSetupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;

    const res = await fetch("/api/vendor/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName: (form.elements.namedItem("businessName") as HTMLInputElement).value,
        category: (form.elements.namedItem("category") as HTMLSelectElement).value,
        location: (form.elements.namedItem("location") as HTMLInputElement).value,
        bio: (form.elements.namedItem("bio") as HTMLTextAreaElement).value,
        coverImage,
        portfolio,
        instagram: (form.elements.namedItem("instagram") as HTMLInputElement).value || null,
        website: (form.elements.namedItem("website") as HTMLInputElement).value || null,
      }),
    });

    setLoading(false);
    if (!res.ok) { const json = await res.json(); setError(json.error ?? "Something went wrong"); return; }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div style={{ background: "#131313", color: "#e5e2e1", minHeight: "100vh" }}>
      <div className="py-8 px-[5vw]">
        <Link href="/" style={{ fontFamily: "var(--font-noto-serif)", fontSize: "24px", color: "#f2ca50" }}>AYEYE</Link>
      </div>

      <div className="flex items-start justify-center" style={{ padding: "2rem 5vw 6rem" }}>
        <div style={{ width: "100%", maxWidth: "580px" }}>
          <div className="mb-10">
            <span className="label-caps block mb-3" style={{ color: "#f2ca50" }}>Vendor Onboarding</span>
            <h1 style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 400, color: "#e5e2e1" }}>
              Set up your profile
            </h1>
            <p className="mt-3 text-sm" style={{ color: "rgba(208,197,175,0.6)", lineHeight: 1.7 }}>
              This is how celebrants will discover and evaluate your services on Ayeye.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Business Name</label>
              <input name="businessName" type="text" required placeholder="e.g. Lumière Photography" style={fieldStyle} />
            </div>

            <div>
              <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Service Category</label>
              <select name="category" required style={{ ...fieldStyle }}>
                <option value="" style={{ background: "#1c1b1b" }}>Select a category</option>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value} style={{ background: "#1c1b1b" }}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Location</label>
              <input name="location" type="text" required placeholder="e.g. Lagos, Nigeria" style={fieldStyle} />
            </div>

            <div>
              <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>About Your Business</label>
              <textarea name="bio" required rows={4}
                placeholder="Tell celebrants what makes your service exceptional…"
                style={{ ...fieldStyle, resize: "none" }} />
            </div>

            <div className="border-t pt-8" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
              <span className="label-caps block mb-6" style={{ color: "rgba(208,197,175,0.5)" }}>Online Presence <span style={{ opacity: 0.5 }}>— optional</span></span>
              <div className="space-y-8">
                <div>
                  <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Instagram Handle</label>
                  <div className="flex items-center" style={{ borderBottom: "1px solid rgba(153,144,124,0.4)" }}>
                    <span className="label-caps pr-2" style={{ color: "rgba(208,197,175,0.4)", fontSize: "13px", paddingBottom: "0.75rem", paddingTop: "0.75rem", whiteSpace: "nowrap" }}>instagram.com/</span>
                    <input name="instagram" type="text" placeholder="yourhandle" style={{ ...fieldStyle, borderBottom: "none" }} />
                  </div>
                </div>
                <div>
                  <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Website URL</label>
                  <input name="website" type="url" placeholder="https://yourwebsite.com" style={fieldStyle} />
                </div>
              </div>
            </div>

            <div className="border-t pt-8" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
              <ImageUploader
                label="Cover Photo"
                hint="Main image displayed at the top of your vendor profile"
                onUpload={(url) => setCoverImage(url)}
              />
            </div>

            <MultiImageUploader
              label="Portfolio Photos (up to 6)"
              max={6}
              onChange={setPortfolio}
            />

            {error && <p className="label-caps" style={{ color: "#ffb4ab", fontSize: "10px" }}>{error}</p>}

            <div className="flex gap-4 pt-2">
              <button type="submit" disabled={loading}
                className="label-caps flex-1 py-4 transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: "#f2ca50", color: "#3c2f00", letterSpacing: "0.15em" }}>
                {loading ? "Saving…" : "Create Profile"}
              </button>
              <Link href="/dashboard"
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
