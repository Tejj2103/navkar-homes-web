"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { Star, X, Loader2 } from "lucide-react";

export type UploadedImage = { url: string; isCover: boolean };

export function ImageUpload({
  value,
  onChange,
}: {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setIsUploading(true);

    try {
      const uploaded: UploadedImage[] = [];
      for (const file of Array.from(files)) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        uploaded.push({ url: blob.url, isCover: false });
      }

      const next = [...value, ...uploaded];
      if (!next.some((image) => image.isCover) && next.length > 0) {
        next[0].isCover = true;
      }
      onChange(next);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function setCover(url: string) {
    onChange(value.map((image) => ({ ...image, isCover: image.url === url })));
  }

  function remove(url: string) {
    const next = value.filter((image) => image.url !== url);
    if (!next.some((image) => image.isCover) && next.length > 0) {
      next[0].isCover = true;
    }
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {value.map((image) => (
          <div
            key={image.url}
            className={`relative size-24 overflow-hidden rounded-lg border-2 ${
              image.isCover ? "border-accent" : "border-border"
            }`}
          >
            <Image src={image.url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => setCover(image.url)}
              aria-label="Mark as cover"
              className={`absolute left-1 top-1 flex size-6 items-center justify-center rounded-full bg-white/90 ${
                image.isCover ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <Star className="size-3.5" fill={image.isCover ? "currentColor" : "none"} />
            </button>
            <button
              type="button"
              onClick={() => remove(image.url)}
              aria-label="Remove image"
              className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-white/90 text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex size-24 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-accent hover:text-accent"
        >
          {isUploading ? <Loader2 className="size-5 animate-spin" /> : "Add photo"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
