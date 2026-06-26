"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { User, Pencil, Loader2 } from "lucide-react";

export function AvatarUpload({ image }: { image: string | null }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: blob.url }),
      });

      if (!response.ok) {
        setError("Could not save photo");
        return;
      }

      router.refresh();
    } catch {
      setError("Upload failed");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative size-20">
        <div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-accent-soft text-accent">
          {image ? (
            <Image src={image} alt="" fill className="object-cover" />
          ) : (
            <User className="size-8" />
          )}
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          aria-label="Change photo"
          className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[var(--shadow-card)]"
        >
          {isUploading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Pencil className="size-3.5" />
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => handleFile(event.target.files)}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
