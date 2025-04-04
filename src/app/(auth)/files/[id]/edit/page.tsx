import React from "react";
import { Card } from "@/components/ui/card";
import HeaderCard from "@/components/header-card";
import TableLayout from "@/layouts/table-layout";
import FileEditForm from "@/components/file-edit-form";
import { getFileById } from "@/actions/file-action";

export default async function FileEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const file = await getFileById(id);

  if (!file) {
    return <p>File is not exists</p>;
  }

  return (
    <TableLayout>
      <div className="space-y-8 mb-4">
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard
            header="Edit"
            content="Update current file data and information"
          />
          <FileEditForm file={file} />
        </Card>
      </div>
    </TableLayout>
  );
}
