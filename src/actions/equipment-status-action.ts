"use server";

import prisma from "@/lib/prisma";
import { EquipmentStatus } from "@/types/equipment-status";

export async function getEquipmentStatuses(): Promise<
  EquipmentStatus[] | null
> {
  const equipmentStatuses = await prisma.equipmentStatus.findMany({
    select: {
      id: true,
      description: true,
    },
  });

  return equipmentStatuses;
}

export async function getEquipmentStatus({
  id,
}: {
  id: number;
}): Promise<EquipmentStatus | null> {
  const equipmentStatuses = await prisma.equipmentStatus.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      description: true,
    },
  });

  return equipmentStatuses;
}
