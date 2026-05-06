"use client";

import { useState } from "react";

interface Props {
  value: number;
  onChange?: (val: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "text-base", md: "text-2xl", lg: "text-3xl" };

export default function StarRating({ value, onChange, readonly = false, size = "md" }: Props) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`${sizes[size]} leading-none transition-transform ${!readonly ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
        >
          <span className={(hover || value) >= star ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
