import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { classificationsData } from "../data/classifications";
const prisma = new PrismaClient();

export async function seedClassification() {
  try {
    await prisma.classification.createMany({
      data: classificationsData,
    });
  } catch (e) {
    console.log(`Error seeding classification: ${e}`);
  } finally {
    prisma.$disconnect();
  }
}

export const getRandomClassificationType = () => {
  const length = classificationsData.length;
  const index = faker.number.int({ min: 0, max: length - 1 });

  return classificationsData[index].type;
};

export async function getClassifications() {
  const classifications = await prisma.classification.findMany();
  return classifications;
}
