import { getDepartments } from "@/actions/department-action";
import { getUsers } from "@/actions/user-action";
import GeneratePagination from "@/components/pagination";
import UserHeader from "@/components/user-header";
import UserTable from "@/components/user-table";
import TableLayout from "@/layouts/table-layout";
import React from "react";

export default async function UserPage({
  searchParams,
}: {
  searchParams: {
    query: string;
    order: string;
    sortBy: string;
    page: string;
    perPage: string;
    department: string;
  };
}) {
  const { query, order, sortBy, page, perPage, department } =
    await searchParams;

  const { users, totalPages } = await getUsers({
    page: Number(page ?? 1),
    orderBy: order,
    query: query,
    sortBy: sortBy,
    perPage: perPage,
    department: department,
  });

  const departments = await getDepartments();

  return (
    <TableLayout>
      <UserHeader departments={departments} />
      <UserTable users={users} />
      <GeneratePagination totalPages={totalPages} />
    </TableLayout>
  );
}
