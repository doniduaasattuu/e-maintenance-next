import { getClassifications } from "@/actions/classification-action";
import { getEquipments } from "@/actions/equipment-action";
import { getEquipmentStatuses } from "@/actions/equipment-status-action";
import EquipmentHeader from "@/components/equipment-header";
import EquipmentTable from "@/components/equipment-table";
import GeneratePagination from "@/components/generate-pagination";
import TableLayout from "@/layouts/table-layout";
import React from "react";

export default async function EquipmentPage(props: {
  searchParams: Promise<{
    query: string;
    order: string;
    sortBy: string;
    page: string;
    perPage: string;
    classification: string;
    status: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const { query, order, sortBy, page, perPage, classification, status } =
    searchParams;

  const classifications = await getClassifications();
  const equipmentStatuses = await getEquipmentStatuses();

  const { equipments, totalPages } = await getEquipments({
    page: parseInt(page ?? 1),
    orderBy: order,
    query: query,
    sortBy: sortBy,
    perPage: perPage,
    classificationId: classification,
    status: status,
  });

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
