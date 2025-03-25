import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [{ name: "User" }, { name: "Admin" }],
    skipDuplicates: true, // To avoid duplicates on re-run
  });

  const adminRole = await prisma.role.findUnique({
    where: { name: "Admin" },
  });

  if (!adminRole) {
    throw new Error("Admin role not found");
  }

  const userRole = await prisma.role.findUnique({
    where: { name: "User" },
  });

  if (!userRole) {
    throw new Error("User role not found");
  }

  await prisma.user.createMany({
    data: [
      {
        email: "doni@gmail.com",
        name: "Doni Darmawan",
        nik: "55000154",
        image: "https://github.com/shadcn.png",
        password: await bcrypt.hash("password", 10),
        roleId: adminRole.id,
      },
      {
        email: "mark@gmail.com",
        name: "Mark Morton",
        nik: "55000111",
        password: await bcrypt.hash("password", 10),
        roleId: userRole.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .then(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
