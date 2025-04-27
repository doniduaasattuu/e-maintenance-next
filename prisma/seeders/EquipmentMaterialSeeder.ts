import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { getRandomEquipmentId } from "./EquipmentSeeder";
import { getRandomMaterialId } from "./MaterialSeeder";
const prisma = new PrismaClient();

export default async function seedRandomEquipmentMaterial(total?: number) {
  try {
    const equipmentMaterialsPromises = Array.from({ length: total ?? 10 }).map(
      async () => ({
        equipmentId: await getRandomEquipmentId(),
        materialId: await getRandomMaterialId(),
        quantity: faker.number.int({ min: 1, max: 4 }),
      })
    );

    const equipmentMaterials = await Promise.all(equipmentMaterialsPromises);

    await prisma.equipmentMaterial.createMany({
      data: equipmentMaterials,
      skipDuplicates: true,
    });

    console.log("✅ Equipment-Material seeder");
  } catch (error) {
    console.error("❌ Error seeding equipment material:", error);
  } finally {
    await prisma.$disconnect();
  }
}
