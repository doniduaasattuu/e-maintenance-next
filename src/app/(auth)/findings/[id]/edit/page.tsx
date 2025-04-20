import React from "react";
import HeaderCard from "@/components/header-card";
import TableLayout from "@/layouts/table-layout";
import FormCard from "@/components/form-card";
import { getFindingById, getFindingStatuses } from "@/actions/finding-action";
import FindingEditForm from "@/components/finding-edit-form";
import { getUserSession } from "@/hooks/useUserSession";
import { redirect } from "next/navigation";
import { leader } from "@/lib/config";

export default async function FindingEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserSession();
  const finding = await getFindingById(id);
  const findingStatuses = await getFindingStatuses();

  if (!finding) {
    return <p>Finding is not exists</p>;
  }

  if (user.id !== String(finding?.userId) && !leader.includes(user.role)) {
    redirect("/unauthorized");
  }

  return (
    <TableLayout>
      <FormCard>
        <HeaderCard
          header="Edit"
          content="Update current finding data and information"
        />
        <FindingEditForm findingStatuses={findingStatuses} finding={finding} />
      </FormCard>
    </TableLayout>
  );
}
