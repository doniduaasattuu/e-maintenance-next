import React from "react";
import { Card } from "@/components/ui/card";
import HeaderCard from "@/components/header-card";
import TableLayout from "@/layouts/table-layout";
import FindingCreateForm from "@/components/finding-create-form";
import { getFindingStatuses } from "@/actions/finding-action";

export default async function FindingCreatePage() {
  const findingStatuses = await getFindingStatuses();

  return (
    <TableLayout>
      <div className="space-y-8 mb-4">
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard header="Create" content="Create new finding" />
          <FindingCreateForm findingStatuses={findingStatuses} />
        </Card>
      </div>
    </TableLayout>
  );
}
