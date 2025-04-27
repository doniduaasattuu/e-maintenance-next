import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { rolesData } from "../data/roles";
const prisma = new PrismaClient();

export async function seedRole() {
  try {
    await prisma.role.createMany({
      data: rolesData,
    });
  } catch (e) {
    console.log(`Error seeding role: ${e}`);
  } finally {
    prisma.$disconnect();
  }
}

export const getRandomRoleName = () => {
  const length = rolesData.length;
  const index = faker.number.int({ min: 0, max: length - 1 });

  return rolesData[index].name;
};
