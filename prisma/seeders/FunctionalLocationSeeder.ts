import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function generateRandomFuncloc() {
  const machines = [
    "SP1",
    "PM1",
    "SP2",
    "PM2",
    "SP3",
    "PM3",
    "SP5",
    "PM5",
    "SP7",
    "PM7",
    "SP8",
    "PM8",
  ];
  const machine = faker.helpers.arrayElement(machines);
  const field = faker.string.alphanumeric(3).toUpperCase();
  const type =
    faker.string.alpha(2).toUpperCase() +
    faker.number.int({ min: 0, max: 99 }).toString().padStart(2, "0");
  return `FP-01-${machine}-${field}-${type}`;
}

export async function seedRandomFunctionalLocations(total?: number) {
  try {
    const funclocIds = Array.from({ length: total ?? 10 }).map(() => ({
      id: generateRandomFuncloc(),
    }));

    for (const funcloc of funclocIds) {
      await prisma.functionalLocation.create({
        data: {
          id: funcloc.id,
          description: faker.company.buzzPhrase().toUpperCase(),
        },
      });
    }

    console.log("✅ Functional location seeder");
  } catch (error) {
    console.error("❌ Error seeding functional location:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getRandomFunclocId(total?: number) {
  const funclocs = await prisma.functionalLocation.findMany({
    take: total ?? 10,
    select: {
      id: true,
    },
  });

  if (!funclocs) {
    throw new Error("Functional locations is empty");
  }

  const funclocIds = funclocs.map((funcloc) => funcloc.id);
  const index = faker.number.int({ min: 0, max: funclocs.length - 1 });
  return funclocIds[index];
}
