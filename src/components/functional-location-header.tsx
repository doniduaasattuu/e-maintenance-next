"use client";

import * as React from "react";
import SearchBar from "./search-bar";
import FilterDropdown from "./filter-dropdown";
import AddButton from "./add-button";

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
    value: "createdAt",
    label: "Created at",
  },
  {
    value: "updatedAt",
    label: "Updated at",
  },
];

export default function FunctionalLocationHeader() {
  return (
    <div className="flex justify-between items-center space-x-2">
      <SearchBar />
      <div className="space-x-2 flex items-center">
        <FilterDropdown sortOptions={sortOptions} />
        <AddButton url="/functional-locations/create" />
      </div>
    </div>
  );
}
