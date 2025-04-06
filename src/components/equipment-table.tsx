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
import { Equipment } from "@/types/equipment";
import Link from "next/link";
import { Roboto_Mono } from "next/font/google";

const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export default function EquipmentTable({
  equipments,
}: {
  equipments: Equipment[];
}) {
  return (
    <Table>
      <TableCaption>A list of data equipments.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-muted-foreground">ID</TableHead>
          <TableHead className="text-muted-foreground">Details</TableHead>
          <TableHead className="w-[300px] text-muted-foreground">
            Functional location
          </TableHead>
          <TableHead className="w-[110px] text-right text-muted-foreground">
            Updated at
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-x-scroll scrollbar-hide">
        {equipments &&
          equipments.length >= 1 &&
          equipments.map((equipment) => {
            return (
              <TableRow key={equipment.id}>
                <TableCell className="font-medium flex-col">
                  <Link
                    className={`link ${robotoMono.className}`}
                    href={`/equipments/${equipment.id}`}
                  >
                    {equipment.id}
                  </Link>
                  <div className="font-normal text-muted-foreground">
                    {equipment.equipmentStatus.description}
                  </div>
                </TableCell>
                <TableCell className="font-light flex-col max-w-[200px] sm:w-auto">
                  <div className="truncate">{equipment.sortField}</div>
                  <div className="text-muted-foreground truncate">
                    {equipment.description}
                  </div>
                </TableCell>
                <TableCell className="font-light flex-col">
                  <div>
                    <Link
                      href={`/functional-locations/${equipment.functionalLocation?.id}`}
                      className="link"
                    >
                      {equipment.functionalLocation?.id}
                    </Link>
                  </div>
                  <div className="text-muted-foreground">
                    {equipment.functionalLocation?.description}
                  </div>
                </TableCell>
                <TableCell className="text-right font-light align-top">
                  {formatDate(equipment.updatedAt)}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
