import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { unitsData } from "../data/units";
const prisma = new PrismaClient();

export async function seedUnit() {
  try {
    await prisma.unit.createMany({
      data: unitsData,
    });
  } catch (e) {
    console.log(`Error seeding unit: ${e}`);
  } finally {
    prisma.$disconnect();
  }
}

export const getRandomUnitDescription = () => {
  const length = unitsData.length;
  const index = faker.number.int({ min: 0, max: length - 1 });

  return unitsData[index].description;
};
