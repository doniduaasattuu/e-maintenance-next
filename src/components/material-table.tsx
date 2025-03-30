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
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Roboto_Mono } from "next/font/google";

const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export default function MaterialTable({
  materials,
}: {
  materials: ({
    unit: {
      id: number;
      createdAt: Date;
      updatedAt: Date;
      description: string;
    } | null;
    equipmentMaterials: {
      equipmentId: string;
      materialId: string;
      quantity: number;
    }[];
  } & {
    id: string;
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    unitId: number | null;
  })[];
}) {
  return (
    <Table>
      <TableCaption>A list of data materials.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-muted-foreground">ID</TableHead>
          <TableHead className="truncate text-muted-foreground">Name</TableHead>
          <TableHead className="w-[200px] text-muted-foreground">
            Price
          </TableHead>
          <TableHead className="w-[110px] text-muted-foreground">
            Created at
          </TableHead>
          <TableHead className="w-[110px] text-right text-muted-foreground">
            Updated at
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-x-scroll scrollbar-hide">
        {materials &&
          materials.length >= 1 &&
          materials.map((material) => {
            return (
              <TableRow key={material.id}>
                <TableCell className="font-medium flex-col">
                  <Link
                    className={`link ${robotoMono.className}`}
                    href={`/materials/${material.id}`}
                  >
                    {material.id}
                  </Link>
                </TableCell>
                <TableCell className="font-light">{material.name}</TableCell>
                <TableCell className="font-light text-muted-foreground">
                  {formatCurrency({ number: material?.price })}
                </TableCell>
                <TableCell className="font-light text-muted-foreground">
                  {formatDate(material.createdAt)}
                </TableCell>
                <TableCell className="text-right font-light text-muted-foreground">
                  {formatDate(material.updatedAt)}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
