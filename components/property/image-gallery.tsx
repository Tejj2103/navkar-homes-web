"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ImageGallery({
  images,
  alt,
}: {
  images: { id: string; url: string }[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);

  function go(direction: "prev" | "next") {
    setIndex((current) => {
      const length = images.length;
      return direction === "prev"
        ? (current - 1 + length) % length
        : (current + 1) % length;
    });
  }

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <Image
          src={images[index].url}
          alt={alt}
          fill
          priority
          className="object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go("prev")}
              className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-[var(--shadow-card)] transition-colors hover:bg-white"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go("next")}
              className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-[var(--shadow-card)] transition-colors hover:bg-white"
            >
              <ChevronRight className="size-4" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto">
          {images.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View photo ${i + 1}`}
              className={`relative size-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                i === index ? "border-accent" : "border-border"
              }`}
            >
              <Image src={image.url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
