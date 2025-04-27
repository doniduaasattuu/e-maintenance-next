// import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const arrayFiles = [
  {
    path: "/assets/files/87fa08d1-9f70-4b38-a1b9-ccc76a8cb158.pdf",
    name: "Schematic diagram module P-2-3 SP7",
    tags: "Diagram SP7",
  },
  {
    path: "/assets/files/e0e10f46-01ac-4d9a-8475-eac125c27818.pdf",
    name: "Schematic diagram M-Clean PM7 modifikasi Soft Starter ABB",
    tags: "M-Clean Soft-Starter",
  },
  {
    path: "/assets/files/e8ef1c98-6fab-4fce-92af-12578382598d.pdf",
    name: "Schematic diagram module CN-14 Drum Pulper SP#37",
    tags: "Sensor Drum Pulper Diagram",
  },
  {
    path: "/assets/files/ea147d7c-fa51-4b26-95f0-b39f37186f76.pdf",
    name: "Master list data sensor Atmos PM#37",
    tags: "Sensor Atmos Data",
  },
];

export async function seedFile() {
  for (const file of arrayFiles) {
    await prisma.file.create({
      data: {
        name: file.name,
        path: file.path,
        type: file.path.split(".")[1],
        tags: file.tags.trim(),
      },
    });
  }

  console.log("✅ File seeder");
}
