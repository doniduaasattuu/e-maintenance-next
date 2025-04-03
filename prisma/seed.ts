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

  await prisma.unit.createMany({
    data: [
      { description: "PCS" },
      { description: "Meter" },
      { description: "Kilogram" },
      { description: "Liter" },
      { description: "Pack" },
      { description: "Box" },
      { description: "Roll" },
      { description: "Set" },
      { description: "Pair" },
      { description: "Bottle" },
    ],
    skipDuplicates: true,
  });

  // 🔹 Ambil semua Unit yang telah dibuat
  const unitData = await prisma.unit.findMany();

  await prisma.material.createMany({
    data: [
      {
        id: "10019920",
        name: "Bearing",
        price: 50000,
        unitId: unitData[0]?.id,
      },
      {
        id: "10019921",
        name: "Motor Induksi",
        price: 750000,
        unitId: unitData[3]?.id,
      },
      {
        id: "10019922",
        name: "Kabel Daya",
        price: 15000,
        unitId: unitData[1]?.id,
      },
      {
        id: "10019923",
        name: "Stick Mixer",
        price: 100000,
        unitId: unitData[0]?.id,
      },
      { id: "10019924", name: "Grease", price: 20000, unitId: unitData[9]?.id },
      { id: "10019925", name: "Pulley", price: 85000, unitId: unitData[0]?.id },
      { id: "10019926", name: "Belt", price: 45000, unitId: unitData[1]?.id },
      {
        id: "10019927",
        name: "Bearing Cover",
        price: 30000,
        unitId: unitData[0]?.id,
      },
      {
        id: "10019928",
        name: "Sensor Suhu",
        price: 120000,
        unitId: unitData[3]?.id,
      },
      { id: "10019929", name: "Fuse", price: 5000, unitId: unitData[0]?.id },
      { id: "10019930", name: "Switch", price: 40000, unitId: unitData[0]?.id },
      { id: "10019931", name: "Relay", price: 60000, unitId: unitData[0]?.id },
      {
        id: "10019932",
        name: "Panel Listrik",
        price: 250000,
        unitId: unitData[5]?.id,
      },
      {
        id: "10019933",
        name: "Fan Belt",
        price: 55000,
        unitId: unitData[1]?.id,
      },
      {
        id: "10019934",
        name: "Terminal Block",
        price: 20000,
        unitId: unitData[0]?.id,
      },
      {
        id: "10019935",
        name: "Din Rail",
        price: 15000,
        unitId: unitData[1]?.id,
      },
      { id: "10019936", name: "MCB", price: 120000, unitId: unitData[0]?.id },
      {
        id: "10019937",
        name: "Contactors",
        price: 140000,
        unitId: unitData[0]?.id,
      },
      { id: "10019938", name: "PLC", price: 850000, unitId: unitData[0]?.id },
      { id: "10019939", name: "HMI", price: 1200000, unitId: unitData[0]?.id },
    ],
    skipDuplicates: true,
  });

  const materialData = await prisma.material.findMany();

  // 🔹 Equipment IDs
  const equipmentIds = [
    "ELP003787",
    "ELP003788",
    "ELP003789",
    "EMO002807",
    "EMO002834",
    "EMO003218",
    "ELP001073",
    "EMO004984",
    "ELP001074",
    "EMO000879",
  ];

  await prisma.equipmentMaterial.createMany({
    data: equipmentIds.flatMap((equipmentId) =>
      materialData.map((material) => ({
        equipmentId,
        materialId: material.id,
        quantity: Math.floor(Math.random() * 10) + 1, // Jumlah random antara 1-10
      }))
    ),
    skipDuplicates: true,
  });

  await prisma.file.createMany({
    data: [
      {
        id: "6f709c6e-cb30-45ff-aba4-28c97b13b1ee",
        name: "SCHEMATIC DIAGRAM ALL PANEL TURBO VACUUM PAPER MACHINE #7 AND LAYOUT POSITION TRANSFORMER & PANEL",
        tags: "Turbo Panel Schematic",
        type: "pdf",
        path: "/files/6f709c6e-cb30-45ff-aba4-28c97b13b1ee.pdf",
        userId: doni.id,
      },
    ],
  });

  await prisma.equipmentFile.createMany({
    data: [
      {
        equipmentId: "ELP003787",
        fileId: "6f709c6e-cb30-45ff-aba4-28c97b13b1ee",
      },
    ],
  });

  console.log("Seeding selesai!");
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
