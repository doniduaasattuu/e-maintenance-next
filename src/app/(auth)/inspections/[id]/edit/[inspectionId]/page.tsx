import { getEquipmentById } from "@/actions/equipment-action";
import { getMotorInspectionById } from "@/actions/inspection-action";
import BackBreadcrumb from "@/components/back-breadcrumb";
import MotorInspectionEditForm from "@/components/motor-inspection-edit-form";
import React from "react";

export default async function InspectionEdit({
  params,
}: {
  params: Promise<{ id: string; inspectionId: string }>;
}) {
  const { id, inspectionId } = await params;

  const equipment = await getEquipmentById(id);
  const inspectionMotor = await getMotorInspectionById(parseInt(inspectionId));

  if (!equipment || !inspectionMotor) {
    return <p>{`Record of ${id} is not found`}</p>;
  }

  return (
    <div className="space-y-4 mb-4">
      <BackBreadcrumb page="Update motor inspection form" />
      {equipment.classification.type === "MOTOR" && (
        <MotorInspectionEditForm
          equipment={equipment}
          inspectionMotor={inspectionMotor}
        />
      )}
      {equipment.classification.type === "PANEL" && (
        <p>Panel Inspection Form</p>
      )}
      {!equipment.classification.type && <p>Equipment is not classified.</p>}
    </div>

    // <React.Fragment>
    //   {equipment.classification.type === "MOTOR" && (
    //     <MotorInspectionEditForm
    //       equipment={equipment}
    //       inspectionMotor={inspectionMotor}
    //     />
    //   )}
    //   {equipment.classification.type === "PANEL" && (
    //     <p>Panel Inspection Form</p>
    //   )}
    //   {!equipment.classification.type && <p>Equipment is not classified.</p>}
    // </React.Fragment>
  );
}
