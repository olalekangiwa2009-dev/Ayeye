"use client";

import { useState } from "react";

interface Props {
  vendorProfileId: string;
  vendorName: string;
  onSubmitted: () => void;
}

export default function ReviewForm({ vendorProfileId, vendorName, onSubmitted }: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating"); return; }
    setError("");
    setLoading(true);
    const form = e.currentTarget;

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendorProfileId,
        rating,
        comment: (form.elements.namedItem("comment") as HTMLTextAreaElement).value,
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Failed to submit review");
      return;
    }
    onSubmitted();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="label-caps block mb-3" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Your Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110 cursor-pointer"
              style={{ fontSize: "28px", color: (hover || rating) >= star ? "#f2ca50" : "rgba(153,144,124,0.3)", background: "none", border: "none", padding: 0 }}>
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>Your Review</label>
        <textarea name="comment" required rows={4}
          placeholder={`Share your experience with ${vendorName}…`}
          style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(153,144,124,0.4)", padding: "0.75rem 0", color: "#e5e2e1", fontSize: "14px", outline: "none", width: "100%", resize: "none", lineHeight: 1.6 }} />
      </div>

      {error && <p className="label-caps" style={{ color: "#ffb4ab", fontSize: "10px" }}>{error}</p>}

      <button type="submit" disabled={loading}
        className="label-caps w-full py-4 transition-all hover:opacity-90 disabled:opacity-40"
        style={{ background: "#f2ca50", color: "#3c2f00", letterSpacing: "0.15em" }}>
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
