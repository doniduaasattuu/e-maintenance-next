"use server";

import prisma from "@/lib/prisma";
import { Material, MaterialWithRelations } from "@/types/material";
import {
  CreateMaterialSchema,
  EditMateriaSchema,
} from "@/validations/material-validation";

type GetMaterialParams = {
  page?: number;
  perPage?: string;
  orderBy?: string;
  sortBy?: string;
  query?: string;
  unitId?: number;
  includeEquipments?: boolean;
};

type PaginatedMaterials = {
  materials: Material[];
  totalPages: number;
};

export async function getMaterials({
  page = 1,
  perPage = "15",
  orderBy = "desc",
  sortBy = "id",
  query,
  unitId,
}: GetMaterialParams): Promise<PaginatedMaterials> {
  const skip = (page - 1) * Number(perPage);
  const take = parseInt(perPage);

  const [materials, total] = await prisma.$transaction([
    prisma.material.findMany({
      skip,
      take,
      orderBy: { [sortBy]: orderBy as "asc" | "desc" },
      where: {
        ...(query && {
          OR: [
            { id: { contains: query, mode: "insensitive" } },
            { name: { contains: query, mode: "insensitive" } },
            {
              equipmentMaterials: {
                some: {
                  equipment: {
                    OR: [
                      { id: { contains: query, mode: "insensitive" } },
                      { sortField: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
              },
            },
          ],
        }),
      },
      include: {
        unit: {
          select: {
            id: true,
            description: true,
          },
        },
      },
    }),
    prisma.material.count({
      where: {
        ...(query && {
          OR: [
            { id: { contains: query, mode: "insensitive" } },
            { name: { contains: query, mode: "insensitive" } },
            {
              equipmentMaterials: {
                some: {
                  equipment: {
                    OR: [
                      { id: { contains: query, mode: "insensitive" } },
                      { sortField: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
              },
            },
          ],
        }),
        ...(unitId && {
          unitId: unitId,
        }),
      },
    }),
  ]);

  return {
    materials,
    totalPages: Math.ceil(total / parseInt(perPage)),
  };
}

export async function getMaterial({
  id,
}: {
  id: string;
  includeEquipments?: boolean;
}): Promise<MaterialWithRelations | null> {
  const material = await prisma.material.findUnique({
    where: { id },
    include: {
      unit: true,
      equipmentMaterials: {
        select: {
          equipment: {
            select: {
              id: true,
              sortField: true,
              description: true,
            },
          },
          quantity: true,
        },
      },
    },
  });

  return material;
}

export async function createMaterial(prevState: unknown, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = CreateMaterialSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation Error",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { id, name, price, unitId } = validatedData.data;

    const materialExists = await prisma.material.findUnique({
      where: {
        id: id,
      },
    });

    if (materialExists) {
      return {
        success: false,
        message: "Material already exists",
        errors: {
          id: ["Material already exists"],
        },
      };
    }

    await prisma.material.create({
      data: {
        id: id,
        name: name,
        price: Number(price),
        unitId: Number(unitId),
      },
    });

    return {
      success: true,
      message: "Material created successfully",
      errors: null,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      errors: null,
    };
  }
}

export async function editMaterial(prevState: unknown, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = EditMateriaSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation Error",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { id, name, price, unitId } = validatedData.data;

    const materialExists = await prisma.material.findUnique({
      where: {
        id: id,
      },
    });

    if (!materialExists) {
      return {
        success: false,
        message: "Material is not exists",
        errors: {
          id: ["Material is not exists"],
        },
      };
    }

    await prisma.material.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        price: Number(price),
        unitId: Number(unitId),
      },
    });

    return {
      success: true,
      message: "Material updated successfully",
      errors: null,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      errors: null,
    };
  }
}

export type MaterialSearchResult = {
  id: string;
  name: string;
  price: number;
};

export async function getMaterialsByKeyword(
  keyword: string
): Promise<MaterialSearchResult[] | null> {
  const materials = await prisma.material.findMany({
    where: {
      OR: [
        { id: { contains: keyword, mode: "insensitive" } },
        { name: { contains: keyword, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
  });

  return materials;
}
