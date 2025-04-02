import { getEquipmentStatus } from "@/actions/equipment-status-action";
import { z } from "zod";

export const BaseEquipmentSchema = z.object({
  id: z
    .string({ message: "Equipment id is required" })
    .min(9)
    .max(9)
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
    .transform((val) => (val?.trim() === "" ? undefined : val)),
  sortField: z.string().min(3).max(50),
  description: z.string({ message: "Description is required" }).min(3).max(100),
});

export const EditEquipmentSchema = BaseEquipmentSchema.superRefine(
  async (data, ctx) => {
    try {
      const status = await getEquipmentStatus({ id: data.equipmentStatusId });
      const statusDescription = status?.description;
      const functionalLocationRegex = /^[A-Z0-9]+(-[A-Z0-9]+)*$/;

      if (statusDescription === "Installed") {
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
      } else {
        if (data.functionalLocationId === undefined) {
          console.log("Data undefined"); // printed
        } else if (data.functionalLocationId === "undefined") {
          console.log("String undefined");
        } else if (data.functionalLocationId.trim() === "") {
          console.log("Empty string"); // printed
        } else {
          console.log(`Data: ${data.functionalLocationId}`);
        }

        const validFunctinonalLocation =
          data.functionalLocationId !== "undefined" &&
          data.functionalLocationId !== undefined &&
          data.functionalLocationId !== null &&
          data.functionalLocationId.trim() !== "";

        console.log(`RESULT: ${validFunctinonalLocation}`);

        if (validFunctinonalLocation) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Functional location is prohibited unless status is 'Installed'",
            path: ["functionalLocationId"],
          });
        }
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

export const CreateEquipmentSchema = EditEquipmentSchema;
