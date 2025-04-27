import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { getRandomUserId } from "./UserSeeder";
import { SimpleEquipment } from "@/types/equipment";
const prisma = new PrismaClient();

function generateTemperature(): number {
  return faker.number.int({ min: 28, max: 60 });
}

function generateVibration(): number {
  const value = Math.random() * 1.5;
  return parseFloat(value.toFixed(2));
}

function generateBoolean(value: number | undefined) {
  return faker.datatype.boolean(value);
}

function generateCurrent(nominal: number, span: number) {
  const min = nominal - span;
  const max = nominal + span;
  const current = faker.number.int({ min: min, max: max });

  return current;
}

export async function seedEquipmentInspections(total?: number) {
  const motors = await prisma.equipment.findMany({
    where: {
      classification: {
        type: {
          equals: "MOTOR",
        },
      },
    },
    select: {
      id: true,
      sortField: true,
      description: true,
    },
  });

  const panels = await prisma.equipment.findMany({
    where: {
      classification: {
        type: {
          equals: "PANEL",
        },
      },
    },
  });

  if (!motors || !panels) {
    throw new Error("Error seed inspections data");
  }

  await seedMotorInspections(motors, total);
  await seedPanelInspections(panels, total);

  console.log("✅ Inspection seeder");
}

async function seedMotorInspections(motors: SimpleEquipment[], total?: number) {
  const motorInspectionsPromises = Array.from({ length: total ?? 12 }).map(
    () => ({
      isOperated: generateBoolean(0.75),
      isClean: generateBoolean(0.75),
      numberOfGreasing: faker.helpers.arrayElement([
        30, 40, 50, 60, 70, 80, 90, 100,
      ]),
      temperatureDe: generateTemperature(),
      temperatureBody: generateTemperature(),
      temperatureNde: generateTemperature(),
      vibrationDev: generateVibration(),
      vibrationDeh: generateVibration(),
      vibrationDea: generateVibration(),
      vibrationDef: generateVibration(),
      isNoisyDe: faker.datatype.boolean(0.25),
      vibrationNdev: generateVibration(),
      vibrationNdeh: generateVibration(),
      vibrationNdef: generateVibration(),
      isNoisyNde: faker.datatype.boolean(0.25),
      note: null,
    })
  );

  const motorInspections = await Promise.all(motorInspectionsPromises);

  for (const motor of motors) {
    for (const data of motorInspections) {
      const motorInspection = await prisma.motorInspection.create({
        data: data,
      });

      await prisma.equipmentInspectionForm.create({
        data: {
          equipmentId: motor.id,
          formableId: motorInspection.id,
          formableType: "MOTOR",
          userId: await getRandomUserId(),
        },
      });
    }
  }
}

async function seedPanelInspections(panels: SimpleEquipment[], total?: number) {
  const panelInspectionsPromises = Array.from({ length: total ?? 12 }).map(
    () => ({
      isOperated: generateBoolean(0.75),
      isClean: generateBoolean(0.75),
      isLabelOk: generateBoolean(0.75),
      isIndicatorOk: generateBoolean(0.75),
      temperatureIncomingR: generateTemperature(),
      temperatureIncomingS: generateTemperature(),
      temperatureIncomingT: generateTemperature(),
      temperatureCabinet: generateTemperature(),
      temperatureOutgoingR: generateTemperature(),
      temperatureOutgoingS: generateTemperature(),
      temperatureOutgoingT: generateTemperature(),
      currentR: generateCurrent(30, 5),
      currentS: generateCurrent(30, 5),
      currentT: generateCurrent(30, 5),
      isNoisy: generateBoolean(0.75),
      note: null,
    })
  );

  const panelInspections = await Promise.all(panelInspectionsPromises);

  for (const panel of panels) {
    for (const data of panelInspections) {
      const panelInspection = await prisma.panelInspection.create({
        data: data,
      });

      await prisma.equipmentInspectionForm.create({
        data: {
          equipmentId: panel.id,
          formableId: panelInspection.id,
          formableType: "PANEL",
          userId: await getRandomUserId(),
        },
      });
    }
  }
}
