import { getFunctionalLocations } from "@/actions/functional-location-action";
import * as React from "react";
import FunctionalLocationHeader from "@/components/functional-location-header";
import GeneratePagination from "@/components/pagination";
import FunctionalLocationTable from "@/components/functional-location-table";
import TableLayout from "@/layouts/table-layout";

export default async function FunctionalLocationIndexPage({
  searchParams,
}: {
  searchParams: {
    query: string;
    order: string;
    sortBy: string;
    page: string;
    perPage: string;
  };
}) {
  const { query, order, sortBy, page, perPage } = await searchParams;

  const { functionalLocations, totalPages } = await getFunctionalLocations({
    destinationPage: Number(page ?? 1),
    orderBy: order,
    query: query,
    sortBy: sortBy,
    perPage: perPage,
  });

  return (
    <TableLayout>
      <FunctionalLocationHeader />
      <FunctionalLocationTable functionalLocations={functionalLocations} />
      <GeneratePagination totalPages={totalPages} />
    </TableLayout>
  );
}
