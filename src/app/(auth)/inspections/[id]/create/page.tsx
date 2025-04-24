import { getEquipmentById } from "@/actions/equipment-action";
import BackBreadcrumb from "@/components/back-breadcrumb";
import MotorInspectionCreateForm from "@/components/motor-inspection-create-form";
import React from "react";

export default async function InspectionForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const equipment = await getEquipmentById(id);

  if (!equipment) {
    return <p>Equipment is not found</p>;
  }

  return (
    <div className="space-y-4 mb-4">
      <BackBreadcrumb page="Motor inspection form" />
      {equipment.classification.type === "MOTOR" && (
        <MotorInspectionCreateForm equipment={equipment} />
      )}
      {equipment.classification.type === "PANEL" && (
        <p>Panel Inspection Form</p>
      )}
      {!equipment.classification.type && <p>Equipment is not classified.</p>}
    </div>
  );
}
