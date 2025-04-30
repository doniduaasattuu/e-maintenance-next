import { PrismaClient } from "@prisma/client";
import { seedRandomFunctionalLocations } from "./seeders/FunctionalLocationSeeder";
import { seedRandomEquipments } from "./seeders/EquipmentSeeder";
import { seedRandomUser } from "./seeders/UserSeeder";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import { seedRandomMaterials } from "./seeders/MaterialSeeder";
import seedRandomEquipmentMaterial from "./seeders/EquipmentMaterialSeeder";
import { seedEquipmentInspections } from "./seeders/InspectionSeeder";
import { seedRandomFinding } from "./seeders/FindingSeeder";
import { seedFile } from "./seeders/FileSeeder";
import seedEquipmentFile from "./seeders/EquipmentFileSeeder";

async function seedAdmin() {
  const adminRole = await prisma.role.findUnique({
    where: {
      name: "Admin",
    },
  });

  if (!adminRole) {
    throw new Error("Error seeding user");
  }

  await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      name: "Administrator",
      nik: "12345678",
      image: "/api/uploads/images/users/12345678-1745979400578.jpg",
      password: await bcrypt.hash("password", 10),
      roleId: adminRole.id,
    },
  });
}

async function main() {
  await seedRandomUser(50);
  await seedAdmin();
  await seedRandomFunctionalLocations(50);
  await seedRandomEquipments(50);
  await seedRandomMaterials(50);
  await seedRandomEquipmentMaterial(200);
  await seedEquipmentInspections();
  await seedRandomFinding(20);
  await seedFile();
  await seedEquipmentFile();
}

main()
  .then(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  })
  .then(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
