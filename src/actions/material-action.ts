"use server";

import prisma from "@/lib/prisma";
import { MaterialWithEquipments } from "@/types/prisma-types";
import {
  CreateMaterialSchema,
  EditMateriaSchema,
} from "@/validations/material-validation";

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
}): Promise<MaterialWithEquipments | null> {
  const material = await prisma.material.findUnique({
    where: { id },
    include: {
      unit: true,
      equipmentMaterials: includeEquipments
        ? {
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
          }
        : false,
    },
  });

  return material as MaterialWithEquipments;
}

export async function editMaterial(prevState: unknown, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = EditMateriaSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: null,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { id, name, price, unitId } = validatedData.data;

    const materialExists = await prisma.material.findFirst({
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
        unitId: unitId === "undefined" ? null : Number(unitId),
      },
    });

    return {
      success: true,
      message: "Material updated successfully",
      errors: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        errors: null,
      };
    }

    return {
      success: false,
      message: "Something went wrong",
      errors: null,
    };
  }
}

export async function createMaterial(prevState: unknown, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = CreateMaterialSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: null,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { id, name, price, unitId } = validatedData.data;

    const materialExists = await prisma.material.findFirst({
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
        unitId: unitId === "undefined" ? null : Number(unitId),
      },
    });

    return {
      success: true,
      message: "Material created successfully",
      errors: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        errors: null,
      };
    }

    return {
      success: false,
      message: "Something went wrong",
      errors: null,
    };
  }
}
