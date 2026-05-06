"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MultiImageUploader from "@/components/MultiImageUploader";

interface Props {
  id: string;
  initialTitle: string;
  initialDescription: string;
  initialPriceFrom: number;
  initialPriceTo?: number;
  initialImages: string[];
}

export default function EditServiceForm({
  id, initialTitle, initialDescription, initialPriceFrom, initialPriceTo, initialImages,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [priceFrom, setPriceFrom] = useState(String(initialPriceFrom));
  const [priceTo, setPriceTo] = useState(initialPriceTo ? String(initialPriceTo) : "");
  const [images, setImages] = useState<string[]>(initialImages);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch(`/api/vendor/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, priceFrom, priceTo: priceTo || null, images }),
    });

    setLoading(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Something went wrong");
      return;
    }

    router.push("/vendor/services");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Service name</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price from (₦)</label>
          <input
            type="number"
            required
            min="0"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price to (₦) <span className="text-gray-400 font-normal">optional</span>
          </label>
          <input
            type="number"
            min="0"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <MultiImageUploader
        label="Service photos"
        max={4}
        initialUrls={images}
        onChange={setImages}
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition"
        >
          {loading ? "Saving…" : "Save changes"}
        </button>
        <Link
          href="/vendor/services"
          className="flex-1 text-center border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-2 rounded-lg transition"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
