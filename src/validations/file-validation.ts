import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/config";
import { z } from "zod";

export const BaseFileSchema = z.object({
  id: z.string().uuid(),
  name: z.string({ message: "File name is required" }).min(3).max(100),
  tags: z
    .string()
    .max(100)
    .optional()
    .transform((val) => (val?.trim() === "" ? undefined : val)),
  type: z.enum(ALLOWED_FILE_TYPES),
  file: z
    .instanceof(File)
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: `File size has exceeded it max limit of ${
        MAX_FILE_SIZE / 1024 / 1024
      }MB`,
      path: ["file"],
    }),
  path: z.string().min(3).max(100),
  userId: z.number(),
});

export const CreateFileSchema = BaseFileSchema.pick({
  name: true,
  tags: true,
  file: true,
});

export const EditFileSchema = BaseFileSchema.pick({
  id: true,
  name: true,
  tags: true,
  file: true,
}).partial({
  file: true,
});

export class FileValidation {
  static readonly CREATE: z.ZodType = CreateFileSchema;
}
