"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface Props {
  label: string;
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  hint?: string;
}

export default function ImageUploader({ label, currentUrl, onUpload, hint }: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();
    setUploading(false);
    if (!res.ok) { setError(json.error ?? "Upload failed"); return; }
    setPreview(json.url);
    onUpload(json.url);
  }

  return (
    <div>
      <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>{label}</label>
      {hint && <p className="text-xs mb-3" style={{ color: "rgba(208,197,175,0.35)" }}>{hint}</p>}

      <div onClick={() => inputRef.current?.click()}
        className="relative cursor-pointer overflow-hidden transition-all hover:border-[#f2ca50]"
        style={{ minHeight: "140px", border: "1px dashed rgba(153,144,124,0.35)", background: "rgba(32,31,31,0.6)" }}>
        {preview ? (
          <div className="relative w-full h-44">
            <Image src={preview} alt="Preview" fill className="object-cover" style={{ opacity: 0.85 }} />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.5)" }}>
              <span className="label-caps" style={{ color: "#f2ca50", fontSize: "10px" }}>Change Photo</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-36" style={{ color: "rgba(208,197,175,0.35)" }}>
            {uploading ? (
              <span className="label-caps" style={{ fontSize: "10px" }}>Uploading…</span>
            ) : (
              <>
                <span className="material-symbols-outlined mb-2" style={{ fontSize: "28px" }}>upload</span>
                <span className="label-caps" style={{ fontSize: "10px" }}>Click to upload</span>
                <span className="text-xs mt-1" style={{ color: "rgba(208,197,175,0.25)" }}>JPEG · PNG · WebP · max 5 MB</span>
              </>
            )}
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden" onChange={handleChange} />
      {error && <p className="label-caps mt-1" style={{ color: "#ffb4ab", fontSize: "10px" }}>{error}</p>}
    </div>
  );
}
