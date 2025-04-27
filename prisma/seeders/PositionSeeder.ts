import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { positionsData } from "../data/positions";
const prisma = new PrismaClient();

export async function seedPosition() {
  try {
    await prisma.position.createMany({
      data: positionsData,
    });
  } catch (e) {
    console.log(`Error seeding position: ${e}`);
  } finally {
    prisma.$disconnect();
  }
}

export const getRandomPositionId = () => {
  const length = positionsData.length;
  const index = faker.number.int({ min: 0, max: length - 1 });

  return positionsData[index].id;
};
