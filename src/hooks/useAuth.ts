// hooks/useAuth.ts
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";

export function useAuth(redirect = "/login") {
  const { data: session, status } = useSession();
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && user?.role == null) {
      if (status === "authenticated" && session.user !== null) {
        setUser(session.user);
      } else if (status === "unauthenticated") {
        setUser(null);
        router.replace(redirect);
      }
    }
  }, [status, session?.user, setUser, router, redirect, user?.role]);

  return { user, status, isLoading: status === "loading" };
}
