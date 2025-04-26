import { authOptions } from "@/lib/authOptions";
import { SessionUser } from "@/types/user";
import { getServerSession } from "next-auth/next";

export async function getUserSession(): Promise<SessionUser | undefined> {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return user;
}
