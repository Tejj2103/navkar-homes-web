"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRequireAuth } from "@/lib/use-require-auth";

export function FavoriteButton({
  propertyId,
  initialFavorited = false,
  className = "absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-colors hover:bg-white",
}: {
  propertyId: string;
  initialFavorited?: boolean;
  className?: string;
}) {
  const withAuth = useRequireAuth();
  const [favorited, setFavorited] = useState(initialFavorited);

  async function toggle() {
    const next = !favorited;
    setFavorited(next);

    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId }),
    });

    if (!response.ok) {
      setFavorited(!next);
    }
  }

  return (
    <button
      type="button"
      aria-label={favorited ? "Remove from favorites" : "Save property"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        withAuth(toggle);
      }}
      className={className}
    >
      <Heart
        className={favorited ? "size-4 text-accent" : "size-4 text-foreground"}
        fill={favorited ? "currentColor" : "none"}
      />
    </button>
  );
}
