import React from "react";
import { getFindings } from "@/actions/finding-action";
import HeaderPage from "@/components/header-page";
import GeneratePagination from "@/components/pagination";
import FindingList from "@/components/finding-list";
import FindingHeader from "@/components/finding-header";

export default async function FindingPage({
  searchParams,
}: {
  searchParams: {
    query: string;
    order: string;
    sortBy: string;
    page: string;
    perPage: string;
    status: string;
  };
}) {
  const { query, order, sortBy, page, perPage, status } = await searchParams;

  const { findings, totalPages, findingStatuses } = await getFindings({
    page: parseInt(page ?? 1),
    orderBy: order,
    query: query,
    sortBy: sortBy,
    findingStatusId: parseInt(status),
    perPage: perPage,
  });

  return (
    <div className="flex flex-col gap-4">
      <HeaderPage
        header="Findings"
        content="Records of observations and issues identified during daily maintenance checks."
      />
      <FindingHeader findingStatuses={findingStatuses} />
      <FindingList findings={findings} findingStatuses={findingStatuses} />
      <GeneratePagination totalPages={totalPages} />
    </div>
  );
}
