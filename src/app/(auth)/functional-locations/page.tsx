import { getFunctionalLocations } from "@/actions/functional-location-action";
import * as React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import FunctionalLocationHeader from "@/components/functional-location-header";
import GeneratePagination from "@/components/pagination";
import FunctionalLocationTable from "@/components/functional-location-table";

export default async function FunctionalLocationIndexPage({
  searchParams,
}: {
  searchParams: { query: string; order: string; sortBy: string; page: string };
}) {
  const { query, order, sortBy, page } = await searchParams;

  const { functionalLocations, totalPages } = await getFunctionalLocations({
    destinationPage: Number(page ?? 1),
    orderBy: order,
    query: query,
    sortBy: sortBy,
  });

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink asChild>
            <Link href="/home">Home</Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Functional Locations</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <FunctionalLocationHeader />

      <FunctionalLocationTable functionalLocations={functionalLocations} />

      {/* <Table>
        <TableCaption>A list of data functional locations.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px] text-muted-foreground">
              ID
            </TableHead>
            <TableHead className="text-muted-foreground">Description</TableHead>
            <TableHead className="text-muted-foreground">Created at</TableHead>
            <TableHead className="text-muted-foreground">Updated at</TableHead>
            <TableHead className="text-right text-muted-foreground"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {functionalLocations &&
            functionalLocations.length >= 1 &&
            functionalLocations.map((funcloc) => {
              return (
                <TableRow key={funcloc.id}>
                  <TableCell className="font-medium">
                    <Link
                      className="hover:underline underline-offset-3"
                      href={`/functional-locations/${funcloc.id}`}
                    >
                      {funcloc.id}
                    </Link>
                  </TableCell>
                  <TableCell>{funcloc.description}</TableCell>
                  <TableCell>{formatDate(funcloc.createdAt)}</TableCell>
                  <TableCell>{formatDate(funcloc.updatedAt)}</TableCell>
                  <TableCell className="text-right text-muted-foreground hover:underline underline-offset-2">
                    <Link href={"/"}>Edit</Link>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table> */}

      <GeneratePagination totalPages={totalPages} />
    </div>
  );
}
