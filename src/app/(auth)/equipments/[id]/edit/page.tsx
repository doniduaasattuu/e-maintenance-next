import React from "react";
import { Card } from "@/components/ui/card";
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
      <div className="space-y-8 mb-4">
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard header="Edit" content="Update equipment data" />
          <EquipmentEditForm
            equipment={equipment}
            classifications={classifications}
            equipmentStatuses={equipmentStatuses}
          />
        </Card>

        {/* MATERIALS */}
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard
            header="Material"
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
        </Card>

        {/* DOCUMENTS */}
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard
            header="Document"
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
        </Card>
      </div>
    </TableLayout>
  );
}
