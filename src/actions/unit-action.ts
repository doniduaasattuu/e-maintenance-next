"use server";

import prisma from "@/lib/prisma";
import { Unit } from "@/types/unit";

export async function getUnits(): Promise<Unit[] | null> {
  const units = await prisma.unit.findMany({
    select: {
      id: true,
      description: true,
    },
  });

  return units;
}
