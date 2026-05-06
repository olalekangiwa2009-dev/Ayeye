"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  initialQuery: string;
}

export default function SearchBar({ initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const category = searchParams.get("category");
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (query.trim()) params.set("q", query.trim());
    router.push(`/vendors${params.size ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center border-b" style={{ borderColor: "rgba(242,202,80,0.3)", maxWidth: "40rem" }}>
      <span className="material-symbols-outlined mr-3" style={{ color: "rgba(242,202,80,0.6)", fontSize: "20px" }}>search</span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="SEARCH BY NAME, LOCATION, OR SPECIALTY…"
        className="input-gold flex-1"
        style={{ paddingLeft: 0 }}
      />
      <button type="submit" className="label-caps px-4 py-3 transition-all hover:bg-[#f2ca50] hover:text-[#3c2f00]"
        style={{ color: "#f2ca50", borderLeft: "1px solid rgba(242,202,80,0.3)" }}>
        Search
      </button>
    </form>
  );
}
