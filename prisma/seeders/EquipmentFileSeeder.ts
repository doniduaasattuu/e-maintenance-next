import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function seedEquipmentFile() {
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
      throw new Error("Error seed equipment file");
    }

    for (const equipment of panelEquipments) {
      const files = await prisma.file.findMany({
        take: faker.number.int({ min: 1, max: 3 }),
      });

      for (const file of files) {
        await prisma.equipmentFile.create({
          data: {
            equipmentId: equipment.id,
            fileId: file.id,
          },
        });
      }
    }

    console.log("✅ Equipment-File seeder");
  } catch (error) {
    console.error("❌ Error seeding equipment file:", error);
  } finally {
    await prisma.$disconnect();
  }
}
