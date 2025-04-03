"use server";

import prisma from "@/lib/prisma";
import { CreateFileSchema } from "@/validations/file-validation";
import fs from "fs/promises";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import path from "path";

type getFileParams = {
  page?: number;
  perPage?: string;
  orderBy?: string;
  sortBy?: "id" | "description" | string;
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

  const allFiles = await prisma.file.findMany({
    orderBy: { [sortBy]: orderBy as "asc" | "desc" },
    ...(query && {
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { tags: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
  });

  const total = allFiles.length;

  const paginatedFiles = allFiles.slice(skip, skip + Number(perPage));

  return {
    files: paginatedFiles,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / Number(perPage)),
  };
}

export async function createFile(prevState: unknown, formData: FormData) {
  const session = await getServerSession();
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
        tags:
          tags === "undefined"
            ? `${fileExtension}`
            : `${fileExtension} ${tags}`,
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
    revalidatePath("/files");

    return {
      success: true,
      message: "File deleted successfully",
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Something went wrong",
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
