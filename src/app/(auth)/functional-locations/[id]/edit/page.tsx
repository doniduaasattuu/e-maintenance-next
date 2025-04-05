import React from "react";
import FunctionalLocationEditForm from "@/components/functional-location-edit-form";
import { getFunctionalLocation } from "@/actions/functional-location-action";
import HeaderCard from "@/components/header-card";
import TableLayout from "@/layouts/table-layout";
import FormCard from "@/components/form-card";

export default async function FunctionalLocationEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const functionalLocation = await getFunctionalLocation({ id });

  if (!functionalLocation) {
    return;
  }

  return (
    <TableLayout>
      <FormCard>
        <HeaderCard header="Edit" content="Update functional location data" />
        <FunctionalLocationEditForm functionalLocation={functionalLocation} />
      </FormCard>
    </TableLayout>
  );
}
