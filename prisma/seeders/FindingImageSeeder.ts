import { SimpleFinding } from "@/types/finding";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const arrayFindingImages = [
  "/api/uploads/images/findings/0c390b0e-03af-4712-9d37-36c30548389d.jpg",
  "/api/uploads/images/findings/0fcca3d6-5493-4994-9bf2-5bfb61b3009a.jpg",
  "/api/uploads/images/findings/1dfaedb7-80af-4f47-aa28-f170c2a4aef8.jpg",
  "/api/uploads/images/findings/2a5c7658-7c3c-4b7e-9e5f-33d6810c136e.jpg",
  "/api/uploads/images/findings/3b562c40-befc-4db4-86f8-5165d17d480f.jpg",
  "/api/uploads/images/findings/8c0688ff-e27a-4f1d-995a-e279e309a914.jpg",
  "/api/uploads/images/findings/8fce606f-3d64-46b2-a8ec-6b5213924bbd.jpg",
  "/api/uploads/images/findings/10da42ce-d00a-462d-a569-90cde2f27147.jpg",
  "/api/uploads/images/findings/20b2aec5-55c3-4570-a9f1-b02d02b39a66.jpg",
  "/api/uploads/images/findings/905ffacb-2173-43e0-8268-b275f8460235.jpg",
  "/api/uploads/images/findings/7339c206-8124-45b6-9359-7e0a0bb84dca.jpg",
  "/api/uploads/images/findings/0784400d-54f6-4a4a-b071-69d39668e186.jpg",
  "/api/uploads/images/findings/ae992813-398b-4922-8cec-2d9527e28392.jpg",
  "/api/uploads/images/findings/bc0b178f-8bd7-494f-b82b-c21cf87f3fde.jpg",
  "/api/uploads/images/findings/c63590a6-0687-4944-863d-7d43d9b8a796.jpg",
  "/api/uploads/images/findings/e3b4e6c8-67ab-4e9a-b462-867df4c1b572.jpg",
  "/api/uploads/images/findings/e20c6484-1772-4e24-9b42-81d127de039a.jpg",
  "/api/uploads/images/findings/f3c981c7-1382-4d9a-8427-424f37989187.jpg",
  "/api/uploads/images/findings/f6cb8295-68ce-4dcf-813e-21500bd49ac4.jpg",
];

export async function seedFindingImage(findings: SimpleFinding[]) {
  if (!findings) {
    throw new Error("Findings is not found");
  }

  for (const finding of findings) {
    const count = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < count; i++) {
      await prisma.findingImage.create({
        data: {
          findingId: finding.id,
          path: faker.helpers.arrayElement(arrayFindingImages),
          imageStatus: "Before",
        },
      });
    }

    if (finding.findingStatus.description === "Close") {
      await prisma.findingImage.create({
        data: {
          findingId: finding.id,
          path: faker.helpers.arrayElement(arrayFindingImages),
          imageStatus: "After",
        },
      });
    }
  }

  console.log("✅ Finding image seeder");
}
