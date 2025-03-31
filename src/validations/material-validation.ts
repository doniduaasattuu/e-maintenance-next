import { z } from "zod";

export const BaseMaterialSchema = z.object({
  id: z
    .string({ message: "Material id is required" })
    .min(8)
    .max(8)
    .toUpperCase(),
  name: z.string({ message: "Material name is required" }).min(3).max(100),
  price: z
    .union([z.number(), z.string()])
    .transform((val) => (val === null || val === "" ? 0 : val)),
  unitId: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  equipmentId: z
    .string()
    .min(9)
    .max(9)
    .toUpperCase()
    .transform((val) => (val?.trim() === "" ? undefined : val)),
});

export const CreateMaterialSchema = BaseMaterialSchema.pick({
  id: true,
  name: true,
  price: true,
  unitId: true,
});

export const EditMateriaSchema = CreateMaterialSchema;

export class MaterialValidation {
  static readonly CREATE: z.ZodType = CreateMaterialSchema;
}
