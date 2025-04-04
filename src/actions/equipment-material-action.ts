"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteMaterialFromEquipment(
  equipmentId: string,
  materialId: string
) {
  try {
    await prisma.equipmentMaterial.delete({
      where: {
        equipmentId_materialId: {
          equipmentId: equipmentId,
          materialId: materialId,
        },
      },
    });

    revalidatePath(`/equipments/${equipmentId}/edit`);

    return {
      success: true,
      message: "Material successfully removed from related equipment",
    };
  } catch (error) {
    console.error("Error deleting material from equipment:", error);
    return {
      success: false,
      message: "Error deleting material from equipment",
    };
  }
}

export async function addMaterialToEquipment(
  equipmentId: string,
  materialId: string
) {
  try {
    // Periksa apakah kombinasi equipmentId dan materialId sudah ada
    const existingRelation = await prisma.equipmentMaterial.findUnique({
      where: {
        equipmentId_materialId: {
          equipmentId: equipmentId,
          materialId: materialId,
        },
      },
    });

    if (existingRelation) {
      return {
        success: false,
        message: "Material has been added to this equipment",
      };
    }

    // Tambahkan relasi antara equipment dan material jika belum ada
    await prisma.equipmentMaterial.create({
      data: {
        equipmentId: equipmentId,
        materialId: materialId,
        quantity: 1,
      },
    });

    // Revalidate path agar data terbaru ditampilkan
    revalidatePath(`/equipments/${equipmentId}/edit`);

    return {
      success: true,
      message: "Material successfully added to equipment",
    };
  } catch (error) {
    console.error("Error adding material to equipment:", error);
    return {
      success: false,
      message: "Error adding material to equipment",
    };
  }
}
