"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  enquiryId: string;
}

export default function ReplyForm({ enquiryId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    const res = await fetch(`/api/enquiries/${enquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: text }),
    });
    setLoading(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Something went wrong");
      return;
    }
    router.refresh();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="label-caps flex items-center gap-1 transition-colors hover:text-[#f2ca50]"
        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(208,197,175,0.5)", padding: 0, marginTop: "1rem" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>reply</span>
        Reply
      </button>
    );
  }

  return (
    <div className="mt-4 border-t pt-4" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
      <p className="label-caps mb-3" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Your Reply</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Write your reply…"
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          borderBottom: "1px solid rgba(153,144,124,0.4)",
          padding: "0.5rem 0",
          color: "#e5e2e1",
          fontSize: "14px",
          outline: "none",
          resize: "none",
          lineHeight: 1.7,
        }}
      />
      {error && <p className="label-caps mt-1" style={{ color: "#ffb4ab", fontSize: "10px" }}>{error}</p>}
      <div className="flex items-center gap-4 mt-4">
        <button onClick={submit} disabled={loading || !text.trim()}
          className="label-caps px-6 py-3 transition-all hover:opacity-90 disabled:opacity-40"
          style={{ background: "#f2ca50", color: "#3c2f00", border: "none", cursor: "pointer" }}>
          {loading ? "Sending…" : "Send Reply"}
        </button>
        <button onClick={() => { setOpen(false); setText(""); setError(""); }}
          className="label-caps transition-colors hover:text-[#e5e2e1]"
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(208,197,175,0.4)", padding: 0 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
