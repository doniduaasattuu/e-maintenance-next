import { Prisma } from "@prisma/client";

// Definisikan tipe hasil query untuk material
export const materialWithEquipments =
  Prisma.validator<Prisma.MaterialDefaultArgs>()({
    include: {
      unit: true,
      equipmentMaterials:
        {
          select: {
            equipment: {
              select: { id: true, description: true },
            },
            quantity: true,
          },
        } | null,
    },
  });

// Gunakan tipe yang sesuai untuk hasil query
export type MaterialWithEquipments = Prisma.MaterialGetPayload<
  typeof materialWithEquipments
>;

export const units = Prisma.validator<Prisma.UnitDefaultArgs>()({
  select: {
    id: true,
    description: true,
  },
});

export type Unit = Prisma.UnitGetPayload<typeof units>;
