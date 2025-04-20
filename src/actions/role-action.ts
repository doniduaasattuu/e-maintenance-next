"use server";

import { getUserSession } from "@/hooks/useUserSession";
import prisma from "@/lib/prisma";
import { Role } from "@/types/role";

export async function getRoles(): Promise<Role[] | null> {
  const roles = prisma.role.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return roles;
}

type AssignRoleProps = {
  userId: number;
  roleId: number;
};

type AssignRespone = {
  success: boolean;
  message: string;
};
export async function assignRoleById({
  userId,
  roleId,
}: AssignRoleProps): Promise<AssignRespone> {
  const userSession = await getUserSession();

  if (userSession.role !== "Admin") {
    return {
      success: false,
      message: "Operation not allowed.",
    };
  }

  const userExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userExist || userExist.email === "admin@gmail.com") {
    return {
      success: false,
      message: "User is not exist.",
    };
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      roleId: roleId,
    },
  });

  return {
    success: true,
    message: "Success",
  };
}

export async function getRoleByName(name: string): Promise<Role | null> {
  return await prisma.role.findUnique({
    where: {
      name: name,
    },
  });
}
