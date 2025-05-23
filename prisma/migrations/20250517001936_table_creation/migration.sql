-- CreateEnum
CREATE TYPE "ImageStatus" AS ENUM ('Before', 'After');

-- CreateTable
CREATE TABLE "positions" (
    "id" VARCHAR(5) NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" VARCHAR(5) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nik" VARCHAR(8) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(13),
    "image" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roleId" INTEGER NOT NULL,
    "positionId" TEXT,
    "departmentId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "functional_locations" (
    "id" VARCHAR(100) NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "functional_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classifications" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(50) NOT NULL,
    "type" VARCHAR(25) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_statuses" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(50) NOT NULL,

    CONSTRAINT "equipment_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipments" (
    "id" CHAR(9) NOT NULL,
    "classificationId" INTEGER NOT NULL,
    "equipmentStatusId" INTEGER NOT NULL,
    "functionalLocationId" TEXT,
    "sortField" VARCHAR(50) NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_material" (
    "equipmentId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "equipment_material_pkey" PRIMARY KEY ("equipmentId","materialId")
);

-- CreateTable
CREATE TABLE "units" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materials" (
    "id" CHAR(8) NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "unitId" INTEGER,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tags" TEXT,
    "type" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_file" (
    "equipmentId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "equipment_file_pkey" PRIMARY KEY ("equipmentId","fileId")
);

-- CreateTable
CREATE TABLE "finding_statuses" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finding_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "findings" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "notification" CHAR(8),
    "equipmentId" TEXT,
    "functionalLocationId" TEXT,
    "userId" INTEGER,
    "findingStatusId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "findings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finding_images" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "imageStatus" "ImageStatus" NOT NULL DEFAULT 'Before',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "finding_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_inspection_forms" (
    "id" SERIAL NOT NULL,
    "equipmentId" CHAR(9) NOT NULL,
    "formableId" INTEGER NOT NULL,
    "formableType" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_inspection_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motor_inspections" (
    "id" SERIAL NOT NULL,
    "isOperated" BOOLEAN NOT NULL,
    "isClean" BOOLEAN NOT NULL,
    "numberOfGreasing" INTEGER,
    "temperatureDe" DECIMAL(5,2),
    "temperatureBody" DECIMAL(5,2),
    "temperatureNde" DECIMAL(5,2),
    "vibrationDev" DECIMAL(4,2),
    "vibrationDeh" DECIMAL(4,2),
    "vibrationDea" DECIMAL(4,2),
    "vibrationDef" DECIMAL(4,2),
    "isNoisyDe" BOOLEAN NOT NULL,
    "vibrationNdev" DECIMAL(4,2),
    "vibrationNdeh" DECIMAL(4,2),
    "vibrationNdef" DECIMAL(4,2),
    "isNoisyNde" BOOLEAN NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motor_inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panel_inspections" (
    "id" SERIAL NOT NULL,
    "isOperated" BOOLEAN NOT NULL,
    "isClean" BOOLEAN NOT NULL,
    "isLabelOk" BOOLEAN NOT NULL,
    "isIndicatorOk" BOOLEAN NOT NULL,
    "temperatureIncomingR" DECIMAL(5,2),
    "temperatureIncomingS" DECIMAL(5,2),
    "temperatureIncomingT" DECIMAL(5,2),
    "temperatureCabinet" DECIMAL(5,2),
    "temperatureOutgoingR" DECIMAL(5,2),
    "temperatureOutgoingS" DECIMAL(5,2),
    "temperatureOutgoingT" DECIMAL(5,2),
    "currentR" DECIMAL(6,2),
    "currentS" DECIMAL(6,2),
    "currentT" DECIMAL(6,2),
    "isNoisy" BOOLEAN NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panel_inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_image" (
    "equipmentId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "equipment_image_pkey" PRIMARY KEY ("equipmentId","imageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_nik_key" ON "users"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_nik_name_email_idx" ON "users"("nik", "name", "email");

-- CreateIndex
CREATE INDEX "functional_locations_id_description_idx" ON "functional_locations"("id", "description");

-- CreateIndex
CREATE UNIQUE INDEX "classifications_type_key" ON "classifications"("type");

-- CreateIndex
CREATE INDEX "equipments_id_sortField_description_idx" ON "equipments"("id", "sortField", "description");

-- CreateIndex
CREATE UNIQUE INDEX "units_description_key" ON "units"("description");

-- CreateIndex
CREATE INDEX "materials_id_name_idx" ON "materials"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "files_name_key" ON "files"("name");

-- CreateIndex
CREATE INDEX "files_name_tags_idx" ON "files"("name", "tags");

-- CreateIndex
CREATE UNIQUE INDEX "finding_statuses_description_key" ON "finding_statuses"("description");

-- CreateIndex
CREATE INDEX "findings_description_notification_equipmentId_functionalLoc_idx" ON "findings"("description", "notification", "equipmentId", "functionalLocationId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "functional_locations" ADD CONSTRAINT "functional_locations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_equipmentStatusId_fkey" FOREIGN KEY ("equipmentStatusId") REFERENCES "equipment_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_functionalLocationId_fkey" FOREIGN KEY ("functionalLocationId") REFERENCES "functional_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "classifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_material" ADD CONSTRAINT "equipment_material_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_material" ADD CONSTRAINT "equipment_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_file" ADD CONSTRAINT "equipment_file_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_file" ADD CONSTRAINT "equipment_file_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "findings" ADD CONSTRAINT "findings_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "findings" ADD CONSTRAINT "findings_functionalLocationId_fkey" FOREIGN KEY ("functionalLocationId") REFERENCES "functional_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "findings" ADD CONSTRAINT "findings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "findings" ADD CONSTRAINT "findings_findingStatusId_fkey" FOREIGN KEY ("findingStatusId") REFERENCES "finding_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finding_images" ADD CONSTRAINT "finding_images_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "findings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_inspection_forms" ADD CONSTRAINT "equipment_inspection_forms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_image" ADD CONSTRAINT "equipment_image_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_image" ADD CONSTRAINT "equipment_image_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
