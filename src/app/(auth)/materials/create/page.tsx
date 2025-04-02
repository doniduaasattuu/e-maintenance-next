import React from "react";
import { Card } from "@/components/ui/card";
import MaterialCreateForm from "@/components/material-create-form";
import HeaderCard from "@/components/header-card";
import TableLayout from "@/layouts/table-layout";
import { getUnits } from "@/actions/unit-action";

export default async function MaterialCreatePage() {
  const units = await getUnits();

  return (
    <TableLayout>
      <div className="space-y-8 mb-4">
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard header="Create" content="Insert new material" />
          <MaterialCreateForm units={units} />
        </Card>
      </div>
    </TableLayout>
  );
}
