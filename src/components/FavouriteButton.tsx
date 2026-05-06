"use client";

import { useState, useTransition } from "react";

interface Props {
  vendorProfileId: string;
  initialSaved: boolean;
}

export default function FavouriteButton({ vendorProfileId, initialSaved }: Props) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const res = await fetch("/api/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorProfileId }),
      });
      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
      }
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      title={saved ? "Remove from saved" : "Save vendor"}
      style={{
        background: "none",
        border: "none",
        cursor: pending ? "wait" : "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.2s",
        opacity: pending ? 0.5 : 1,
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: "22px",
          color: saved ? "#f2ca50" : "rgba(208,197,175,0.6)",
          fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0",
          transition: "color 0.2s, font-variation-settings 0.2s",
        }}
      >
        favorite
      </span>
    </button>
  );
}
