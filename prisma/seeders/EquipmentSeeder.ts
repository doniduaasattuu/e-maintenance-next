import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import {
  getRandomEquipmentStatusDescription,
  seedEquipmentStatus,
} from "./EquipmentStatusSeeder";
import { seedClassification } from "./ClassificationSeeder";
import { getRandomFunclocId } from "./FunctionalLocationSeeder";
const prisma = new PrismaClient();

export async function getRandomEquipmentId(): Promise<string> {
  const length = await prisma.equipment.count();
  const take = faker.number.int({ min: 10, max: length - 1 });
  const sortBy = faker.helpers.arrayElement(["asc", "desc"]);

  const equipments = await prisma.equipment.findMany({
    take: take,
    orderBy: {
      id: sortBy as "asc" | "desc",
    },
    select: {
      id: true,
    },
  });

  if (!equipments) {
    throw new Error("Error get random equipments");
  }

  const equipmentIds = equipments.map((equipment) => equipment.id);
  const shuffledEquipmentIds = faker.helpers.shuffle(equipmentIds);
  const index = faker.number.int({
    min: 0,
    max: shuffledEquipmentIds.length - 1,
  });

  return shuffledEquipmentIds[index];
}

function generateRandomNumeric(length: number): number {
  const min = Math.pow(10, length - 1); // Angka terkecil dengan panjang 'length'
  const max = Math.pow(10, length) - 1; // Angka terbesar dengan panjang 'length'
  const randomNumeric = faker.number.int({ min, max });
  return randomNumeric;
}

function generateRandomEquipment(prefix: string) {
  const numericPart = generateRandomNumeric(6);
  return `${prefix}${numericPart}`;
}

export async function seedRandomEquipments(total?: number) {
  await seedEquipmentStatus();
  await seedClassification();

  try {
    const classifications = await prisma.classification.findMany();

    if (!classifications || classifications.length < 1) {
      throw new Error("Classification is empty");
    }

    for (const classification of classifications) {
      let type = "";
      switch (classification.type) {
        case "MOTOR":
          type = "EMO";
          break;
        case "PANEL":
          type = "ELP";
          break;
      }

      const equipments = Array.from({ length: total ?? 10 }).map(() => ({
        id: generateRandomEquipment(type),
      }));

      for (const equipment of equipments) {
        const status = await prisma.equipmentStatus.findFirst({
          where: {
            description: getRandomEquipmentStatusDescription(),
          },
        });

        if (!status) {
          throw new Error("Error find equipment status");
        }

        let functionalLocationId = null;

        if (status.description === "Installed") {
          functionalLocationId = await getRandomFunclocId();
        }

        await prisma.equipment.create({
          data: {
            id: equipment.id,
            classificationId: classification.id,
            equipmentStatusId: status.id,
            sortField: faker.lorem.words({ min: 1, max: 2 }).toUpperCase(),
            description: faker.lorem.words({ min: 2, max: 4 }).toUpperCase(),
            functionalLocationId: functionalLocationId,
          },
        });
      }
    }

    console.log("✅ Equipment seeder");
  } catch (error) {
    console.error("❌ Error seeding equipment:", error);
  } finally {
    await prisma.$disconnect();
  }
}
