import { getMaterials } from "@/actions/material-action";
import MaterialHeader from "@/components/material-header";
import MaterialTable from "@/components/material-table";
import GeneratePagination from "@/components/generate-pagination";
import TableLayout from "@/layouts/table-layout";
import React from "react";

export default async function MaterialPage(props: {
  searchParams: Promise<{
    query: string;
    order: string;
    sortBy: string;
    page: string;
    perPage: string;
    unitId: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const { query, order, sortBy, page, perPage, unitId } = searchParams;

  const { materials, totalPages } = await getMaterials({
    page: Number(page ?? 1),
    orderBy: order,
    query: query,
    sortBy: sortBy,
    perPage: perPage,
    unitId: Number(unitId),
  });

  return (
    <TableLayout>
      <MaterialHeader />
      <MaterialTable materials={materials} />
      <GeneratePagination totalPages={totalPages} />
    </TableLayout>
  );
}
