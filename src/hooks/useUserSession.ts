import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SessionUser } from "@/types/user";
import { getServerSession } from "next-auth/next";

export async function getUserSession(): Promise<SessionUser | undefined> {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return user;
}
