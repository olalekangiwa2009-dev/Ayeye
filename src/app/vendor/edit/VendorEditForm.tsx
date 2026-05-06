"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/categories";
import ImageUploader from "@/components/ImageUploader";
import MultiImageUploader from "@/components/MultiImageUploader";

interface Props {
  profile: {
    businessName: string;
    category: string;
    location: string;
    bio: string;
    coverImage: string | null;
    portfolio: string[];
    instagram: string | null;
    website: string | null;
  };
}

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

export default function VendorEditForm({ profile }: Props) {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState<string | null>(profile.coverImage);
  const [portfolio, setPortfolio] = useState<string[]>(profile.portfolio);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;

    const res = await fetch("/api/vendor/profile", {
      method: "PUT",
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
    <form onSubmit={handleSubmit} className="space-y-10">
      <div>
        <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Business Name</label>
        <input name="businessName" type="text" required defaultValue={profile.businessName} style={fieldStyle} />
      </div>

      <div>
        <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Service Category</label>
        <select name="category" required defaultValue={profile.category} style={{ ...fieldStyle }}>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value} style={{ background: "#1c1b1b" }}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Location</label>
        <input name="location" type="text" required defaultValue={profile.location} style={fieldStyle} />
      </div>

      <div>
        <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>About Your Business</label>
        <textarea name="bio" required rows={4} defaultValue={profile.bio}
          style={{ ...fieldStyle, resize: "none" }} />
      </div>

      <div className="border-t pt-8" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
        <span className="label-caps block mb-6" style={{ color: "rgba(208,197,175,0.5)" }}>Online Presence <span style={{ opacity: 0.5 }}>— optional</span></span>
        <div className="space-y-8 mb-10">
          <div>
            <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Instagram Handle</label>
            <div className="flex items-center" style={{ borderBottom: "1px solid rgba(153,144,124,0.4)" }}>
              <span className="label-caps pr-2" style={{ color: "rgba(208,197,175,0.4)", fontSize: "13px", paddingBottom: "0.75rem", paddingTop: "0.75rem", whiteSpace: "nowrap" }}>instagram.com/</span>
              <input name="instagram" type="text" placeholder="yourhandle"
                defaultValue={profile.instagram ?? ""}
                style={{ background: "transparent", border: "none", padding: "0.75rem 0", color: "#e5e2e1", fontSize: "15px", outline: "none", width: "100%" }} />
            </div>
          </div>
          <div>
            <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Website URL</label>
            <input name="website" type="url" placeholder="https://yourwebsite.com"
              defaultValue={profile.website ?? ""}
              style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(153,144,124,0.4)", padding: "0.75rem 0", color: "#e5e2e1", fontSize: "15px", outline: "none", width: "100%" }} />
          </div>
        </div>
      </div>

      <div className="border-t pt-8" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
        <ImageUploader
          label="Cover Photo"
          currentUrl={coverImage}
          hint="Main image displayed at the top of your vendor profile"
          onUpload={(url) => setCoverImage(url)}
        />
      </div>

      <MultiImageUploader
        label="Portfolio Photos (up to 6)"
        initialUrls={portfolio}
        max={6}
        onChange={setPortfolio}
      />

      {error && <p className="label-caps" style={{ color: "#ffb4ab", fontSize: "10px" }}>{error}</p>}

      <div className="flex gap-4 pt-2">
        <button type="submit" disabled={loading}
          className="label-caps flex-1 py-4 transition-all hover:opacity-90 disabled:opacity-40"
          style={{ background: "#f2ca50", color: "#3c2f00", letterSpacing: "0.15em" }}>
          {loading ? "Saving…" : "Save Changes"}
        </button>
        <Link href="/dashboard"
          className="label-caps flex-1 py-4 text-center border transition-all hover:border-[rgba(208,197,175,0.5)]"
          style={{ borderColor: "rgba(77,70,53,0.5)", color: "rgba(208,197,175,0.5)" }}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
