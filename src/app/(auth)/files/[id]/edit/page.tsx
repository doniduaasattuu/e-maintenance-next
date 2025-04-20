import React from "react";
import HeaderCard from "@/components/header-card";
import TableLayout from "@/layouts/table-layout";
import FileEditForm from "@/components/file-edit-form";
import { getFileById } from "@/actions/file-action";
import FormCard from "@/components/form-card";
import { redirect } from "next/navigation";
import { getUserSession } from "@/hooks/useUserSession";
import { onlyAdmin } from "@/lib/config";

export default async function FileEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserSession();
  const file = await getFileById(id);

  if (!file) {
    return <p>File is not exists</p>;
  }

  if (user.id !== String(file?.userId) && !onlyAdmin.includes(user.role)) {
    redirect("/unauthorized");
  }

  return (
    <TableLayout>
      <FormCard>
        <HeaderCard
          header="Edit"
          content="Update current file data and information"
        />
        <FileEditForm file={file} />
      </FormCard>
    </TableLayout>
  );
}
