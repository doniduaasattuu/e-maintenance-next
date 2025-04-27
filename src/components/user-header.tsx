"use client";

import * as React from "react";
import SearchBar from "./search-bar";
import FilterDropdown from "./filter-dropdown";
import { FilterDepartment } from "./filter-department";
import { Department } from "@/types/department";
import { Position } from "@/types/position";
import { FilterPosition } from "./filter-position";

const sortOptions = [
  {
    value: "id",
    label: "ID",
  },
  {
    value: "nik",
    label: "NIK",
  },
  {
    value: "name",
    label: "Name",
    isSelected: true,
  },
  {
    value: "email",
    label: "Email",
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

export default function UserHeader({
  departments,
  positions,
}: {
  departments: Department[] | null;
  positions: Position[] | null;
}) {
  return (
    <div className="flex justify-between items-center space-x-2">
      <SearchBar />
      <div className="space-x-2 flex items-center">
        <FilterPosition positions={positions} />
        <FilterDepartment departments={departments} />
        <FilterDropdown sortOptions={sortOptions} selectedOrderBy="asc" />
      </div>
    </div>
  );
}
