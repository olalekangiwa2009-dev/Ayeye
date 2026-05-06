"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function mark() {
    setLoading(true);
    await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "READ" }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <button onClick={mark} disabled={loading}
      className="label-caps transition-all hover:text-[#e5e2e1] disabled:opacity-40"
      style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px", background: "none", border: "none", cursor: "pointer" }}>
      {loading ? "…" : "Mark read"}
    </button>
  );
}
