import { PrismaClient } from "@prisma/client";
import { equipmentStatusesData } from "../data/equipment-statuses";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();

export async function seedEquipmentStatus() {
  try {
    await prisma.equipmentStatus.createMany({
      data: equipmentStatusesData,
    });
  } catch (e) {
    console.log(`Error seeding equipment status: ${e}`);
  } finally {
    prisma.$disconnect();
  }
}

export const getRandomEquipmentStatusDescription = () => {
  const length = equipmentStatusesData.length;
  const index = faker.number.int({ min: 0, max: length - 1 });

  return equipmentStatusesData[index].description;
};
