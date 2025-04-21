import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  // POSITION CREATION
  await prisma.position.createMany({
    data: [
      {
        id: "OPR",
        name: "Operator",
      },
      {
        id: "FR",
        name: "Foreman",
      },
      {
        id: "GL",
        name: "Group Leader",
      },
      {
        id: "SPV",
        name: "Supervisor",
      },
      {
        id: "DH",
        name: "Dept. Head",
      },
      {
        id: "MGR",
        name: "Manager",
      },
      {
        id: "DIR",
        name: "Director",
      },
    ],
  });

  const [OPR, FR, GL, SPV, DH, MGR, DIR] = await prisma.$transaction([
    prisma.position.findUnique({
      where: {
        id: "OPR",
      },
    }),
    prisma.position.findUnique({
      where: {
        id: "FR",
      },
    }),
    prisma.position.findUnique({
      where: {
        id: "GL",
      },
    }),
    prisma.position.findUnique({
      where: {
        id: "SPV",
      },
    }),
    prisma.position.findUnique({
      where: {
        id: "DH",
      },
    }),
    prisma.position.findUnique({
      where: {
        id: "MGR",
      },
    }),
    prisma.position.findUnique({
      where: {
        id: "DIR",
      },
    }),
  ]);

  if (!OPR || !FR || !GL || !SPV || !DH || !MGR || !DIR) {
    throw new Error("Failed insert user position");
  }

  // DEPARTMENT CREATION
  await prisma.department.createMany({
    data: [
      {
        id: "EI1",
        name: "ELECTRIC INSTRUMENT 1",
      },
      {
        id: "EI2",
        name: "ELECTRIC INSTRUMENT 2",
      },
      {
        id: "EI3",
        name: "ELECTRIC INSTRUMENT 3",
      },
      {
        id: "EI4",
        name: "ELECTRIC INSTRUMENT 4",
      },
      {
        id: "EI5",
        name: "ELECTRIC INSTRUMENT 5",
      },
      {
        id: "EI6",
        name: "ELECTRIC INSTRUMENT 6",
      },
    ],
  });

  const [EI1, EI2, EI3, EI4, EI5, EI6] = await prisma.$transaction([
    prisma.department.findUnique({
      where: {
        id: "EI1",
      },
    }),
    prisma.department.findUnique({
      where: {
        id: "EI2",
      },
    }),
    prisma.department.findUnique({
      where: {
        id: "EI3",
      },
    }),
    prisma.department.findUnique({
      where: {
        id: "EI4",
      },
    }),
    prisma.department.findUnique({
      where: {
        id: "EI5",
      },
    }),
    prisma.department.findUnique({
      where: {
        id: "EI6",
      },
    }),
  ]);

  if (!EI1 || !EI2 || !EI3 || !EI4 || !EI5 || !EI6) {
    throw new Error("Department is not found");
  }

  // ROLE CREATION
  await prisma.role.createMany({
    data: [
      { name: "User" },
      { name: "Leader" },
      { name: "Management" },
      { name: "Admin" },
    ],
    skipDuplicates: true, // To avoid duplicates on re-run
  });

  const [userRole, leaderRole, managementRole, adminRole] =
    await prisma.$transaction([
      prisma.role.findUnique({
        where: { name: "User" },
      }),
      prisma.role.findUnique({
        where: { name: "Leader" },
      }),
      prisma.role.findUnique({
        where: { name: "Management" },
      }),
      prisma.role.findUnique({
        where: { name: "Admin" },
      }),
    ]);

  if (!userRole || !leaderRole || !managementRole || !adminRole) {
    throw new Error("Role not found");
  }

  // USER CREATION
  await prisma.user.createMany({
    data: [
      {
        email: "doni@gmail.com",
        name: "Doni Darmawan",
        nik: "55000154",
        phone: "08983456945",
        image: "/images/users/550001541744816193712.jpg",
        positionId: FR.id,
        departmentId: EI2.id,
        password: await bcrypt.hash("password", 10),
        roleId: userRole.id,
      },
      {
        email: "admin@gmail.com",
        name: "Administrator",
        nik: "12345678",
        image: "/images/users/123456781744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: adminRole.id,
      },
      {
        email: "erry@gmail.com",
        name: "Erry Puji Anggoro",
        nik: "55000071",
        positionId: GL.id,
        departmentId: EI2.id,
        image: "/images/users/550000711744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: leaderRole.id,
      },
      {
        email: "jamal@gmail.com",
        name: "Jamal Mirdad",
        nik: "55000153",
        positionId: SPV.id,
        departmentId: EI6.id,
        image: "/images/users/550001531744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: managementRole.id,
      },
      {
        email: "mark@gmail.com",
        name: "Mark Morton",
        nik: "55000111",
        image: "/images/users/550001111744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: userRole.id,
      },
      {
        email: "arifsunari@gmail.com",
        name: "Arif Sunari",
        nik: "31100003",
        positionId: GL.id,
        departmentId: EI2.id,
        image: "/images/users/311000031744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: leaderRole.id,
      },
      {
        email: "rochmad@gmail.com",
        name: "Rochmad",
        nik: "31100035",
        positionId: FR.id,
        departmentId: EI2.id,
        image: "/images/users/311000351744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: userRole.id,
      },
      {
        email: "suhaemi@gmail.com",
        name: "Suhaemi",
        nik: "31100099",
        positionId: GL.id,
        departmentId: EI2.id,
        image: "/images/users/311000991744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: leaderRole.id,
      },
      {
        email: "sartika@gmail.com",
        name: "Sartika",
        nik: "31100107",
        positionId: GL.id,
        departmentId: EI2.id,
        image: "/images/users/311001071744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: leaderRole.id,
      },
      {
        email: "suryanto@gmail.com",
        name: "Suryanto",
        nik: "31100156",
        positionId: GL.id,
        departmentId: EI2.id,
        image: "/images/users/311001561744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: leaderRole.id,
      },
      {
        email: "darminto@gmail.com",
        name: "Darminto",
        nik: "31100171",
        positionId: FR.id,
        departmentId: EI2.id,
        image: "/images/users/311001711744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: userRole.id,
      },
      {
        email: "andriyanto@gmail.com",
        name: "Andriyanto",
        nik: "31702025",
        positionId: FR.id,
        departmentId: EI2.id,
        image: "/images/users/317020251744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: userRole.id,
      },
      {
        email: "andi@gmail.com",
        name: "Andi Kurnia Mulyana",
        nik: "31804007",
        positionId: FR.id,
        departmentId: EI2.id,
        image: "/images/users/318040071744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: userRole.id,
      },
      {
        email: "jaka@gmail.com",
        name: "Jaka Kumara",
        nik: "31804008",
        positionId: FR.id,
        departmentId: EI2.id,
        image: "/images/users/318040081744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: userRole.id,
      },
      {
        email: "johan@gmail.com",
        name: "Johan Guz Zali",
        nik: "31804024",
        positionId: FR.id,
        departmentId: EI2.id,
        image: "/images/users/318040241744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: userRole.id,
      },
      {
        email: "malik@gmail.com",
        name: "Abdul Malik",
        nik: "31811028",
        positionId: FR.id,
        departmentId: EI2.id,
        image: "/images/users/318110281744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: userRole.id,
      },
      {
        email: "nauri@gmail.com",
        name: "Nauri Dwi Karsa",
        nik: "31812027",
        positionId: GL.id,
        departmentId: EI2.id,
        image: "/images/users/318120271744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: leaderRole.id,
      },
      {
        email: "harapan@gmail.com",
        name: "Harapan Tua Panjaitan",
        nik: "33000009",
        positionId: FR.id,
        departmentId: EI2.id,
        image: "/images/users/330000091744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: userRole.id,
      },
      {
        email: "mbeat@gmail.com",
        name: "R. Much Arief S",
        nik: "55000092",
        positionId: FR.id,
        departmentId: EI2.id,
        image: "/images/users/550000921744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: userRole.id,
      },
      {
        email: "saiful@gmail.com",
        name: "Saiful Bahri",
        nik: "55000093",
        positionId: FR.id,
        departmentId: EI2.id,
        image: "/images/users/550000931744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: userRole.id,
      },
      {
        email: "suhadi@gmail.com",
        name: "Suhadi Lesmana Bin Karsa",
        nik: "55000097",
        positionId: GL.id,
        departmentId: EI2.id,
        image: "/images/users/550000971744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: leaderRole.id,
      },
      {
        email: "ag@gmail.com",
        name: "AG Yuanto",
        nik: "55000099",
        positionId: GL.id,
        departmentId: EI2.id,
        image: "/images/users/550000991744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: leaderRole.id,
      },
      {
        email: "arief@gmail.com",
        name: "Arief Rahman",
        nik: "55000125",
        positionId: GL.id,
        departmentId: EI2.id,
        image: "/images/users/550001251744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: leaderRole.id,
      },
      {
        email: "edi@gmail.com",
        name: "Edi Supriadi",
        nik: "55000135",
        positionId: FR.id,
        departmentId: EI2.id,
        image: "/images/users/550001351744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: userRole.id,
      },
      {
        email: "hendra@gmail.com",
        name: "Hendra",
        nik: "60000067",
        positionId: FR.id,
        departmentId: EI2.id,
        image: "/images/users/600000671744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: userRole.id,
      },
      {
        email: "rosiman@gmail.com",
        name: "Rosiman Wiraswasta",
        nik: "60000139",
        positionId: DH.id,
        departmentId: EI2.id,
        image: "/images/users/600001391744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: managementRole.id,
      },
      {
        email: "yopi@gmail.com",
        name: "Yopi Sofyan",
        nik: "60000158",
        positionId: SPV.id,
        departmentId: EI2.id,
        image: "/images/users/600001581744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: managementRole.id,
      },
      {
        email: "agam@gmail.com",
        name: "Agam Hermawan",
        nik: "60000170",
        positionId: SPV.id,
        departmentId: EI1.id,
        image: "/images/users/600001701744816193712.jpg",
        password: await bcrypt.hash("password", 10),
        roleId: managementRole.id,
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

  await prisma.findingStatus.createMany({
    data: [
      {
        description: "Open",
      },
      {
        description: "Close",
      },
    ],
  });

  const [open, close] = await Promise.all([
    prisma.findingStatus.findFirst({
      where: {
        description: "Open",
      },
    }),
    prisma.findingStatus.findFirst({
      where: {
        description: "Close",
      },
    }),
  ]);

  if (!open || !close) {
    throw new Error("Finding status failed to seed");
  }

  await prisma.finding.createMany({
    data: [
      {
        description:
          "Out terminal phase R module P-2-3-A SP7 panas lebih dari 90 degree",
        equipmentId: "ELP001074",
        findingStatusId: close.id,
        userId: doni.id,
      },
      {
        description:
          "Bearing DE indikasi motor housing, tambah grease 2x50 masih tetap kasar",
        equipmentId: "EMO000123",
        findingStatusId: open.id,
        userId: doni.id,
      },
      {
        description:
          "Penambahan platform untuk mempermudah pekerjaan maintenance slip ring pulper SP-03 SP3.",
        equipmentId: "EMO003218",
        findingStatusId: open.id,
        userId: doni.id,
      },
      {
        description: "Replacement contactor and module set for P-B-9 SP7",
        findingStatusId: open.id,
        userId: doni.id,
      },
    ],
  });

  const [first, second] = await Promise.all([
    prisma.finding.findFirst({
      where: {
        equipmentId: "ELP001074",
      },
    }),
    prisma.finding.findFirst({
      where: {
        equipmentId: "EMO000123",
      },
    }),
  ]);

  if (!first || !second) {
    throw new Error("Finding not found");
  }

  await prisma.findingImage.createMany({
    data: [
      {
        findingId: first.id,
        path: "/images/findings/27c55fb8-79aa-384d-9d8d-6051b9858cf3.jpg",
      },
      {
        findingId: first.id,
        path: "/images/findings/670ade30-fe2b-372a-94a2-0409e61c9753.jpg",
      },
      {
        findingId: second.id,
        path: "/images/findings/670ade30-fe2b-372a-94a2-0409e61c9753.jpg",
      },
      {
        findingId: second.id,
        path: "/images/findings/27c55fb8-79aa-384d-9d8d-6051b9858cf3.jpg",
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
