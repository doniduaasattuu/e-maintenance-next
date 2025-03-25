import prisma from "@/lib/prisma";
import { Role } from "@/types/role";

export async function getRoleByName(name: string): Promise<Role | null> {
  return await prisma.role.findUnique({
    where: {
      name: name,
    },
  });
}
