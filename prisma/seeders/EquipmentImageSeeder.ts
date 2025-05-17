import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function seedEquipmentImage() {
  try {
    const panelEquipments = await prisma.equipment.findMany({
      take: 5,
      orderBy: {
        id: "desc",
      },
      where: {
        classification: {
          type: {
            equals: "PANEL",
          },
        },
      },
    });

    if (!panelEquipments) {
      throw new Error("Error seed equipment image");
    }

    for (const equipment of panelEquipments) {
      const images = await prisma.image.findMany({
        take: faker.number.int({ min: 1, max: 3 }),
      });

      images.sort();
      for (const image of images) {
        await prisma.equipmentImage.create({
          data: {
            equipmentId: equipment.id,
            imageId: image.id,
          },
        });
      }
    }

    console.log("✅ Equipment-Image seeder");
  } catch (error) {
    console.error("❌ Error seeding equipment image:", error);
  } finally {
    await prisma.$disconnect();
  }
}
