import React from "react";
import HeaderCard from "@/components/header-card";
import TableLayout from "@/layouts/table-layout";
import FunctionalLocationCreateForm from "@/components/functional-location-create-form";
import FormCard from "@/components/form-card";

export default function FunctionalLocationCreatePage() {
  return (
    <TableLayout>
      <FormCard>
        <HeaderCard header="Create" content="Insert new functional location" />
        <FunctionalLocationCreateForm />
      </FormCard>
    </TableLayout>
  );
}
