"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  verified: boolean;
}

export default function VerifyToggle({ id, verified }: Props) {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(verified);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    const res = await fetch(`/api/admin/vendors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: !current }),
    });
    if (res.ok) {
      setCurrent((v) => !v);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button onClick={toggle} disabled={loading}
      className="label-caps px-4 py-2 border transition-all disabled:opacity-40"
      style={{
        fontSize: "10px",
        borderColor: current ? "rgba(242,202,80,0.4)" : "rgba(153,144,124,0.3)",
        color: current ? "#f2ca50" : "rgba(208,197,175,0.5)",
        background: current ? "rgba(242,202,80,0.06)" : "transparent",
        cursor: "pointer",
      }}>
      {loading ? "…" : current ? "✓ Verified" : "Unverified"}
    </button>
  );
}
