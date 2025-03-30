"use server";

import prisma from "@/lib/prisma";

type getMaterialParams = {
  page?: number;
  perPage?: string;
  orderBy?: string;
  sortBy?: string;
  query?: string;
  unitId?: number;
  includeEquipments?: boolean;
};

export async function getMaterials({
  page = 1,
  perPage = "15",
  orderBy = "desc",
  sortBy = "id",
  query,
  unitId,
  includeEquipments = false,
}: getMaterialParams) {
  const skip = (page - 1) * Number(perPage);
  const allMaterials = await prisma.material.findMany({
    orderBy: { [sortBy]: orderBy as "asc" | "desc" },
    where: {
      ...(query && {
        OR: [
          { id: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
        ],
      }),
      ...(unitId && {
        unitId: unitId,
      }),
    },
    include: {
      unit: true,
      equipmentMaterials: includeEquipments
        ? {
            select: {
              equipment: {
                select: {
                  id: true,
                  description: true,
                },
              },
              quantity: true,
            },
          }
        : false,
    },
  });

  const total = allMaterials.length;

  const paginatedMaterials = allMaterials.slice(skip, skip + Number(perPage));

  return {
    materials: paginatedMaterials,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / Number(perPage)),
  };
}

export async function getMaterial({
  id,
  includeEquipments,
}: {
  id: string;
  includeEquipments?: boolean;
}) {
  const material = await prisma.material.findUnique({
    where: {
      id: id,
    },
    include: {
      unit: true,
      equipmentMaterials: includeEquipments
        ? {
            select: {
              equipment: {
                select: {
                  id: true,
                  description: true,
                },
              },
              quantity: true,
            },
          }
        : false,
    },
  });

  return material;
}
