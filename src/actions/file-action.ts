"use server";

import prisma from "@/lib/prisma";
import {
  CreateFileSchema,
  EditFileSchema,
} from "@/validations/file-validation";
import fs from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

  const [files, totalPages] = await prisma.$transaction([
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
    totalPages,
  };
}

export async function createFile(prevState: unknown, formData: FormData) {
  const session = await getServerSession(authOptions);
  const uploader = session?.user;

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

    const fileExtension = file.name.split(".").pop();

    const result = await prisma.file.create({
      data: {
        name: name,
        tags: tags === "undefined" ? null : tags,
        type: String(fileExtension).toLowerCase(),
        path: "/files",
      },
    });

    const fileName = `${result.id}.${fileExtension}`;
    saveFile(file, fileName);

    const path = `/files/${fileName}`;

    await prisma.file.update({
      where: {
        id: result.id,
      },
      data: {
        path: path,
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
  const filePath = path.join(process.cwd(), "public/files", fileName);

  try {
    await fs.writeFile(filePath, Buffer.from(fileBuffer));
    return `/files/${fileName}`; // Return path relative to public directory
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
}

export async function deleteFileById(id: string) {
  try {
    const file = await prisma.file.delete({
      where: {
        id: id,
      },
    });

    await deleteFileFromFilesystem(file.path);

    await prisma.equipmentFile.deleteMany({
      where: {
        fileId: id,
      },
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

export async function deleteFileFromFilesystem(fileName: string) {
  try {
    const filePath = path.join(process.cwd(), "public", fileName);
    await fs.unlink(filePath); // Hapus file dari sistem file
  } catch (error) {
    console.error("Error deleting file:", error);
    return {
      success: false,
      message: "Failed to delete file.",
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
      where: {
        id: id,
      },
    });

    if (!currentFile) {
      return {
        success: false,
        message: null,
        errors: { name: ["File is not exists"] },
      };
    }

    if (file) {
      const fileExtension = file.name.split(".").pop();
      deleteFileFromFilesystem(currentFile.path);
      const fileName = `${currentFile.id}.${fileExtension}`;
      const path = `/files/${fileName}`;

      saveFile(file, fileName);

      await prisma.file.update({
        where: {
          id: currentFile.id,
        },
        data: {
          name: name,
          tags: tags === "undefined" ? null : tags,
          type: String(fileExtension).toLowerCase(),
          path: path,
        },
      });
    } else {
      await prisma.file.update({
        where: {
          id: currentFile.id,
        },
        data: {
          name: name,
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
