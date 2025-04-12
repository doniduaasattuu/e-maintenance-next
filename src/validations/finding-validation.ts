import {
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_COUNT,
  MAX_FILE_SIZE,
} from "@/lib/config";
import { z } from "zod";

export const BaseFindingSchema = z.object({
  description: z
    .string({ message: "Finding description is required" })
    .min(3)
    .max(500),
  notification: z.string().length(8).optional(),
  equipmentId: z.string().min(9).max(9).toUpperCase().optional(),
  functionalLocationId: z
    .string()
    .regex(/^[A-Z0-9]+(-[A-Z0-9]+)*$/, {
      message: "Invalid functional location format",
    })
    .min(9)
    .max(100)
    .toUpperCase()
    .optional(),
  findingStatusId: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val)),
  images: z
    .any()
    .refine((images) => {
      return [...images].every((file) => {
        return ALLOWED_IMAGE_TYPES.map((f) => `image/${f}`).includes(file.type);
      });
    }, `Only image files ${ALLOWED_IMAGE_TYPES.join(", ")} are allowed`)
    .refine((images) => {
      return [...images].every((file) => file.size <= MAX_FILE_SIZE);
    }, `You have one of your files that has exceeded the maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
    .refine((images) => {
      return images.length < MAX_FILE_COUNT + 1;
    }, `Maximum ${MAX_FILE_COUNT} images allowed.`),
});

export const CreateFindingSchema = BaseFindingSchema.pick({
  description: true,
  notification: true,
  equipmentId: true,
  functionalLocationId: true,
  findingStatusId: true,
  images: true,
});

export const StoreFindingSchema = BaseFindingSchema.pick({
  description: true,
  notification: true,
  equipmentId: true,
  functionalLocationId: true,
  findingStatusId: true,
});
