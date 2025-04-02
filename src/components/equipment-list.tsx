import { Roboto_Mono } from "next/font/google";
import Link from "next/link";
import React from "react";

type Equipment = {
  id: string;
  sortField: string;
  description: string;
};

type EquipmentListProps = {
  equipments: Equipment[];
};

const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export default function EquipmentList({ equipments }: EquipmentListProps) {
  return (
    <div className="space-y-3">
      {equipments.map((equipment: Equipment) => (
        <div
          key={equipment.id}
          className="flex justify-between text-sm max-w-xl space-x-3"
        >
          <div className="flex justify-start space-x-3">
            <Link
              href={`/equipments/${equipment.id}`}
              className={`link ${robotoMono.className}`}
            >
              {equipment.id}
            </Link>
            <div className="max-w-[150px] text-muted-foreground truncate">
              {equipment.sortField}
            </div>
          </div>
          <div className="truncate text-muted-foreground">
            {equipment.description}
          </div>
        </div>
      ))}
    </div>
  );
}
