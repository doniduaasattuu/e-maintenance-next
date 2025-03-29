import React from "react";
import { Card } from "@/components/ui/card";
import FunctionalLocationEditForm from "@/components/functional-location-edit-form";
import { getFunctionalLocation } from "@/actions/functional-location-action";
import HeaderCard from "@/components/header-card";
import TableLayout from "@/layouts/table-layout";

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
      <div className="space-y-8 mb-4">
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard header="Edit" content="Update functional location data" />
          <FunctionalLocationEditForm functionalLocation={functionalLocation} />
        </Card>
      </div>
    </TableLayout>
  );
}
