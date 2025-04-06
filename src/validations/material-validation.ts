import { z } from "zod";

export const BaseMaterialSchema = z.object({
  id: z
    .string()
    .length(8, {
      message: "The ID must be exactly 8 characters long",
    })
    .refine((val) => /^\d+$/.test(val), {
      message: "The ID must be numeric",
    }),
  name: z.string({ message: "Material name is required" }).min(3).max(100),
  price: z
    .union([z.number(), z.string()])
    .transform((val) =>
      val === null || val === "" || parseInt(String(val)) < 0 ? 0 : val
    ),
  unitId: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});

export const CreateMaterialSchema = BaseMaterialSchema.pick({
  id: true,
  name: true,
  price: true,
  unitId: true,
});

export const EditMateriaSchema = CreateMaterialSchema;
