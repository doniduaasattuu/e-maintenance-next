import { z } from "zod";

export const BaseInspectionFormSchema = z.object({
  equipmentId: z
    .string()
    .length(9)
    .regex(/^[A-Z]{3}\d{6}$/)
    .toUpperCase(),
  bool: z.enum(["true", "false"], {
    errorMap: () => ({ message: "Operational status is required" }),
  }),
  temperature: z
    .string()
    .regex(/^\d+$/, {
      message: "The temperature must be numeric",
    })
    .refine(
      (val) => {
        const parsed = parseInt(val);
        return parsed >= 20 && parsed <= 200;
      },
      {
        message: "The temperature should be between 20°C and 200°C",
      }
    ),
  vibration: z
    .string()
    .regex(/^\d+(\.\d+)?$/, {
      message: "The vibration must be a valid number",
    })
    .refine(
      (val) => {
        const parsed = parseFloat(val);
        return parsed >= 0 && parsed <= 45;
      },
      {
        message: "The vibration should be between 0 mm/s and 45 mm/s",
      }
    ),
  numerical: z.string().regex(/^\d+$/, { message: "Only number are allowed" }),
});

export const CreateMotorInspectionSchema = z.object({
  equipmentId: BaseInspectionFormSchema.shape.equipmentId,
  isOperated: BaseInspectionFormSchema.shape.bool,
  isClean: BaseInspectionFormSchema.shape.bool,
  numberOfGreasing: BaseInspectionFormSchema.shape.numerical.optional(),
  temperatureDe: BaseInspectionFormSchema.shape.temperature.optional(),
  temperatureBody: BaseInspectionFormSchema.shape.temperature.optional(),
  temperatureNde: BaseInspectionFormSchema.shape.temperature.optional(),
  vibrationDev: BaseInspectionFormSchema.shape.vibration.optional(),
  vibrationDeh: BaseInspectionFormSchema.shape.vibration.optional(),
  vibrationDea: BaseInspectionFormSchema.shape.vibration.optional(),
  vibrationDef: BaseInspectionFormSchema.shape.vibration.optional(),
  isNoisyDe: BaseInspectionFormSchema.shape.bool,
  vibrationNdev: BaseInspectionFormSchema.shape.vibration.optional(),
  vibrationNdeh: BaseInspectionFormSchema.shape.vibration.optional(),
  vibrationNdef: BaseInspectionFormSchema.shape.vibration.optional(),
  isNoisyNde: BaseInspectionFormSchema.shape.bool,
  note: z.string().min(9).max(1000).optional(),
});

export const EditMotorInspectionSchema = CreateMotorInspectionSchema.extend({
  inspectionId: z.string().optional(),
});
