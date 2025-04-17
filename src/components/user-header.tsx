"use client";

import * as React from "react";
import SearchBar from "./search-bar";
import FilterDropdown from "./filter-dropdown";
import { FilterDepartment } from "./filter-department";
import { Department } from "@/types/department";

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
}: {
  departments: Department[] | null;
}) {
  return (
    <div className="flex justify-between items-center space-x-2">
      <SearchBar />
      <div className="space-x-2 flex items-center">
        <FilterDepartment departments={departments} />
        <FilterDropdown sortOptions={sortOptions} />
      </div>
    </div>
  );
}
