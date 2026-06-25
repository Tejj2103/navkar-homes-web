"use client";

import { Heart } from "lucide-react";
import { useRequireAuth } from "@/lib/use-require-auth";

export function FavoriteButton() {
  const withAuth = useRequireAuth();

  return (
    <button
      type="button"
      aria-label="Save property"
      onClick={() => withAuth()}
      className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-foreground backdrop-blur transition-colors hover:bg-white"
    >
      <Heart className="size-4" />
    </button>
  );
}
