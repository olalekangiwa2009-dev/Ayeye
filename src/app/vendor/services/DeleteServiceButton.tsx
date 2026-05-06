"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteServiceButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Remove this service?")) return;
    setLoading(true);
    await fetch(`/api/vendor/services/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className="label-caps transition-all hover:text-[#ffb4ab] disabled:opacity-40"
      style={{ color: "rgba(208,197,175,0.4)", fontSize: "10px", background: "none", border: "none", cursor: "pointer" }}>
      {loading ? "…" : "Remove"}
    </button>
  );
}
