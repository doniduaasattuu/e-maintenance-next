import { getEquipmentById } from "@/actions/equipment-action";
import {
  getMotorInspectionById,
  getPanelInspectionById,
} from "@/actions/inspection-action";
import BackBreadcrumb from "@/components/back-breadcrumb";
import MotorInspectionEditForm from "@/components/motor-inspection-edit-form";
import PanelInspectionEditForm from "@/components/panel-inspection-edit-form";
import { InspectionMotor } from "@/types/motor-inspection";
import { InspectionPanel } from "@/types/panel-inspection";
import React from "react";

export default async function InspectionEdit({
  params,
}: {
  params: Promise<{ id: string; inspectionId: string }>;
}) {
  const { id, inspectionId } = await params;
  const equipment = await getEquipmentById(id);

  if (!equipment) {
    return <p>{`Equipment ${id} is not found`}</p>;
  }
  const equipmentClassType = equipment.classification.type;
  let inspection: unknown = null;

  if (equipmentClassType === "MOTOR") {
    inspection = await getMotorInspectionById(parseInt(inspectionId));
  } else if (equipmentClassType === "PANEL") {
    inspection = await getPanelInspectionById(parseInt(inspectionId));
  }

  if (!inspection) {
    return <p>No record found.</p>;
  }

  return (
    <div className="space-y-4 mb-4">
      {equipmentClassType === "MOTOR" && (
        <React.Fragment>
          <BackBreadcrumb page="Update motor inspection form" />
          <MotorInspectionEditForm
            equipment={equipment}
            inspectionMotor={inspection as InspectionMotor}
          />
        </React.Fragment>
      )}
      {equipmentClassType === "PANEL" && (
        <React.Fragment>
          <BackBreadcrumb page="Update panel inspection form" />
          <PanelInspectionEditForm
            equipment={equipment}
            inspectionPanel={inspection as InspectionPanel}
          />
        </React.Fragment>
      )}
    </div>
  );
}
