import React from "react";
import { getFindings } from "@/actions/finding-action";
import AddButton from "@/components/add-button";
import HeaderPage from "@/components/header-page";
import GeneratePagination from "@/components/pagination";
import SearchBar from "@/components/search-bar";
import { Plus } from "lucide-react";
import FindingList from "@/components/finding-list";

export default async function FindingPage({
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

  const { findings, totalPages, findingStatuses } = await getFindings({
    page: Number(page ?? 1),
    orderBy: order,
    query: query,
    sortBy: sortBy,
    perPage: perPage,
  });

  return (
    <div className="flex flex-col gap-4">
      <HeaderPage
        header="Findings"
        content="Records of observations and issues identified during daily maintenance checks."
      />
      <div className="flex justify-between space-x-2">
        <SearchBar />
        <AddButton url="/findings/create" label="New" icon={<Plus />} />
      </div>
      <FindingList findings={findings} findingStatuses={findingStatuses} />
      <GeneratePagination totalPages={totalPages} />
    </div>
  );
}
