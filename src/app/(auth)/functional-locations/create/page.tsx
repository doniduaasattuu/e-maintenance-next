import React from "react";
import { Card } from "@/components/ui/card";
import FunctionalLocationCreateForm from "@/components/functional-location-create-form";
import HeaderCard from "@/components/header-card";
import TableLayout from "@/layouts/table-layout";

export default function FunctionalLocationCreatePage() {
  return (
    <TableLayout>
      <div className="space-y-8 mb-4">
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard
            header="Create"
            content="Insert new functional location"
          />
          <FunctionalLocationCreateForm />
        </Card>
      </div>
    </TableLayout>
  );
}
