import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { findingStatusesData } from "../data/finding-statuses";

export async function seedFindingStatus() {
  await prisma.findingStatus.createMany({
    data: findingStatusesData,
  });
}

export const getRandomFindingStatusDescription = () => {
  const length = findingStatusesData.length;
  const index = faker.number.int({ min: 0, max: length - 1 });

  return findingStatusesData[index].description;
};
