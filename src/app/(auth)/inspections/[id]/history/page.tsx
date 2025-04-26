import { getEquipmentById } from "@/actions/equipment-action";
import { getInspectionsByEquipmentId } from "@/actions/inspection-action";
import BackBreadcrumb from "@/components/back-breadcrumb";
import MotorInspectionChart from "@/components/motor-inspection-chart";
import PanelInspectionChart from "@/components/panel-inspection-chart";
import { InspectionMotor } from "@/types/motor-inspection";
import { InspectionPanel } from "@/types/panel-inspection";
import React from "react";

export default async function InspectionHistory({
  params,
}: {
  params: Promise<{ id: string; inspectionId: string }>;
}) {
  const { id } = await params;
  const equipment = await getEquipmentById(id);

  if (!equipment) {
    return <p>{`Equipment ${id} is not found`}</p>;
  }
  const equipmentClassType = equipment.classification.type;
  const inspections = await getInspectionsByEquipmentId(
    equipment.id,
    equipmentClassType
  );

  if (!inspections || inspections.length === 0) {
    return <p>No records found.</p>;
  }

  return (
    <div className="space-y-4">
      {equipmentClassType === "MOTOR" && (
        <React.Fragment>
          <BackBreadcrumb
            page={`Inspection History of ${equipment.id} (${equipmentClassType})`}
          />
          <MotorInspectionChart
            motorInspections={inspections as InspectionMotor[]}
          />
        </React.Fragment>
      )}
      {equipmentClassType === "PANEL" && (
        <React.Fragment>
          <BackBreadcrumb
            page={`Inspection History of ${equipment.id} (${equipmentClassType})`}
          />
          <PanelInspectionChart
            panelInspections={inspections as InspectionPanel[]}
          />
        </React.Fragment>
      )}
    </div>
  );
}
