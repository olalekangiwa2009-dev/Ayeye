"use client";

import { useState } from "react";
import ReviewForm from "@/components/ReviewForm";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  celebrantName: string;
}

interface Props {
  vendorProfileId: string;
  vendorName: string;
  reviews: Review[];
  isCelebrant: boolean;
  hasReviewed: boolean;
}

export default function ReviewSection({ vendorProfileId, vendorName, reviews: initial, isCelebrant, hasReviewed }: Props) {
  const [reviews, setReviews] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(hasReviewed);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <span className="label-caps" style={{ color: "rgba(208,197,175,0.5)" }}>
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </span>
        {isCelebrant && !submitted && (
          <button onClick={() => setShowForm((v) => !v)}
            className="label-caps pb-0.5 transition-all"
            style={{ color: "#f2ca50", borderBottom: showForm ? "none" : "1px solid #f2ca50" }}>
            {showForm ? "Cancel" : "Leave a Review"}
          </button>
        )}
      </div>

      {isCelebrant && showForm && !submitted && (
        <div className="p-8 mb-8 border" style={{ borderColor: "rgba(77,70,53,0.5)", background: "#1c1b1b" }}>
          <ReviewForm
            vendorProfileId={vendorProfileId}
            vendorName={vendorName}
            onSubmitted={() => {
              setSubmitted(true);
              setShowForm(false);
              setReviews((r) => [{
                id: "new",
                rating: 5,
                comment: "Your review was submitted!",
                createdAt: new Date().toISOString(),
                celebrantName: "You",
              }, ...r]);
            }}
          />
        </div>
      )}

      {submitted && !hasReviewed && (
        <div className="p-4 mb-6 border-l-2" style={{ borderColor: "#f2ca50", background: "rgba(242,202,80,0.05)" }}>
          <p className="label-caps" style={{ color: "#f2ca50" }}>✓ Your review has been submitted. Thank you!</p>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="py-12 text-center border" style={{ borderColor: "rgba(77,70,53,0.3)" }}>
          <p style={{ color: "rgba(208,197,175,0.4)", fontStyle: "italic" }}>No reviews yet.</p>
          {isCelebrant && <p className="text-sm mt-1" style={{ color: "rgba(208,197,175,0.3)" }}>Be the first to review this vendor.</p>}
        </div>
      ) : (
        <div className="space-y-px">
          {reviews.map((r) => (
            <div key={r.id} className="py-6 border-t" style={{ borderColor: "rgba(77,70,53,0.4)" }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="label-caps" style={{ color: "#e5e2e1" }}>{r.celebrantName}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} style={{ color: star <= r.rating ? "#f2ca50" : "rgba(153,144,124,0.3)", fontSize: "16px" }}>★</span>
                    ))}
                  </div>
                </div>
                <p className="label-caps" style={{ color: "rgba(208,197,175,0.4)", fontSize: "10px" }}>
                  {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(229,226,225,0.75)" }}>{r.comment}</p>
            </div>
          ))}
          <div className="border-t" style={{ borderColor: "rgba(77,70,53,0.4)" }} />
        </div>
      )}
    </div>
  );
}
