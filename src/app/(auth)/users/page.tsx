import { getDepartments } from "@/actions/department-action";
import { getPositions } from "@/actions/position-action";
import { getRoles } from "@/actions/role-action";
import { getUsers } from "@/actions/user-action";
import GeneratePagination from "@/components/pagination";
import UserHeader from "@/components/user-header";
import UserTable from "@/components/user-table";
import TableLayout from "@/layouts/table-layout";
import React from "react";

export default async function UserPage(props: {
  searchParams: Promise<{
    query: string;
    order: string;
    sortBy: string;
    page: string;
    perPage: string;
    department: string;
    position: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const { query, order, sortBy, page, perPage, department, position } =
    searchParams;

  const { users, totalPages } = await getUsers({
    page: Number(page ?? 1),
    orderBy: order,
    query: query,
    sortBy: sortBy,
    perPage: perPage,
    department: department,
    position: position,
  });

  const departments = await getDepartments();
  const positions = await getPositions();
  const roles = await getRoles();

  if (!departments || !roles || !positions) {
    return <p>Loading..</p>;
  }

  return (
    <TableLayout>
      <UserHeader departments={departments} positions={positions} />
      <UserTable users={users} roles={roles} />
      <GeneratePagination totalPages={totalPages} />
    </TableLayout>
  );
}
