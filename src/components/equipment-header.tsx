"use client";

import * as React from "react";
import SearchBar from "./search-bar";
import FilterDropdown from "./filter-dropdown";
import AddButton from "./add-button";
import { Classification } from "@/types/classification";
import { EquipmentStatus } from "@/types/equipment-status";
import { FilterEquipmentStatus } from "./filter-equipment-status";
import { FilterClassification } from "./filter-classification";
import { DropdownMenuSeparator } from "./ui/dropdown-menu";

const sortOptions = [
  {
    value: "id",
    label: "ID",
  },
  {
    value: "sortField",
    label: "Sort field",
  },
  {
    value: "description",
    label: "Description",
  },
  {
    value: "createdAt",
    label: "Created at",
  },
  {
    value: "updatedAt",
    label: "Updated at",
  },
];

export default function EquipmentHeader({
  classifications,
  equipmentStatuses,
}: {
  classifications: Classification[] | null;
  equipmentStatuses: EquipmentStatus[] | null;
}) {
  return (
    <div className="flex justify-between items-center space-x-2">
      <SearchBar />
      <div className="space-x-2 flex items-center">
        <FilterClassification
          className="hidden md:flex"
          classifications={classifications}
        />
        <FilterEquipmentStatus
          className="hidden md:flex"
          equipmentStatuses={equipmentStatuses}
        />
        <FilterDropdown sortOptions={sortOptions}>
          <span className="md:hidden">
            <DropdownMenuSeparator />
            <FilterClassification
              className="w-full"
              classifications={classifications}
            />
          </span>
          <span className="md:hidden">
            <DropdownMenuSeparator />
            <FilterEquipmentStatus
              className="w-full"
              equipmentStatuses={equipmentStatuses}
            />
          </span>
        </FilterDropdown>
        <AddButton url="/equipments/create" />
      </div>
    </div>
  );
}
