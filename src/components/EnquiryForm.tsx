"use client";

import { useState } from "react";

interface Props {
  vendorProfileId: string;
  vendorName: string;
}

const inputStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(153,144,124,0.4)",
  padding: "0.75rem 0",
  color: "#e5e2e1",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.05em",
  outline: "none",
  width: "100%",
  transition: "border-color 0.3s",
};

export default function EnquiryForm({ vendorProfileId, vendorName }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;

    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendorProfileId,
        eventType: (form.elements.namedItem("eventType") as HTMLInputElement).value,
        eventDate: (form.elements.namedItem("eventDate") as HTMLInputElement).value || null,
        message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Failed to send enquiry");
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="py-6 border-l-2" style={{ borderColor: "#f2ca50" }}>
        <p className="label-caps mb-2" style={{ color: "#f2ca50" }}>✓ Enquiry sent</p>
        <p className="text-sm" style={{ color: "rgba(208,197,175,0.7)", lineHeight: 1.6 }}>
          Your enquiry to {vendorName} has been sent. You&apos;ll be notified when they respond.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>
          Event Type
        </label>
        <select name="eventType" required style={{ ...inputStyle }}>
          <option value="" style={{ background: "#1c1b1b" }}>Select event type</option>
          {["Wedding", "Birthday", "Naming Ceremony", "Engagement", "Corporate Event", "Traditional Wedding", "Other"].map((t) => (
            <option key={t} value={t} style={{ background: "#1c1b1b" }}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>
          Event Date <span style={{ opacity: 0.5 }}>(optional)</span>
        </label>
        <input name="eventDate" type="date" style={inputStyle} />
      </div>

      <div>
        <label className="label-caps block mb-2" style={{ color: "rgba(208,197,175,0.5)", fontSize: "10px" }}>
          Message
        </label>
        <textarea name="message" required rows={4}
          placeholder={`Tell ${vendorName} about your event…`}
          style={{ ...inputStyle, resize: "none" }} />
      </div>

      {error && <p className="label-caps" style={{ color: "#ffb4ab", fontSize: "10px" }}>{error}</p>}

      <button type="submit" disabled={loading}
        className="label-caps w-full py-4 transition-all hover:opacity-90 disabled:opacity-40"
        style={{ background: "#f2ca50", color: "#3c2f00", letterSpacing: "0.15em" }}>
        {loading ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
