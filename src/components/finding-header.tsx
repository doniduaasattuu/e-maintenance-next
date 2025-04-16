"use client";

import React from "react";
import SearchBar from "./search-bar";
import FilterDropdown from "./filter-dropdown";
import AddButton from "./add-button";
import { Plus } from "lucide-react";
import { FilterFindingStatus } from "./filter-finding-status";
import { FindingStatus } from "@/types/finding-status";

const sortOptions = [
  {
    value: "id",
    label: "ID",
  },
  {
    value: "description",
    label: "Description",
  },
  {
    value: "notification",
    label: "Notification",
  },
  {
    value: "createdAt",
    label: "Created at",
    isSelected: true,
  },
  {
    value: "updatedAt",
    label: "Updated at",
  },
];

export default function FindingHeader({
  findingStatuses,
}: {
  findingStatuses: FindingStatus[] | null;
}) {
  return (
    <div className="flex justify-between items-center space-x-2">
      <SearchBar />
      <div className="space-x-2 flex items-center">
        <FilterFindingStatus findingStatuses={findingStatuses} />
        <FilterDropdown sortOptions={sortOptions} />
        <AddButton url="/findings/create" label="New" icon={<Plus />} />
      </div>
    </div>
  );
}
