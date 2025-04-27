import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import {
  getRandomFindingStatusDescription,
  seedFindingStatus,
} from "./FindingStatusSeeder";
import { getRandomEquipmentId } from "./EquipmentSeeder";
import { getRandomUserId } from "./UserSeeder";
import { seedFindingImage } from "./FindingImageSeeder";

async function generateRandomFinding() {
  const withEquipment = true;

  const equipment = withEquipment
    ? await prisma.equipment.findUnique({
        where: {
          id: await getRandomEquipmentId(),
          equipmentStatus: {
            description: {
              equals: "Installed",
            },
          },
        },
      })
    : null;

  const findingStatus = await prisma.findingStatus.findUnique({
    where: {
      description: getRandomFindingStatusDescription(),
    },
  });

  if (!findingStatus) {
    throw new Error("Finding status not found");
  }

  const description = faker.lorem.paragraph();
  const notification = faker.datatype.boolean(0.25)
    ? faker.number.int({ min: 11111111, max: 99999999 }).toString()
    : null;
  const equipmentId = equipment?.id;
  const functionalLocationId = equipment?.functionalLocationId;
  const userId = await getRandomUserId();
  const findingStatusId = findingStatus.id;

  return {
    description,
    notification,
    equipmentId,
    functionalLocationId,
    userId,
    findingStatusId,
  };
}

export async function seedRandomFinding(total?: number) {
  await seedFindingStatus();

  try {
    const findingsPromises = Array.from({ length: total ?? 20 }).map(
      async () => await generateRandomFinding()
    );

    const findings = await Promise.all(findingsPromises);

    await prisma.finding.createMany({
      data: findings,
      skipDuplicates: true,
    });

    const storedFindings = await prisma.finding.findMany({
      select: {
        id: true,
        description: true,
        findingStatus: {
          select: {
            id: true,
            description: true,
          },
        },
      },
    });

    await seedFindingImage(storedFindings);

    console.log("✅ Finding seeder");
  } catch (error) {
    console.error("❌ Error seeding finding:", error);
  } finally {
    await prisma.$disconnect();
  }
}
