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

  // Sync session user to global store
  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user &&
      user?.id !== session.user.id
    ) {
      setUser(session.user); // Set only once when user is different
    }

    if (status === "unauthenticated") {
      setUser(null); // Clear state on logout
      router.replace(redirect);
    }
  }, [status, session?.user, user?.id, setUser, router, redirect]);

  return { user, status, isLoading: status === "loading" };
}

// hooks/useAuth.ts
// import { useSession } from "next-auth/react";
// import { useEffect } from "react";
// import { useAuthStore } from "@/hooks/useAuthStore";
// import { useRouter } from "next/navigation";

// export function useAuth(redirect = "/login") {
//   const { data, status } = useSession();
//   const { user, setUser } = useAuthStore();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "authenticated" && data?.user) {
//       setUser(data.user); // Set user once
//     }

//     if (status === "unauthenticated") {
//       router.push(redirect);
//     }
//   }, [status, data?.user, setUser, router, redirect]);

//   return { user, status };
// }

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export function useAuth(redirect = "/login") {
//   console.log("src/hooks/useAuth.ts is executed in every request...");
//   const { data, status } = useSession();
//   const user = data?.user;
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push(redirect);
//     }
//   }, [status, router, redirect]);

//   return { user, status };
// }
