"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export function useRequireAuth() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  return function withAuth(action?: () => void) {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    action?.();
  };
}
