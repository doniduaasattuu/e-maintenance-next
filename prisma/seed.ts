import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  // ROLE CREATION
  await prisma.role.createMany({
    data: [{ name: "User" }, { name: "Admin" }],
    skipDuplicates: true, // To avoid duplicates on re-run
  });

  const adminRole = await prisma.role.findUnique({
    where: { name: "Admin" },
  });

  if (!adminRole) {
    throw new Error("Admin role not found");
  }

  const userRole = await prisma.role.findUnique({
    where: { name: "User" },
  });

  if (!userRole) {
    throw new Error("User role not found");
  }

  // USER CREATION
  await prisma.user.createMany({
    data: [
      {
        email: "doni@gmail.com",
        name: "Doni Darmawan",
        nik: "55000154",
        image: "https://github.com/shadcn.png",
        password: await bcrypt.hash("password", 10),
        roleId: adminRole.id,
      },
      {
        email: "mark@gmail.com",
        name: "Mark Morton",
        nik: "55000111",
        password: await bcrypt.hash("password", 10),
        roleId: userRole.id,
      },
    ],
  });

  const doni = await prisma.user.findUnique({
    where: {
      email: "doni@gmail.com",
    },
  });

  if (!doni) {
    throw new Error("User not found");
  }

  // FUNCTIONAL LOCATION CREATION
  await prisma.functionalLocation.createMany({
    data: [
      {
        id: "FP-01-PM3-CUT-RWD1",
        description: "REWINDER #1 BM3",
      },
      {
        id: "FP-01-PM3-APS-SR12",
        description: "SCREENER #12",
      },
      {
        id: "FP-01-PM3-APS-SR13",
        description: "SCREENER #13",
      },
      {
        id: "FP-01-PM3-APS-SR14",
        description: "SCREENER #14",
      },
      {
        id: "FP-01-PM3-APS-T030",
        description: "WHITE WATER SILO",
      },
      {
        id: "FP-01-PM3-APS-T030-P044",
        description: "PUMP #44",
      },
      {
        id: "FP-01-PM3-APS-T031",
        description: "EXCESS WHITE WATER CHEST",
      },
      {
        id: "FP-01-PM3-APS-T031-P045",
        description: "PUMP #45",
      },
      {
        id: "FP-01-PM3-APS-T031-P046",
        description: "PUMP #46",
      },
      {
        id: "FP-01-PM3-APS-T031-P047",
        description: "PUMP #47",
      },
      {
        id: "FP-01-PM3-APS-T031-P048",
        description: "PUMP #48",
      },
      {
        id: "FP-01-PM3-OCC-CL01",
        description: "CLEANER #1",
      },
      {
        id: "FP-01-PM3-OCC-CL02",
        description: "CLEANER #2",
      },
      {
        id: "FP-01-PM3-OCC-CL03",
        description: "CLEANER #3",
      },
      {
        id: "FP-01-PM3-OCC-CL04",
        description: "CLEANER #4",
      },
      {
        id: "FP-01-PM3-OCC-CL05",
        description: "CLEANER #5",
      },
      {
        id: "FP-01-PM3-OCC-CL06",
        description: "CLEANER #6",
      },
      {
        id: "FP-01-PM3-OCC-CL07",
        description: "CLEANER #7",
      },
      {
        id: "FP-01-PM3-OCC-CL11",
        description: "PROTECTOR HD-CLEANER #1",
      },
      {
        id: "FP-01-PM3-OCC-CL12",
        description: "PROTECTOR HD-CLEANER #2",
      },
      {
        id: "FP-01-PM3-OCC-CN01",
        description: "CONVEYOR #1",
      },
      {
        id: "FP-01-PM3-OCC-CN02",
        description: "CONVEYOR #2",
      },
      {
        id: "FP-01-PM3-OCC-DP01-AP01",
        description: "AGITATOR #1",
      },
      {
        id: "FP-01-PM3-OCC-DP01-AP02",
        description: "AGITATOR #2",
      },
      {
        id: "FP-01-PM3-OCC-DP01-CN12",
        description: "DRUM BALE FEEDING CONVEYOR #1",
      },
      {
        id: "FP-01-PM3-OCC-DP01-CN13",
        description: "DRUM BALE FEEDING CONVEYOR #2",
      },
      {
        id: "FP-01-PM3-OCC-DP01-CN14",
        description: "NEW REJECT CONVEYOR #1",
      },
      {
        id: "FP-01-PM3-OCC-DP01-CN15",
        description: "NEW REJECT CONVEYOR #2",
      },
      {
        id: "FP-01-PM3-OCC-DP01-CN16",
        description: "NEW REJECT CONVEYOR #3",
      },
      {
        id: "FP-01-PM3-OCC-DP01-CN17",
        description: "NEW REJECT CONVEYOR #4",
      },
      {
        id: "FP-01-SP3-OCC-DP01-LRC1",
        description: "LIGHT REJECT COMPACTOR #1",
      },
      {
        id: "FP-01-SP3-OCC-DP01-LRC1-HD10",
        description: "HYDRAULIC UNIT REJECT COMPACTOR 1",
      },
      {
        id: "FP-01-SP3-OCC-DP01-LRC2",
        description: "LIGHT REJECT COMPACTOR #2",
      },
      {
        id: "FP-01-SP3-OCC-DP01-LRC2-HD11",
        description: "HYDRAULIC UNIT REJECT COMPACTOR 2",
      },
      {
        id: "FP-01-SP3-OCC-DP01-MD01",
        description: "DRIVE 1 DRUM PULPER FFD450EE",
      },
      {
        id: "FP-01-SP3-OCC-DP01-MD02",
        description: "DRIVE 2 DRUM PULPER FFD450EE",
      },
      {
        id: "FP-01-SP3-OCC-DP01-OU11",
        description: "OIL UNIT DRIVE 1 PULPER FFD450EE",
      },
      {
        id: "FP-01-SP3-OCC-DP01-OU12",
        description: "OIL UNIT DRIVE 2 PULPER FFD450EE",
      },
      {
        id: "FP-01-SP3-OCC-DP01-PP15",
        description: "PUMP 1 DISCHARGE DRUM PULPER",
      },
      {
        id: "FP-01-SP3-OCC-DP01-PP16",
        description: "PUMP 2 DISCHARGE DRUM PULPER",
      },
    ],
  });

  // CLASSIFICATION CREATION
  await prisma.classification.createMany({
    data: [
      {
        description: "ELECTRICAL PANEL",
      },
      {
        description: "MOTOR/DRIVE",
      },
    ],
  });

  // EQUIPMENT STATUS CREATION
  await prisma.equipmentStatus.createMany({
    data: [
      {
        description: "Available",
      },
      {
        description: "Installed",
      },
      {
        description: "Repaired",
      },
    ],
  });

  const panel = await prisma.classification.findFirst({
    where: {
      description: "ELECTRICAL PANEL",
    },
  });

  if (!panel) {
    throw new Error("Electrical panel classification is not found");
  }

  const motor = await prisma.classification.findFirst({
    where: {
      description: "MOTOR/DRIVE",
    },
  });

  if (!motor) {
    throw new Error("Motor classification is not found");
  }

  // const installed = await prisma.equipmentStatus.findFirst({
  //   where: {
  //     description: "Installed",
  //   },
  // });

  const [available, installed, repaired] = await Promise.all([
    await prisma.equipmentStatus.findFirst({
      where: {
        description: "Available",
      },
    }),
    await prisma.equipmentStatus.findFirst({
      where: {
        description: "Installed",
      },
    }),
    await prisma.equipmentStatus.findFirst({
      where: {
        description: "Repaired",
      },
    }),
  ]);

  if (!installed || !available || !repaired) {
    throw new Error("Equipment status is not found");
  }

  await prisma.equipment.createMany({
    data: [
      {
        id: "ELP003508",
        functionalLocationId: "FP-01-PM3-CUT-RWD1",
        classificationId: panel.id,
        equipmentStatusId: installed.id,
        sortField: "PM3.REW.MOVEMENT.MOTOR/E",
        description: "Movement Motor Panel",
      },
      {
        id: "ELP003509",
        functionalLocationId: "FP-01-PM3-CUT-RWD1",
        classificationId: panel.id,
        equipmentStatusId: installed.id,
        sortField: "PM3.REW.CH.CORE TS/E",
        description: "Core Chuck TS Motor Panel",
      },
      {
        id: "ELP003510",
        functionalLocationId: "FP-01-PM3-CUT-RWD1",
        classificationId: panel.id,
        equipmentStatusId: installed.id,
        sortField: "PM3.REW.CH.CORE DS/E",
        description: "Core Chuck DS Motor Panel",
      },
      {
        id: "ELP003787",
        functionalLocationId: "FP-01-PM3-CUT-RWD1",
        classificationId: panel.id,
        equipmentStatusId: installed.id,
        sortField: "PM3.WD1.PLC/E",
        description: "DRIVE MASTER PLC PANEL",
      },
      {
        id: "ELP003788",
        functionalLocationId: "FP-01-PM3-CUT-RWD1",
        classificationId: panel.id,
        equipmentStatusId: installed.id,
        sortField: "PM3.WD1.CPE/E",
        description: "CPE#4",
      },
      {
        id: "ELP003789",
        functionalLocationId: "FP-01-PM3-CUT-RWD1",
        classificationId: panel.id,
        equipmentStatusId: installed.id,
        sortField: "PM3.WD1.MDP/E",
        description: "DRIVE WINDER #1 MDP PANEL",
      },
      {
        id: "EMO002807",
        functionalLocationId: "FP-01-PM3-CUT-RWD1",
        classificationId: motor.id,
        equipmentStatusId: installed.id,
        sortField: "PM3.REW.CH.CORE TS/M",
        description: "Core Chuck TS Motor",
      },
      {
        id: "EMO002834",
        functionalLocationId: "FP-01-PM3-CUT-RWD1",
        classificationId: motor.id,
        equipmentStatusId: installed.id,
        sortField: "PM3.REW.CH.CORE DS/M",
        description: "Core Chuck DS Motor",
      },
      {
        id: "EMO003218",
        functionalLocationId: "FP-01-PM3-CUT-RWD1",
        classificationId: motor.id,
        equipmentStatusId: installed.id,
        sortField: "PM3.REW.MOVEMENT.MOTOR/M",
        description: "MOTOR,R.73WD100L-6-2,0,75/1,6KW,2,4/4,3A",
      },
      // SCREENER #12
      {
        id: "ELP001073",
        functionalLocationId: "FP-01-PM3-APS-SR12",
        classificationId: panel.id,
        equipmentStatusId: installed.id,
        sortField: "PM3.AP01/E",
        description: "ELEC PANEL",
      },
      {
        id: "EMO004984",
        functionalLocationId: "FP-01-PM3-APS-SR12",
        classificationId: motor.id,
        equipmentStatusId: installed.id,
        sortField: "PM3.AP01/M",
        description: "AC MOTOR;380V,50Hz,22kW,4P,180L,B3",
        userId: doni.id,
      },
      // SCREENER #13
      {
        id: "ELP001074",
        functionalLocationId: "FP-01-PM3-APS-SR13",
        classificationId: panel.id,
        equipmentStatusId: installed.id,
        sortField: "PM3.AP02/E",
        description: "ELEC PANEL",
      },
      {
        id: "EMO000879",
        functionalLocationId: "FP-01-PM3-APS-SR13",
        classificationId: motor.id,
        equipmentStatusId: installed.id,
        sortField: "PM3.AP02/M",
        description: "AC MOTOR;380V,50HZ,30KW,6P,200M/L,B",
      },
      // SCREENER #14
      {
        id: "ELP001075",
        functionalLocationId: "FP-01-PM3-APS-SR14",
        classificationId: panel.id,
        equipmentStatusId: installed.id,
        sortField: "PM3.AP03/E",
        description: "ELEC PANEL",
      },
      {
        id: "EMO001628",
        functionalLocationId: "FP-01-PM3-APS-SR14",
        classificationId: motor.id,
        equipmentStatusId: installed.id,
        sortField: "PM3.AP03/M",
        description: "AC MOTOR;380V,50Hz,132kW,6P,315MC,B3",
      },
      {
        id: "EMO000123",
        classificationId: motor.id,
        equipmentStatusId: repaired.id,
        sortField: "PM3.AP03/M",
        description: "AC MOTOR;380V,50Hz,132kW,6P,315MC,B3",
      },
      {
        id: "EMO000999",
        classificationId: motor.id,
        equipmentStatusId: available.id,
        sortField: "PM3.AP03/M",
        description: "AC MOTOR;380V,50Hz,132kW,6P,315MC,B3",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .then(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
