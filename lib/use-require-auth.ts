"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useRequireAuth() {
  const { data: session } = useSession();
  const router = useRouter();

  return function withAuth(action?: () => void) {
    if (!session) {
      router.push("/login");
      return;
    }
    action?.();
  };
}
