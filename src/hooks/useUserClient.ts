"use client";

import { SessionUser } from "@/types/user";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useUserClient(): SessionUser | null {
  const { data, status } = useSession();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    if (status !== "loading" && data) {
      setUser(data.user as SessionUser);
    }
  }, [data, status]);

  return user;
}
