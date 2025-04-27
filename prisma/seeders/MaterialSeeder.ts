import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { getRandomUnitDescription, seedUnit } from "./UnitSeeder";
const prisma = new PrismaClient();

export async function getRandomMaterialId(): Promise<string> {
  const length = await prisma.material.count();
  const take = faker.number.int({ min: 10, max: length - 1 });
  const sortBy = faker.helpers.arrayElement(["asc", "desc"]);

  const materials = await prisma.material.findMany({
    take: take,
    orderBy: {
      id: sortBy as "asc" | "desc",
    },
    select: {
      id: true,
    },
  });

  if (!materials) {
    throw new Error("Error get random materials");
  }

  const materialIds = materials.map((material) => material.id);
  const shuffledMaterialIds = faker.helpers.shuffle(materialIds);
  const index = faker.number.int({
    min: 0,
    max: shuffledMaterialIds.length - 1,
  });

  return shuffledMaterialIds[index];
}

function generateRandomMaterial() {
  const id = `100${faker.number.int({ min: 11111, max: 99999 })}`;
  const name = faker.commerce.productName();
  const price = faker.number.int({ min: 10000, max: 9999999 });

  return { id, name, price };
}

export async function seedRandomMaterials(total?: number) {
  await seedUnit();

  try {
    const materials = Array.from({ length: total ?? 10 }).map(() =>
      generateRandomMaterial()
    );

    for (const material of materials) {
      const unit = await prisma.unit.findUnique({
        where: {
          description: getRandomUnitDescription(),
        },
      });

      if (!unit) {
        throw new Error("Error seeding material");
      }

      await prisma.material.create({
        data: {
          id: material.id,
          name: material.name,
          price: material.price,
          unitId: unit?.id,
        },
      });
    }

    console.log("✅ Material seeder");
  } catch (error) {
    console.error("❌ Error seeding material:", error);
  } finally {
    await prisma.$disconnect();
  }
}
