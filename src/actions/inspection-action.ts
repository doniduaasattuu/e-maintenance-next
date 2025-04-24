"use server";

import { getUserSession } from "@/hooks/useUserSession";
import prisma from "@/lib/prisma";
import { stringToBoolean } from "@/lib/utils";
import { InspectionMotor } from "@/types/motor-inspection";
import {
  CreateMotorInspectionSchema,
  EditMotorInspectionSchema,
} from "@/validations/inspection-form-validation";

export async function storeMotorInspection(
  prevState: unknown,
  formData: FormData
) {
  const user = await getUserSession();

  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = CreateMotorInspectionSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation Error",
        errors: validatedData.error.flatten().fieldErrors,
        inspectionId: null,
      };
    }

    const {
      equipmentId,
      isOperated,
      isClean,
      numberOfGreasing,
      temperatureDe,
      temperatureBody,
      temperatureNde,
      vibrationDev,
      vibrationDeh,
      vibrationDea,
      vibrationDef,
      isNoisyDe,
      vibrationNdev,
      vibrationNdeh,
      vibrationNdef,
      isNoisyNde,
      note,
    } = validatedData.data;

    const [inspectionMotor] = await prisma.$transaction(async (tx) => {
      const inspectionMotor = await tx.motorInspection.create({
        data: {
          isOperated: stringToBoolean(isOperated),
          isClean: stringToBoolean(isClean),
          numberOfGreasing: numberOfGreasing
            ? parseInt(String(numberOfGreasing))
            : null,
          temperatureDe: temperatureDe ?? null,
          temperatureBody: temperatureBody ?? null,
          temperatureNde: temperatureNde ?? null,
          vibrationDev: vibrationDev ?? null,
          vibrationDeh: vibrationDeh ?? null,
          vibrationDea: vibrationDea ?? null,
          vibrationDef: vibrationDef ?? null,
          isNoisyDe: stringToBoolean(isNoisyDe),
          vibrationNdev: vibrationNdev ?? null,
          vibrationNdeh: vibrationNdeh ?? null,
          vibrationNdef: vibrationNdef ?? null,
          isNoisyNde: stringToBoolean(isNoisyNde),
          note: note ?? null,
        },
      });

      await tx.equipmentInspectionForm.create({
        data: {
          equipmentId,
          formableId: inspectionMotor.id,
          formableType: "MOTOR",
          userId: parseInt(user.id),
        },
      });

      return [inspectionMotor];
    });

    return {
      success: true,
      message: "Inspection saved successfully",
      errors: null,
      inspectionId: inspectionMotor.id,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      errors: null,
      inspectionId: null,
    };
  }
}

export async function updateMotorInspection(
  prevState: unknown,
  formData: FormData
) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = EditMotorInspectionSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Validation Error",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const {
      inspectionId,
      isOperated,
      isClean,
      numberOfGreasing,
      temperatureDe,
      temperatureBody,
      temperatureNde,
      vibrationDev,
      vibrationDeh,
      vibrationDea,
      vibrationDef,
      isNoisyDe,
      vibrationNdev,
      vibrationNdeh,
      vibrationNdef,
      isNoisyNde,
      note,
    } = validatedData.data;

    if (!inspectionId) {
      return {
        success: false,
        message: "Validation Error",
        errors: {
          equipmentId: ["Inspection form is not found"],
        },
      };
    }

    await prisma.motorInspection.update({
      where: {
        id: parseInt(inspectionId),
      },
      data: {
        isOperated: stringToBoolean(isOperated),
        isClean: stringToBoolean(isClean),
        numberOfGreasing: numberOfGreasing
          ? parseInt(String(numberOfGreasing))
          : null,
        temperatureDe: temperatureDe ?? null,
        temperatureBody: temperatureBody ?? null,
        temperatureNde: temperatureNde ?? null,
        vibrationDev: vibrationDev ?? null,
        vibrationDeh: vibrationDeh ?? null,
        vibrationDea: vibrationDea ?? null,
        vibrationDef: vibrationDef ?? null,
        isNoisyDe: stringToBoolean(isNoisyDe),
        vibrationNdev: vibrationNdev ?? null,
        vibrationNdeh: vibrationNdeh ?? null,
        vibrationNdef: vibrationNdef ?? null,
        isNoisyNde: stringToBoolean(isNoisyNde),
        note: note ?? null,
      },
    });

    return {
      success: true,
      message: "Inspection updated successfully",
      errors: null,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      errors: null,
    };
  }
}

export async function getMotorInspectionById(
  id: number
): Promise<InspectionMotor | null> {
  const inspectionMotor = await prisma.motorInspection.findUnique({
    where: {
      id: id,
    },
  });

  if (!inspectionMotor) {
    return null;
  }

  const sanitized = {
    ...inspectionMotor,
    numberOfGreasing: inspectionMotor.numberOfGreasing?.toString() ?? null,
    temperatureDe: inspectionMotor.temperatureDe?.toString() ?? null,
    temperatureBody: inspectionMotor.temperatureBody?.toString() ?? null,
    temperatureNde: inspectionMotor.temperatureNde?.toString() ?? null,
    vibrationDev: inspectionMotor.vibrationDev?.toString() ?? null,
    vibrationDeh: inspectionMotor.vibrationDeh?.toString() ?? null,
    vibrationDea: inspectionMotor.vibrationDea?.toString() ?? null,
    vibrationDef: inspectionMotor.vibrationDef?.toString() ?? null,
    vibrationNdev: inspectionMotor.vibrationNdev?.toString() ?? null,
    vibrationNdeh: inspectionMotor.vibrationNdeh?.toString() ?? null,
    vibrationNdef: inspectionMotor.vibrationNdef?.toString() ?? null,
  };

  return sanitized;
}
