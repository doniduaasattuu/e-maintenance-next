"use server";

import prisma from "@/lib/prisma";
import { Finding } from "@/types/finding";
import { FindingStatus } from "@/types/finding-status";
import { StoreFindingSchema } from "@/validations/finding-validation";
import { getServerSession } from "next-auth";
import { v4 as uuid } from "uuid";
import fs from "fs/promises";
import path from "path";

type getFindingsParams = {
  page?: number;
  perPage?: string;
  orderBy?: string;
  sortBy?: string;
  query?: string;
};

type PaginatedFindings = {
  findings: Finding[];
  totalPages: number;
  findingStatuses: FindingStatus[];
};

export async function getFindings({
  page = 1,
  perPage = "15",
  orderBy = "desc",
  sortBy = "createdAt",
  query,
}: getFindingsParams): Promise<PaginatedFindings> {
  const skip = (page - 1) * Number(perPage);
  const take = parseInt(perPage);

  const [findings, total, findingStatuses] = await prisma.$transaction([
    prisma.finding.findMany({
      skip,
      take,
      orderBy: { [sortBy]: orderBy as "asc" | "desc" },
      ...(query && {
        where: {
          OR: [
            { description: { contains: query, mode: "insensitive" } },
            { notification: { contains: query, mode: "insensitive" } },
            { equipmentId: { contains: query, mode: "insensitive" } },
            {
              functionalLocationId: { contains: query, mode: "insensitive" },
            },
          ],
        },
      }),
      include: {
        equipment: {
          select: {
            id: true,
            sortField: true,
            description: true,
          },
        },
        functionalLocation: {
          select: {
            id: true,
            description: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        findingImages: {
          select: {
            id: true,
            findingId: true,
            path: true,
            imageStatus: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    }),
    prisma.finding.count({
      ...(query && {
        where: {
          OR: [
            { description: { contains: query, mode: "insensitive" } },
            { notification: { contains: query, mode: "insensitive" } },
            { equipmentId: { contains: query, mode: "insensitive" } },
            {
              functionalLocationId: { contains: query, mode: "insensitive" },
            },
          ],
        },
      }),
    }),
    prisma.findingStatus.findMany({
      select: {
        id: true,
        description: true,
      },
    }),
  ]);

  return {
    findings,
    totalPages: Math.ceil(total / parseInt(perPage)),
    findingStatuses,
  };
}

export async function getFindingStatuses(): Promise<FindingStatus[] | null> {
  const findingStatuses = await prisma.findingStatus.findMany({
    select: {
      id: true,
      description: true,
    },
  });

  return findingStatuses;
}

export async function createFinding(prevState: unknown, formData: FormData) {
  const session = await getServerSession();
  const uploader = session?.user;

  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = StoreFindingSchema.safeParse(rawData);
    const images = formData.getAll("images");

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation Error",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const {
      findingStatusId,
      notification,
      equipmentId,
      functionalLocationId,
      description,
    } = validatedData.data;

    if (equipmentId) {
      const isEquipmentExist = await prisma.equipment.findUnique({
        where: {
          id: equipmentId,
        },
      });

      if (!isEquipmentExist) {
        return {
          success: false,
          message: "Equipment is not exists",
          errors: {
            equipmentId: [
              "Equipment is not exists or you can leave the input blank",
            ],
          },
        };
      }
    }

    if (functionalLocationId) {
      const isFunclocExists = await prisma.functionalLocation.findUnique({
        where: {
          id: functionalLocationId,
        },
      });

      if (!isFunclocExists) {
        return {
          success: false,
          message: "Functional location is not exists",
          errors: {
            equipmentId: [
              "Functional location is not exists or you can leave the input blank",
            ],
          },
        };
      }
    }

    const storedFinding = await prisma.finding.create({
      data: {
        findingStatusId: findingStatusId,
        notification: notification,
        equipmentId: equipmentId,
        functionalLocationId: functionalLocationId,
        description: description,
        userId: parseInt(String(uploader?.id)) ?? null,
      },
    });

    if (images.length > 0) {
      images.map(async (image) => {
        image = image as File;
        const fileExtension = image.name.split(".").pop()?.toLowerCase();
        const fileName = uuid() + "." + fileExtension;

        await prisma.findingImage.create({
          data: {
            path: `/images/findings/${fileName}`,
            findingId: storedFinding.id,
            imageStatus: "Before",
          },
        });

        saveFile(image, fileName);
      });
    }

    return {
      success: true,
      message: "Finding created successfully",
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

async function saveFile(file: File, fileName: string): Promise<string> {
  const fileBuffer = await file.arrayBuffer();
  const filePath = path.join(process.cwd(), "public/images/findings", fileName);

  try {
    await fs.writeFile(filePath, Buffer.from(fileBuffer));
    return `/image/findings/${fileName}`;
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
}
