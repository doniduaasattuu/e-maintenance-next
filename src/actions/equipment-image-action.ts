"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import fSync from "fs";

export async function deleteImageFromEquipment(
  equipmentId: string,
  imageId: string
) {
  try {
    const imageModel = await prisma.image.findUnique({
      where: {
        id: imageId,
      },
    });

    if (!imageModel) {
      return {
        success: false,
        message: "Image not found.",
      };
    }

    const imagePath = imageModel.path;

    const filePath = path.join(
      process.cwd(),
      "storage",
      imagePath.replace("/api", "")
    );

    if (fSync.existsSync(filePath)) {
      await fs.unlink(filePath);
    }

    await prisma.equipmentImage.delete({
      where: {
        equipmentId_imageId: {
          equipmentId: equipmentId,
          imageId: imageId,
        },
      },
    });

    revalidatePath(`/equipments/${equipmentId}/edit`);

    return {
      success: true,
      message: "Image successfully removed from related equipment.",
    };
  } catch (error) {
    console.error("Error deleting image from equipment:", error);
    return {
      success: false,
      message: "Error deleting image from equipment",
    };
  }
}
