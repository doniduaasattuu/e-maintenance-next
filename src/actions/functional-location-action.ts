"use server";

import prisma from "@/lib/prisma";
import { CreateFunctionalLocationSchema } from "@/validations/functional-location-validation";

type getFunclocParams = {
  destinationPage?: number;
  perPage?: number;
  orderBy?: string;
  sortBy?: "id" | "description" | string;
  query?: string;
};

export async function getFunctionalLocations({
  destinationPage = 1,
  perPage = 10,
  orderBy = "desc",
  sortBy = "id",
  query,
}: getFunclocParams) {
  const skip = (destinationPage - 1) * perPage;

  const [functionalLocations, total] = await Promise.all([
    prisma.functionalLocation.findMany({
      skip,
      take: perPage,
      orderBy: { [sortBy]: orderBy as "asc" | "desc" },
      ...(query && {
        where: {
          OR: [
            { id: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
      }),
    }),
    prisma.functionalLocation.count(),
  ]);

  return {
    functionalLocations,
    total,
    destinationPage,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

export async function createFunctionalLocation(
  prevState: unknown,
  formData: FormData
) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = CreateFunctionalLocationSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: null,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }
    const { id, description } = validatedData.data;

    const funclocExist = await prisma.functionalLocation.findFirst({
      where: {
        id: id,
      },
    });

    if (funclocExist) {
      return {
        success: false,
        message: "Functional location already exists",
        errors: {
          id:
            funclocExist.id === id
              ? ["Functional location already exists"]
              : undefined,
        },
      };
    }

    await prisma.functionalLocation.create({
      data: {
        id: id,
        description: description,
      },
    });

    return {
      success: true,
      message: "Functional location created successfully",
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
