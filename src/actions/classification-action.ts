"use server";

import prisma from "@/lib/prisma";
import { Classification } from "@/types/classification";

export async function getClassifications(): Promise<Classification[] | null> {
  const classifications = await prisma.classification.findMany({
    select: {
      id: true,
      description: true,
    },
  });

  return classifications;
}
