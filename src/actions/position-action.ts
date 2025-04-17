"use server";

import prisma from "@/lib/prisma";
import { Position } from "@/types/position";

export async function getPositions(): Promise<Position[] | null> {
  const positions = await prisma.position.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return positions;
}
