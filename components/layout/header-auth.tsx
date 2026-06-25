"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";

export function HeaderAuth() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Log in
      </Link>
    );
  }

  return (
    <Link
      href="/profile"
      aria-label="Profile"
      className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-accent"
    >
      <User className="size-4" />
    </Link>
  );
}
