import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { departmentData } from "../data/departments";
const prisma = new PrismaClient();

export async function seedDepartment() {
  try {
    await prisma.department.createMany({
      data: departmentData,
    });
  } catch (e) {
    console.log(`Error seeding department: ${e}`);
  } finally {
    prisma.$disconnect();
  }
}

export const getRandomDepartmentId = () => {
  const length = departmentData.length;
  const index = faker.number.int({ min: 0, max: length - 1 });

  return departmentData[index].id;
};
