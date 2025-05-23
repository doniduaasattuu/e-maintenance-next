import { getEquipmentStatus } from "@/actions/equipment-status-action";
import { MAX_FILE_SIZE } from "@/lib/config";
import { z } from "zod";

export const BaseEquipmentSchema = z.object({
  id: z
    .string({ message: "Equipment id is required" })
    .regex(/^[A-Z]{3}\d{6}$/)
    .toUpperCase(),
  classificationId: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val)),
  equipmentStatusId: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val)),
  functionalLocationId: z
    .string()
    .optional()
    .transform((val) =>
      val?.trim() == "" || val === "undefined" ? undefined : val
    ),
  sortField: z.string().min(3).max(50),
  description: z.string({ message: "Description is required" }).min(3).max(100),
});

export const CreateEquipmentSchema = BaseEquipmentSchema.superRefine(
  async (data, ctx) => {
    try {
      const status = await getEquipmentStatus({ id: data.equipmentStatusId });
      const statusDescription = status?.description;
      const functionalLocationRegex = /^[A-Z0-9]+(-[A-Z0-9]+)*$/;

      if (
        statusDescription === "Installed" &&
        data.functionalLocationId === undefined
      ) {
        if (!data.functionalLocationId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Functional location is required when status is 'Installed'",
            path: ["functionalLocationId"],
          });
        } else if (!functionalLocationRegex.test(data.functionalLocationId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Functional location must be in a valid format",
            path: ["functionalLocationId"],
          });
        }
      }

      if (
        statusDescription !== "Installed" &&
        data.functionalLocationId !== undefined
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Functional location is prohibited unless status is 'Installed'",
          path: ["functionalLocationId"],
        });
      }
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Failed to validate equipment status",
        path: ["equipmentStatusId"],
      });
      console.log(error);
    }
  }
);

export const EditEquipmentSchema = CreateEquipmentSchema;
export const UploadEquipmentImageSchema = BaseEquipmentSchema.pick({
  id: true,
}).extend({
  image: z
    .instanceof(File, { message: "Image is required" })
    .refine((image) => !image || image.size <= MAX_FILE_SIZE, {
      message: `File size has exceeded it max limit of ${
        MAX_FILE_SIZE / 1024 / 1024
      }MB`,
      path: ["image"],
    }),
});
