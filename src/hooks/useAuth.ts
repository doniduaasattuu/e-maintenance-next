import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(redirect = "/login") {
  const { data, status } = useSession();
  const user = data?.user;
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(redirect);
    }
  }, [status, router, redirect]);

  return { user, status };
}
