import React from "react";
import { Card } from "@/components/ui/card";
import { getEquipment } from "@/actions/equipment-action";
import HeaderCard from "@/components/header-card";
import TableLayout from "@/layouts/table-layout";
import EquipmentEditForm from "@/components/equipment-edit-form";
import { getClassifications } from "@/actions/classification-action";
import { getEquipmentStatuses } from "@/actions/equipment-status-action";

export default async function EquipmentEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const equipment = await getEquipment({ id });
  const classifications = await getClassifications();
  const equipmentStatuses = await getEquipmentStatuses();

  if (!equipment || !classifications || !equipmentStatuses) {
    return;
  }

  return (
    <TableLayout>
      <div className="space-y-8 mb-4">
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard header="Edit" content="Update functional location data" />
          <EquipmentEditForm
            equipment={equipment}
            classifications={classifications}
            equipmentStatuses={equipmentStatuses}
          />
        </Card>
      </div>
    </TableLayout>
  );
}
