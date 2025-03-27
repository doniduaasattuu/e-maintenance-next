import { z } from "zod";

export const BaseFunctionalLocationSchema = z.object({
  id: z
    .string({ message: "Functional location is required" })
    .min(9)
    .max(100)
    .toUpperCase(),
  description: z.string({ message: "Description is required" }).min(3).max(100),
});

export const CreateFunctionalLocationSchema = BaseFunctionalLocationSchema;

export class FunctionalLocationValidation {
  static readonly CREATE: z.ZodType = CreateFunctionalLocationSchema;
}
