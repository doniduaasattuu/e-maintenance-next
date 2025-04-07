"use server";

import { getUserSession } from "@/hooks/useUserSession";
import prisma from "@/lib/prisma";
import {
  FunctionalLocation,
  FunclocWithEquipment,
} from "@/types/functional-location";
import {
  CreateFunctionalLocationSchema,
  EditFunctionalLocationSchema,
} from "@/validations/functional-location-validation";

type GetFunclocsParams = {
  page?: number;
  perPage?: string;
  orderBy?: string;
  sortBy?: "id" | "description" | string;
  query?: string;
};

type PaginatedFunctionalLocations = {
  functionalLocations: FunctionalLocation[]; // Asumsikan FunctionalLocation adalah tipe model Anda
  totalPages: number;
};

export async function getFunctionalLocations({
  page = 1,
  perPage = "15",
  orderBy = "desc",
  sortBy = "id",
  query,
}: GetFunclocsParams): Promise<PaginatedFunctionalLocations> {
  const skip = (page - 1) * parseInt(perPage);
  const take = parseInt(perPage);

  const [functionalLocations, total] = await prisma.$transaction([
    prisma.functionalLocation.findMany({
      skip,
      take,
      orderBy: { [sortBy]: orderBy as "asc" | "desc" },
      ...(query && {
        where: {
          OR: [
            { id: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            {
              equipments: {
                some: {
                  OR: [
                    { id: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                  ],
                },
              },
            },
          ],
        },
      }),
    }),
    prisma.functionalLocation.count({
      ...(query && {
        where: {
          OR: [
            { id: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            {
              equipments: {
                some: {
                  OR: [
                    { id: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                  ],
                },
              },
            },
          ],
        },
      }),
    }),
  ]);

  return {
    functionalLocations,
    totalPages: Math.ceil(total / parseInt(perPage)),
  };
}

type GetFunclocParams = {
  id: string;
};

export async function getFunctionalLocation({
  id,
}: GetFunclocParams): Promise<FunclocWithEquipment | null> {
  const functionalLocation = await prisma.functionalLocation.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      description: true,
      userId: true,
      equipments: {
        select: {
          id: true,
          sortField: true,
          description: true,
        },
      },
    },
  });

  return functionalLocation;
}

type CreateFunclocResult = {
  success: boolean;
  message: string;
  errors: { [key: string]: string[] | undefined } | null;
};

export async function createFunctionalLocation(
  prevState: unknown,
  formData: FormData
): Promise<CreateFunclocResult> {
  const user = await getUserSession();

  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = CreateFunctionalLocationSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation Error",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }
    const { id, description } = validatedData.data;

    const funclocExists = await prisma.functionalLocation.findUnique({
      where: {
        id: id,
      },
    });

    if (funclocExists) {
      return {
        success: false,
        message: "Functional location with this ID already exists.",
        errors: {
          id:
            funclocExists.id === id
              ? ["Functional location with this ID already exists."]
              : undefined,
        },
      };
    }

    await prisma.functionalLocation.create({
      data: {
        id: id,
        description: description,
        userId: user.id ? parseInt(user.id, 10) : null,
      },
    });

    return {
      success: true,
      message: "Functional location created successfully.",
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

type EditFunclocResult = {
  success: boolean;
  message: string;
  errors: { [key: string]: string[] | undefined } | null;
};

export async function editFunctionalLocation(
  prevState: unknown,
  formData: FormData
): Promise<EditFunclocResult> {
  const user = await getUserSession();

  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = EditFunctionalLocationSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation Error",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }
    const { id, description } = validatedData.data;

    const funclocExists = await prisma.functionalLocation.findUnique({
      where: {
        id: id,
      },
    });

    if (!funclocExists) {
      return {
        success: false,
        message: "Functional location is not exists",
        errors: {
          id: ["Functional location is not exists"],
        },
      };
    }

    await prisma.functionalLocation.update({
      where: {
        id: id,
      },
      data: {
        description: description,
        userId: user.id ? parseInt(user.id, 10) : null,
      },
    });

    return {
      success: true,
      message: "Functional location updated successfully",
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
