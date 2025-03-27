import prisma from "@/lib/prisma";
import { CreateFunctionalLocationSchema } from "@/validations/functional-location-validation";

type getFunclocParams = {
  page?: number;
  perPage?: number;
};

export async function getFunctionalLocations({
  page = 1,
  perPage = 10,
}: getFunclocParams) {
  const skip = (page - 1) * perPage;

  const [functionalLocations, total] = await Promise.all([
    prisma.functionalLocation.findMany({
      skip,
      take: perPage,
      orderBy: { createdAt: "desc" },
    }),
    prisma.functionalLocation.count(),
  ]);

  return {
    functionalLocations,
    total,
    page,
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

    const funclocExist = await prisma.functionalLocation.findUnique({
      where: {
        id: validatedData.data.id,
      },
    });

    if (funclocExist) {
      return {
        success: true,
        message: null,
        errors: { id: ["Functional location is exists"] },
      };
    }

    const { id, description } = validatedData.data;

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
