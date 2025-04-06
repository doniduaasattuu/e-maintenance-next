"use server";

import { getUserSession } from "@/hooks/useUserSession";
import prisma from "@/lib/prisma";
import { Equipment, EquipmentWitRelations } from "@/types/equipment";
import {
  CreateEquipmentSchema,
  EditEquipmentSchema,
} from "@/validations/equipment-validation";

type GetEquipmentParams = {
  page?: number;
  perPage?: string;
  orderBy?: string;
  sortBy?: string;
  query?: string;
  classificationId?: string;
  status?: string;
};

export type PaginatedEquipments = {
  equipments: Equipment[];
  totalPages: number;
};

export async function getEquipments({
  page = 1,
  perPage = "10",
  orderBy = "desc",
  sortBy = "id",
  query,
  classificationId,
  status,
}: GetEquipmentParams): Promise<PaginatedEquipments> {
  const skip = (page - 1) * parseInt(perPage);
  const take = parseInt(perPage);

  const [equipments, total] = await prisma.$transaction([
    prisma.equipment.findMany({
      skip,
      take,
      orderBy: { [sortBy]: orderBy as "asc" | "desc" },
      where: {
        ...(query && {
          OR: [
            { id: { contains: query, mode: "insensitive" } },
            { sortField: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            {
              functionalLocation: {
                OR: [
                  { id: { contains: query, mode: "insensitive" } },
                  { description: { contains: query, mode: "insensitive" } },
                ],
              },
            },
          ],
        }),
        ...(classificationId && {
          classificationId: parseInt(classificationId),
        }),
        ...(status && {
          equipmentStatusId: parseInt(status),
        }),
      },
      include: {
        classification: {
          select: {
            id: true,
            description: true,
          },
        },
        equipmentStatus: {
          select: {
            id: true,
            description: true,
          },
        },
        functionalLocation: {
          select: {
            id: true,
            description: true,
          },
        },
      },
    }),
    prisma.equipment.count({
      where: {
        ...(query && {
          OR: [
            { id: { contains: query, mode: "insensitive" } },
            { sortField: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            {
              functionalLocation: {
                OR: [
                  { id: { contains: query, mode: "insensitive" } },
                  { description: { contains: query, mode: "insensitive" } },
                ],
              },
            },
          ],
        }),
        ...(classificationId && {
          classificationId: parseInt(classificationId),
        }),
        ...(status && {
          equipmentStatusId: parseInt(status),
        }),
      },
    }),
  ]);

  return {
    equipments,
    totalPages: Math.ceil(total / parseInt(perPage)),
  };
}

type getEquipmentProps = {
  id: string;
};

export async function getEquipment({
  id,
}: getEquipmentProps): Promise<EquipmentWitRelations | null> {
  const equipment = await prisma.equipment.findUnique({
    where: {
      id: id,
    },
    include: {
      classification: true,
      equipmentStatus: true,
      functionalLocation: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      equipmentMaterials: {
        select: {
          material: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
          quantity: true,
        },
      },
      equipmentFiles: {
        select: {
          file: {
            select: {
              id: true,
              name: true,
              path: true,
            },
          },
        },
      },
    },
  });

  return equipment;
}

export async function createEquipment(prevState: unknown, formData: FormData) {
  const user = await getUserSession();
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = await CreateEquipmentSchema.safeParseAsync(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation Error",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const {
      id,
      classificationId,
      equipmentStatusId,
      functionalLocationId,
      sortField,
      description,
    } = validatedData.data;

    const equipmentExists = await prisma.equipment.findUnique({
      where: {
        id: id,
      },
    });

    if (equipmentExists) {
      return {
        success: false,
        message: "Equipment already exists",
        errors: {
          id: ["Equipment already exists"],
        },
      };
    }

    if (functionalLocationId) {
      const functionalLocation = await prisma.functionalLocation.findUnique({
        where: {
          id: functionalLocationId,
        },
      });

      if (!functionalLocation) {
        return {
          success: false,
          message: "Functional location is not exists",
          errors: {
            functionalLocationId: ["Functional location is not exists"],
          },
        };
      }
    }

    await prisma.equipment.create({
      data: {
        id: id,
        classificationId: classificationId,
        equipmentStatusId: equipmentStatusId,
        functionalLocationId:
          functionalLocationId === undefined ? null : functionalLocationId,
        sortField: sortField,
        description: description,
        userId: user?.id ? parseInt(user.id) : null,
      },
    });

    return {
      success: true,
      message: "Equipment created successfully",
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

export async function editEquipment(prevState: unknown, formData: FormData) {
  const user = await getUserSession();
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = await EditEquipmentSchema.safeParseAsync(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation Error",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const {
      id,
      classificationId,
      equipmentStatusId,
      functionalLocationId,
      sortField,
      description,
    } = validatedData.data;

    const equipmentExists = await prisma.equipment.findUnique({
      where: {
        id: id,
      },
    });

    if (!equipmentExists) {
      return {
        success: false,
        message: "Equipment is not exists",
        errors: {
          id: ["Equipment is not exists"],
        },
      };
    }

    if (functionalLocationId) {
      const functionalLocation = await prisma.functionalLocation.findUnique({
        where: {
          id: functionalLocationId,
        },
      });

      if (!functionalLocation) {
        return {
          success: false,
          message: "Functional location is not exists",
          errors: {
            functionalLocationId: ["Functional location is not exists"],
          },
        };
      }
    }

    await prisma.equipment.update({
      where: {
        id: id,
      },
      data: {
        classificationId: classificationId,
        equipmentStatusId: equipmentStatusId,
        functionalLocationId:
          functionalLocationId === undefined ? null : functionalLocationId,
        sortField: sortField,
        description: description,
        userId: user?.id ? parseInt(user.id) : null,
      },
    });

    return {
      success: true,
      message: "Equipment updated successfully",
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

export type EquipmentExistsResponse = { success: boolean; message: string };

export async function isEquipmentExist(
  equipmentId: string
): Promise<EquipmentExistsResponse> {
  const isEquipmentExist = await prisma.equipment.findUnique({
    where: {
      id: equipmentId,
    },
  });

  if (isEquipmentExist) {
    return {
      success: true,
      message: "Equipment is found",
    };
  } else {
    return { success: false, message: "Equipment is not found" };
  }
}
