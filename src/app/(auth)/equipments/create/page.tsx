import { getClassifications } from "@/actions/classification-action";
import { getEquipmentStatuses } from "@/actions/equipment-status-action";
import EquipmentCreateForm from "@/components/equipment-create-form";
import FormCard from "@/components/form-card";
import HeaderCard from "@/components/header-card";
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
      <FormCard>
        <HeaderCard header="Create" content="Insert new equipment" />
        <EquipmentCreateForm
          classifications={classifications}
          equipmentStatuses={equipmentStatuses}
        />
      </FormCard>
    </TableLayout>
  );
}
