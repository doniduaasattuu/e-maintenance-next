"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteFileFromEquipment(
  equipmentId: string,
  fileId: string
) {
  try {
    await prisma.equipmentFile.delete({
      where: {
        equipmentId_fileId: {
          equipmentId: equipmentId,
          fileId: fileId,
        },
      },
    });

    revalidatePath(`/equipments/${equipmentId}/edit`);

    return {
      success: true,
      message: "File successfully removed from related equipment.",
    };
  } catch (error) {
    console.error("Error deleting file from equipment:", error);
    return {
      success: false,
      message: "Error deleting file from equipment",
    };
  }
}

export async function addFileToEquipment(equipmentId: string, fileId: string) {
  try {
    // Periksa apakah kombinasi equipmentId dan fileId sudah ada
    const existingRelation = await prisma.equipmentFile.findUnique({
      where: {
        equipmentId_fileId: {
          equipmentId: equipmentId,
          fileId: fileId,
        },
      },
    });

    if (existingRelation) {
      return {
        success: false,
        message: "File has been added to this equipment",
      };
    }

    // Tambahkan relasi antara equipment dan file jika belum ada
    await prisma.equipmentFile.create({
      data: {
        equipmentId: equipmentId,
        fileId: fileId,
      },
    });

    // Revalidate path agar data terbaru ditampilkan
    revalidatePath(`/equipments/${equipmentId}/edit`);

    return {
      success: true,
      message: "File successfully added to equipment",
    };
  } catch (error) {
    console.error("Error adding file to equipment:", error);
    return {
      success: false,
      message: "Error adding file to equipment",
    };
  }
}
