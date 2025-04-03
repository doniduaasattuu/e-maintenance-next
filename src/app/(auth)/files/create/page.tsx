import React from "react";
import { Card } from "@/components/ui/card";
import HeaderCard from "@/components/header-card";
import TableLayout from "@/layouts/table-layout";
import FileCreateForm from "@/components/file-create-form";

export default function FileCreatePage() {
  return (
    <TableLayout>
      <div className="space-y-8 mb-4">
        <Card className="py-8 px-5 md:p-8 rounded-md">
          <HeaderCard header="Create" content="Upload new file" />
          <FileCreateForm />
        </Card>
      </div>
    </TableLayout>
  );
}
