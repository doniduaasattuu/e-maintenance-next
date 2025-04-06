import React from "react";
import HeaderCard from "@/components/header-card";
import TableLayout from "@/layouts/table-layout";
import { getMaterial } from "@/actions/material-action";
import MaterialEditForm from "@/components/material-edit-form";
import { getUnits } from "@/actions/unit-action";
import FormCard from "@/components/form-card";
import { Unit } from "@/types/unit";

export default async function MaterialEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const material = await getMaterial({
    id: id,
  });
  const units: Unit[] | null = await getUnits();

  if (!material) {
    return <p>Material is not exists</p>;
  }

  return (
    <TableLayout>
      <FormCard>
        <HeaderCard header="Edit" content="Update material data" />
        <MaterialEditForm material={material} units={units} />
      </FormCard>
    </TableLayout>
  );
}
