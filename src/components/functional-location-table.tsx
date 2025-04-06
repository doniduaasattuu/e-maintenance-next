import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { FunctionalLocation } from "@/types/functional-location";
import Link from "next/link";

export default function FunctionalLocationTable({
  functionalLocations,
}: {
  functionalLocations: FunctionalLocation[];
}) {
  return (
    <Table>
      <TableCaption>A list of data functional locations.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px] text-muted-foreground">ID</TableHead>
          <TableHead className="text-muted-foreground">Description</TableHead>
          <TableHead className="w-[110px] text-muted-foreground">
            Created at
          </TableHead>
          <TableHead className="w-[110px] text-right text-muted-foreground">
            Updated at
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-x-scroll scrollbar-hide">
        {functionalLocations &&
          functionalLocations.length >= 1 &&
          functionalLocations.map((funcloc) => {
            return (
              <TableRow key={funcloc.id}>
                <TableCell className="font-medium">
                  <Link
                    className="link"
                    href={`/functional-locations/${funcloc.id}`}
                  >
                    {funcloc.id}
                  </Link>
                </TableCell>
                <TableCell className="font-light max-w-sm truncate">
                  {funcloc.description}
                </TableCell>
                <TableCell className="font-light text-muted-foreground">
                  {formatDate(funcloc.createdAt)}
                </TableCell>
                <TableCell className="text-right font-light text-muted-foreground">
                  {formatDate(funcloc.updatedAt)}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
