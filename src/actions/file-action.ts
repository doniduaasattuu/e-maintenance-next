"use server";

import prisma from "@/lib/prisma";
import {
  CreateFileSchema,
  EditFileSchema,
} from "@/validations/file-validation";
import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { getUserSession } from "@/hooks/useUserSession";
import fSync from "fs";

type getFileParams = {
  page?: number;
  perPage?: string;
  orderBy?: string;
  sortBy?: string;
  query?: string;
};

export async function getFiles({
  page = 1,
  perPage = "15",
  orderBy = "desc",
  sortBy = "createdAt",
  query,
}: getFileParams) {
  const skip = (page - 1) * Number(perPage);
  const take = parseInt(perPage);

  const [files, total] = await prisma.$transaction([
    prisma.file.findMany({
      skip,
      take,
      orderBy: { [sortBy]: orderBy as "asc" | "desc" },
      ...(query && {
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { tags: { contains: query, mode: "insensitive" } },
          ],
        },
      }),
    }),
    prisma.file.count({
      orderBy: { [sortBy]: orderBy as "asc" | "desc" },
      ...(query && {
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { tags: { contains: query, mode: "insensitive" } },
          ],
        },
      }),
    }),
  ]);

  return {
    files,
    totalPages: Math.ceil(total / parseInt(perPage)),
  };
}

export async function createFile(prevState: unknown, formData: FormData) {
  const uploader = await getUserSession();

  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = CreateFileSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: null,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { name, tags, file } = validatedData.data;
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    const createdFile = await prisma.file.create({
      data: {
        name,
        tags: tags === "undefined" ? null : tags,
        type: fileExtension ?? "",
        path: "", // temporary path, will be updated after saving
      },
    });

    const fileName = `${createdFile.id}.${fileExtension}`;
    const relativePath = await saveFile(file, fileName);

    await prisma.file.update({
      where: { id: createdFile.id },
      data: {
        path: relativePath,
        userId: Number(uploader?.id),
      },
    });

    return {
      success: true,
      message: "File uploaded successfully",
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
  const dirPath = path.join(process.cwd(), "storage", "uploads", "files");
  const filePath = path.join(dirPath, fileName);

  await fs.mkdir(dirPath, { recursive: true }); // Ensure directory exists
  await fs.writeFile(filePath, Buffer.from(fileBuffer));

  return `/api/uploads/files/${fileName}`;
}

export async function deleteFileById(id: string) {
  try {
    const file = await prisma.file.delete({
      where: { id },
    });

    const absolutePath = path.join(
      process.cwd(),
      "storage",
      file.path.replace("/api", "")
    );
    if (fSync.existsSync(absolutePath)) {
      await fs.unlink(absolutePath);
    }

    // Delete equipment relation
    await prisma.equipmentFile.deleteMany({
      where: { fileId: id },
    });

    revalidatePath("/files");

    return {
      success: true,
      message: "File deleted successfully",
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

export async function deleteFileFromFilesystem(imagePath: string) {
  try {
    const filePath = path.join(
      process.cwd(),
      "storage",
      imagePath.replace("/api", "")
    );

    if (fSync.existsSync(filePath)) {
      await fs.unlink(filePath);
    }
  } catch (error) {
    console.error("Error deleting finding image:", error);
    return {
      success: false,
      message: "Failed to delete finding image.",
    };
  }
}

export async function editFile(prevState: unknown, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = EditFileSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: null,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { id, name, tags, file } = validatedData.data;

    const currentFile = await prisma.file.findUnique({
      where: { id },
    });

    if (!currentFile) {
      return {
        success: false,
        message: null,
        errors: { name: ["File does not exist."] },
      };
    }

    // If file is being replaced
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const fileName = `${currentFile.id}.${fileExtension}`;
      const relativePath = `/api/uploads/files/${fileName}`;
      // const absolutePath = path.join(process.cwd(), "storage", relativePath);

      // Delete old file if exists
      const oldFilePath = path.join(
        process.cwd(),
        "storage",
        currentFile.path.replace("/api", "")
      );
      if (fSync.existsSync(oldFilePath)) {
        await fs.unlink(oldFilePath);
      }

      // Save new file
      await saveFile(file, fileName);

      // Update record
      await prisma.file.update({
        where: { id },
        data: {
          name,
          tags: tags === "undefined" ? null : tags,
          type: fileExtension ?? "",
          path: relativePath,
        },
      });
    } else {
      // Only update name/tags
      await prisma.file.update({
        where: { id },
        data: {
          name,
          tags: tags === "undefined" ? null : tags,
        },
      });
    }

    return {
      success: true,
      message: "File updated successfully",
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

export async function getFileById(id: string) {
  const file = await prisma.file.findUnique({
    where: {
      id: id,
    },
  });

  return file;
}

export async function getFilesByKeyword(
  keyword: string
): Promise<FileSearchResult[] | null> {
  const files = await prisma.file.findMany({
    where: {
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { tags: { contains: keyword, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      path: true,
    },
  });

  return files;
}

export type FileSearchResult = {
  id: string;
  name: string;
  path: string;
};
