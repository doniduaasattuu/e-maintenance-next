import React from "react";
import MaterialCreateForm from "@/components/material-create-form";
import HeaderCard from "@/components/header-card";
import TableLayout from "@/layouts/table-layout";
import { getUnits } from "@/actions/unit-action";
import FormCard from "@/components/form-card";
import { Unit } from "@/types/unit";

export default async function MaterialCreatePage() {
  const units: Unit[] | null = await getUnits();

  return (
    <TableLayout>
      <FormCard>
        <HeaderCard header="Create" content="Insert new material" />
        <MaterialCreateForm units={units} />
      </FormCard>
    </TableLayout>
  );
}
