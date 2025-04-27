import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { getRandomRoleName, seedRole } from "./RoleSeeder";
import bcrypt from "bcrypt";
import { getRandomDepartmentId, seedDepartment } from "./DepartmentSeeder";
import { getRandomPositionId, seedPosition } from "./PositionSeeder";
const prisma = new PrismaClient();

function generateRandomUser() {
  const nik = faker.number.int({ min: 10000000, max: 99999999 }).toString();
  const name = faker.person.fullName();
  const email = faker.internet.email({ provider: "gmail.com" }).toLowerCase();
  const image = faker.image.avatar();
  const phone = faker.phone.number({ style: "international" });

  return {
    nik,
    name,
    email,
    image,
    phone,
  };
}

export async function seedRandomUser(total?: number) {
  await seedRole();
  await seedDepartment();
  await seedPosition();

  try {
    const users = Array.from({ length: total ?? 10 }).map(() =>
      generateRandomUser()
    );

    for (const user of users) {
      const role = await prisma.role.findUnique({
        where: {
          name: getRandomRoleName(),
        },
      });

      const department = await prisma.department.findUnique({
        where: {
          id: getRandomDepartmentId(),
        },
      });

      const position = await prisma.position.findUnique({
        where: {
          id: getRandomPositionId(),
        },
      });

      if (!role || !department || !position) {
        throw new Error("Error seeding user");
      }

      await prisma.user.create({
        data: {
          nik: user.nik,
          name: user.name,
          email: user.email,
          image: user.image,
          password: await bcrypt.hash("password", 10),
          roleId: role.id,
          departmentId: department.id,
          positionId: position.id,
          phone: user.phone,
        },
      });
    }

    console.log("✅ User seeder");
  } catch (e) {
    console.log(`❌ Error seeding user: ${e}`);
  } finally {
    prisma.$disconnect();
  }
}

export async function getRandomUserId(): Promise<number> {
  const length = await prisma.user.count();
  const take = faker.number.int({ min: 10, max: length - 1 });
  const sortBy = faker.helpers.arrayElement(["asc", "desc"]);

  const users = await prisma.user.findMany({
    take: take,
    orderBy: {
      id: sortBy as "asc" | "desc",
    },
    select: {
      id: true,
    },
  });

  if (!users) {
    throw new Error("Error get random users");
  }

  const userIds = users.map((user) => user.id);
  const shuffledUserIds = faker.helpers.shuffle(userIds);
  const index = faker.number.int({
    min: 0,
    max: shuffledUserIds.length - 1,
  });

  return shuffledUserIds[index];
}
