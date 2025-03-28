import React from "react";

type Equipment = {
  id: string;
  description: string;
};

type EquipmentListProps = {
  equipments: Equipment[];
};

export default function EquipmentList({ equipments }: EquipmentListProps) {
  return (
    <div className="space-y-3">
      {equipments.map((equipment: Equipment) => (
        <div
          key={equipment.id}
          className="flex justify-between text-sm max-w-md space-x-3"
        >
          <div>{equipment.id}</div>
          <div className="truncate">{equipment.description}</div>
        </div>
      ))}
    </div>
  );
}
