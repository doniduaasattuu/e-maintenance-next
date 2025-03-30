import { getClassifications } from "@/actions/classification-action";
import { getEquipments } from "@/actions/equipment-action";
import { getEquipmentStatuses } from "@/actions/equipment-status-action";
import EquipmentHeader from "@/components/equipment-header";
import EquipmentTable from "@/components/equipment-table";
import GeneratePagination from "@/components/pagination";
import TableLayout from "@/layouts/table-layout";
import React from "react";

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: {
    query: string;
    order: string;
    sortBy: string;
    page: string;
    perPage: string;
    classification: string;
    status: string;
  };
}) {
  const { query, order, sortBy, page, perPage, classification, status } =
    await searchParams;
  const classifications = await getClassifications();
  const equipmentStatuses = await getEquipmentStatuses();

  const { equipments, totalPages } = await getEquipments({
    destinationPage: Number(page ?? 1),
    orderBy: order,
    query: query,
    sortBy: sortBy,
    perPage: perPage,
    classification: classification,
    status: status,
  });

  if (!equipments) {
    return null;
  }

  return (
    <TableLayout>
      <EquipmentHeader
        classifications={classifications}
        equipmentStatuses={equipmentStatuses}
      />
      <EquipmentTable equipments={equipments} />
      <GeneratePagination totalPages={totalPages} />
    </TableLayout>
  );
}
