"use server";

import { getUserSession } from "@/hooks/useUserSession";
import prisma from "@/lib/prisma";
import { stringToBoolean } from "@/lib/utils";
import { InspectionMotor } from "@/types/motor-inspection";
import { InspectionPanel } from "@/types/panel-inspection";
import {
  CreateMotorInspectionSchema,
  CreatePanelInspectionSchema,
  EditMotorInspectionSchema,
  EditPanelInspectionSchema,
} from "@/validations/inspection-form-validation";

export async function getInspectionsByEquipmentId(
  equipmentId: string,
  formableType: string
): Promise<InspectionMotor[] | InspectionPanel[] | undefined> {
  const inspectionList = await prisma.equipmentInspectionForm.findMany({
    take: 12,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      formableType: formableType,
      equipmentId: equipmentId,
    },
    select: {
      formableId: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  const idList = inspectionList.map((item) => item.formableId);
  const userMap = new Map<number, string>();
  inspectionList.forEach((item) => {
    if (item.formableId && item.user?.name) {
      userMap.set(item.formableId, item.user.name);
    }
  });

  if (formableType === "MOTOR") {
    const motorInspections = await prisma.motorInspection.findMany({
      where: {
        id: {
          in: idList,
        },
      },
    });

    if (!motorInspections) {
      return undefined;
    }
    const sanitizedMotorInspections = motorInspections.map((data) => ({
      ...data,
      numberOfGreasing: data.numberOfGreasing?.toString() ?? null,
      temperatureDe: data.temperatureDe?.toString() ?? null,
      temperatureBody: data.temperatureBody?.toString() ?? null,
      temperatureNde: data.temperatureNde?.toString() ?? null,
      vibrationDev: data.vibrationDev?.toString() ?? null,
      vibrationDeh: data.vibrationDeh?.toString() ?? null,
      vibrationDea: data.vibrationDea?.toString() ?? null,
      vibrationDef: data.vibrationDef?.toString() ?? null,
      vibrationNdev: data.vibrationNdev?.toString() ?? null,
      vibrationNdeh: data.vibrationNdeh?.toString() ?? null,
      vibrationNdef: data.vibrationNdef?.toString() ?? null,
      inspector: userMap.get(data.id) ?? null,
    }));

    return sanitizedMotorInspections as InspectionMotor[];
  } else if (formableType === "PANEL") {
    const panelInspections = await prisma.panelInspection.findMany({
      where: {
        id: {
          in: idList,
        },
      },
    });

    const sanitizedPanelInspections = panelInspections.map((data) => ({
      ...data,
      temperatureIncomingR: data.temperatureIncomingR?.toString() ?? null,
      temperatureIncomingS: data.temperatureIncomingS?.toString() ?? null,
      temperatureIncomingT: data.temperatureIncomingT?.toString() ?? null,
      temperatureCabinet: data.temperatureCabinet?.toString() ?? null,
      temperatureOutgoingR: data.temperatureOutgoingR?.toString() ?? null,
      temperatureOutgoingS: data.temperatureOutgoingS?.toString() ?? null,
      temperatureOutgoingT: data.temperatureOutgoingT?.toString() ?? null,
      currentR: data.currentR?.toString() ?? null,
      currentS: data.currentS?.toString() ?? null,
      currentT: data.currentT?.toString() ?? null,
      inspector: userMap.get(data.id) ?? null,
    }));

    return sanitizedPanelInspections as InspectionPanel[];
  }
}

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

export async function storePanelInspection(
  prevState: unknown,
  formData: FormData
) {
  const user = await getUserSession();

  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = CreatePanelInspectionSchema.safeParse(rawData);

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
      isLabelOk,
      isIndicatorOk,
      temperatureIncomingR,
      temperatureIncomingS,
      temperatureIncomingT,
      temperatureCabinet,
      temperatureOutgoingR,
      temperatureOutgoingS,
      temperatureOutgoingT,
      currentR,
      currentS,
      currentT,
      isNoisy,
      note,
    } = validatedData.data;

    const [inspectionPanel] = await prisma.$transaction(async (tx) => {
      const inspectionPanel = await tx.panelInspection.create({
        data: {
          isOperated: stringToBoolean(isOperated),
          isClean: stringToBoolean(isClean),
          isLabelOk: stringToBoolean(isLabelOk),
          isIndicatorOk: stringToBoolean(isIndicatorOk),
          temperatureIncomingR: temperatureIncomingR ?? null,
          temperatureIncomingS: temperatureIncomingS ?? null,
          temperatureIncomingT: temperatureIncomingT ?? null,
          temperatureCabinet: temperatureCabinet ?? null,
          temperatureOutgoingR: temperatureOutgoingR ?? null,
          temperatureOutgoingS: temperatureOutgoingS ?? null,
          temperatureOutgoingT: temperatureOutgoingT ?? null,
          currentR: currentR ?? null,
          currentS: currentS ?? null,
          currentT: currentT ?? null,
          isNoisy: stringToBoolean(isNoisy),
          note: note ?? null,
        },
      });

      await tx.equipmentInspectionForm.create({
        data: {
          equipmentId,
          formableId: inspectionPanel.id,
          formableType: "PANEL",
          userId: parseInt(user.id),
        },
      });

      return [inspectionPanel];
    });

    return {
      success: true,
      message: "Inspection saved successfully",
      errors: null,
      inspectionId: inspectionPanel.id,
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

export async function updatePanelInspection(
  prevState: unknown,
  formData: FormData
) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = EditPanelInspectionSchema.safeParse(rawData);

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
      isLabelOk,
      isIndicatorOk,
      temperatureIncomingR,
      temperatureIncomingS,
      temperatureIncomingT,
      temperatureCabinet,
      temperatureOutgoingR,
      temperatureOutgoingS,
      temperatureOutgoingT,
      currentR,
      currentS,
      currentT,
      isNoisy,
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

    await prisma.panelInspection.update({
      where: {
        id: parseInt(inspectionId),
      },
      data: {
        isOperated: stringToBoolean(isOperated),
        isClean: stringToBoolean(isClean),
        isLabelOk: stringToBoolean(isLabelOk),
        isIndicatorOk: stringToBoolean(isIndicatorOk),
        temperatureIncomingR: temperatureIncomingR ?? null,
        temperatureIncomingS: temperatureIncomingS ?? null,
        temperatureIncomingT: temperatureIncomingT ?? null,
        temperatureCabinet: temperatureCabinet ?? null,
        temperatureOutgoingR: temperatureOutgoingR ?? null,
        temperatureOutgoingS: temperatureOutgoingS ?? null,
        temperatureOutgoingT: temperatureOutgoingT ?? null,
        currentR: currentR ?? null,
        currentS: currentS ?? null,
        currentT: currentT ?? null,
        isNoisy: stringToBoolean(isNoisy),
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

export async function getPanelInspectionById(
  id: number
): Promise<InspectionPanel | null> {
  const inspectionPanel = await prisma.panelInspection.findUnique({
    where: {
      id: id,
    },
  });

  if (!inspectionPanel) {
    return null;
  }

  const sanitized = {
    ...inspectionPanel,
    temperatureIncomingR:
      inspectionPanel.temperatureIncomingR?.toString() ?? null,
    temperatureIncomingS:
      inspectionPanel.temperatureIncomingS?.toString() ?? null,
    temperatureIncomingT:
      inspectionPanel.temperatureIncomingT?.toString() ?? null,
    temperatureCabinet: inspectionPanel.temperatureCabinet?.toString() ?? null,
    temperatureOutgoingR:
      inspectionPanel.temperatureOutgoingR?.toString() ?? null,
    temperatureOutgoingS:
      inspectionPanel.temperatureOutgoingS?.toString() ?? null,
    temperatureOutgoingT:
      inspectionPanel.temperatureOutgoingT?.toString() ?? null,
    currentR: inspectionPanel.currentR?.toString() ?? null,
    currentS: inspectionPanel.currentS?.toString() ?? null,
    currentT: inspectionPanel.currentT?.toString() ?? null,
  };

  return sanitized;
}
