"use server";

import prisma from "@/lib/prisma";
import { Unit } from "@/types/prisma-types";

export async function getUnits(): Promise<Unit[] | []> {
  const units = await prisma.unit.findMany({
    select: {
      id: true,
      description: true,
    },
  });

  return units;
}
