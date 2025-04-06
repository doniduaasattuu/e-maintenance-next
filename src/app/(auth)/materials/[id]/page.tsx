import HeaderCard from "@/components/header-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";
import TableLayout from "@/layouts/table-layout";
import { getMaterial } from "@/actions/material-action";
import { formatCurrency } from "@/lib/utils";
import EquipmentList from "@/components/equipment-list";
import FormCard from "@/components/form-card";
import { SimpleEquipment } from "@/types/equipment";

export default async function MaterialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const material = await getMaterial({
    id: id,
    includeEquipments: true,
  });

  if (!material) return <p>Material is not exists</p>;

  let equipments: SimpleEquipment[] | [] = [];

  if (material.equipmentMaterials) {
    equipments =
      material.equipmentMaterials.map((item) => {
        return item.equipment as SimpleEquipment;
      }) || [];
  }

  return (
    <TableLayout>
      <FormCard>
        <HeaderCard header="Detail" content="Material data and relations">
          <Link className="text-sm" href={`/materials/${id}/edit`}>
            Edit
          </Link>
        </HeaderCard>

        <div className="space-y-4">
          <div className="grid w-full max-w-xl items-center gap-2">
            <Label htmlFor="id">ID</Label>
            <Input readOnly id="id" defaultValue={material?.id} />
          </div>
          <div className="grid w-full max-w-xl items-center gap-2">
            <Label htmlFor="name">Name</Label>
            <Input readOnly id="name" defaultValue={material.name} />
          </div>
          <div className="grid w-full max-w-xl items-center gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              readOnly
              id="price"
              defaultValue={formatCurrency({ number: material.price })}
            />
          </div>
          <div className="grid w-full max-w-xl items-center gap-2">
            <Label htmlFor="unitId">Unit</Label>
            <Input
              readOnly
              id="unitId"
              defaultValue={material.unit?.description}
            />
          </div>
        </div>
      </FormCard>
      <FormCard>
        <HeaderCard
          header="Equipments"
          content="List of equipment that uses this material"
        />
        {equipments && equipments.length >= 1 ? (
          <EquipmentList equipments={equipments} />
        ) : (
          <p className="text-sm font-normal text-muted-foreground">Empty.</p>
        )}
      </FormCard>
    </TableLayout>
  );
}
