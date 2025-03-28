"use client";
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
import { useAuth } from "@/hooks/useAuth";

export default function FunctionalLocationTable({
  functionalLocations,
}: {
  functionalLocations: FunctionalLocation[];
}) {
  const { user } = useAuth();
  const isAdmin: boolean = user?.role?.name === "Admin";

  return (
    <Table>
      <TableCaption>A list of data functional locations.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px] text-muted-foreground">ID</TableHead>
          <TableHead className="text-muted-foreground">Description</TableHead>
          <TableHead className="text-muted-foreground">Created at</TableHead>
          <TableHead
            className={`${!isAdmin && "text-right"} text-muted-foreground`}
          >
            Updated at
          </TableHead>
          {isAdmin && (
            <TableHead className="text-right text-muted-foreground"></TableHead>
          )}
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
                <TableCell className={`${!isAdmin && "text-right"}`}>
                  {formatDate(funcloc.updatedAt)}
                </TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <Link
                      href={`functional-locations/${funcloc.id}/edit`}
                      className="text-muted-foreground hover:underline underline-offset-2 hover:text-blue-400 transition-colors"
                    >
                      Edit
                    </Link>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
