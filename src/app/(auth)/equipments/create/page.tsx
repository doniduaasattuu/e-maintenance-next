import { getClassifications } from "@/actions/classification-action";
import { getEquipmentStatuses } from "@/actions/equipment-status-action";
import EquipmentCreateForm from "@/components/equipment-create-form";
import HeaderCard from "@/components/header-card";
import { Card } from "@/components/ui/card";
import TableLayout from "@/layouts/table-layout";
import React from "react";

export default async function EquipmentCreatePage() {
  const classifications = await getClassifications();
  const equipmentStatuses = await getEquipmentStatuses();

  if (!classifications || !equipmentStatuses) {
    return;
  }

  return (
    <TableLayout>
      <div className="space-y-8 mb-4">
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard header="Create" content="Insert new equipment" />
          <EquipmentCreateForm
            classifications={classifications}
            equipmentStatuses={equipmentStatuses}
          />
        </Card>
      </div>
    </TableLayout>
  );
}
