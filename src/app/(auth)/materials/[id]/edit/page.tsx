import React from "react";
import { Card } from "@/components/ui/card";
import HeaderCard from "@/components/header-card";
import TableLayout from "@/layouts/table-layout";
import { getMaterial } from "@/actions/material-action";
import MaterialEditForm from "@/components/material-edit-form";
import { getUnits } from "@/actions/unit-action";

export default async function MaterialEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const material = await getMaterial({
    id: id,
  });
  const units = await getUnits();

  if (!material) {
    return <p>Material is not exists</p>;
  }

  return (
    <TableLayout>
      <div className="space-y-8 mb-4">
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard header="Edit" content="Update material data" />
          <MaterialEditForm material={material} units={units} />
        </Card>
      </div>
    </TableLayout>
  );
}
