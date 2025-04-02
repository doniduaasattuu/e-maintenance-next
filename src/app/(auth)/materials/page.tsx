import { getMaterials } from "@/actions/material-action";
import MaterialHeader from "@/components/material-header";
import MaterialTable from "@/components/material-table";
import GeneratePagination from "@/components/pagination";
import TableLayout from "@/layouts/table-layout";
import React from "react";

export default async function MaterialPage({
  searchParams,
}: {
  searchParams: {
    query: string;
    order: string;
    sortBy: string;
    page: string;
    perPage: string;
    unitId: string;
  };
}) {
  const { query, order, sortBy, page, perPage, unitId } = await searchParams;

  const { materials, totalPages } = await getMaterials({
    page: Number(page ?? 1),
    orderBy: order,
    query: query,
    sortBy: sortBy,
    perPage: perPage,
    unitId: Number(unitId),
  });

  if (!materials) {
    return null;
  }

  return (
    <TableLayout>
      <MaterialHeader />
      <MaterialTable materials={materials} />
      <GeneratePagination totalPages={totalPages} />
    </TableLayout>
  );
}
