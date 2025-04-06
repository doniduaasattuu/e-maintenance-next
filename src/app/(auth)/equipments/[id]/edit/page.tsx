import React from "react";
import { getEquipment } from "@/actions/equipment-action";
import HeaderCard from "@/components/header-card";
import TableLayout from "@/layouts/table-layout";
import EquipmentEditForm from "@/components/equipment-edit-form";
import { getClassifications } from "@/actions/classification-action";
import { getEquipmentStatuses } from "@/actions/equipment-status-action";
import MaterialDetachment from "@/components/material-detachment";
import SearchMaterialDialog from "@/components/search-material-dialog";
import FileDetachment from "@/components/file-detachment";
import SearchFileDialog from "@/components/search-file-dialog";
import FormCard from "@/components/form-card";

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
    return <p>Loading...</p>;
  }

  return (
    <TableLayout>
      <FormCard>
        <HeaderCard header="Edit" content="Update equipment data" />
        <EquipmentEditForm
          equipment={equipment}
          classifications={classifications}
          equipmentStatuses={equipmentStatuses}
        />
      </FormCard>

      {/* MATERIALS */}
      <FormCard>
        <HeaderCard
          header="Materials"
          content="A list of materials that used in this equipment."
        >
          <SearchMaterialDialog equipment={equipment} />
        </HeaderCard>

        {equipment.equipmentMaterials &&
          equipment.equipmentMaterials.length >= 1 && (
            <MaterialDetachment
              equipment={equipment}
              items={equipment.equipmentMaterials}
            />
          )}
      </FormCard>

      {/* DOCUMENTS */}
      <FormCard>
        <HeaderCard
          header="Documents"
          content="A list of related equipment document."
        >
          <SearchFileDialog equipment={equipment} />
        </HeaderCard>

        {equipment.equipmentFiles && equipment.equipmentFiles.length >= 1 && (
          <FileDetachment
            equipment={equipment}
            items={equipment.equipmentFiles}
          />
        )}
      </FormCard>
    </TableLayout>
  );
}
