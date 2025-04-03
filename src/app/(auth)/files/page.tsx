import { getFiles } from "@/actions/file-action";
import AddButton from "@/components/add-button";
import FileTable from "@/components/file-table";
import HeaderPage from "@/components/header-page";
import GeneratePagination from "@/components/pagination";
import SearchBar from "@/components/search-bar";
import { Upload } from "lucide-react";
import React from "react";

export default async function FilePage({
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

  const { files, totalPages } = await getFiles({
    page: Number(page ?? 1),
    orderBy: order,
    query: query,
    sortBy: sortBy,
    perPage: perPage,
  });

  return (
    <div className="flex flex-col gap-4">
      <HeaderPage
        header="Files"
        content="A collection of accessible and downloadable files."
      />
      <div className="flex justify-between space-x-2">
        <SearchBar />
        <AddButton url="/files/create" label="Upload" icon={<Upload />} />
      </div>
      <FileTable files={files} />
      <GeneratePagination totalPages={totalPages} />
    </div>
  );
}
