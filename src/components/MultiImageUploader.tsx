"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface Props {
  label: string;
  initialUrls?: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export default function MultiImageUploader({ label, initialUrls = [], onChange, max = 6 }: Props) {
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const toUpload = files.slice(0, max - urls.length);
    setError("");
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of toUpload) {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (res.ok) uploaded.push(json.url);
    }
    setUploading(false);
    const next = [...urls, ...uploaded];
    setUrls(next);
    onChange(next);
  }

  function remove(url: string) {
    const next = urls.filter((u) => u !== url);
    setUrls(next);
    onChange(next);
  }

  return (
    <div>
      <label className="label-caps block mb-3" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>{label}</label>

      <div className="grid grid-cols-3 gap-2">
        {urls.map((url) => (
          <div key={url} className="relative overflow-hidden group" style={{ aspectRatio: "1", background: "#201f1f" }}>
            <Image src={url} alt="" fill className="object-cover" />
            <button type="button" onClick={() => remove(url)}
              className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.7)", color: "#ffb4ab", border: "none", cursor: "pointer", fontSize: "14px" }}>
              ×
            </button>
          </div>
        ))}

        {urls.length < max && (
          <button type="button" onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center transition-all hover:border-[#f2ca50]"
            style={{ aspectRatio: "1", border: "1px dashed rgba(153,144,124,0.35)", background: "rgba(32,31,31,0.6)", cursor: "pointer", color: "rgba(208,197,175,0.35)" }}>
            {uploading ? (
              <span className="label-caps" style={{ fontSize: "9px" }}>Uploading…</span>
            ) : (
              <>
                <span className="material-symbols-outlined mb-1" style={{ fontSize: "22px" }}>add_photo_alternate</span>
                <span className="label-caps" style={{ fontSize: "9px" }}>Add</span>
              </>
            )}
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp"
        multiple className="hidden" onChange={handleChange} />
      {error && <p className="label-caps mt-1" style={{ color: "#ffb4ab", fontSize: "10px" }}>{error}</p>}
      <p className="label-caps mt-2" style={{ color: "rgba(208,197,175,0.3)", fontSize: "9px" }}>{urls.length}/{max} photos</p>
    </div>
  );
}
