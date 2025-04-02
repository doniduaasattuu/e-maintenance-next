"use server";

import prisma from "@/lib/prisma";
import { Equipment } from "@/types/equipment";
import {
  CreateEquipmentSchema,
  EditEquipmentSchema,
} from "@/validations/equipment-validation";

type getEquipmentParams = {
  destinationPage?: number;
  perPage?: string;
  orderBy?: string;
  sortBy?: string;
  query?: string;
  classification?: string;
  status?: string;
};

export async function getEquipments({
  destinationPage = 1,
  perPage = "10",
  orderBy = "desc",
  sortBy = "id",
  query,
  classification,
  status,
}: getEquipmentParams) {
  const skip = (destinationPage - 1) * Number(perPage);
  const allEquipments = await prisma.equipment.findMany({
    orderBy: { [sortBy]: orderBy as "asc" | "desc" },
    where: {
      // Query Param (ID or Description)
      ...(query && {
        OR: [
          { id: { contains: query, mode: "insensitive" } },
          { sortField: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      }),

      // Classification Filter
      ...(classification && {
        classificationId: Number(classification),
      }),

      // Equipment Status Filter
      ...(status && {
        equipmentStatusId: Number(status),
      }),
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
    },
  });

  const total = allEquipments.length;

  const paginatedEquipments = allEquipments.slice(skip, skip + Number(perPage));

  return {
    equipments: paginatedEquipments,
    total,
    destinationPage,
    perPage,
    totalPages: Math.ceil(total / Number(perPage)),
  };
}

type getEquipmentProps = {
  id: string;
};

export async function getEquipment({
  id,
}: getEquipmentProps): Promise<Equipment | null> {
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
    },
  });

  return equipment;
}

export async function editEquipment(prevState: unknown, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = await EditEquipmentSchema.safeParseAsync(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: null,
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

    const equipmentExists = await prisma.equipment.findFirst({
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

    if (
      functionalLocationId !== "undefined" &&
      functionalLocationId &&
      functionalLocationId?.length > 1
    ) {
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
          functionalLocationId === "undefined" ? null : functionalLocationId,
        sortField: sortField,
        description: description,
      },
    });

    return {
      success: true,
      message: "Equipment updated successfully",
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

export async function createEquipment(prevState: unknown, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = await CreateEquipmentSchema.safeParseAsync(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: null,
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

    const equipmentExists = await prisma.equipment.findFirst({
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

    if (
      functionalLocationId !== "undefined" &&
      functionalLocationId &&
      functionalLocationId?.length > 1
    ) {
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
          functionalLocationId === "undefined" ? null : functionalLocationId,
        sortField: sortField,
        description: description,
      },
    });

    return {
      success: true,
      message: "Equipment created successfully",
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
