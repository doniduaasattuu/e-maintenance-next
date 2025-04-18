"use server";

import prisma from "@/lib/prisma";
import { Department } from "@/types/department";

export async function getDepartments(): Promise<Department[] | null> {
  const departments = await prisma.department.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return departments;
}
