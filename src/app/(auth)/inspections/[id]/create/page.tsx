import { getEquipmentById } from "@/actions/equipment-action";
import BackBreadcrumb from "@/components/back-breadcrumb";
import MotorInspectionCreateForm from "@/components/motor-inspection-create-form";
import PanelInspectionCreateForm from "@/components/panel-inspection-create-form";
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
      {equipment.classification.type === "MOTOR" && (
        <React.Fragment>
          <BackBreadcrumb page="Motor inspection form" />
          <MotorInspectionCreateForm equipment={equipment} />
        </React.Fragment>
      )}
      {equipment.classification.type === "PANEL" && (
        <React.Fragment>
          <BackBreadcrumb page="Panel inspection form" />
          <PanelInspectionCreateForm equipment={equipment} />
        </React.Fragment>
      )}
    </div>
  );
}
