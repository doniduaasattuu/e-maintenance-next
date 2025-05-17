import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const arrayImages = [
  {
    path: "/api/uploads/images/equipment/6ed338e2-4145-490a-acf4-7a8b9fef3ad2.jpg",
  },
  {
    path: "/api/uploads/images/equipment/0238810e-ff37-4641-b443-a0213f3856a4.jpg",
  },
  {
    path: "/api/uploads/images/equipment/5d398083-354e-4e2f-b732-34bf58094b9d.jpg",
  },
  {
    path: "/api/uploads/images/equipment/657e0875-b3d2-4a8a-b362-86f6da19934c.jpg",
  },
];

export async function seedImageEquipment() {
  for (const image of arrayImages) {
    await prisma.image.create({
      data: {
        path: image.path,
      },
    });
  }

  console.log("✅ Image seeder");
}
